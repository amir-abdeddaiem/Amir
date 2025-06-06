import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Favorite } from '@/models/Favorite'; // Adjust path to your model
import { connectDB } from '@/lib/mongodb'; // Adjust path to your database connection

// POST: Add a favorite product
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { userId, productId } = await req.json();
    
    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid userId or productId' }, { status: 400 });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    
    if (existingFavorite) {
      return NextResponse.json(existingFavorite, { status: 200 });
    }

    // Create new favorite
    const favorite = new Favorite({
      user: userId,
      product: productId,
    });

    await favorite.save();
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/favoriteproduct:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Retrieve favorites for a user
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    const favorites = await Favorite.find({ user: userId })
      .populate('product')
      .select('-__v')
      .lean();

    return NextResponse.json(favorites, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/favoriteproduct:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Remove a favorite product
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing userId or productId' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid userId or productId' }, { status: 400 });
    }

    const result = await Favorite.findOneAndDelete({ user: userId, product: productId });

    if (!result) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/favoriteproduct:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}