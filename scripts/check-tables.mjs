import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_ClqeusG3p9bh@ep-snowy-moon-ai6s65sq-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
const r = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
console.log('Tables:', r.map(x => x.table_name).join(', ') || '(none)');
