import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });

async function migrate() {
  try {
    const dir = import.meta.dirname;
    const sql = readFileSync(join(dir, '..', 'migrations', '001-init.sql'), 'utf-8');
    await pool.query(sql);
    console.log('Migration applied successfully');
  } catch (err) {
    const msg = String(err && typeof err === 'object' ? err.message || '' : '');
    if (msg.includes('already exists')) {
      console.log('Tables already exist, skipping migration');
    } else {
      console.error('Migration error:', msg || err);
    }
  } finally {
    await pool.end();
  }
}

migrate();
