import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel, { SwipeType } from '@/models/Swipe';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { swiper, swiped, actionType }: { swiper: string; swiped: string; actionType: SwipeType } = body;

    // ✅ Validate required fields
    if (!swiper || !swiped || !actionType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(swiper) || !mongoose.Types.ObjectId.isValid(swiped)) {
      return NextResponse.json({ error: 'Invalid swiper or swiped ID' }, { status: 400 });
    }

    // ✅ Convert to ObjectId
    const swiperId = new mongoose.Types.ObjectId(swiper);
    const swipedId = new mongoose.Types.ObjectId(swiped);

    // ✅ Create or update swipe
    const swipe = await SwipeActionModel.findOneAndUpdate(
      { swiper: swiperId, swiped: swipedId },
      { swiper: swiperId, swiped: swipedId, actionType },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(swipe, { status: 200 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Swipe already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const animalId = searchParams.get('animalId');
    const received = searchParams.get('received') === 'true';
    const actionType = searchParams.get('actionType');

    // ✅ Validate animalId
    if (!animalId || !mongoose.Types.ObjectId.isValid(animalId)) {
      return NextResponse.json({ error: 'Invalid or missing animalId' }, { status: 400 });
    }

    const filter: any = received ? { swiped: animalId } : { swiper: animalId };
    if (actionType) filter.actionType = actionType;

    const swipes = await SwipeActionModel.find(filter)
      .populate('swiper', 'name image')
      .populate('swiped', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(swipes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
