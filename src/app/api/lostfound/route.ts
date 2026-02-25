import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const base64 = image
      ? `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString('base64')}`
      : null;
    const animals = await sql`SELECT * FROM animals WHERE image = ${base64}`;
    return NextResponse.json({ data: animals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
