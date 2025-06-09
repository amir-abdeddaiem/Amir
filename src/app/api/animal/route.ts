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
  owner?: string;
  inmatch: boolean;
}
export async function GET() {
  await connectDB();

  try {
    const animals = await Animal.find().populate('owner');

    const formattedAnimals = animals.map(animal => ({
      id: animal._id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      weight: animal.weight,
      description: animal.description,
      HealthStatus: animal.HealthStatus || {
        vaccinated: animal.vaccinated,
        neutered: animal.neutered,
        microchipped: animal.microchipped,
      },
      friendly: animal.friendly || {
        children: animal.children,
        dogs: animal.dogs,
        cats: animal.cats,
        other: animal.other,
      },
      image: animal.image,
      owner: animal.owner,
      inmatch: animal.inmatch,
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt,
    }));

    return NextResponse.json(formattedAnimals);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  await connectDB();
  const Owner = req.headers.get("x-user-id");

  try {
    const body = await req.json();
    console.log(body);

   

    // Create a new animal
    const newAnimal = await Animal.create({
      name: body.name,
      type: body.type,
      breed: body.breed,
      // birthDate: body.birthDate,
      age: body.age,
      gender: body.gender,
      weight: body.weight,
      description: body.description,
      HealthStatus: body.HealthStatus || {
        vaccinated: false,
        neutered: false,
        microchipped: false,
      },
      friendly: body.friendly || {
        children: false,
        dogs: false,
        cats: false,
        other: false,
      },
      image: body.image,
      owner: Owner,
      inmatch: true,
    });

    return NextResponse.json(
      {
        message: "Animal created successfully",
        animal: newAnimal,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 420 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create animal" },
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