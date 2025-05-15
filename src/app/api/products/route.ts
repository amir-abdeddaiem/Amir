import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  // 1. Check if `user` is provided and is a valid ObjectId
  if (!body.user || !mongoose.Types.ObjectId.isValid(body.user)) {
    return NextResponse.json(
      { message: 'Invalid or missing user ID' },
      { status: 400 }
    )
  }

  try {
    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      category: body.category,
      quantity: body.quantity,
      user: body.user // Must be a valid ObjectId
    })

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId')
  const name = searchParams.get('name') // Add this line to get the name parameter

  try {
    // Get single product by ID
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: 'Invalid product ID' },
          { status: 400 }
        )
      }

      const product = await Product.findById(id)
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(product)
    }

    // Get all products for a specific user
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: 'Invalid user ID' },
          { status: 400 }
        )
      }

      const products = await Product.find({ user: userId })
      return NextResponse.json(products)
    }

    // Get products by name (case-insensitive partial match)
    if (name) {
      const products = await Product.find({
        name: { $regex: name, $options: 'i' } // 'i' makes it case insensitive
      })
      return NextResponse.json(products)
    }

    // Get all products if no specific ID, user ID, or name is provided
    const products = await Product.find()
    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
export async function PUT(req: Request) {
  await connectDB()
  const body = await req.json()

  // Check if product ID is provided and valid
  if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
    return NextResponse.json(
      { message: 'Invalid or missing product ID' },
      { status: 400 }
    )
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      body._id,
      {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        category: body.category,
        quantity: body.quantity
      },
      { new: true } // Return the updated document
    )

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: updatedProduct },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  // Check if product ID is provided and valid
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
