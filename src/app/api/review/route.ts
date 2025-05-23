import { connectDB } from '@/lib/db'
import { Review } from '@/models/Review'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

interface ReviewRequestBody {
  stars: number;
  message?: string;
  product: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure connection is established
    
    const body = await req.json();
    
    // Create a new review using the properly imported model
    const review = await Review.create({
      stars: body.stars,
      message: body.message,
      product: body.product,
      user: body.userId
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review creation failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create review' },
      { status: 500 }
    );
  }
}export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const productId = req.nextUrl.searchParams.get('productId')
    
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email') // Adjust fields as needed
      .sort({ createdAt: -1 })

    return NextResponse.json(
      { success: true, reviews },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
