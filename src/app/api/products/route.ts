import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { User } from "@/models/User";


export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const authHeader =  req.headers.get('x-user-id');

   const user = await User.findOne({ _id:authHeader });
    
  if (!body.user || !mongoose.Types.ObjectId.isValid(body.user)) {
    return NextResponse.json({ message: 'Invalid or missing user ID' }, { status: 400 });
  }

  try {
    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      images: body.images, // array of base64 strings
      category: body.category,
      localisation: body.localisation,
      featured: body.featured,
      petType: body.petType,
      quantity: body.quantity,
      specifications: body.specifications || [],
      user: {
        _id: authHeader,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get('id');
const userId = searchParams.get('userId');

  const name = searchParams.get('name');
  const category = searchParams.get('category');
  const priceMin = parseFloat(searchParams.get('priceMin') || "0");
  const priceMax = parseFloat(searchParams.get('priceMax') || "10000");
  const inStock = searchParams.get('inStock');

  try {
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
      }
      const product = await Product.findById(id).populate('user'); // Populate user data
      if (!product) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    let query: any = { price: { $gte: priceMin, $lte: priceMax } };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    }

    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (inStock === "true") query.quantity = { $gt: 0 };

    const products = await Product.find(query) // Populate user data
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}






