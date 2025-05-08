import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextAuth';

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();
  console.log(email,password  )
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
    
    // Check if password exists
    if (!user.password) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Create session
    const session = await getServerSession(authOptions);
    if (session) {
      console.log("session",session)
      return NextResponse.json({ message: 'Already logged in' }, { status: 400 });
    }

    // Create new session
    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.firstName + ' ' + user.lastName
      }
    }, { status: 200 });

    // Set session cookie
    response.cookies.set('next-auth.session-token', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
} 