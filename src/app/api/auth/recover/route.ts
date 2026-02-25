import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import sql from '@/lib/db';

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const users = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (!users.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const userId = users[0].id;
    const digit = Math.floor(100000 + Math.random() * 900000).toString();

    await sql`INSERT INTO recover_tokens (email, digits) VALUES (${email}, ${digit})`;

    return NextResponse.json({ success: true, message: 'Recovery code generated', userId, code: digit });
  } catch (error: any) {
    console.error('Recover error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { pass, userId, code } = await req.json();
  if (!userId || !pass || !code) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  try {
    const users = await sql`SELECT email FROM users WHERE id = ${userId} LIMIT 1`;
    if (!users.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const email = users[0].email;
    const tokens = await sql`SELECT * FROM recover_tokens WHERE email = ${email} AND digits = ${code} LIMIT 1`;
    if (!tokens.length) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(pass, 10);
    await sql`UPDATE users SET password = ${hashedPassword}, updated_at = NOW() WHERE id = ${userId}`;
    await sql`DELETE FROM recover_tokens WHERE email = ${email} AND digits = ${code}`;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Recover PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
