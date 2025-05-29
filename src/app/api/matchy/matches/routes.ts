import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel, { SwipeType } from '@/models/Swipe';
import { Match } from '@/models/Match';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { swiper, swiped, actionType }: { swiper: string; swiped: string; actionType: SwipeType } = await req.json();

    if (!swiper || !swiped || !actionType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(swiper) || !mongoose.Types.ObjectId.isValid(swiped)) {
      return NextResponse.json({ error: 'Invalid animal IDs' }, { status: 400 });
    }

    const swipe = await SwipeActionModel.findOneAndUpdate(
      { swiper, swiped },
      { swiper, swiped, actionType },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (actionType === 'like') {
      const reciprocal = await SwipeActionModel.findOne({
        swiper: swiped,
        swiped: swiper,
        actionType: 'like',
      });

      if (reciprocal) {
        const [id1, id2] = [swiper, swiped].sort();
        const existingMatch = await Match.findOne({ pet1: id1, pet2: id2 });

        if (!existingMatch) {
          await Match.create({ pet1: id1, pet2: id2 });
          console.log(`💘 Match created between ${id1} and ${id2}`);
        }
      }
    }

    return NextResponse.json(swipe, { status: 200 });
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
