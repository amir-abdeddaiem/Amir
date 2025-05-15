import { connectDB } from '@/lib/db'
import { Review } from '@/models/Review'
import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

interface ReviewRequestBody {
  stars: number;
  message?: string;
  product: string;
  user: string;
}
export async function POST(req: Request) {
    try {
      await connectDB()
  
      const body = await req.json()
  
      // Validation for embedded user
      if (
        !body.user ||
        !body.user.id ||
        !body.user.firstName ||
        !body.user.lastName
      ) {
        return NextResponse.json(
          { success: false, message: 'Missing user information' },
          { status: 400 }
        )
      }
  
      // Validate product ID
      if (!body.product || !mongoose.Types.ObjectId.isValid(body.product)) {
        return NextResponse.json(
          { success: false, message: 'Invalid or missing product ID' },
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
        user: {
          id: body.user.id,
          firstName: body.user.firstName,
          lastName: body.user.lastName
        }
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

// GET /api/review?product=PRODUCT_ID or /api/review?user=USER_ID
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const searchParams = req.nextUrl.searchParams
    const product = searchParams.get('product')
    const user = searchParams.get('user')

    const filter: any = {}

    if (product) {
      if (!mongoose.Types.ObjectId.isValid(product)) {
        return NextResponse.json(
          { success: false, message: 'Invalid product ID' },
          { status: 400 }
        )
      }
      filter.product = product
    }

    if (user) {
      if (!mongoose.Types.ObjectId.isValid(user)) {
        return NextResponse.json(
          { success: false, message: 'Invalid user ID' },
          { status: 400 }
        )
      }
      filter.user = user
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name') // assuming 'user' has a 'name' field
      .populate('product', 'title') // assuming 'product' has a 'title' field
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: reviews
    })

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
