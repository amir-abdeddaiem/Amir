import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const slots = await sql`
      SELECT a.date, a.times,
        COALESCE(array_agg(r.time_slot::text) FILTER (WHERE r.status IN ('pending','confirmed')), '{}') AS booked
      FROM appointments a
      LEFT JOIN reservations r ON r.provider_id = a.provider_id AND r.date::date = a.date
      WHERE a.provider_id = ${id}
      GROUP BY a.id, a.date, a.times
      ORDER BY a.date`;
    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}

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
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes, status)
      VALUES (${userId}, ${providerId}, ${petId}, ${new Date(date)}, ${JSON.stringify([timeSlot])}, ${notes}, 'pending')
      RETURNING *`;

    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
}
