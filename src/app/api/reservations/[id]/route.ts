import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Reservation } from "@/models/Reservation"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const reservation = await Reservation.findOne({
      _id: params.id,
      $or: [{ customerId: userId }, { providerId: userId }],
    })
      .populate("serviceId", "name type description images")
      .populate("customerId", "firstName lastName avatar phone email")
      .populate("providerId", "firstName lastName businessName avatar phone email")
      .populate("petId", "name type breed age weight avatar medicalInfo behavior")

    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: reservation,
    })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reservation" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { status, cancellationReason } = await request.json()

    // Find reservation and check permissions
    const reservation = await Reservation.findOne({
      _id: params.id,
      $or: [{ customerId: userId }, { providerId: userId }],
    })

    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 })
    }

    // Validate status transitions
    const allowedTransitions: { [key: string]: string[] } = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled", "no-show"],
      completed: [],
      cancelled: [],
      "no-show": [],
    }

    if (!allowedTransitions[reservation.status].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status transition" }, { status: 400 })
    }

    // Update reservation
    const updateData: any = { status }
    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("serviceId", "name type images")
      .populate("customerId", "firstName lastName avatar phone")
      .populate("providerId", "firstName lastName businessName avatar phone")
      .populate("petId", "name type breed avatar")

    return NextResponse.json({
      success: true,
      data: updatedReservation,
    })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ success: false, error: "Failed to update reservation" }, { status: 500 })
  }
}
