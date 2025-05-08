import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        message: 'Login failed',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}