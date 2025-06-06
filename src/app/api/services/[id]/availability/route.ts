import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Service } from "@/models/Service"
import { Reservation } from "@/models/Reservation"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const month = searchParams.get("month")

    const service = await Service.findById(params.id)
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }

    if (date) {
      // Get availability for a specific date
      const requestedDate = new Date(date)
      const dayOfWeek = requestedDate.getDay()

      // Find availability for this day of week
      const dayAvailability = service.availability.find((avail: any) => avail.dayOfWeek === dayOfWeek)

      if (!dayAvailability) {
        return NextResponse.json({
          success: true,
          data: { availableSlots: [] },
        })
      }

      // Get existing reservations for this date
      const existingReservations = await Reservation.find({
        serviceId: params.id,
        date: {
          $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
        },
        status: { $in: ["pending", "confirmed"] },
      })

      const bookedSlots = existingReservations.map((res) => res.timeSlot)
      const availableSlots = dayAvailability.timeSlots.filter((slot: string) => !bookedSlots.includes(slot))

      return NextResponse.json({
        success: true,
        data: { availableSlots },
      })
    } else if (month) {
      // Get availability for entire month
      const [year, monthNum] = month.split("-").map(Number)
      const startDate = new Date(year, monthNum - 1, 1)
      const endDate = new Date(year, monthNum, 0)

      const monthAvailability: any = {}

      // Get all reservations for the month
      const monthReservations = await Reservation.find({
        serviceId: params.id,
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ["pending", "confirmed"] },
      })

      // Build availability for each day
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()
        const dateStr = d.toISOString().split("T")[0]

        const dayAvailability = service.availability.find((avail: any) => avail.dayOfWeek === dayOfWeek)

        if (dayAvailability) {
          const dayReservations = monthReservations.filter((res) => res.date.toISOString().split("T")[0] === dateStr)
          const bookedSlots = dayReservations.map((res) => res.timeSlot)
          const availableSlots = dayAvailability.timeSlots.filter((slot: string) => !bookedSlots.includes(slot))

          monthAvailability[dateStr] = availableSlots
        }
      }

      return NextResponse.json({
        success: true,
        data: monthAvailability,
      })
    }

    return NextResponse.json({
      success: true,
      data: service.availability,
    })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch availability" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { availability } = await request.json()

    const service = await Service.findOneAndUpdate(
      { _id: params.id, providerId: userId },
      { availability },
      { new: true, runValidators: true },
    )

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: service.availability,
    })
  } catch (error) {
    console.error("Error updating availability:", error)
    return NextResponse.json({ success: false, error: "Failed to update availability" }, { status: 500 })
  }
}
