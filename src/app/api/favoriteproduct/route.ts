import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });

    const existing = await sql`SELECT id FROM favorites WHERE user_id = ${userId} AND product_id = ${productId} LIMIT 1`;
    if (existing.length) return NextResponse.json(existing[0], { status: 200 });

    const rows = await sql`INSERT INTO favorites (user_id, product_id) VALUES (${userId}, ${productId}) RETURNING *`;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('POST favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const favorites = await sql`
      SELECT f.*, p.name, p.description, p.price, p.images, p.category, p.pet_type, p.listing_type
      FROM favorites f JOIN products p ON p.id = f.product_id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC`;

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('GET favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });

    const rows = await sql`DELETE FROM favorites WHERE user_id = ${userId} AND product_id = ${productId} RETURNING id`;
    if (!rows.length) return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('DELETE favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
