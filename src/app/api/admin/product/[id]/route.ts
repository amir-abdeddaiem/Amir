import sql from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: 'Invalid animal ID' }, { status: 400 });

    const rows = await sql`DELETE FROM animals WHERE id = ${id} RETURNING id`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Animal not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete animal' }, { status: 500 });
  }
}
