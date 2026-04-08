import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { cacheGet } from '@/lib/valkey';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { PDFDocument } from '@/components/report/PDFDocument';
import type { Assessment, SovereigntyReport } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };

  try {
    // Get report from cache or DB
    let report: SovereigntyReport | null = null;
    const cacheKey = `report:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      report = JSON.parse(cached);
    } else {
      const result = await query<{ report_json: SovereigntyReport }>(
        `SELECT report_json FROM reports WHERE assessment_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      report = result.rows[0].report_json;
    }

    // Get assessment for org name
    const assessmentResult = await query<Assessment>(
      `SELECT org_name, sector, org_size FROM assessments WHERE id = $1`,
      [id]
    );
    const assessment = assessmentResult.rows[0];

    const element = React.createElement(PDFDocument, { report: report!, assessment });
    // renderToBuffer expects a Document element — cast required because our component wraps it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any);

    const orgSlug = (assessment?.org_name ?? 'rapport').replace(/\s+/g, '-').toLowerCase();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="suverankoll-${orgSlug}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF-generering misslyckades' });
  }
}
