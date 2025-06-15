import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Service } from "@/models/Service"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const query: any = { }

    // Filter by type
    if (type && type !== "All") {
      query.businessType = type
    }

 
    // Search in name and description
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }




    query.accType= "provider"

    const services = await User.find(query).select("-password -status -updatedAt")

    const total = await User.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: services,

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
