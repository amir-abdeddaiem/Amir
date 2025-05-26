import { NextResponse } from 'next/server';

import {connectDB} from '../../../../lib/mongodb';
import { Animal } from '@/models/Animal';
import { Match } from '@/models/Match';

interface Match {
  pet1: {
    _id: string;
    name: string;
    species: string;
    photo: string;
    owner: string;
  };
  pet2: {
    _id: string;
    name: string;
    species: string;
    photo: string;
    owner: string;
  };
}

interface UserPets {
  _id: string;
}
export async function GET(request: Request) {

  try {
    await connectDB();
    const userPets: UserPets[] = await Animal.find({ owner: (request as any).user.userId }).select('_id');
    const userPetIds = userPets.map((pet) => pet._id);

    const matches: Match[] = await Match.find({
      $or: [{ pet1: { $in: userPetIds } }, { pet2: { $in: userPetIds } }],
    })
      .populate('pet1', 'name species photo owner')
      .populate('pet2', 'name species photo owner');

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};