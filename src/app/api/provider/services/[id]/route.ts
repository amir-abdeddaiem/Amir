import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service, type IService } from "@/models/Service";
import { ServiceReview } from "@/models/ServiceReview";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid service ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch service with provider details
    const service = await Service.findById(params.id)
      .populate("providerId", "firstName lastName businessName avatar phone email")
      .lean()
      .exec();

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Fetch recent reviews
    const reviews = await ServiceReview.find({
      serviceId: params.id,
      isVisible: true,
    })
      .populate("customerId", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: {
        service,
        reviews,
      },
    });
  } catch (error: any) {
    console.error("Error fetching service:", {
      errorMsg: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch service",
      messageId: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const service = await Service.findOneAndUpdate({ _id: params.id, providerId: userId }, body, {
      new: true,
      runValidators: true,
    })

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: service,
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ success: false, error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const service = await Service.findOneAndDelete({
      _id: params.id,
      providerId: userId,
    })

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 })
  }
}
