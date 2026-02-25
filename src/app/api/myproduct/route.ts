import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const userId = req.headers.get('x-user-id');
  try {
    if (productId) {
      const rows = await sql`SELECT p.*, u.first_name, u.last_name, u.email, u.phone FROM products p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = ${productId} LIMIT 1`;
      if (!rows.length) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    }
    if (userId) {
      const rows = await sql`SELECT p.*, u.first_name, u.last_name, u.email, u.phone FROM products p LEFT JOIN users u ON u.id = p.user_id WHERE p.user_id = ${userId} ORDER BY p.created_at DESC`;
      return NextResponse.json(rows);
    }
    return NextResponse.json({ message: 'User ID not found' }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ message: 'No data found' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  try {
    if (!userId) return NextResponse.json({ message: 'User ID not found' }, { status: 404 });
    if (!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });

    const rows = await sql`DELETE FROM products WHERE id = ${productId} AND user_id = ${userId} RETURNING id`;
    if (!rows.length) return NextResponse.json({ message: 'Product not found or not owned by user' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (e) {
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID not found' }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  try {
    const rows = await sql`
      UPDATE products SET
        name = ${body.name}, description = ${body.description}, price = ${body.price},
        images = ${JSON.stringify(body.images || [])}, category = ${body.category},
        localisation = ${body.localisation || null}, featured = ${body.featured ?? false},
        pet_type = ${body.petType}, quantity = ${body.quantity || 1},
        specifications = ${JSON.stringify(body.specifications || [])},
        breed = ${body.breed || null}, age = ${body.age || null}, gender = ${body.gender || null},
        weight = ${body.weight || null}, color = ${body.Color || null},
        listing_type = ${body.listingType || 'sale'}, updated_at = NOW()
      WHERE id = ${body.id} AND user_id = ${userId}
      RETURNING *`;
    if (!rows.length) return NextResponse.json({ message: 'Product not found or not owned by user' }, { status: 404 });
    return NextResponse.json({ message: 'Product updated', product: rows[0] });
  } catch (e) {
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}
