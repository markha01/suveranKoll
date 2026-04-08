import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { org_name, org_size, sector } = req.body as {
    org_name?: string;
    org_size?: string;
    sector?: string;
  };

  try {
    const result = await query<{ id: string }>(
      `INSERT INTO assessments (org_name, org_size, sector, status)
       VALUES ($1, $2, $3, 'in_progress')
       RETURNING id`,
      [org_name ?? null, org_size ?? null, sector ?? null]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('create assessment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
