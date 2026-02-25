import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  const body = await req.json();
  try {
    if (!body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ message: 'Email and password are required.', success: false }, { status: 400 });
    }
    if (!body.phone || !/^\d{8}$/.test(body.phone)) {
      return NextResponse.json({ message: 'Phone must be 8 digits.', success: false }, { status: 400 });
    }
    const existing = await sql`SELECT id FROM users WHERE email = ${body.email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Email already registered.', success: false }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const coordinatesJson = body.coordinates
      ? JSON.stringify({ type: 'Point', coordinates: body.coordinates })
      : null;

    const inserted = await sql`
      INSERT INTO users (
        acc_type, birth_date, email, first_name, gender, last_name, location,
        coordinates, password, phone, avatar, boutique_image, bio, status,
        business_name, business_type, services, certifications, description, website
      ) VALUES (
        ${body.accType || 'regular'}, ${body.birthDate || null}, ${body.email},
        ${body.firstName}, ${body.gender || null}, ${body.lastName}, ${body.location || ''},
        ${coordinatesJson}, ${hashedPassword}, ${body.phone},
        ${body.avatar || null}, ${body.boutiqueImage || null}, ${body.bio || null},
        'authenticated',
        ${body.businessName || null}, ${body.businessType || null},
        ${JSON.stringify(body.services || [])},
        ${body.certifications || null}, ${body.description || null}, ${body.website || null}
      ) RETURNING *`;

    const newUser = inserted[0];
    const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.acc_type }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'User created successfully', success: true, token,
      user: { id: newUser.id, email: newUser.email, name: `${newUser.first_name} ${newUser.last_name}`, status: 'authenticated', role: newUser.acc_type },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed.', success: false }, { status: 500 });
  }
}
