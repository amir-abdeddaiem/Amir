import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  console.log('✓', filePath);
}

const BASE = 'd:/code/src/app/api';

// ─── LOSTFOUND / [id] ────────────────────────────────────────
write(`${BASE}/lostfound/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await sql\`SELECT * FROM found_lost_animals WHERE id = \${params.id} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const allowed = ['color','image','description','breed','gender','type'];
    const sets: string[] = [];
    const vals: any[] = [];
    let n = 1;
    for (const key of allowed) {
      if (updates[key] !== undefined) { sets.push(\`\${key} = $\${n++}\`); vals.push(updates[key]); }
    }
    if (!sets.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    vals.push(params.id);
    const rows = await sql(\`UPDATE found_lost_animals SET \${sets.join(', ')} WHERE id = $\${n} RETURNING *\`, vals);
    if (!rows.length) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── REVIEW / [id] ────────────────────────────────────────────
write(`${BASE}/review/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows = await sql\`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.id = \${params.id} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get('x-user-id');
  try {
    const { stars, message, photo } = await req.json();
    const rows = await sql\`UPDATE reviews SET stars = \${stars}, message = \${message}, photo = \${photo || null} WHERE id = \${params.id} AND user_id = \${userId} RETURNING *\`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ success: true, review: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get('x-user-id');
  try {
    const rows = await sql\`DELETE FROM reviews WHERE id = \${params.id} AND user_id = \${userId} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
`);

// ─── MATCHY / messages (note: routes.ts not route.ts) ────────
write(`${BASE}/matchy/messages/routes.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { matchId, content } = await request.json();
    if (!matchId || !content) return NextResponse.json({ error: 'matchId and content required' }, { status: 400 });

    // Verify match exists and user is a participant
    const matchRows = await sql\`SELECT * FROM matches WHERE id = \${matchId} LIMIT 1\`;
    if (!matchRows.length) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    const match = matchRows[0];

    const userPets = await sql\`SELECT id FROM animals WHERE owner_id = \${userId}\`;
    const petIds = userPets.map((p: any) => p.id);
    if (!petIds.includes(match.pet1_id) && !petIds.includes(match.pet2_id)) {
      return NextResponse.json({ error: 'Unauthorized to send message in this match' }, { status: 403 });
    }

    const rows = await sql\`INSERT INTO messages (match_id, sender_id, content) VALUES (\${matchId}, \${userId}, \${content}) RETURNING *\`;
    return NextResponse.json({ message: 'Message sent successfully', data: rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message', details: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    if (!matchId) return NextResponse.json({ error: 'matchId is required' }, { status: 400 });

    const matchRows = await sql\`SELECT * FROM matches WHERE id = \${matchId} LIMIT 1\`;
    if (!matchRows.length) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    const match = matchRows[0];

    const userPets = await sql\`SELECT id FROM animals WHERE owner_id = \${userId}\`;
    const petIds = userPets.map((p: any) => p.id);
    if (!petIds.includes(match.pet1_id) && !petIds.includes(match.pet2_id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await sql\`
      SELECT m.*, u.first_name AS sender_first_name, u.last_name AS sender_last_name, u.avatar AS sender_avatar
      FROM messages m LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.match_id = \${matchId} ORDER BY m.created_at ASC\`;

    return NextResponse.json({ data: messages });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve messages', details: error.message }, { status: 500 });
  }
}
`);

// ─── ADMIN / USER / users ────────────────────────────────────
write(`${BASE}/admin/user/users/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const users = await sql\`SELECT id, acc_type, email, first_name, last_name, gender, birth_date, location, phone, avatar, bio, business_name, boutique_image, business_type, services, certifications, description, website, status, created_at, updated_at FROM users ORDER BY created_at DESC\`;
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
    await sql\`DELETE FROM users WHERE id = \${id}\`;
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
`);

// ─── ADMIN / USER / providers ────────────────────────────────
write(`${BASE}/admin/user/providers/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const providers = await sql\`SELECT id, acc_type, email, first_name, last_name, gender, birth_date, location, phone, avatar, bio, business_name, boutique_image, business_type, services, certifications, description, website, status, created_at, updated_at FROM users WHERE acc_type = 'provider' ORDER BY created_at DESC\`;
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving providers' }, { status: 500 });
  }
}
`);

// ─── ADMIN / USER / providers / statistic ────────────────────
write(`${BASE}/admin/user/providers/statistic/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const [reservationRows, reviewRows] = await Promise.all([
      sql\`SELECT COUNT(*) AS count FROM reservations WHERE provider_id = \${userId}\`,
      sql\`SELECT AVG(rating) AS avg_rating FROM service_reviews WHERE provider_id = \${userId} AND is_visible = true\`,
    ]);

    const monthlyRows = await sql\`
      SELECT COALESCE(SUM(0), 0) AS earnings
      FROM reservations
      WHERE provider_id = \${userId} AND status = 'completed'
        AND created_at >= DATE_TRUNC('month', NOW())\`;

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
`);

// ─── ADMIN / PRODUCT / myproduct ─────────────────────────────
write(`${BASE}/admin/product/myproduct/route.tsx`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const products = await sql\`
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM products p LEFT JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC\`;

    const formatted = products.map((p: any) => ({
      id: p.id,
      name: p.name, description: p.description, price: p.price,
      images: p.images || [], category: p.category,
      localisation: p.localisation || '', featured: p.featured,
      petType: p.pet_type, quantity: p.quantity,
      user: p.user_id ? { id: p.user_id, firstName: p.first_name, lastName: p.last_name, email: p.email } : null,
      breed: p.breed || '', age: p.age || '', gender: p.gender || '',
      weight: p.weight || '', Color: p.color || '',
      listingType: p.listing_type || 'sale',
      createdAt: p.created_at, updatedAt: p.updated_at,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error retrieving products' }, { status: 500 });
  }
}
`);

// ─── PROVIDER / SERVICES / [id] ──────────────────────────────
write(`${BASE}/provider/services/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceRows = await sql\`SELECT * FROM users WHERE id = \${params.id} AND acc_type = 'provider' LIMIT 1\`;
    if (!serviceRows.length) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    const { password, ...service } = serviceRows[0];
    const reviews = await sql\`SELECT sr.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.avatar AS customer_avatar FROM service_reviews sr LEFT JOIN users u ON u.id = sr.customer_id WHERE sr.provider_id = \${params.id} AND sr.is_visible = true ORDER BY sr.created_at DESC LIMIT 10\`;
    return NextResponse.json({ success: true, data: { service, reviews } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const rows = await sql\`UPDATE users SET description = \${body.description || null}, website = \${body.website || null}, services = \${JSON.stringify(body.services || [])}, updated_at = NOW() WHERE id = \${params.id} AND id = \${userId} RETURNING *\`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ success: true });
}
`);

console.log('\\nAll remaining routes written!');
