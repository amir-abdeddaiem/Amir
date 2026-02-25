import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const engagementData = await sql`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
        COUNT(*) AS users,
        COUNT(*) FILTER (WHERE updated_at >= NOW() - ${days} * INTERVAL '1 day') AS active
      FROM users
      WHERE created_at >= NOW() - ${days} * INTERVAL '1 day'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)`;

    const activeRows = await sql`SELECT COUNT(*) AS count FROM users WHERE updated_at >= NOW() - ${days} * INTERVAL '1 day'`;

    return NextResponse.json({ engagementData, activeUsers: parseInt(activeRows[0].count) });
  } catch (error) {
    console.error('Admin user stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
