// import { type NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/lib/db"
// import { Service } from "@/models/Service"

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB()

//     const userId = request.headers.get("x-user-id")
//     if (!userId) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     const services = await Service.find({ providerId: userId }).sort({ createdAt: -1 })

//     return NextResponse.json({
//       success: true,
//       data: services,
//     })
//   } catch (error) {
//     console.error("Error fetching provider services:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Service } from "@/models/Service";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "All";
    const search = searchParams.get("search") || "";

    const query: any = { isActive: true };

    if (type !== "All") {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const services = await Service.find(query)
      .select("name type description price location rating reviewCount images")
      .sort({ rating: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}