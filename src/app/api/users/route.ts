import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'User not found', data: null }, { status: 404 });

    const rows = await sql`SELECT id, first_name, last_name, email, birth_date, gender, location, phone, avatar, bio, created_at, updated_at FROM users WHERE id = ${userId} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found', data: null }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error', data: null }, { status: 500 });
  }
}
