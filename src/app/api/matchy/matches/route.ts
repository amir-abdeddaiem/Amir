import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const { swiperpet, swipedpet, actionType } = await req.json();
  if (!userId || !swiperpet || !swipedpet || !actionType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    // Verify swiper pet belongs to user
    const petCheck = await sql`SELECT id FROM animals WHERE id = ${swiperpet} AND owner_id = ${userId} LIMIT 1`;
    if (!petCheck.length) return NextResponse.json({ error: 'Swiper pet not found or unauthorized' }, { status: 403 });

    // Insert swipe (ignore duplicate)
    try {
      await sql`INSERT INTO swipe_actions (swiper_id, swiperpet_id, swipedpet_id, action_type) VALUES (${userId}, ${swiperpet}, ${swipedpet}, ${actionType})`;
    } catch (e: any) {
      if (e.message?.includes('unique')) return NextResponse.json({ error: 'Duplicate swipe' }, { status: 409 });
      throw e;
    }

    if (actionType === 'like' || actionType === 'superlike') {
      const reverse = await sql`SELECT id FROM swipe_actions WHERE swiperpet_id = ${swipedpet} AND swipedpet_id = ${swiperpet} AND action_type IN ('like','superlike') LIMIT 1`;
      if (reverse.length) {
        const swipedPet = await sql`SELECT owner_id FROM animals WHERE id = ${swipedpet} LIMIT 1`;
        if (!swipedPet.length) return NextResponse.json({ error: 'Swiped pet not found' }, { status: 404 });

        const ids = [swiperpet, swipedpet].sort();
        const [pet1, pet2] = ids;
        const [owner1, owner2] = pet1 === swiperpet ? [userId, swipedPet[0].owner_id] : [swipedPet[0].owner_id, userId];

        await sql`
          INSERT INTO matches (pet1_id, pet2_id, owner1_id, owner2_id) VALUES (${pet1}, ${pet2}, ${owner1}, ${owner2})
          ON CONFLICT (pet1_id, pet2_id) DO NOTHING`;
        return NextResponse.json({ message: 'Match created', match: true });
      }
    }
    return NextResponse.json({ message: 'Swipe recorded' });
  } catch (error: any) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const animalId = searchParams.get('animalId');
  if (!animalId) return NextResponse.json({ error: 'Invalid or missing animalId' }, { status: 400 });
  try {
    const matches = await sql`
      SELECT m.*,
        p1.name AS pet1_name, p1.image AS pet1_image,
        p2.name AS pet2_name, p2.image AS pet2_image
      FROM matches m
      LEFT JOIN animals p1 ON p1.id = m.pet1_id
      LEFT JOIN animals p2 ON p2.id = m.pet2_id
      WHERE m.pet1_id = ${animalId} OR m.pet2_id = ${animalId}
      ORDER BY m.created_at DESC`;
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
