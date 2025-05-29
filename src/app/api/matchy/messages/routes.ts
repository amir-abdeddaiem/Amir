import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Message } from '@/models/Message';
import { Match } from '@/models/Match';
import { Animal } from '@/models/Animal';
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
    
    if (!request.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId, content }: MessageRequestBody = await request.json();

    if (!matchId || !content) {
      return NextResponse.json({ error: 'matchId and content are required' }, { status: 400 });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const userPets = await Animal.find({ owner: request.user.userId }).select('_id');
    const userPetIds = userPets.map((pet) => pet._id.toString());
    
    if (!userPetIds.includes(match.pet1.toString()) && !userPetIds.includes(match.pet2.toString())) {
      return NextResponse.json({ error: 'Unauthorized to send message in this match' }, { status: 403 });
    }

    const message = await Message.create({
      matchId,
      sender: request.user.userId,
      content,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Message sent successfully', 
      data: message 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: AuthenticatedRequest) {
  try {
    await connectDB();

    if (!request.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json({ error: 'matchId is required' }, { status: 400 });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const userPets = await Animal.find({ owner: request.user.userId }).select('_id');
    const userPetIds = userPets.map((pet) => pet._id.toString());

    if (!userPetIds.includes(match.pet1.toString()) && !userPetIds.includes(match.pet2.toString())) {
      return NextResponse.json({ error: 'Unauthorized to view messages in this match' }, { status: 403 });
    }

    const messages = await Message.find({ matchId })
      .populate('sender', 'name _id')
      .sort({ createdAt: 1 });

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
