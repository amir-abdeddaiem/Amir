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
    await connectDB()
    const body = await req.json()

    // Validate user ID
    if (!body.userId || !mongoose.Types.ObjectId.isValid(body.userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Validate product ID
    if (!body.product || !mongoose.Types.ObjectId.isValid(body.product)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    if (typeof body.stars !== 'number' || body.stars < 1 || body.stars > 5) {
      return NextResponse.json(
        { success: false, message: 'Stars must be a number between 1 and 5' },
        { status: 400 }
      )
    }

    const newReview = await Review.create({
      stars: body.stars,
      message: body.message,
      product: new mongoose.Types.ObjectId(body.product),
      user: new mongoose.Types.ObjectId(body.userId)
    })

    return NextResponse.json(
      { success: true, message: 'Review created successfully', data: newReview },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Failed to create review:', error)
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

// ... keep the GET function the same ...