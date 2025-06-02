import { connectDB } from '@/lib/db';
import { Animal } from '@/models/Animal';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import mongoose from 'mongoose';
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const userId =req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required in query params' },
        { status: 400 }
      );
    }

    const pets = await Animal.find({
      inmatch: true,
      owner: new mongoose.Types.ObjectId(userId),
    });

    // Optionally format the data
    const formattedPets = pets.map((pet) => ({
      id: pet._id,
      name: pet.name,
      age: pet.age,
      breed: pet.breed,
      image: pet.image,
      bio: pet.description,
      temperament: Object.entries(pet.friendly)
        .filter(([_, val]) => val)
        .map(([key]) => key),
    }));

    return NextResponse.json({ pets: formattedPets }, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch pets' },
      { status: 500 }
    );
  }
}