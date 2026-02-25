import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Authorization header is missing' }, { status: 401 });
  try {
    const rows = await sql`SELECT id, first_name, last_name, email, birth_date, gender, location, phone, avatar, bio, acc_type, business_name, business_type, description, website, coordinates, created_at, updated_at FROM users WHERE id = ${userId} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Authorization header is missing' }, { status: 401 });
  try {
    const body = await req.json();
    const allowed = ['first_name','last_name','gender','location','phone','avatar','bio','boutique_image','business_name','description','website'];
    const updates: string[] = [];
    const vals: any[] = [];
    let n = 1;
    for (const key of allowed) {
      const bodyKey = key.replace(/_([a-z])/g, (_,c) => c.toUpperCase());
      const val = body[bodyKey] ?? body[key];
      if (val !== undefined) { updates.push(`${key} = $${n++}`); vals.push(val); }
    }
    if (!updates.length) return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    vals.push(userId);
    const rows = await sql.query(`UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${n} RETURNING *`, vals);
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
