import { connectDB } from '@/lib/db';
import { Animal } from '@/models/Animal';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const animals = await Animal.find({ owner: userId }).populate('owner');
    return NextResponse.json(animals); // Return array of animals
  } catch (error) {
    console.error('Error retrieving animals:', error);
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updated = await Animal.findOneAndUpdate(
      { owner: userId },
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating animal:', error);
    return NextResponse.json({ message: 'Error updating animal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();
  const userId = req.headers.get('x-user-id');
  
  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const deleted = await Animal.findOneAndDelete({ owner: userId });

    if (!deleted) {
      return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Error deleting animal:', error);
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}