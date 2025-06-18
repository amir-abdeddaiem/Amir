import { NextRequest, NextResponse } from 'next/server';
import { Animal } from '@/models/Animal';
export async function POST(req: NextRequest) {
    try {
        // Parse form data to get the image
        const formData = await req.formData();
        const image = formData.get('image') as File | null;

        if (!image) {
            return NextResponse.json({ error: 'Image is required.' }, { status: 400 });
        }

        // Read image as buffer
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

 
        // Search by image: find animals with matching image data (base64)
        // Assuming Animal model has an 'image' field storing base64 string (e.g., "data:image/jpeg;base64,...")
        const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
        const animals = await Animal.find({ image: base64Image });
        console.log(animals);
        return NextResponse.json({ data: animals });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
    }
}