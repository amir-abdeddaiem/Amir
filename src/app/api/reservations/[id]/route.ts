import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { providerId, petId, date, timeSlot, notes = '' } = body;
    const missing = ['providerId','petId','date','timeSlot'].filter(f => !body[f]);
    if (missing.length) return NextResponse.json({ success: false, error: `Missing: ${missing.join(', ')}` }, { status: 400 });

    const existing = await sql`SELECT id FROM reservations WHERE provider_id = ${providerId} AND date = ${new Date(date)} AND time_slot::text LIKE ${'%' + timeSlot + '%'} LIMIT 1`;
    if (existing.length) return NextResponse.json({ success: false, error: 'Time slot already booked' }, { status: 409 });

    const rows = await sql`
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes)
      VALUES (${userId}, ${providerId}, ${petId}, ${new Date(date)}, ${JSON.stringify([timeSlot])}, ${notes})
      RETURNING *`;

    return NextResponse.json({ success: true, data: { id: rows[0].id, date: rows[0].date, timeSlot: rows[0].time_slot, status: rows[0].status } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
}
