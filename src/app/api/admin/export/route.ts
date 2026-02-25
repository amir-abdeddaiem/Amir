import { NextRequest, NextResponse } from 'next/server';
import { Parser } from 'json2csv';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = searchParams.get('days') || '30';
    const type = searchParams.get('type') || 'users'; // users | products | animals

    let data: any[] = [];
    let fields: string[] = [];

    if (type === 'users') {
      data = await sql`SELECT id, first_name, last_name, email, acc_type, phone, location, status, created_at FROM users WHERE created_at >= NOW() - ${parseInt(days)} * INTERVAL '1 day' ORDER BY created_at DESC`;
      fields = ['id','first_name','last_name','email','acc_type','phone','location','status','created_at'];
    } else if (type === 'products') {
      data = await sql`SELECT id, name, category, pet_type, price, quantity, listing_type, created_at FROM products WHERE created_at >= NOW() - ${parseInt(days)} * INTERVAL '1 day' ORDER BY created_at DESC`;
      fields = ['id','name','category','pet_type','price','quantity','listing_type','created_at'];
    } else if (type === 'animals') {
      data = await sql`SELECT id, name, type, breed, age, gender, lost, inmatch, created_at FROM animals WHERE created_at >= NOW() - ${parseInt(days)} * INTERVAL '1 day' ORDER BY created_at DESC`;
      fields = ['id','name','type','breed','age','gender','lost','inmatch','created_at'];
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}_export.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
