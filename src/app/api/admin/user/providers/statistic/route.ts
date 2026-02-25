import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const [reservationRows, reviewRows] = await Promise.all([
      sql`SELECT COUNT(*) AS count FROM reservations WHERE provider_id = ${userId}`,
      sql`SELECT AVG(rating) AS avg_rating FROM service_reviews WHERE provider_id = ${userId} AND is_visible = true`,
    ]);

    const monthlyRows = await sql`
      SELECT COALESCE(SUM(0), 0) AS earnings
      FROM reservations
      WHERE provider_id = ${userId} AND status = 'completed'
        AND created_at >= DATE_TRUNC('month', NOW())`;

    return NextResponse.json({
      success: true,
      data: {
        totalReservations: parseInt(reservationRows[0].count),
        averageRating: parseFloat(reviewRows[0].avg_rating || '0'),
        monthlyEarnings: parseFloat(monthlyRows[0].earnings || '0'),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
