import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'customer';
    const column = role === 'provider' ? 'provider_id' : 'customer_id';
    const rows = await sql.query(`
      SELECT r.*, a.name AS pet_name, a.image AS pet_image,
        u.first_name AS provider_first_name, u.last_name AS provider_last_name
      FROM reservations r
      LEFT JOIN animals a ON a.id = r.pet_id
      LEFT JOIN users u ON u.id = r.provider_id
      WHERE r.${column} = $1
      ORDER BY r.date DESC`, [userId]);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const customerId = req.headers.get('x-user-id');
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const rows = await sql`
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes, status)
      VALUES (${customerId}, ${body.providerId}, ${body.petId || null}, ${body.date}, ${JSON.stringify(body.timeSlot || [])}, ${body.notes || ''}, 'pending')
      RETURNING *`;
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Reservation ID required' }, { status: 400 });
    const rows = await sql`UPDATE reservations SET status = ${body.status}, cancellation_reason = ${body.cancellationReason || null}, updated_at = NOW() WHERE id = ${body.id} RETURNING *`;
    if (!rows.length) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
