import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT * FROM found_lost_animals WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const allowed = ['color','image','description','breed','gender','type'];
    const sets: string[] = [];
    const vals: any[] = [];
    let n = 1;
    for (const key of allowed) {
      if (updates[key] !== undefined) { sets.push(`${key} = $${n++}`); vals.push(updates[key]); }
    }
    if (!sets.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    vals.push(id);
    const rows = await sql.query(`UPDATE found_lost_animals SET ${sets.join(', ')} WHERE id = $${n} RETURNING *`, vals);
    if (!rows.length) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
