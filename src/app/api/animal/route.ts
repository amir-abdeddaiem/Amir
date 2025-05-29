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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const animalId =  params.id; 

    if (!animalId) {
      return NextResponse.json(
        { message: 'Animal ID is required' },
        { status: 400 }
      );
    }

    const animal = await Animal.findById(animalId).populate('owner');

    if (!animal) {
      return NextResponse.json(
        { message: 'Animal not found' },
        { status: 404 }
      );
    }

    // Transform the data for response
    const animalData = {
      id: animal._id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      birthDate: animal.birthDate,
      age: animal.age,
      gender: animal.gender,
      weight: animal.weight,
      description: animal.description,
      vaccinated: animal.vaccinated,
      neutered: animal.neutered,
      friendly: animal.friendly,
      image: animal.image,
      owner: animal.owner,
      inmatch: animal.inmatch,
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt
    };

    return NextResponse.json(animalData, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve animal' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body: IAnimal = await req.json();

    // Basic validation
    if (!body.owner) {
      return NextResponse.json(
        { message: 'Owner is required' },
        { status: 400 }
      );
    }

    // Create a new animal
    const newAnimal = await Animal.create({
      name: body.name,
      type: body.type,
      breed: body.breed,
      birthDate: body.birthDate,
      age: body.age,
      gender: body.gender,
      weight: body.weight,
      description: body.description,
      HealthStatus: body.HealthStatus || {
        vaccinated: false,
        neutered: false,
        microchipped: false
      },
      friendly: body.friendly || {
        children: false,
        dogs: false,
        cats: false,
        other: false
      },
      image: body.image,
      owner: body.owner,
      inmatch: body.inmatch
    });

    return NextResponse.json(
      { 
        message: 'Animal created successfully',
        animal: newAnimal 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST Error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create animal' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: 'Animal ID is required' },
        { status: 400 }
      );
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('owner');

    if (!updatedAnimal) {
      return NextResponse.json(
        { message: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Animal updated successfully',
        animal: updatedAnimal 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PUT Error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update animal' },
      { status: 500 }
    );
  }
}