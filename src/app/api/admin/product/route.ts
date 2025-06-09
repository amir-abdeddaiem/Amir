import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; // assumes you have a db connector
import { User } from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, '-password'); // exclude password field
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error fetching users' }, { status: 500 });
  }
}