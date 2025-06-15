import { NextRequest, NextResponse } from 'next/server';
import { FoundAnimal } from '@/models/FoundLost';
import { Animal } from '@/models/Animal';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = req.headers.get('x-user-id');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    const color = formData.get('color') as string;
    const description = formData.get('description') as string;
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const type = formData.get('type') as string;

    // Validate required fields
    if (!image || !color || !description || !breed || !gender || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert image to base64 (adjust based on your storage method, e.g., S3)
    const buffer = await image.arrayBuffer();
    const imageBase64 = `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`;

    const foundAnimal = new FoundAnimal({
      color,
      image: imageBase64,
      description,
      breed,
      gender,
      type,
      reporter: user,
    });

    await foundAnimal.save();

    // Check for potential matches with lost animals
    const potentialMatches = await Animal.find({
      lost: true,
      type,
      $or: [
        { breed: breed },
        { color: color },
        { gender: gender },
      ],
    });

    if (potentialMatches.length > 0) {
      await Animal.updateMany(
        { _id: { $in: potentialMatches.map((m) => m._id) } },
        { $set: { inmatch: true } },
      );
    }

    return NextResponse.json({ message: 'Found animal reported successfully', data: foundAnimal }, { status: 201 });
  } catch (error) {
    console.error('Error reporting found animal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const foundAnimals = await FoundAnimal.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: foundAnimals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching found animals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}