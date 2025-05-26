// app/api/tinderanimal/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Like } from '@/models/Like';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { pet1Id, pet2Id } = body;

    if (!pet1Id || !pet2Id) {
      return NextResponse.json({ error: 'Missing pet IDs' }, { status: 400 });
    }

    const existingLike = await Like.findOne({
      pet1: pet1Id,
      pet2: pet2Id,
    });

    if (existingLike) {
      return NextResponse.json({ message: 'Like already exists' });
    }

    const newLike = await Like.create({ pet1: pet1Id, pet2: pet2Id });

    return NextResponse.json({ like: newLike }, { status: 201 });
  } catch (error) {
    console.error('Error in like route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
