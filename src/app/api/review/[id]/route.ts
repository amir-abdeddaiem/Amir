import { connectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const stars = parseInt(formData.get("stars") as string);
    const message = formData.get("message") as string;
    const product = formData.get("product") as string;
    const userId = req.headers.get("x-user-id"); // Get userId header
    const photo = formData.get("photo") as string;

    // Validate inputs
    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, message: "Invalid rating: must be between 1 and 5" },
        { status: 400 }
      );
    }
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Review message is required" },
        { status: 400 }
      );
    }
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 401 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      stars,
      message,
      product,
      user: userId,
      photo,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : "Failed to create review",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const productId = req.nextUrl.searchParams.get("productId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const review = await Review.findOne({ product: productId, user: userId })
        .populate("user", "name email")
        .select("stars message photo createdAt user");
      return NextResponse.json({ success: true, review }, { status: 200 });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .select("stars message photo createdAt user")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const pathnameParts = req.nextUrl.pathname.split("/");
    const reviewId = pathnameParts[pathnameParts.length - 1]; // Get reviewId from URL
    const formData = await req.formData();
    const stars = parseInt(formData.get("stars") as string);
    const message = formData.get("message") as string;
    const product = formData.get("product") as string;
    const userId = req.headers.get("x-user-id"); // Get userId from header
    const photo = formData.get("photo") as string;

    // Validate reviewId
    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, message: "Invalid rating: must be between 1 and 5" },
        { status: 400 }
      );
    }
    if (!message || message.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Review message is required" },
        { status: 400 }
      );
    }
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 401 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // First check if the review exists and belongs to the user
    const existingReview = await Review.findOne({ _id: reviewId, user: userId });
    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        stars,
        message,
        product,
        user: userId,
        photo,
      },
      { new: true }
    ).populate("user", "name email");

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Review update failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : "Failed to update review",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const pathnameParts = req.nextUrl.pathname.split("/");
    const reviewId = pathnameParts[pathnameParts.length - 1]; // Get the last segment
    const userId = req.headers.get("x-user-id"); // Get userId from header

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: "Invalid review ID" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 401 }
      );
    }

    // First check if the review exists and belongs to the user
    const existingReview = await Review.findOne({ _id: reviewId, user: userId });
    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: "Review not found or unauthorized" },
        { status: 404 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Review deletion failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : "Failed to delete review",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}