import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Service } from "@/models/Service"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const city = searchParams.get("city")
    const search = searchParams.get("search")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10" // km
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const query: any = { isActive: true }

    // Filter by type
    if (type && type !== "All") {
      query.type = type
    }

    // Filter by city
    if (city) {
      query["location.city"] = { $regex: city, $options: "i" }
    }

    // Search in name and description
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Location-based search
    if (lat && lng) {
      query["location.coordinates"] = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
          },
          $maxDistance: Number.parseInt(radius) * 1000, // Convert km to meters
        },
      }
    }

    const skip = (page - 1) * limit

    const services = await Service.find(query)
      .populate("providerId", "firstName lastName businessName avatar")
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Service.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, description, price, duration, location, images, availability } = body

    const service = new Service({
      providerId: userId,
      name,
      type,
      description,
      price,
      duration,
      location,
      images: images || [],
      availability: availability || [],
    })

    await service.save()

    return NextResponse.json(
      {
        success: true,
        data: service,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 })
  }
}
