import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar
      FROM animals a LEFT JOIN users u ON u.id = a.owner_id
      WHERE a.id = ${id} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animal' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`DELETE FROM animals WHERE id = ${id} RETURNING id`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const allowed = ['name','type','breed','age','gender','weight','description','image','color','lost','inmatch'];
    const updates: string[] = [];
    const values: any[] = [];
    allowed.forEach((key) => {
      if (data[key] !== undefined) {
        updates.push(`${key} = $${values.length + 1}`);
        values.push(data[key]);
      }
    });
    if (!updates.length) return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    values.push(id);
    const rows = await sql.query(
      `UPDATE animals SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return new Response('Animal not found', { status: 404 });
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response('Server Error', { status: 500 });
  }
}
