import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });

async function migrate() {
  const dir = join(import.meta.dirname, '..', 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  console.log(`Running ${files.length} migration(s)...`);

  for (const file of files) {
    try {
      const sql = readFileSync(join(dir, file), 'utf-8');
      await pool.query(sql);
      console.log(`  ✅ ${file}`);
    } catch (err) {
      const msg = String(err && typeof err === 'object' ? err.message || '' : '');
      if (msg.includes('already exists')) {
        console.log(`  ℹ️  ${file} — already exists, skipped`);
      } else {
        console.error(`  ❌ ${file}:`, msg || err);
      }
    }
  }

  console.log('Migration complete.');
  await pool.end();
}

migrate();
