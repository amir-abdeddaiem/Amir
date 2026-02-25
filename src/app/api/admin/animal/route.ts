import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  try {
    const animalData = await sql`
      SELECT type,
        COUNT(*) AS count,
        COUNT(*) FILTER (WHERE inmatch = true) AS lost,
        COUNT(*) FILTER (WHERE inmatch = false) AS found
      FROM animals
      WHERE created_at >= NOW() - ${days} * INTERVAL '1 day'
      GROUP BY type`;

    const totalRows = await sql`SELECT COUNT(*) AS count FROM animals WHERE created_at >= NOW() - ${days} * INTERVAL '1 day'`;

    return NextResponse.json({ animalData, totalAnimals: parseInt(totalRows[0].count) });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
