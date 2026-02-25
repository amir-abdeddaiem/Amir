import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
  console.log('✓', filePath);
}

const BASE = 'd:/code/src/app/api';

// ─── AUTH / LOGIN ────────────────────────────────────────────
write(`${BASE}/auth/login/route.ts`, `import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const rows = await sql\`SELECT * FROM users WHERE email = \${body.email} LIMIT 1\`;
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'User not found', success: false }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid password', success: false }, { status: 401 });
    }
    await sql\`UPDATE users SET status = 'authenticated', updated_at = NOW() WHERE id = \${user.id}\`;

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.acc_type },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return NextResponse.json({
      message: 'Login successful', success: true, token,
      user: { id: user.id, role: user.acc_type, email: user.email, name: \`\${user.first_name} \${user.last_name}\`, status: 'authenticated' },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Failed to login.', success: false }, { status: 500 });
  }
}
`);

// ─── AUTH / REGISTER ─────────────────────────────────────────
write(`${BASE}/auth/register/route.ts`, `import { NextResponse } from 'next/server';
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
    if (!body.phone || !/^\\d{8}$/.test(body.phone)) {
      return NextResponse.json({ message: 'Phone must be 8 digits.', success: false }, { status: 400 });
    }
    const existing = await sql\`SELECT id FROM users WHERE email = \${body.email} LIMIT 1\`;
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Email already registered.', success: false }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const coordinatesJson = body.coordinates
      ? JSON.stringify({ type: 'Point', coordinates: body.coordinates })
      : null;

    const inserted = await sql\`
      INSERT INTO users (
        acc_type, birth_date, email, first_name, gender, last_name, location,
        coordinates, password, phone, avatar, boutique_image, bio, status,
        business_name, business_type, services, certifications, description, website
      ) VALUES (
        \${body.accType || 'regular'}, \${body.birthDate || null}, \${body.email},
        \${body.firstName}, \${body.gender || null}, \${body.lastName}, \${body.location || ''},
        \${coordinatesJson}, \${hashedPassword}, \${body.phone},
        \${body.avatar || null}, \${body.boutiqueImage || null}, \${body.bio || null},
        'authenticated',
        \${body.businessName || null}, \${body.businessType || null},
        \${JSON.stringify(body.services || [])},
        \${body.certifications || null}, \${body.description || null}, \${body.website || null}
      ) RETURNING *\`;

    const newUser = inserted[0];
    const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.acc_type }, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      message: 'User created successfully', success: true, token,
      user: { id: newUser.id, email: newUser.email, name: \`\${newUser.first_name} \${newUser.last_name}\`, status: 'authenticated', role: newUser.acc_type },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed.', success: false }, { status: 500 });
  }
}
`);

// ─── AUTH / RECOVER ──────────────────────────────────────────
write(`${BASE}/auth/recover/route.ts`, `import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import sql from '@/lib/db';

const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io', port: 587,
  auth: { user: 'api', pass: process.env.MAILTRAP_API_TOKEN! },
  secure: false, tls: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const users = await sql\`SELECT id FROM users WHERE email = \${email} LIMIT 1\`;
    if (!users.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const userId = users[0].id;
    const digit = Math.floor(100000 + Math.random() * 900000).toString();

    await sql\`INSERT INTO recover_tokens (email, digits) VALUES (\${email}, \${digit})\`;

    const info = await transporter.sendMail({
      from: 'AnimalsClubs@demomailtrap.co', to: email,
      subject: 'Password Reset - Animal Club',
      html: \`<div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#4a8f29">🐾 Password Reset</h2>
        <p>Your reset code: <strong style="font-size:24px;color:#4a8f29">\${digit}</strong></p>
        <a href="http://localhost:3000/auth/recover/\${userId}" style="background:#4a8f29;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none">Reset Password</a>
      </div>\`,
    });

    return NextResponse.json({ success: true, message: 'Email sent', messageId: info.messageId });
  } catch (error: any) {
    console.error('Recover error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { pass, userId, code } = await req.json();
  if (!userId || !pass || !code) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  try {
    const users = await sql\`SELECT email FROM users WHERE id = \${userId} LIMIT 1\`;
    if (!users.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const email = users[0].email;
    const tokens = await sql\`SELECT * FROM recover_tokens WHERE email = \${email} AND digits = \${code} LIMIT 1\`;
    if (!tokens.length) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(pass, 10);
    await sql\`UPDATE users SET password = \${hashedPassword}, updated_at = NOW() WHERE id = \${userId}\`;
    await sql\`DELETE FROM recover_tokens WHERE email = \${email} AND digits = \${code}\`;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Recover PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
`);

// ─── AUTH / MAIL VERIFICATION ────────────────────────────────
write(`${BASE}/auth/mailVerification/route.ts`, `import nodemailer from 'nodemailer';
import sql from '@/lib/db';

const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io', port: 587,
  auth: { user: 'api', pass: process.env.MAILTRAP_API_TOKEN! },
  secure: false, tls: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    const users = await sql\`SELECT id FROM users WHERE email = \${email} LIMIT 1\`;
    if (!users.length) throw new Error('User not found');

    const digit = Math.floor(100000 + Math.random() * 900000).toString();
    await sql\`INSERT INTO recover_tokens (email, digits) VALUES (\${email}, \${digit})\`;

    const info = await transporter.sendMail({
      from: 'AnimalsClubs@demomailtrap.co', to: email,
      subject: 'Email Verification - Animal Club',
      html: \`<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#4a8f29">🐾 Email Verification</h2>
        <p>Your verification code:</p>
        <div style="font-size:32px;font-weight:bold;color:#4a8f29;background:#f5f5f5;padding:20px;text-align:center;border-radius:8px">\${digit}</div>
        <p>This code expires in 15 minutes.</p>
      </div>\`,
    });

    return new Response(JSON.stringify({ success: true, message: 'Email sent', messageId: info.messageId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
`);

// ─── ANIMAL / route ──────────────────────────────────────────
write(`${BASE}/animal/route.ts`, `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const animals = await sql\`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar
      FROM animals a
      LEFT JOIN users u ON u.id = a.owner_id
      ORDER BY a.created_at DESC\`;
    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ownerId = req.headers.get('x-user-id');
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ message: 'Content-Type must be application/json' }, { status: 400 });
  }
  const body = await req.json();
  try {
    const healthStatus = JSON.stringify(body.healthStatus || { vaccinated: false, neutered: false, microchipped: false });
    const friendly = JSON.stringify(body.friendly || { children: false, dogs: false, cats: false, animals: false });

    const rows = await sql\`
      INSERT INTO animals (name, type, breed, age, gender, weight, description, health_status, friendly, image, owner_id, color, inmatch)
      VALUES (\${body.name}, \${body.type}, \${body.breed}, \${body.age}, \${body.gender},
              \${body.weight || null}, \${body.description || null}, \${healthStatus}, \${friendly},
              \${body.image || null}, \${ownerId}, \${body.color || null}, \${body.inmatch ?? true})
      RETURNING *\`;
    return NextResponse.json({ message: 'Animal created successfully', animal: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('POST animal error:', error);
    return NextResponse.json({ message: 'Failed to create animal' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ message: 'Animal ID is required' }, { status: 400 });

    const sets = Object.keys(data).map((k) => \`\${k} = '\${data[k]}'\`).join(', ');
    const rows = await sql\`
      UPDATE animals SET \${sql.unsafe(sets)}, updated_at = NOW()
      WHERE id = \${id}
      RETURNING *\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal updated successfully', animal: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update animal' }, { status: 500 });
  }
}
`);

// ─── ANIMAL / [id] ───────────────────────────────────────────
write(`${BASE}/animal/[id]/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await sql\`
      SELECT a.*, u.first_name, u.last_name, u.email, u.phone, u.avatar
      FROM animals a LEFT JOIN users u ON u.id = a.owner_id
      WHERE a.id = \${params.id} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animal' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const rows = await sql\`DELETE FROM animals WHERE id = \${params.id} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const allowed = ['name','type','breed','age','gender','weight','description','image','color','lost','inmatch'];
    const updates: string[] = [];
    const values: any[] = [];
    allowed.forEach((key) => {
      if (data[key] !== undefined) {
        updates.push(\`\${key} = $\${values.length + 1}\`);
        values.push(data[key]);
      }
    });
    if (!updates.length) return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    values.push(params.id);
    const rows = await sql(
      \`UPDATE animals SET \${updates.join(', ')}, updated_at = NOW() WHERE id = $\${values.length} RETURNING *\`,
      values
    );
    if (!rows.length) return new Response('Animal not found', { status: 404 });
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response('Server Error', { status: 500 });
  }
}
`);

// ─── MY ANIMAL ───────────────────────────────────────────────
write(`${BASE}/myanimal/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const animals = await sql\`SELECT * FROM animals WHERE owner_id = \${userId} ORDER BY created_at DESC\`;
    return NextResponse.json(animals);
  } catch (error) {
    return NextResponse.json({ message: 'Error retrieving animals' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const data = await req.json();
    const rows = await sql\`
      UPDATE animals SET
        name = \${data.name}, type = \${data.type}, breed = \${data.breed},
        age = \${data.age}, gender = \${data.gender}, weight = \${data.weight || null},
        description = \${data.description || null}, image = \${data.image || null},
        updated_at = NOW()
      WHERE owner_id = \${userId}
      RETURNING *\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating animal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const rows = await sql\`DELETE FROM animals WHERE owner_id = \${userId} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting animal' }, { status: 500 });
  }
}
`);

// ─── PRODUCTS ────────────────────────────────────────────────
write(`${BASE}/products/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const offset = (page - 1) * limit;

    const category = searchParams.get('category');
    const petType = searchParams.get('petType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const userId = searchParams.get('userId');
    const gender = searchParams.get('gender');
    const breed = searchParams.get('breed');
    const sortBy = ['created_at','price','name','age'].includes(searchParams.get('sortBy') || '')
      ? searchParams.get('sortBy')! : 'created_at';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const values: any[] = [];
    let n = 1;

    if (category) { conditions.push(\`p.category = $\${n++}\`); values.push(category); }
    if (petType)  { conditions.push(\`p.pet_type = $\${n++}\`); values.push(petType); }
    if (location) { conditions.push(\`p.localisation ILIKE $\${n++}\`); values.push(\`%\${location}%\`); }
    if (userId)   { conditions.push(\`p.user_id = $\${n++}\`); values.push(userId); }
    if (gender)   { conditions.push(\`p.gender = $\${n++}\`); values.push(gender); }
    if (breed)    { conditions.push(\`p.breed ILIKE $\${n++}\`); values.push(\`%\${breed}%\`); }
    if (minPrice) { conditions.push(\`p.price >= $\${n++}\`); values.push(parseFloat(minPrice)); }
    if (maxPrice) { conditions.push(\`p.price <= $\${n++}\`); values.push(parseFloat(maxPrice)); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const dataQuery = \`SELECT p.*, u.first_name, u.last_name, u.email FROM products p LEFT JOIN users u ON u.id = p.user_id \${where} ORDER BY p.\${sortBy} \${sortOrder} LIMIT $\${n++} OFFSET $\${n++}\`;
    const countQuery = \`SELECT COUNT(*) FROM products p \${where}\`;

    const [products, countRows] = await Promise.all([
      sql(dataQuery, [...values, limit, offset]),
      sql(countQuery, values),
    ]);

    const total = parseInt(countRows[0].count);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: { total, totalPages, currentPage: page, limit, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.images?.length) return NextResponse.json({ message: 'At least one image is required' }, { status: 400 });

    const rows = await sql\`
      INSERT INTO products (name, description, price, images, category, localisation, featured, pet_type, quantity,
        specifications, breed, age, gender, weight, health_status, friendly, color, user_id, listing_type)
      VALUES (
        \${body.name}, \${body.description}, \${body.price}, \${JSON.stringify(body.images)},
        \${body.category}, \${body.localisation || null}, \${body.featured ?? false}, \${body.petType},
        \${body.quantity || 1}, \${JSON.stringify(body.specifications || [])},
        \${body.breed || null}, \${body.age || null}, \${body.gender || 'other'},
        \${body.weight || null},
        \${JSON.stringify(body.healthStatus || { vaccinated: false, neutered: false, microchipped: false })},
        \${JSON.stringify(body.friendly || { children: false, dogs: false, cats: false, animals: false })},
        \${body.Color || null}, \${userId}, \${body.listingType || 'sale'}
      ) RETURNING *\`;

    return NextResponse.json({ message: 'Product created successfully', product: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
`);

// ─── MY PRODUCT ──────────────────────────────────────────────
write(`${BASE}/myproduct/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const userId = req.headers.get('x-user-id');
  try {
    if (productId) {
      const rows = await sql\`SELECT p.*, u.first_name, u.last_name, u.email, u.phone FROM products p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = \${productId} LIMIT 1\`;
      if (!rows.length) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    }
    if (userId) {
      const rows = await sql\`SELECT p.*, u.first_name, u.last_name, u.email, u.phone FROM products p LEFT JOIN users u ON u.id = p.user_id WHERE p.user_id = \${userId} ORDER BY p.created_at DESC\`;
      return NextResponse.json(rows);
    }
    return NextResponse.json({ message: 'User ID not found' }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ message: 'No data found' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  try {
    if (!userId) return NextResponse.json({ message: 'User ID not found' }, { status: 404 });
    if (!productId) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });

    const rows = await sql\`DELETE FROM products WHERE id = \${productId} AND user_id = \${userId} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ message: 'Product not found or not owned by user' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (e) {
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID not found' }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  try {
    const rows = await sql\`
      UPDATE products SET
        name = \${body.name}, description = \${body.description}, price = \${body.price},
        images = \${JSON.stringify(body.images || [])}, category = \${body.category},
        localisation = \${body.localisation || null}, featured = \${body.featured ?? false},
        pet_type = \${body.petType}, quantity = \${body.quantity || 1},
        specifications = \${JSON.stringify(body.specifications || [])},
        breed = \${body.breed || null}, age = \${body.age || null}, gender = \${body.gender || null},
        weight = \${body.weight || null}, color = \${body.Color || null},
        listing_type = \${body.listingType || 'sale'}, updated_at = NOW()
      WHERE id = \${body.id} AND user_id = \${userId}
      RETURNING *\`;
    if (!rows.length) return NextResponse.json({ message: 'Product not found or not owned by user' }, { status: 404 });
    return NextResponse.json({ message: 'Product updated', product: rows[0] });
  } catch (e) {
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}
`);

// ─── FAVORITES ───────────────────────────────────────────────
write(`${BASE}/favoriteproduct/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });

    const existing = await sql\`SELECT id FROM favorites WHERE user_id = \${userId} AND product_id = \${productId} LIMIT 1\`;
    if (existing.length) return NextResponse.json(existing[0], { status: 200 });

    const rows = await sql\`INSERT INTO favorites (user_id, product_id) VALUES (\${userId}, \${productId}) RETURNING *\`;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('POST favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const favorites = await sql\`
      SELECT f.*, p.name, p.description, p.price, p.images, p.category, p.pet_type, p.listing_type
      FROM favorites f JOIN products p ON p.id = f.product_id
      WHERE f.user_id = \${userId}
      ORDER BY f.created_at DESC\`;

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('GET favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });

    const rows = await sql\`DELETE FROM favorites WHERE user_id = \${userId} AND product_id = \${productId} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('DELETE favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── REVIEW ──────────────────────────────────────────────────
write(`${BASE}/review/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const stars = parseInt(formData.get('stars') as string);
    const message = formData.get('message') as string;
    const productId = formData.get('product') as string;
    const userId = req.headers.get('x-user-id');
    const photo = formData.get('photo') as string;

    if (!stars || stars < 1 || stars > 5) return NextResponse.json({ success: false, message: 'Invalid rating' }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ success: false, message: 'Review message is required' }, { status: 400 });
    if (!productId) return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const rows = await sql\`
      INSERT INTO reviews (stars, message, product_id, user_id, photo)
      VALUES (\${stars}, \${message}, \${productId}, \${userId}, \${photo || null})
      RETURNING *\`;
    return NextResponse.json({ success: true, review: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Review creation failed:', error);
    return NextResponse.json({ success: false, message: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get('productId');
    const userId = req.nextUrl.searchParams.get('userId');
    if (!productId) return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });

    if (userId) {
      const rows = await sql\`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.product_id = \${productId} AND r.user_id = \${userId} LIMIT 1\`;
      return NextResponse.json({ success: true, review: rows[0] || null });
    }

    const rows = await sql\`SELECT r.*, u.first_name, u.last_name, u.email FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.product_id = \${productId} ORDER BY r.created_at DESC\`;
    return NextResponse.json({ success: true, reviews: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('id');
    const userId = req.headers.get('x-user-id');
    if (!reviewId) return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });

    const rows = await sql\`DELETE FROM reviews WHERE id = \${reviewId} AND user_id = \${userId} RETURNING id\`;
    if (!rows.length) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete review' }, { status: 500 });
  }
}
`);

// ─── MATCHY / animal (swipeable pets, not owned by user) ─────
write(`${BASE}/matchy/animal/route.ts`, `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const pets = await sql\`SELECT * FROM animals WHERE inmatch = true AND owner_id != \${userId}\`;
    const formatted = pets.map((p: any) => ({
      id: p.id, name: p.name, age: p.age, breed: p.breed, image: p.image, bio: p.description,
      temperament: Object.entries(p.friendly || {}).filter(([_, v]) => v).map(([k]) => k),
    }));
    return NextResponse.json({ pets: formatted });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch pets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { _id, inmatch } = body;
  if (!_id) return NextResponse.json({ message: 'Animal ID is required' }, { status: 400 });
  try {
    const rows = await sql\`UPDATE animals SET inmatch = \${inmatch ?? true}, updated_at = NOW() WHERE id = \${_id} RETURNING *\`;
    if (!rows.length) return NextResponse.json({ message: 'Animal not found' }, { status: 404 });
    return NextResponse.json({ animal: rows[0] });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update animal' }, { status: 500 });
  }
}
`);

// ─── MATCHY / animalUser (user's own pets in match) ──────────
write(`${BASE}/matchy/animalUser/route.ts`, `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  try {
    const pets = await sql\`SELECT * FROM animals WHERE inmatch = true AND owner_id = \${userId}\`;
    const formatted = pets.map((p: any) => ({
      id: p.id, name: p.name, age: p.age, breed: p.breed, image: p.image, bio: p.description,
      temperament: Object.entries(p.friendly || {}).filter(([_, v]) => v).map(([k]) => k),
    }));
    return NextResponse.json({ pets: formatted });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch pets' }, { status: 500 });
  }
}
`);

// ─── MATCHY / matches (swipes + mutual match) ────────────────
write(`${BASE}/matchy/matches/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const { swiperpet, swipedpet, actionType } = await req.json();
  if (!userId || !swiperpet || !swipedpet || !actionType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  try {
    // Verify swiper pet belongs to user
    const petCheck = await sql\`SELECT id FROM animals WHERE id = \${swiperpet} AND owner_id = \${userId} LIMIT 1\`;
    if (!petCheck.length) return NextResponse.json({ error: 'Swiper pet not found or unauthorized' }, { status: 403 });

    // Insert swipe (ignore duplicate)
    try {
      await sql\`INSERT INTO swipe_actions (swiper_id, swiperpet_id, swipedpet_id, action_type) VALUES (\${userId}, \${swiperpet}, \${swipedpet}, \${actionType})\`;
    } catch (e: any) {
      if (e.message?.includes('unique')) return NextResponse.json({ error: 'Duplicate swipe' }, { status: 409 });
      throw e;
    }

    if (actionType === 'like' || actionType === 'superlike') {
      const reverse = await sql\`SELECT id FROM swipe_actions WHERE swiperpet_id = \${swipedpet} AND swipedpet_id = \${swiperpet} AND action_type IN ('like','superlike') LIMIT 1\`;
      if (reverse.length) {
        const swipedPet = await sql\`SELECT owner_id FROM animals WHERE id = \${swipedpet} LIMIT 1\`;
        if (!swipedPet.length) return NextResponse.json({ error: 'Swiped pet not found' }, { status: 404 });

        const ids = [swiperpet, swipedpet].sort();
        const [pet1, pet2] = ids;
        const [owner1, owner2] = pet1 === swiperpet ? [userId, swipedPet[0].owner_id] : [swipedPet[0].owner_id, userId];

        await sql\`
          INSERT INTO matches (pet1_id, pet2_id, owner1_id, owner2_id) VALUES (\${pet1}, \${pet2}, \${owner1}, \${owner2})
          ON CONFLICT (pet1_id, pet2_id) DO NOTHING\`;
        return NextResponse.json({ message: 'Match created', match: true });
      }
    }
    return NextResponse.json({ message: 'Swipe recorded' });
  } catch (error: any) {
    console.error('Match error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const animalId = searchParams.get('animalId');
  if (!animalId) return NextResponse.json({ error: 'Invalid or missing animalId' }, { status: 400 });
  try {
    const matches = await sql\`
      SELECT m.*,
        p1.name AS pet1_name, p1.image AS pet1_image,
        p2.name AS pet2_name, p2.image AS pet2_image
      FROM matches m
      LEFT JOIN animals p1 ON p1.id = m.pet1_id
      LEFT JOIN animals p2 ON p2.id = m.pet2_id
      WHERE m.pet1_id = \${animalId} OR m.pet2_id = \${animalId}
      ORDER BY m.created_at DESC\`;
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── MATCHY / likesU (superlikes) ────────────────────────────
write(`${BASE}/matchy/likesU/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const swiped = searchParams.get('swiped');
  const actionType = searchParams.get('actionType');

  if (!userId) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  if (!swiped) return NextResponse.json({ error: 'Missing swiped pet ID' }, { status: 400 });
  if (actionType !== 'superlike') return NextResponse.json({ error: 'Action type must be superlike' }, { status: 400 });

  try {
    const petCheck = await sql\`SELECT id FROM animals WHERE id = \${swiped} AND owner_id = \${userId} LIMIT 1\`;
    if (!petCheck.length) return NextResponse.json({ error: 'Pet not found or not owned by user' }, { status: 403 });

    const swipes = await sql\`
      SELECT sa.*, a.name AS swiperpet_name, a.image AS swiperpet_image, a.type AS swiperpet_type
      FROM swipe_actions sa
      LEFT JOIN animals a ON a.id = sa.swiperpet_id
      WHERE sa.swipedpet_id = \${swiped} AND sa.action_type = 'superlike'\`;

    return NextResponse.json({ swipes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── PROFILE ─────────────────────────────────────────────────
write(`${BASE}/profile/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Authorization header is missing' }, { status: 401 });
  try {
    const rows = await sql\`SELECT id, first_name, last_name, email, birth_date, gender, location, phone, avatar, bio, acc_type, business_name, business_type, description, website, coordinates, created_at, updated_at FROM users WHERE id = \${userId} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, error: 'Authorization header is missing' }, { status: 401 });
  try {
    const body = await req.json();
    const allowed = ['first_name','last_name','gender','location','phone','avatar','bio','boutique_image','business_name','description','website'];
    const updates: string[] = [];
    const vals: any[] = [];
    let n = 1;
    for (const key of allowed) {
      const bodyKey = key.replace(/_([a-z])/g, (_,c) => c.toUpperCase());
      const val = body[bodyKey] ?? body[key];
      if (val !== undefined) { updates.push(\`\${key} = $\${n++}\`); vals.push(val); }
    }
    if (!updates.length) return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    vals.push(userId);
    const rows = await sql(\`UPDATE users SET \${updates.join(', ')}, updated_at = NOW() WHERE id = $\${n} RETURNING *\`, vals);
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── USERS ───────────────────────────────────────────────────
write(`${BASE}/users/route.ts`, `import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ success: false, error: 'User not found', data: null }, { status: 404 });

    const rows = await sql\`SELECT id, first_name, last_name, email, birth_date, gender, location, phone, avatar, bio, created_at, updated_at FROM users WHERE id = \${userId} LIMIT 1\`;
    if (!rows.length) return NextResponse.json({ success: false, error: 'User not found', data: null }, { status: 404 });
    return NextResponse.json({ success: true, error: null, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error', data: null }, { status: 500 });
  }
}
`);

// ─── SERVICES (providers list) ───────────────────────────────
write(`${BASE}/services/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const conditions: string[] = ["acc_type = 'provider'"];
    const values: any[] = [];
    let n = 1;

    if (type && type !== 'All') { conditions.push(\`business_type = $\${n++}\`); values.push(type); }
    if (search) {
      conditions.push(\`(first_name ILIKE $\${n} OR last_name ILIKE $\${n} OR description ILIKE $\${n})\`);
      values.push(\`%\${search}%\`); n++;
    }

    const where = conditions.join(' AND ');
    const services = await sql(\`SELECT id, first_name, last_name, email, phone, avatar, boutique_image, bio, acc_type, business_name, business_type, services, description, website, location FROM users WHERE \${where} ORDER BY first_name\`, values);

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}
`);

// ─── RESERVATIONS ────────────────────────────────────────────
write(`${BASE}/reservations/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'customer';
    const column = role === 'provider' ? 'provider_id' : 'customer_id';
    const rows = await sql(\`
      SELECT r.*, a.name AS pet_name, a.image AS pet_image,
        u.first_name AS provider_first_name, u.last_name AS provider_last_name
      FROM reservations r
      LEFT JOIN animals a ON a.id = r.pet_id
      LEFT JOIN users u ON u.id = r.provider_id
      WHERE r.\${column} = $1
      ORDER BY r.date DESC\`, [userId]);
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const customerId = req.headers.get('x-user-id');
  if (!customerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const rows = await sql\`
      INSERT INTO reservations (customer_id, provider_id, pet_id, date, time_slot, notes, status)
      VALUES (\${customerId}, \${body.providerId}, \${body.petId || null}, \${body.date}, \${JSON.stringify(body.timeSlot || [])}, \${body.notes || ''}, 'pending')
      RETURNING *\`;
    return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Reservation ID required' }, { status: 400 });
    const rows = await sql\`UPDATE reservations SET status = \${body.status}, cancellation_reason = \${body.cancellationReason || null}, updated_at = NOW() WHERE id = \${body.id} RETURNING *\`;
    if (!rows.length) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
`);

// ─── FOUND ANIMAL ────────────────────────────────────────────
write(`${BASE}/foundanimal/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const color = formData.get('color') as string;
    const description = formData.get('description') as string;
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const type = formData.get('type') as string;

    if (!image || !color || !description || !breed || !gender || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const buffer = await image.arrayBuffer();
    const imageBase64 = \`data:\${image.type};base64,\${Buffer.from(buffer).toString('base64')}\`;

    const rows = await sql\`
      INSERT INTO found_lost_animals (color, image, description, breed, gender, type, reporter_id)
      VALUES (\${color}, \${imageBase64}, \${description}, \${breed}, \${gender}, \${type}, \${userId})
      RETURNING *\`;

    // Mark potential lost animals as inmatch
    await sql\`UPDATE animals SET inmatch = true, updated_at = NOW() WHERE lost = true AND type = \${type} AND (breed = \${breed} OR color = \${color} OR gender = \${gender})\`;

    return NextResponse.json({ message: 'Found animal reported successfully', data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('foundanimal POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await sql\`SELECT * FROM found_lost_animals ORDER BY created_at DESC\`;
    return NextResponse.json({ data: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`);

// ─── LOSTFOUND ───────────────────────────────────────────────
write(`${BASE}/lostfound/route.ts`, `import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const base64 = image
      ? \`data:\${image.type};base64,\${Buffer.from(await image.arrayBuffer()).toString('base64')}\`
      : null;
    const animals = await sql\`SELECT * FROM animals WHERE image = \${base64}\`;
    return NextResponse.json({ data: animals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
`);

console.log('\\nAll routes written successfully!');
