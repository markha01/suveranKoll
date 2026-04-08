import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

interface AnswerInput {
  question_id: string;
  answer_value: string;
  answer_label: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query as { id: string };
  const { answers } = req.body as { answers: AnswerInput[] };

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'No answers provided' });
  }

  try {
    // Upsert-like: delete existing answers for these question_ids, then insert fresh
    const questionIds = answers.map((a) => a.question_id);
    await query(
      `DELETE FROM assessment_answers
       WHERE assessment_id = $1 AND question_id = ANY($2::text[])`,
      [id, questionIds]
    );

    for (const answer of answers) {
      await query(
        `INSERT INTO assessment_answers (assessment_id, question_id, answer_value, answer_label)
         VALUES ($1, $2, $3, $4)`,
        [id, answer.question_id, answer.answer_value, answer.answer_label]
      );
    }

    res.status(200).json({ saved: answers.length });
  } catch (err) {
    console.error('save answers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
