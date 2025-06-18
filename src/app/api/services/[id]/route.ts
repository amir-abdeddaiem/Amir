import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { ServiceReview } from "@/models/ServiceReview"
import { User } from "@/models/User"
import Appointment from "@/models/Service"
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const {id} = await params
    console.log(id)
    await connectDB()
    const service = await User.findById(id).select("-updatedAt")


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

    // const service = await Service.findOneAndUpdate({ _id: params.id, providerId: userId }, body, {
    //   new: true,
    //   runValidators: true,
    // })

    // if (!service) {
    //   return NextResponse.json({ success: false, error: "Service not found or unauthorized" }, { status: 404 })
    // }

    return NextResponse.json({
      success: true,
      // data: service,
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

    // const service = await Service.findOneAndDelete({
    //   _id: params.id,
    //   providerId: userId,
    // })

    // if (!service) {
    //   return NextResponse.json({ success: false, error: "Service not found or unauthorized" }, { status: 404 })
    // }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Get provider ID from route params
    const { id } = await params;

    // Get user ID from headers
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - User ID missing" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { times, date } = body;

    // Validate required fields
    if (!times || !date) {
      return NextResponse.json(
        { success: false, error: "Both time slots and date are required" },
        { status: 403 }
      );
    }

    // Validate times is an array with at least one entry
    if (!Array.isArray(times) || times.length === 0) {
      return NextResponse.json(
        { success: false, error: "Time slots must be provided as an array" },
        { status: 400 }
      );
    }

    // Validate each time slot format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const invalidTimes = times.filter(t => !timeRegex.test(t));
    if (invalidTimes.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid time format for slots: ${invalidTimes.join(", ")}. Use HH:MM format`
        },
        { status: 400 }
      );
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await Appointment.create({
      providerId: userId,
      date: parsedDate,
      times,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: appointment._id,
          date: appointment.date,
          times: appointment.times,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create appointment"
      },
      { status: 500 }
    );
  }
}