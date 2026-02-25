import { NextRequest, NextResponse } from 'next/server';
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

    if (category) { conditions.push(`p.category = $${n++}`); values.push(category); }
    if (petType)  { conditions.push(`p.pet_type = $${n++}`); values.push(petType); }
    if (location) { conditions.push(`p.localisation ILIKE $${n++}`); values.push(`%${location}%`); }
    if (userId)   { conditions.push(`p.user_id = $${n++}`); values.push(userId); }
    if (gender)   { conditions.push(`p.gender = $${n++}`); values.push(gender); }
    if (breed)    { conditions.push(`p.breed ILIKE $${n++}`); values.push(`%${breed}%`); }
    if (minPrice) { conditions.push(`p.price >= $${n++}`); values.push(parseFloat(minPrice)); }
    if (maxPrice) { conditions.push(`p.price <= $${n++}`); values.push(parseFloat(maxPrice)); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const dataQuery = `SELECT p.*, u.first_name, u.last_name, u.email FROM products p LEFT JOIN users u ON u.id = p.user_id ${where} ORDER BY p.${sortBy} ${sortOrder} LIMIT $${n++} OFFSET $${n++}`;
    const countQuery = `SELECT COUNT(*) FROM products p ${where}`;

    const [products, countRows] = await Promise.all([
      sql.query(dataQuery, [...values, limit, offset]),
      sql.query(countQuery, values),
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

    const rows = await sql`
      INSERT INTO products (name, description, price, images, category, localisation, featured, pet_type, quantity,
        specifications, breed, age, gender, weight, health_status, friendly, color, user_id, listing_type)
      VALUES (
        ${body.name}, ${body.description}, ${body.price}, ${JSON.stringify(body.images)},
        ${body.category}, ${body.localisation || null}, ${body.featured ?? false}, ${body.petType},
        ${body.quantity || 1}, ${JSON.stringify(body.specifications || [])},
        ${body.breed || null}, ${body.age || null}, ${body.gender || 'other'},
        ${body.weight || null},
        ${JSON.stringify(body.healthStatus || { vaccinated: false, neutered: false, microchipped: false })},
        ${JSON.stringify(body.friendly || { children: false, dogs: false, cats: false, animals: false })},
        ${body.Color || null}, ${userId}, ${body.listingType || 'sale'}
      ) RETURNING *`;

    return NextResponse.json({ message: 'Product created successfully', product: rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
