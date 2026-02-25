import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const conditions: string[] = ["acc_type = 'provider'"];
    const values: any[] = [];
    let n = 1;

    if (type && type !== 'All') { conditions.push(`business_type = $${n++}`); values.push(type); }
    if (search) {
      conditions.push(`(first_name ILIKE $${n} OR last_name ILIKE $${n} OR description ILIKE $${n})`);
      values.push(`%${search}%`); n++;
    }

    const where = conditions.join(' AND ');
    const services = await sql.query(`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, bio, acc_type, business_name, business_type, services, description, website, location FROM users WHERE ${where} ORDER BY first_name`, values);

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
