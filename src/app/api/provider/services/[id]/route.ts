import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const serviceRows = await sql`SELECT * FROM users WHERE id = ${id} AND acc_type = 'provider' LIMIT 1`;
    if (!serviceRows.length) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    const { password, ...service } = serviceRows[0];
    const reviews = await sql`SELECT sr.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.avatar AS customer_avatar FROM service_reviews sr LEFT JOIN users u ON u.id = sr.customer_id WHERE sr.provider_id = ${id} AND sr.is_visible = true ORDER BY sr.created_at DESC LIMIT 10`;
    return NextResponse.json({ success: true, data: { service, reviews } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    const rows = await sql`UPDATE users SET description = ${body.description || null}, website = ${body.website || null}, services = ${JSON.stringify(body.services || [])}, updated_at = NOW() WHERE id = ${id} AND id = ${userId} RETURNING *`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ success: true });
}
