import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const animals = await sql`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar
      FROM animals a
      LEFT JOIN users u ON u.id = a.owner_id
      ORDER BY a.created_at DESC`;
    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ownerId = req.headers.get('x-user-id');
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ message: 'Content-Type must be application/json' }, { status: 400 });
  }
  const body = await req.json();
  try {
    const healthStatus = JSON.stringify(body.healthStatus || { vaccinated: false, neutered: false, microchipped: false });
    const friendly = JSON.stringify(body.friendly || { children: false, dogs: false, cats: false, animals: false });

    const rows = await sql`
      INSERT INTO animals (name, type, breed, age, gender, weight, description, health_status, friendly, image, owner_id, color, inmatch)
      VALUES (${body.name}, ${body.type}, ${body.breed}, ${body.age}, ${body.gender},
              ${body.weight || null}, ${body.description || null}, ${healthStatus}, ${friendly},
              ${body.image || null}, ${ownerId}, ${body.color || null}, ${body.inmatch ?? true})
      RETURNING *`;
    return NextResponse.json({ message: 'Animal created successfully', animal: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('POST animal error:', error);
    return NextResponse.json({ message: 'Failed to create animal' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ message: 'Animal ID is required' }, { status: 400 });

    const allowed = ['name','type','breed','age','gender','weight','description','health_status','friendly','image','lost','color','inmatch'];
    const updates: string[] = [];
    const vals: any[] = [];
    let n = 1;
    for (const key of allowed) {
      if (data[key] !== undefined) {
        updates.push(`${key} = $${n++}`);
        vals.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
      }
    }
    if (!updates.length) return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    vals.push(id);
    const rows = await sql.query(`UPDATE animals SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${n} RETURNING *`, vals);
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal updated successfully', animal: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update animal' }, { status: 500 });
  }
}
