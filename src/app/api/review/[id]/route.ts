import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.id = ${id} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('x-user-id');
  try {
    const { id } = await params;
    const { stars, message, photo } = await req.json();
    const rows = await sql`UPDATE reviews SET stars = ${stars}, message = ${message}, photo = ${photo || null} WHERE id = ${id} AND user_id = ${userId} RETURNING *`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get('x-user-id');
  try {
    const { id } = await params;
    const rows = await sql`DELETE FROM reviews WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
