import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const products = await sql`
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM products p LEFT JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC`;

    const formatted = products.map((p: any) => ({
      id: p.id,
      name: p.name, description: p.description, price: p.price,
      images: p.images || [], category: p.category,
      localisation: p.localisation || '', featured: p.featured,
      petType: p.pet_type, quantity: p.quantity,
      user: p.user_id ? { id: p.user_id, firstName: p.first_name, lastName: p.last_name, email: p.email } : null,
      breed: p.breed || '', age: p.age || '', gender: p.gender || '',
      weight: p.weight || '', Color: p.color || '',
      listingType: p.listing_type || 'sale',
      createdAt: p.created_at, updatedAt: p.updated_at,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error retrieving products' }, { status: 500 });
  }
}
