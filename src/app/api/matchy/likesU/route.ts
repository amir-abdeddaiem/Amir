import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const swiped = searchParams.get('swiped');
  const actionType = searchParams.get('actionType');

  if (!userId) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  if (!swiped) return NextResponse.json({ error: 'Missing swiped pet ID' }, { status: 400 });
  if (actionType !== 'superlike') return NextResponse.json({ error: 'Action type must be superlike' }, { status: 400 });

  try {
    const petCheck = await sql`SELECT id FROM animals WHERE id = ${swiped} AND owner_id = ${userId} LIMIT 1`;
    if (!petCheck.length) return NextResponse.json({ error: 'Pet not found or not owned by user' }, { status: 403 });

    const swipes = await sql`
      SELECT sa.*, a.name AS swiperpet_name, a.image AS swiperpet_image, a.type AS swiperpet_type
      FROM swipe_actions sa
      LEFT JOIN animals a ON a.id = sa.swiperpet_id
      WHERE sa.swipedpet_id = ${swiped} AND sa.action_type = 'superlike'`;

    return NextResponse.json({ swipes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
