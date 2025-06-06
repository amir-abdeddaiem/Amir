import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Service } from "@/models/Service"
import { ServiceReview } from "@/models/ServiceReview"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const service = await Service.findById(params.id).populate(
      "providerId",
      "firstName lastName businessName avatar phone email",
    )

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    // Get recent reviews
    const reviews = await ServiceReview.find({
      serviceId: params.id,
      isVisible: true,
    })
      .populate("customerId", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(10)

    return NextResponse.json({
      success: true,
      data: {
        ...service.toObject(),
        reviews,
      },
    })
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch service" }, { status: 500 })
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
