import { neon } from "@neondatabase/serverless";

// DATABASE_URL must be set at runtime; at build time it may be absent
const sql = neon(process.env.DATABASE_URL || "postgresql://placeholder:placeholder@placeholder/placeholder");

export { sql };
export default sql;
