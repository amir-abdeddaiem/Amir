import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel, { SwipeType } from '@/models/Swipe';
import { Match } from '@/models/Match';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("matched")
    const { swiped, actionType }: { swiped: string; actionType: SwipeType } = await req.json();
    const swiper = req.headers.get('x-user-id');
    console.log(swiper)
    if (!swiper || !swiped || !actionType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 450 });
    }

    if (!mongoose.Types.ObjectId.isValid(swiper) || !mongoose.Types.ObjectId.isValid(swiped)) {
      return NextResponse.json({ error: 'Invalid animal IDs' }, { status: 400 });
    }

    // Insert the new swipe
    await SwipeActionModel.create({ swiper, swiped, actionType });

    // Check for a reverse swipe (swiped => swiper)
    const existingReverseSwipe = await SwipeActionModel.findOne({
      swiper: swiped,
      swiped: swiper,
    });

    if (existingReverseSwipe) {
      console.log('🔁 Mutual interest found!');
      console.log(existingReverseSwipe);
    }

    return NextResponse.json({ message: 'Swipe recorded successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Match creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const animalId = searchParams.get('animalId');

    if (!animalId || !mongoose.Types.ObjectId.isValid(animalId)) {
      return NextResponse.json({ error: 'Invalid or missing animalId' }, { status: 400 });
    }

    const matches = await Match.find({
      $or: [{ pet1: animalId }, { pet2: animalId }],
    })
      .populate('pet1', 'name image')
      .populate('pet2', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error('❌ Fetching matches failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
