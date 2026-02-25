import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { matchId, content } = await request.json();
    if (!matchId || !content) return NextResponse.json({ error: 'matchId and content required' }, { status: 400 });

    // Verify match exists and user is a participant
    const matchRows = await sql`SELECT * FROM matches WHERE id = ${matchId} LIMIT 1`;
    if (!matchRows.length) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    const match = matchRows[0];

    const userPets = await sql`SELECT id FROM animals WHERE owner_id = ${userId}`;
    const petIds = userPets.map((p: any) => p.id);
    if (!petIds.includes(match.pet1_id) && !petIds.includes(match.pet2_id)) {
      return NextResponse.json({ error: 'Unauthorized to send message in this match' }, { status: 403 });
    }

    const rows = await sql`INSERT INTO messages (match_id, sender_id, content) VALUES (${matchId}, ${userId}, ${content}) RETURNING *`;
    return NextResponse.json({ message: 'Message sent successfully', data: rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    if (!matchId) return NextResponse.json({ error: 'matchId is required' }, { status: 400 });

    const matchRows = await sql`SELECT * FROM matches WHERE id = ${matchId} LIMIT 1`;
    if (!matchRows.length) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    const match = matchRows[0];

    const userPets = await sql`SELECT id FROM animals WHERE owner_id = ${userId}`;
    const petIds = userPets.map((p: any) => p.id);
    if (!petIds.includes(match.pet1_id) && !petIds.includes(match.pet2_id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await sql`
      SELECT m.*, u.first_name AS sender_first_name, u.last_name AS sender_last_name, u.avatar AS sender_avatar
      FROM messages m LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.match_id = ${matchId} ORDER BY m.created_at ASC`;

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve messages', details: error.message }, { status: 500 });
  }
}
