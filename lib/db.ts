import { Pool, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;
let migrated = false;

function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL ?? '';
    const useSsl = process.env.DATABASE_SSL === 'true' || url.includes('sslmode=require');
    pool = new Pool({
      connectionString: url,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  await ensureMigrated();
  return getPool().query<T>(text, params);
}

async function ensureMigrated(): Promise<void> {
  if (migrated) return;
  migrated = true;
  try {
    const migrationPath = path.join(process.cwd(), 'lib', 'migrations.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await getPool().query(sql);
  } catch (err) {
    console.error('Migration failed:', err);
    migrated = false;
    throw err;
  }
}
