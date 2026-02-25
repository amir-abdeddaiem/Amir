import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ClqeusG3p9bh@ep-snowy-moon-ai6s65sq-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);
const schema = readFileSync(join(__dirname, '..', 'src', 'lib', 'schema.sql'), 'utf8');

// Split on semicolons that end a line (handles multi-line statements)
const statements = schema
  .replace(/--[^\n]*/g, '')   // strip single-line comments
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 5); // skip blank/tiny fragments

let ok = 0, fail = 0;
for (const stmt of statements) {
  try {
    await sql.query(stmt + ';');
    ok++;
  } catch (e) {
    // "already exists" errors are fine
    if (!e.message.includes('already exists')) {
      console.warn(`⚠  ${e.message.split('\n')[0]}`);
      fail++;
    } else {
      ok++;
    }
  }
}

console.log(`\nDone: ${ok} OK, ${fail} errors.`);
