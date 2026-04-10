import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { cacheGet, cacheSet } from '@/lib/valkey';
import { ScoringEngine } from '@/lib/scoring';
import { generateReport } from '@/lib/claude';
import type { Assessment, AssessmentAnswer, SovereigntyReport } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };

  try {
    // Check Valkey cache first
    const cacheKey = `report:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached) as SovereigntyReport);
    }

    // Check DB cache
    const existingReport = await query<{ report_json: SovereigntyReport }>(
      `SELECT report_json FROM reports WHERE assessment_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [id]
    );
    if (existingReport.rows.length > 0) {
      const report = existingReport.rows[0].report_json;
      await cacheSet(cacheKey, JSON.stringify(report));
      return res.status(200).json(report);
    }

    // Fetch assessment
    const assessmentResult = await query<Assessment>(
      `SELECT * FROM assessments WHERE id = $1`,
      [id]
    );
    if (assessmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    const assessment = assessmentResult.rows[0];

    // Fetch answers
    const answersResult = await query<AssessmentAnswer>(
      `SELECT * FROM assessment_answers WHERE assessment_id = $1`,
      [id]
    );
    const answers = answersResult.rows;

    // Calculate score
    const engine = new ScoringEngine(answers);
    const { total, breakdown } = engine.calculate();

    // Update assessment with score
    await query(
      `UPDATE assessments
       SET sovereignty_score = $1, score_breakdown = $2, status = 'completed', updated_at = NOW()
       WHERE id = $3`,
      [total, JSON.stringify(breakdown), id]
    );
    assessment.sovereignty_score = total;
    assessment.score_breakdown = breakdown;

    // Generate AI report
    const report = await generateReport(assessment, answers);
    report.sovereigntyScore = total;

    // Store report in DB
    await query(
      `INSERT INTO reports (assessment_id, report_json) VALUES ($1, $2)`,
      [id, JSON.stringify(report)]
    );

    // Cache in Valkey
    await cacheSet(cacheKey, JSON.stringify(report));

    res.status(200).json(report);
  } catch (err) {
    console.error('generate report error:', err);
    res.status(500).json({ error: 'Report generation failed' });
  }
}
