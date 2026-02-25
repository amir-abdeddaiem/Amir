import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ClqeusG3p9bh@ep-snowy-moon-ai6s65sq-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

// Old PascalCase tables from the previous MongoDB migration attempt
const oldTables = [
  'Animal', 'Appointment', 'BusinessProvider', 'Favorite',
  'FoundAnimal', 'Like', 'Match', 'Message', 'Product',
  'Recover', 'Reservation', 'Review', 'ServiceReview', 'SwipeAction', 'User'
];

for (const table of oldTables) {
  try {
    await sql.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    console.log(`✓ Dropped "${table}"`);
  } catch (e) {
    console.warn(`⚠  "${table}": ${e.message}`);
  }
}

console.log('\nDone. Remaining tables:');
const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
console.log(rows.map(r => r.table_name).join(', '));
