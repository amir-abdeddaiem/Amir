import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { Message } from '../../../models/Message';
import { Match } from '../../../models/Match';
import { Animal } from '../../../models/Animal';
import { IMessage } from '@/types/index';
import { NextRequest } from 'next/server';
interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    // add other user properties if needed
  };
}

interface MessageRequestBody {
  matchId: string;
  content: string;
}

export async function POST(request: AuthenticatedRequest) {
  try {
    await connectDB();
    
    // Parse the request body
    const { matchId, content }: MessageRequestBody = await request.json();

    if (!matchId || !content) {
      return NextResponse.json({ error: 'matchId and content are required' }, { status: 400 });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Note: You'll need to handle the user authentication properly
    // Currently using request.user!.userId assumes you have middleware setting this
    const userPets = await Animal.find({ owner: request.user!.userId }).select('_id');
    
    const userPetIds = userPets.map((pet) => pet._id.toString());
    if (!userPetIds.includes(match.pet1.toString()) && !userPetIds.includes(match.pet2.toString())) {
      return NextResponse.json({ error: 'Unauthorized to send message in this match' }, { status: 403 });
    }

    const message: IMessage = await Message.create({
      matchId,
      sender: request.user!.userId,
      content,
      createdAt: new Date() // Adding timestamp if not automatically set by schema
    });

    return NextResponse.json({ message: 'Message sent successfully', data: message }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}