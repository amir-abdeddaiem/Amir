import { connectDB } from '@/lib/db';
import { Review } from '@/models/Review';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const animalId = req.nextUrl.searchParams.get('animalId');

    const filter = animalId && mongoose.Types.ObjectId.isValid(animalId)
      ? { product: animalId }
      : {};

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('product', 'name type')
      .select('stars message photo product user createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('GET Reviews Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reviews',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { reviewIds } = await req.json();

    if (!Array.isArray(reviewIds) || reviewIds.length === 0 || !reviewIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json(
        { success: false, message: 'Invalid or empty review IDs array'},
        { status: 400 }
      );
    }

    const deletedReviews = await Review.deleteMany({ _id: { $in: reviewIds } });

    if (deletedReviews.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No reviews found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${deletedReviews.deletedCount} review(s) deleted successfully`,
    });
  } catch (error) {
    console.error('DELETE Reviews Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete reviews',
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}