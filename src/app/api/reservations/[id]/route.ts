import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import mongoose from "mongoose";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    // Authentication
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      serviceId,
      providerId,
      petId,
      date,
      timeSlot,
      notes = "",
      totalPrice
    } = body;

    // Validation
    const requiredFields = ["serviceId", "providerId", "petId", "date", "timeSlot", "totalPrice"];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check for existing reservation at same time
    const existingReservation = await Reservation.findOne({
      providerId,
      date: new Date(date),
      timeSlot
    });

    if (existingReservation) {
      return NextResponse.json(
        { success: false, error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create new reservation
    const reservation = await Reservation.create({
      customerId: userId,
      service: serviceId,
      providerId,
      petId,
      date: new Date(date),
      timeSlot,
      status: "pending",
      totalPrice,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: reservation._id,
          date: reservation.date,
          timeSlot: reservation.timeSlot,
          status: reservation.status
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}