import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"

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

