import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'All';
    const search = searchParams.get('search') || '';

    const conditions = ["acc_type = 'provider'"];
    const values: any[] = [];
    let n = 1;

    if (type !== 'All') { conditions.push(`business_type = $${n++}`); values.push(type); }
    if (search) {
      conditions.push(`(business_name ILIKE $${n} OR description ILIKE $${n})`);
      values.push(`%${search}%`); n++;
    }

    const services = await sql.query(`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, business_name, business_type, description, website, location, services FROM users WHERE ${conditions.join(' AND ')} ORDER BY business_name`, values);

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
