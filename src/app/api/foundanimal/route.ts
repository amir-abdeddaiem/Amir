import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const color = formData.get('color') as string;
    const description = formData.get('description') as string;
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const type = formData.get('type') as string;

    if (!image || !color || !description || !breed || !gender || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const buffer = await image.arrayBuffer();
    const imageBase64 = `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`;

    const rows = await sql`
      INSERT INTO found_lost_animals (color, image, description, breed, gender, type, reporter_id)
      VALUES (${color}, ${imageBase64}, ${description}, ${breed}, ${gender}, ${type}, ${userId})
      RETURNING *`;

    // Mark potential lost animals as inmatch
    await sql`UPDATE animals SET inmatch = true, updated_at = NOW() WHERE lost = true AND type = ${type} AND (breed = ${breed} OR color = ${color} OR gender = ${gender})`;

    return NextResponse.json({ message: 'Found animal reported successfully', data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('foundanimal POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM found_lost_animals ORDER BY created_at DESC`;
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
