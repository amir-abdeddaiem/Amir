// app/api/animal/[id]/route.ts
import { connectDB } from '@/lib/db';
import { Animal } from '@/models/Animal';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const animal = await Animal.findById(params.id).populate('owner');

    if (!animal) {
      return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: animal._id,
      name: animal.name,
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      weight: animal.weight,
      description: animal.description,
      HealthStatus: animal.HealthStatus || {
        vaccinated:  animal.vaccinated,
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
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animal' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const deleted = await Animal.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const animalId = params.id;
    const data = await req.json();

    const updatedAnimal = await Animal.findByIdAndUpdate(animalId, data, {
      new: true,
    });

    if (!updatedAnimal) {
      return new Response("Animal not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedAnimal), {
      status: 200,
    });
  } catch (error) {
    return new Response("Server Error", { status: 500 });
  }
}