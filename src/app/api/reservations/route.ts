import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Reservation } from "@/models/Reservation"
import { Service } from "@/models/Service"
import { Pet } from "@/models/Pet"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const role = searchParams.get("role") // 'customer' or 'provider'
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: any = {}

    if (role === "provider") {
      query.providerId = userId
    } else {
      query.customerId = userId
    }

    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const reservations = await Reservation.find(query)
      .populate("serviceId", "name type images")
      .populate("customerId", "firstName lastName avatar phone")
      .populate("providerId", "firstName lastName businessName avatar phone")
      .populate("petId", "name type breed avatar")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Reservation.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { serviceId, petId, date, timeSlot, notes } = await request.json()

    // Validate service exists
    const service = await Service.findById(serviceId)
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    // Validate pet belongs to user
    const pet = await Pet.findOne({ _id: petId, ownerId: userId })
    if (!pet) {
      return NextResponse.json({ success: false, error: "Pet not found or unauthorized" }, { status: 404 })
    }

    // Check if time slot is available
    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()

    const dayAvailability = service.availability.find((avail: any) => avail.dayOfWeek === dayOfWeek)

    if (!dayAvailability || !dayAvailability.timeSlots.includes(timeSlot)) {
      return NextResponse.json({ success: false, error: "Time slot not available" }, { status: 400 })
    }

    // Check if slot is already booked
    const existingReservation = await Reservation.findOne({
      serviceId,
      date: {
        $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
      },
      timeSlot,
      status: { $in: ["pending", "confirmed"] },
    })

    if (existingReservation) {
      return NextResponse.json({ success: false, error: "Time slot already booked" }, { status: 400 })
    }

    const reservation = new Reservation({
      customerId: userId,
      serviceId,
      providerId: service.providerId,
      petId,
      date: requestedDate,
      timeSlot,
      totalPrice: service.price.min, // You might want to calculate this based on selected options
      notes: notes || "",
    })

    await reservation.save()

    // Populate the reservation before returning
    await reservation.populate([
      { path: "serviceId", select: "name type images" },
      { path: "providerId", select: "firstName lastName businessName avatar phone" },
      { path: "petId", select: "name type breed avatar" },
    ])

    return NextResponse.json(
      {
        success: true,
        data: reservation,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ success: false, error: "Failed to create reservation" }, { status: 500 })
  }
}
