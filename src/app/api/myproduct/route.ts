import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get('x-user-id');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid or missing user ID' },
        { status: 401 }
      );
    }

    const products = await Product.find({ user: new mongoose.Types.ObjectId(userId) }).lean();

    return NextResponse.json(
      { message: 'Products retrieved successfully', products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error retrieving products:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve products', error: error.message },
      { status: 500 }
    );
  }
}