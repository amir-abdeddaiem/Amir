import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
  await connectDB();

  const id =  req.headers.get('x-user-id');
console.log("id",id)

  try{
if (id) {
  const myprod = await Product.find({ user: id });
      return NextResponse.json(myprod,{status:200})
}
    return NextResponse.json({message:"error id not found"},{status:404})
  }
  catch(e){
    return NextResponse.json({message:"no data found "},{status:500})
  }
}



export async function DELETE(req: Request) {
  await connectDB();

  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');

  try {
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 404 });
    }

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Verify the product belongs to the user before deleting
    const product = await Product.findOne({ _id: productId, user: userId });
    
    if (!product) {
      return NextResponse.json({ message: "Product not found or not owned by user" }, { status: 404 });
    }

    await Product.findByIdAndDelete(productId);
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();

  const userId = req.headers.get('x-user-id');
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id');
  const body = await req.json();

  try {
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 404 });
    }

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Verify the product belongs to the user before updating
    const existingProduct = await Product.findOne({ _id: productId, user: userId });
    
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found or not owned by user" }, { status: 404 });
    }

    // Prevent changing the user field
    if (body.user && body.user !== userId) {
      return NextResponse.json({ message: "Cannot change product ownership" }, { status: 403 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...body, user: userId }, // Ensure user remains the same
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Error updating product" }, { status: 500 });
  }
}