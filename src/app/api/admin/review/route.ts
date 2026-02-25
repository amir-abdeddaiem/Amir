import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const query = productId
      ? await sql`SELECT r.*, u.first_name, u.last_name, u.email, p.name AS product_name FROM reviews r LEFT JOIN users u ON u.id = r.user_id LEFT JOIN products p ON p.id = r.product_id WHERE r.product_id = ${productId} ORDER BY r.created_at DESC`
      : await sql`SELECT r.*, u.first_name, u.last_name, u.email, p.name AS product_name FROM reviews r LEFT JOIN users u ON u.id = r.user_id LEFT JOIN products p ON p.id = r.product_id ORDER BY r.created_at DESC`;
    return NextResponse.json({ success: true, reviews: query });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { reviewIds } = await req.json();
    if (!Array.isArray(reviewIds) || !reviewIds.length) {
      return NextResponse.json({ success: false, message: 'Invalid review IDs' }, { status: 400 });
    }
    const result = await sql`DELETE FROM reviews WHERE id = ANY(${reviewIds})`;
    return NextResponse.json({ success: true, message: 'Review(s) deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete reviews' }, { status: 500 });
  }
}
