import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const animals = await sql`SELECT * FROM animals WHERE owner_id = ${userId} ORDER BY created_at DESC`;
    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const data = await req.json();
    const rows = await sql`
      UPDATE animals SET
        name = ${data.name}, type = ${data.type}, breed = ${data.breed},
        age = ${data.age}, gender = ${data.gender}, weight = ${data.weight || null},
        description = ${data.description || null}, image = ${data.image || null},
        updated_at = NOW()
      WHERE owner_id = ${userId}
      RETURNING *`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating animal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const rows = await sql`DELETE FROM animals WHERE owner_id = ${userId} RETURNING id`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}
