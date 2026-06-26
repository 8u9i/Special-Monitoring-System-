import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });

async function migrate() {
  try {
    const sql = readFileSync(join(import.meta.dirname, '..', 'migrations', '001-init.sql'), 'utf-8');
    await pool.query(sql);
    console.log('✅ Migration applied successfully');
  } catch (err: any) {
    if (err.message?.includes('already exists')) {
      console.log('ℹ️  Tables already exist, skipping migration');
    } else {
      console.error('⚠️  Migration error (tables may already exist):', err.message);
    }
  } finally {
    await pool.end();
  }
}

migrate();
