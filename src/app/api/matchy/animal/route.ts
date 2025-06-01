import { connectDB } from '@/lib/db';
import { Animal } from '@/models/Animal';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Type definitions
interface IAnimal {
  name: string;
  type: string;
  breed: string;
  birthDate: Date;
  age: string;
  gender: 'male' | 'female' | 'other';
  weight?: string;
  description: string;
  HealthStatus: {
    vaccinated: boolean;
    neutered: boolean;
    microchipped: boolean;
  };

  friendly: {
    children: boolean;
    dogs: boolean;
    cats: boolean;
    other: boolean;
  };
  image: string;
  owner: string;
  inmatch: boolean;
}

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
      _id: { $ne: userId },
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

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { _id, inmatch } = body;

    if (!_id) {
      return NextResponse.json(
        { message: 'Animal ID (_id) is required to update inmatch' },
        { status: 400 }
      );
    }

    if (inmatch === false) {
      const updatedAnimal = await Animal.findByIdAndUpdate(
        _id,
        { inmatch: true },
        { new: true }
      );

      if (!updatedAnimal) {
        return NextResponse.json(
          { message: 'Animal not found for update' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: 'Animal updated to inmatch: true',
          animal: updatedAnimal,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'inmatch is already true or not provided — no update done.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { message: 'Failed to update animal', error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { _id, inmatch } = body;

    if (!_id) {
      return NextResponse.json(
        { message: 'Animal ID (_id) is required to update inmatch' },
        { status: 400 }
      );
    }

    if (inmatch === true) {
      const updatedAnimal = await Animal.findByIdAndUpdate(
        _id,
        { inmatch: false },
        { new: true }
      );

      if (!updatedAnimal) {
        return NextResponse.json(
          { message: 'Animal not found for update' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: 'Animal updated to inmatch: false',
          animal: updatedAnimal,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'inmatch is already false or not provided — no update done.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { message: 'Failed to update animal', error: error.message },
      { status: 500 }
    );
  }
}

