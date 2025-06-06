import { connectDB } from '@/lib/db'
import { Product } from '@/models/Product'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'


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

// export async function PUT(req: Request) {
//   await connectDB();

//   const userId = req.headers.get('x-user-id');
//   console.log(userId)
//   const { searchParams } = new URL(req.url);
//   const productId = searchParams.get('id');
//   const body = await req.json();

//   try {
//     if (!userId) {
//       return NextResponse.json({ message: "User ID not found" }, { status: 404 });
//     }

//     if (!productId) {
//       return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
//     }

//     // Verify the product belongs to the user before updating
//     const existingProduct = await Product.findOne({ _id: productId, user: userId });
    
//     if (!existingProduct) {
//       return NextResponse.json({ message: "Product not found or not owned by user" }, { status: 404 });
//     }

//     // Prevent changing the user field
//     if (body.user && body.user !== userId) {
//       return NextResponse.json({ message: "Cannot change product ownership" }, { status: 403 });
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       { ...body, user: userId }, // Ensure user remains the same
//       { new: true } // Return the updated document
//     );

//     return NextResponse.json(updatedProduct, { status: 200 });
//   } catch (e) {
//     return NextResponse.json({ message: "Error updating product" }, { status: 500 });
//   }
// }

export async function PUT(req: Request) {
  await connectDB();
  const userId = req.headers.get('x-user-id');
  const body = await req.json();

  console.log('PUT Request - User ID:', userId);
  console.log('PUT Request - Body:', body);

  if (!userId) {
    return NextResponse.json({ message: "User ID not found" }, { status: 401 });
  }

  if (!body._id || !mongoose.Types.ObjectId.isValid(body._id)) {
    console.log('Invalid product ID:', body._id);
    return NextResponse.json({ message: 'Invalid or missing product ID' }, { status: 400 });
  }

  try {
    // Verify the product belongs to the user before updating
    const existingProduct = await Product.findOne({ _id: body._id, user: userId });
    
    if (!existingProduct) {
      console.log('Product not found or not owned by user:', { productId: body._id, userId });
      return NextResponse.json({ message: "Product not found or not owned by user" }, { status: 404 });
    }

    const updateData = {
      name: body.name || existingProduct.name,
      description: body.description || existingProduct.description,
      price: typeof body.price === 'number' ? body.price : parseFloat(body.price) || existingProduct.price,
      images: body.images || existingProduct.images,
      category: body.category || existingProduct.category,
      localisation: body.localisation || existingProduct.localisation,
      featured: body.featured ?? existingProduct.featured,
      petType: body.petType || existingProduct.petType,
      quantity: typeof body.quantity === 'number' ? body.quantity : parseInt(body.quantity) || existingProduct.quantity,
      specifications: body.specifications || existingProduct.specifications || [],
      user: userId // Ensure user remains the same
    };

    console.log('Update data:', updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      body._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log('Product not found after update attempt:', body._id);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    console.log('Product updated successfully:', updatedProduct);
    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Update product error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      return NextResponse.json({ 
        message: 'Validation Error', 
        errors: validationErrors
      }, { status: 400 });
    }
    return NextResponse.json({ 
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


// export async function DELETE(req: Request) {
//   await connectDB()
//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json(
//       { message: 'Invalid or missing product ID' },
//       { status: 400 }
//     )
//   }

//   try {
//     const deletedProduct = await Product.findByIdAndDelete(id)
//     if (!deletedProduct) {
//       return NextResponse.json(
//         { message: 'Product not found' },
//         { status: 404 }
//       )
//     }
//     return NextResponse.json(
//       { message: 'Product deleted successfully' },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { message: 'Failed to delete product' },
//       { status: 500 }
//     )
//   }
// }
