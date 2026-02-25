import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const providers = await sql`SELECT id, acc_type, email, first_name, last_name, gender, birth_date, location, phone, avatar, bio, business_name, boutique_image, business_type, services, certifications, description, website, status, created_at, updated_at FROM users WHERE acc_type = 'provider' ORDER BY created_at DESC`;
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving providers' }, { status: 500 });
  }
}
