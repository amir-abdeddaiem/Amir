import { NextResponse } from 'next/server';
import {connectDB} from '../../../lib/mongodb';
import { Swipe } from '@/models/Swipe';
import { Match } from '@/models/Match';


interface SwipeRequest {
  swiperPetId: string;
  swipedPetId: string;
  action: 'like' | 'ignore' | 'super_like';
}

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const { swiperPetId, swipedPetId, action } = (await request.json()) as SwipeRequest;

    // Validate input
    if (!swiperPetId || !swipedPetId || !['like', 'ignore', 'super_like'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid input: swiperPetId, swipedPetId, and action (like, ignore, super_like) are required' },
        { status: 400 }
      );
    }

    // Create a new swipe
    const swipe = await Swipe.create({
      swiperPet: swiperPetId,
      swipedPet: swipedPetId,
      action,
    });

    // Check for a match if action is 'like' or 'super_like'
    let match = null;
    if (action === 'like' || action === 'super_like') {
      const reverseSwipe = await Swipe.findOne({
        swiperPet: swipedPetId,
        swipedPet: swiperPetId,
        action: { $in: ['like', 'super_like'] },
      });

      if (reverseSwipe) {
        // Create a match
        match = await Match.create({
          pet1: swiperPetId,
          pet2: swipedPetId,
        });
      }
    }

    return NextResponse.json({
      message: match ? 'Swipe recorded, match created!' : 'Swipe recorded',
      });
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}