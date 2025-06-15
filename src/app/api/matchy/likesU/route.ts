import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel from '@/models/Swipe';
import {Animal} from '@/models/Animal';
import { connectDB } from '@/lib/db';

// GET: Retrieve superlikes for a given swiped pet
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const swiped = url.searchParams.get('swiped');
    const actionType = url.searchParams.get('actionType');
    const userId = req.headers.get('x-user-id');

    // Validate user ID
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid or missing user ID' }, { status: 400 });
    }

    // Validate swiped pet ID and action type
    if (!swiped || !mongoose.Types.ObjectId.isValid(swiped)) {
      return NextResponse.json({ error: 'Invalid or missing swiped pet ID' }, { status: 400 });
    }
    if (!actionType || actionType !== 'superlike') {
      return NextResponse.json({ error: 'Invalid or missing action type; must be superlike' }, { status: 400 });
    }

    // Verify the swiped pet belongs to the user
    const pet = await Animal.findOne({ _id: swiped, owner: userId }).lean();
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found or not owned by user' }, { status: 403 });
    }

    // Fetch superlikes
    const swipes = await SwipeActionModel.find({
      swipedpet: swiped,
      actionType: 'superlike',
    })
      .populate('swiperpet', 'name image type')
      .lean();

    // Transform response to include only necessary fields
    const response = swipes.map((swipe) => ({
      _id: swipe._id,
      swiperpet: {
        _id: swipe.swiperpet._id,
        name: swipe.swiperpet.name,
        image: swipe.swiperpet.image || '/default-pet.png',
        type: swipe.swiperpet.type?.toLowerCase(),
      },
      swipedpet: swipe.swipedpet,
      actionType: swipe.actionType,
    }));

    return NextResponse.json({ swipes: response }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Failed to fetch superlikes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}