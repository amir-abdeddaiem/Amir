import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const pets = await sql`SELECT * FROM animals WHERE inmatch = true AND owner_id != ${userId}`;
    const formatted = pets.map((p: any) => ({
      id: p.id, name: p.name, age: p.age, breed: p.breed, image: p.image, bio: p.description,
      temperament: Object.entries(p.friendly || {}).filter(([_, v]) => v).map(([k]) => k),
    }));
    return NextResponse.json({ pets: formatted });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch pets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { _id, inmatch } = body;
  if (!_id) return NextResponse.json({ message: 'Animal ID is required' }, { status: 400 });
  try {
    const rows = await sql`UPDATE animals SET inmatch = ${inmatch ?? true}, updated_at = NOW() WHERE id = ${_id} RETURNING *`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ animal: rows[0] });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update animal' }, { status: 500 });
  }
}
