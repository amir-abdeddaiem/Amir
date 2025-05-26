import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'



export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

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
        _id: '6824d2e30b47408a868cacaf',
        firstName: 'Amir',
        lastName: 'Abdeddaiem',
        email: 'amirabdeddaiem03@gmail.com'
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

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
    return NextResponse.json({ message: 'Invalid or missing product ID' }, { status: 400 });
  }

  try {
    const updateData = {
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
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      body._id,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const id = searchParams.get('id');
  // const userId = searchParams.get('userId');
  const userId = "6824d2e30b47408a868cacaf";
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

    const products = await Product.find(query).populate('user'); // Populate user data
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: 'Invalid or missing product ID' },
      { status: 400 }
    )
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
