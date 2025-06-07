import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Pagination parameters with validation
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    // Filtering parameters
    const category = searchParams.get('category');
    const petType = searchParams.get('petType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const userId = searchParams.get('userId');
    const gender = searchParams.get('gender');
    const breed = searchParams.get('breed');

    // Sorting parameters with validation
    const allowedSortFields = ['createdAt', 'price', 'name', 'age'] as const;
    type SortField = typeof allowedSortFields[number];
    const sortBy = allowedSortFields.includes(searchParams.get('sortBy') as SortField) 
      ? searchParams.get('sortBy') as SortField
      : 'createdAt';
    const sortOrder = searchParams.get('sortOrder')?.toLowerCase() === 'asc' ? 1 : -1;

    // Build filter object
    const filter: any = {};
    
    if (category) filter.category = category;
    if (petType) filter.petType = petType;
    if (location) filter.localisation = { $regex: location, $options: 'i' };
    if (userId) filter['user._id'] = userId;
    if (gender) filter.gender = gender;
    if (breed) filter.breed = { $regex: breed, $options: 'i' };
    
    // Price range filter with validation
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    console.log('Filter object:', filter);

    // Build sort object
    const sort: Record<SortField, number> = {
      createdAt: sortOrder,
      price: sortOrder,
      name: sortOrder,
      age: sortOrder
    };

    console.log('Sort object:', { [sortBy]: sortOrder });

    // Execute query with pagination and error handling
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email')
        .lean(),
      Product.countDocuments(filter)
    ]).catch(error => {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch products from database');
    });

    console.log('Query results:', { productsCount: products.length, total });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Prepare response data
    const responseData = {
      success: true,
      data: {
        products,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        },
        filters: {
          category,
          petType,
          minPrice,
          maxPrice,
          location,
          gender,
          breed
        }
      }
    };

    console.log('Response data:', {
      success: responseData.success,
      productsCount: responseData.data.products.length,
      total: responseData.data.pagination.total
    });

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    
    // Handle specific error types
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Database error occurred',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
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

    // Validate required fields
    

    // Validate images
    if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json(
        { message: 'At least one image is required' },
        { status: 400 }
      );
    }

    

    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images,
      category: body.category,
      localisation: body.localisation,
      featured: body.featured || false,
      petType: body.petType,
      quantity: body.quantity || 1,
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
      breed: body.breed,
      gender: body.gender||'other',
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
