import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(request: { url: string | URL; }) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate user data by month
    const userEngagementData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $gte: ["$updatedAt", startDate] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  { $subtract: ["$_id.month", 1] },
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          users: "$totalUsers",
          active: "$activeUsers",
        },
      },
    ]);

    // Calculate total active users in the time range
    const activeUsersCount = await User.countDocuments({
      updatedAt: { $gte: startDate },
    });

    return NextResponse.json({
      engagementData: userEngagementData,
      activeUsers: activeUsersCount,
    });
  } catch (error) {
    console.error("Error retrieving user engagement data:", error);
    return NextResponse.json(
      { message: "Error retrieving user engagement data" },
      { status: 500 }
    );
  }
}