import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      category: body.category,
      quantity: body.quantity,
      user: body.user
    })
    return NextResponse.json({message:'product created successfully'},{status:201})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:'faild to create this product'},{status:500})
  }
}