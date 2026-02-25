import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const stars = parseInt(formData.get('stars') as string);
    const message = formData.get('message') as string;
    const productId = formData.get('product') as string;
    const userId = req.headers.get('x-user-id');
    const photo = formData.get('photo') as string;

    if (!stars || stars < 1 || stars > 5) return NextResponse.json({ success: false, message: 'Invalid rating' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ success: false, message: 'Review message is required' }, { status: 400 });
    if (!productId) return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const rows = await sql`
      INSERT INTO reviews (stars, message, product_id, user_id, photo)
      VALUES (${stars}, ${message}, ${productId}, ${userId}, ${photo || null})
      RETURNING *`;
    return NextResponse.json({ success: true, review: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Review creation failed:', error);
    return NextResponse.json({ success: false, message: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const userId = req.nextUrl.searchParams.get('userId');
    if (!productId) return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });

    if (userId) {
      const rows = await sql`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.product_id = ${productId} AND r.user_id = ${userId} LIMIT 1`;
      return NextResponse.json({ success: true, review: rows[0] || null });
    }

    const rows = await sql`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.product_id = ${productId} ORDER BY r.created_at DESC`;
    return NextResponse.json({ success: true, reviews: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');
    const userId = req.headers.get('x-user-id');
    if (!reviewId) return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });

    const rows = await sql`DELETE FROM reviews WHERE id = ${reviewId} AND user_id = ${userId} RETURNING id`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
