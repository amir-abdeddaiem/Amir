import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Reservation } from "@/models/Reservation"
import { ServiceReview } from "@/models/ServiceReview"
import { User } from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get total services
    const totalServices = await User.countDocuments({
      providerId: userId,
      isActive: true,
    })

    // Get total reservations
    const totalReservations = await Reservation.countDocuments({
      providerId: userId,
    })

    // Get average rating
    const reviews = await ServiceReview.find({
      providerId: userId,
      isVisible: true,
    })

    const averageRating =
      reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

    // Get monthly earnings (mock data for now)
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

    const monthlyReservations = await Reservation.find({
      providerId: userId,
      status: "completed",
      createdAt: { $gte: startOfMonth },
    })

    const monthlyEarnings = monthlyReservations.reduce((sum, reservation) => sum + reservation.totalPrice, 0)

    return NextResponse.json({
      success: true,
      data: {
        totalServices,
        totalReservations,
        averageRating,
        monthlyEarnings,
      },
    })
  } catch (error) {
    console.error("Error fetching provider stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
