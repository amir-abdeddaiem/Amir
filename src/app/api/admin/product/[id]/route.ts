import { connectDB } from '@/lib/db';
import { Animal } from '@/models/Animal';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const animalId = params.id;

    if (!animalId || !mongoose.Types.ObjectId.isValid(animalId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid animal ID' },
        { status: 400 }
      );
    }

    const deletedAnimal = await Animal.findByIdAndDelete(animalId);
    if (!deletedAnimal) {
      return NextResponse.json(
        { success: false, message: 'Animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Animal deletion failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete animal',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}