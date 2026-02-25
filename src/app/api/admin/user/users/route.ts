import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const users = await sql`SELECT id, acc_type, email, first_name, last_name, gender, birth_date, location, phone, avatar, bio, business_name, boutique_image, business_type, services, certifications, description, website, status, created_at, updated_at FROM users ORDER BY created_at DESC`;
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving users' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'User ID required' }, { status: 400 });
    await sql`DELETE FROM users WHERE id = ${id}`;
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
