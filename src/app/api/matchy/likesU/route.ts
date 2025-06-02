import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SwipeActionModel, { SwipeType } from '@/models/Swipe';

import { connectDB } from '@/lib/db';


// GET: Retrieve superlikes for a given swiped user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const swiped = url.searchParams.get('swiped');
    const actionType = url.searchParams.get('actionType');

    if (!swiped || !actionType) {
      return NextResponse.json({ error: 'Missing swiped or actionType' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(swiped)) {
      return NextResponse.json({ error: 'Invalid swiped ID' }, { status: 400 });
    }

    const swipes = await SwipeActionModel.find({
      swiped,
      actionType,
    });

    return NextResponse.json({ swipes }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Failed to fetch superlikes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
