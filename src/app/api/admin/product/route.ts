import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const categoryData = await sql`
      SELECT category AS name, COUNT(*) AS value
      FROM products
      WHERE created_at >= NOW() - ${days} * INTERVAL '1 day'
      GROUP BY category`;

    const totalRows = await sql`SELECT COALESCE(SUM(price), 0) AS total FROM products WHERE created_at >= NOW() - ${days} * INTERVAL '1 day'`;

    return NextResponse.json({
      categoryData: categoryData.map((r: any) => ({ ...r, color: '#4a8f29' })),
      totalSales: parseFloat(totalRows[0].total),
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching product data', error: error.message }, { status: 500 });
  }
}
