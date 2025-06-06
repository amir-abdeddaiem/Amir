import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filtering parameters
    const category = searchParams.get('category');
    const petType = searchParams.get('petType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const userId = searchParams.get('userId');

    // Sorting parameters
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};
    
    if (category) filter.category = category;
    if (petType) filter.petType = petType;
    if (location) filter.localisation = { $regex: location, $options: 'i' };
    if (userId) filter['user._id'] = userId;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPrevPage
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const authHeader = req.headers.get('x-user-id');
    
    if (!authHeader || !mongoose.Types.ObjectId.isValid(authHeader)) {
      return NextResponse.json({ message: 'Invalid or missing user ID' }, { status: 401 });
    }

    const user = await User.findOne({ _id: authHeader });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images,
      category: body.category,
      localisation: body.localisation,
      featured: body.featured,
      petType: body.petType,
      quantity: body.quantity,
      specifications: body.specifications || [],
      HealthStatus: body.HealthStatus || { 
        vaccinated: false, 
        neutered: false, 
        microchipped: false 
      },
      friendly: body.friendly || { 
        children: false, 
        dogs: false, 
        cats: false, 
        animals: false 
      },
      weight: body.weight || '',
      Color: body.Color || '',
      age: body.age,
      user: {
        _id: authHeader,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.errors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to create product' }, 
      { status: 500 }
    );
  }
}
