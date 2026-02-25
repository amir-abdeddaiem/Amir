import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const rows = await sql`SELECT * FROM users WHERE email = ${body.email} LIMIT 1`;
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found', success: false }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password', success: false }, { status: 401 });
    }
    await sql`UPDATE users SET status = 'authenticated', updated_at = NOW() WHERE id = ${user.id}`;

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.acc_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return NextResponse.json({
      message: 'Login successful', success: true, token,
      user: { id: user.id, role: user.acc_type, email: user.email, name: `${user.first_name} ${user.last_name}`, status: 'authenticated' },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Failed to login.', success: false }, { status: 500 });
  }
}
