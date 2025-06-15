import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel, { SwipeType } from '@/models/Swipe';
import { Match } from '@/models/Match';
import { Animal } from '@/models/Animal';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { swiperpet, swipedpet, actionType } = await req.json();
    const userId = req.headers.get('x-user-id');

    if (!userId || !swiperpet || !swipedpet || !actionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(swiperpet) || !mongoose.Types.ObjectId.isValid(swipedpet)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const swiperPet = await Animal.findOne({ _id: swiperpet, owner: userId });
    if (!swiperPet) {
      return NextResponse.json({ error: 'Swiper pet not found or unauthorized' }, { status: 403 });
    }

    try {
      await SwipeActionModel.create({ swiper: userId, swiperpet, swipedpet, actionType });
    } catch (error: any) {
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Duplicate swipe detected' }, { status: 409 });
      }
      throw error;
    }

    if (actionType === 'like' || actionType === 'superlike') {
      const reverseSwipe = await SwipeActionModel.findOne({ swiperpet: swipedpet, swipedpet: swiperpet, actionType: { $in: ['like', 'superlike'] } });
      if (reverseSwipe) {
        const swipedPet = await Animal.findById(swipedpet).select('owner');
        if (!swipedPet) return NextResponse.json({ error: 'Swiped pet not found' }, { status: 404 });

        const [pet1, pet2] = [swiperpet, swipedpet].sort();
        const [owner1, owner2] = pet1 === swiperpet ? [userId, swipedPet.owner] : [swipedPet.owner, userId];

        await Match.findOneAndUpdate({ pet1, pet2 }, { pet1, pet2, owner1, owner2 }, { upsert: true, new: true });
        return NextResponse.json({ message: 'Match created', match: true }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Swipe recorded' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in match creation:', error);
    if (error.name === 'CastError') return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}