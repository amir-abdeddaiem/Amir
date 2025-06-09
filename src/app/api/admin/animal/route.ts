import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Animal } from "@/models/Animal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  try {
    await connectDB();

    // Aggregate animal data by type, lost, and found status
    const animalData = await Animal.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
          },
          inmatch: { $in: [true, false] }, // Include both lost/found status
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          lost: {
            $sum: { $cond: [{ $eq: ["$inmatch", true] }, 1, 0] },
          },
          found: {
            $sum: { $cond: [{ $eq: ["$inmatch", false] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          lost: 1,
          found: 1,
          _id: 0,
        },
      },
    ]);

    const totalAnimals = await Animal.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      animalData,
      totalAnimals,
    });
  } catch (error) {
    console.error("Error fetching animal data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}