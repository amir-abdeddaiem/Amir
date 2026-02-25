import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT * FROM users WHERE id = ${id} AND acc_type = 'provider' LIMIT 1`;
    if (!rows.length) return NextResponse.json({ message: 'Provider not found' }, { status: 404 });
    const { password, ...provider } = rows[0];
    return NextResponse.json(provider);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving provider' }, { status: 500 });
  }
}
