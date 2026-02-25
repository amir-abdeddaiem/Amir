import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized', data: null }, { status: 401 });
  try {
    const rows = await sql`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, business_name, description, website, location, services, created_at, updated_at FROM users WHERE id = ${userId} LIMIT 1`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Provider not found', data: null }, { status: 404 });
    const u = rows[0];
    return NextResponse.json({ success: true, error: null, data: {
      id: u.id, firstName: u.first_name, lastName: u.last_name, email: u.email,
      phone: u.phone, avatar: u.avatar, boutiqueImage: u.boutique_image || '/default-boutique.png',
      businessName: u.business_name || 'Not provided', description: u.description || 'No description',
      website: u.website || 'Not provided', location: u.location || 'Not provided',
      services: u.services || [], createdAt: u.created_at, updatedAt: u.updated_at
    }});
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error', data: null }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized', data: null }, { status: 401 });
  const body = await req.json();
  try {
    const rows = await sql`
      UPDATE users SET
        first_name = COALESCE(${body.firstName}, first_name),
        last_name  = COALESCE(${body.lastName}, last_name),
        email      = COALESCE(${body.email}, email),
        phone      = COALESCE(${body.phone}, phone),
        business_name = COALESCE(${body.businessName}, business_name),
        description   = COALESCE(${body.description}, description),
        website       = COALESCE(${body.website}, website),
        location      = COALESCE(${body.location}, location),
        services      = COALESCE(${JSON.stringify(body.services)}, services),
        boutique_image = COALESCE(${body.boutiqueImage}, boutique_image),
        avatar         = COALESCE(${body.avatar}, avatar),
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Provider not found', data: null }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update profile', data: null }, { status: 500 });
  }
}
