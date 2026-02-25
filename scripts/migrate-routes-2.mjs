import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  console.log('✓', filePath);
}

const BASE = 'd:/code/src/app/api';

// ─── ADMIN / USER stats ──────────────────────────────────────
write(`${BASE}/admin/user/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const engagementData = await sql\`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
        COUNT(*) AS users,
        COUNT(*) FILTER (WHERE updated_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days') AS active
      FROM users
      WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)\`;

    const activeRows = await sql\`SELECT COUNT(*) AS count FROM users WHERE updated_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'\`;

    return NextResponse.json({ engagementData, activeUsers: parseInt(activeRows[0].count) });
  } catch (error) {
    console.error('Admin user stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── ADMIN / PRODUCT stats ───────────────────────────────────
write(`${BASE}/admin/product/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const categoryData = await sql\`
      SELECT category AS name, COUNT(*) AS value
      FROM products
      WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'
      GROUP BY category\`;

    const totalRows = await sql\`SELECT COALESCE(SUM(price), 0) AS total FROM products WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'\`;

    return NextResponse.json({
      categoryData: categoryData.map((r: any) => ({ ...r, color: '#4a8f29' })),
      totalSales: parseFloat(totalRows[0].total),
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching product data', error: error.message }, { status: 500 });
  }
}
`);

// ─── ADMIN / ANIMAL stats ────────────────────────────────────
write(`${BASE}/admin/animal/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  try {
    const animalData = await sql\`
      SELECT type,
        COUNT(*) AS count,
        COUNT(*) FILTER (WHERE inmatch = true) AS lost,
        COUNT(*) FILTER (WHERE inmatch = false) AS found
      FROM animals
      WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'
      GROUP BY type\`;

    const totalRows = await sql\`SELECT COUNT(*) AS count FROM animals WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days'\`;

    return NextResponse.json({ animalData, totalAnimals: parseInt(totalRows[0].count) });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── ADMIN / REVIEW ──────────────────────────────────────────
write(`${BASE}/admin/review/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const query = productId
      ? await sql\`SELECT r.*, u.first_name, u.last_name, u.email, p.name AS product_name FROM reviews r LEFT JOIN users u ON u.id = r.user_id LEFT JOIN products p ON p.id = r.product_id WHERE r.product_id = \${productId} ORDER BY r.created_at DESC\`
      : await sql\`SELECT r.*, u.first_name, u.last_name, u.email, p.name AS product_name FROM reviews r LEFT JOIN users u ON u.id = r.user_id LEFT JOIN products p ON p.id = r.product_id ORDER BY r.created_at DESC\`;
    return NextResponse.json({ success: true, reviews: query });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { reviewIds } = await req.json();
    if (!Array.isArray(reviewIds) || !reviewIds.length) {
      return NextResponse.json({ success: false, message: 'Invalid review IDs' }, { status: 400 });
    }
    const result = await sql\`DELETE FROM reviews WHERE id = ANY(\${reviewIds})\`;
    return NextResponse.json({ success: true, message: 'Review(s) deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete reviews' }, { status: 500 });
  }
}
`);

// ─── PROVIDER / profile ──────────────────────────────────────
write(`${BASE}/provider/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized', data: null }, { status: 401 });
  try {
    const rows = await sql\`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, business_name, description, website, location, services, created_at, updated_at FROM users WHERE id = \${userId} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Provider not found', data: null }, { status: 404 });
    const u = rows[0];
    return NextResponse.json({ success: true, error: null, data: {
      id: u.id, firstName: u.first_name, lastName: u.last_name, email: u.email,
      phone: u.phone, avatar: u.avatar, boutiqueImage: u.boutique_image || '/default-boutique.png',
      businessName: u.business_name || 'Not provided', description: u.description || 'No description',
      website: u.website || 'Not provided', location: u.location || 'Not provided',
      services: u.services || [], createdAt: u.created_at, updatedAt: u.updated_at
    }});
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error', data: null }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized', data: null }, { status: 401 });
  const body = await req.json();
  try {
    const rows = await sql\`
      UPDATE users SET
        first_name = COALESCE(\${body.firstName}, first_name),
        last_name  = COALESCE(\${body.lastName}, last_name),
        email      = COALESCE(\${body.email}, email),
        phone      = COALESCE(\${body.phone}, phone),
        business_name = COALESCE(\${body.businessName}, business_name),
        description   = COALESCE(\${body.description}, description),
        website       = COALESCE(\${body.website}, website),
        location      = COALESCE(\${body.location}, location),
        services      = COALESCE(\${JSON.stringify(body.services)}, services),
        boutique_image = COALESCE(\${body.boutiqueImage}, boutique_image),
        avatar         = COALESCE(\${body.avatar}, avatar),
        updated_at = NOW()
      WHERE id = \${userId}
      RETURNING *\`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'Provider not found', data: null }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update profile', data: null }, { status: 500 });
  }
}
`);

// ─── PROVIDER / [id] ─────────────────────────────────────────
write(`${BASE}/provider/[id]/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await sql\`SELECT * FROM users WHERE id = \${params.id} AND acc_type = 'provider' LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ message: 'Provider not found' }, { status: 404 });
    const { password, ...provider } = rows[0];
    return NextResponse.json(provider);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving provider' }, { status: 500 });
  }
}
`);

// ─── PROVIDER / SERVICES ─────────────────────────────────────
write(`${BASE}/provider/services/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'All';
    const search = searchParams.get('search') || '';

    const conditions = ["acc_type = 'provider'"];
    const values: any[] = [];
    let n = 1;

    if (type !== 'All') { conditions.push(\`business_type = $\${n++}\`); values.push(type); }
    if (search) {
      conditions.push(\`(business_name ILIKE $\${n} OR description ILIKE $\${n})\`);
      values.push(\`%\${search}%\`); n++;
    }

    const services = await sql(\`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, business_name, business_type, description, website, location, services FROM users WHERE \${conditions.join(' AND ')} ORDER BY business_name\`, values);

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
`);

// ─── SERVICES / [id] ─────────────────────────────────────────
write(`${BASE}/services/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const serviceRows = await sql\`SELECT * FROM users WHERE id = \${id} AND acc_type = 'provider' LIMIT 1\`;
    if (!serviceRows.length) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    const { password, ...service } = serviceRows[0];

    const reviews = await sql\`
      SELECT sr.*, u.first_name AS customer_first_name, u.last_name AS customer_last_name, u.avatar AS customer_avatar
      FROM service_reviews sr LEFT JOIN users u ON u.id = sr.customer_id
      WHERE sr.provider_id = \${id} AND sr.is_visible = true
      ORDER BY sr.created_at DESC LIMIT 10\`;

    return NextResponse.json({ success: true, data: { ...service, reviews } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}
`);

// ─── SERVICES / AVAILABILITY / [id] (book + check slots) ────
write(`${BASE}/services/availability/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const slots = await sql\`
      SELECT a.date, a.times,
        COALESCE(array_agg(r.time_slot::text) FILTER (WHERE r.status IN ('pending','confirmed')), '{}') AS booked
      FROM appointments a
      LEFT JOIN reservations r ON r.provider_id = a.provider_id AND r.date::date = a.date
      WHERE a.provider_id = \${params.id}
      GROUP BY a.id, a.date, a.times
      ORDER BY a.date\`;
    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { providerId, petId, date, timeSlot, notes = '' } = body;

    const missing = ['providerId','petId','date','timeSlot'].filter(f => !body[f]);
    if (missing.length) return NextResponse.json({ success: false, error: \`Missing: \${missing.join(', ')}\` }, { status: 400 });

    const existing = await sql\`SELECT id FROM reservations WHERE provider_id = \${providerId} AND date = \${new Date(date)} AND time_slot::text LIKE \${'%' + timeSlot + '%'} LIMIT 1\`;
    if (existing.length) return NextResponse.json({ success: false, error: 'Time slot already booked' }, { status: 409 });

    const rows = await sql\`
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes, status)
      VALUES (\${userId}, \${providerId}, \${petId}, \${new Date(date)}, \${JSON.stringify([timeSlot])}, \${notes}, 'pending')
      RETURNING *\`;

    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
}
`);

// ─── RESERVATIONS / [id] ─────────────────────────────────────
write(`${BASE}/reservations/[id]/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const { providerId, petId, date, timeSlot, notes = '' } = body;
    const missing = ['providerId','petId','date','timeSlot'].filter(f => !body[f]);
    if (missing.length) return NextResponse.json({ success: false, error: \`Missing: \${missing.join(', ')}\` }, { status: 400 });

    const existing = await sql\`SELECT id FROM reservations WHERE provider_id = \${providerId} AND date = \${new Date(date)} AND time_slot::text LIKE \${'%' + timeSlot + '%'} LIMIT 1\`;
    if (existing.length) return NextResponse.json({ success: false, error: 'Time slot already booked' }, { status: 409 });

    const rows = await sql\`
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes)
      VALUES (\${userId}, \${providerId}, \${petId}, \${new Date(date)}, \${JSON.stringify([timeSlot])}, \${notes})
      RETURNING *\`;

    return NextResponse.json({ success: true, data: { id: rows[0].id, date: rows[0].date, timeSlot: rows[0].time_slot, status: rows[0].status } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create reservation' }, { status: 500 });
  }
}
`);

// ─── ADMIN / EXPORT ──────────────────────────────────────────
write(`${BASE}/admin/export/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
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
      data = await sql\`SELECT id, first_name, last_name, email, acc_type, phone, location, status, created_at FROM users WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days' ORDER BY created_at DESC\`;
      fields = ['id','first_name','last_name','email','acc_type','phone','location','status','created_at'];
    } else if (type === 'products') {
      data = await sql\`SELECT id, name, category, pet_type, price, quantity, listing_type, created_at FROM products WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days' ORDER BY created_at DESC\`;
      fields = ['id','name','category','pet_type','price','quantity','listing_type','created_at'];
    } else if (type === 'animals') {
      data = await sql\`SELECT id, name, type, breed, age, gender, lost, inmatch, created_at FROM animals WHERE created_at >= NOW() - INTERVAL '\${sql.unsafe(String(days))} days' ORDER BY created_at DESC\`;
      fields = ['id','name','type','breed','age','gender','lost','inmatch','created_at'];
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': \`attachment; filename="\${type}_export.csv"\`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`);

console.log('\\nAll remaining routes written successfully!');
