import { type NextRequest, NextResponse } from "next/server"

import { connectDB } from "@/lib/db";
import { Reservation } from "@/models/Reservation";
import mongoose from "mongoose";
import Appointment from "@/models/Service";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      providerId,
      petId,
      date,
      timeSlot,
      notes = "",
      calendar
    } = body;

    const requiredFields = [
      "serviceId",
      "providerId",
      "petId",
      "date",
      "timeSlot",
      "totalPrice"
    ];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`
        },
        { status: 400 }
      );
    }

    const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);
    const invalidIds = [
      { field: "providerId", value: providerId },
      { field: "petId", value: petId }
    ].filter(({ value }) => !isValidObjectId(value));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid ID format for: ${invalidIds.map(i => i.field).join(", ")}`
        },
        { status: 400 }
      );
    }

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(timeSlot)) {
      return NextResponse.json(
        { success: false, error: "Time slot must be in HH:MM format" },
        { status: 400 }
      );
    }



    const existingReservation = await Reservation.findOne({
      providerId,
      date: reservationDate,
      timeSlot
    });

    if (existingReservation) {
      return NextResponse.json(
        {
          success: false,
          error: "Time slot already booked",
          conflictId: existingReservation._id
        },
        { status: 409 }
      );
    }

    const reservation = await Reservation.create({
      customerId: userId,
      providerId,
      petId,
      date: reservationDate,
      timeSlot,
      status: "pending",
      notes,

    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: reservation._id,
          date: reservation.date,
          timeSlot: reservation.timeSlot,
          status: reservation.status,
          totalPrice: reservation.totalPrice
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create reservation"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const providerId = params.id;
    console.log("Fetching all availability for provider:", providerId);

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return NextResponse.json(
        { success: false, error: "Invalid provider ID format" },
        { status: 400 }
      );
    }

    // 1. First verify the provider exists
    const providerExists = await mongoose.models.User.exists({ _id: providerId });
    if (!providerExists) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    // 2. Get all appointments for this provider (with logging)
    const allAppointments = await Appointment.find({
      providerId: new mongoose.Types.ObjectId(providerId)
    }).lean();

    console.log(`Found ${allAppointments.length} total appointments for provider`);

    if (allAppointments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          providerId,
          availability: [],
          message: "No appointments found for this provider"
        }
      });
    }

    // 3. Get distinct dates (alternative approach)
    const dateMap = new Map<string, boolean>();
    allAppointments.forEach(appt => {
      const dateStr = appt.date.toISOString().split('T')[0];
      dateMap.set(dateStr, true);
    });
    const distinctDates = Array.from(dateMap.keys());

    console.log("Distinct dates found:", distinctDates);

    // 4. Get all reservations for this provider
    const reservations = await Reservation.find({
      providerId,
      status: { $nin: ["cancelled", "no-show"] }
    });

    console.log(`Found ${reservations.length} relevant reservations`);

    // 5. Create booked slots map
    const bookedSlotsMap = new Map<string, Set<string>>();
    reservations.forEach(res => {
      const dateStr = res.date.toISOString().split('T')[0];
      if (!bookedSlotsMap.has(dateStr)) {
        bookedSlotsMap.set(dateStr, new Set<string>());
      }
      (res.timeSlot as string[]).forEach((time: string) => {
        if (time && typeof time === 'string') {
          bookedSlotsMap.get(dateStr)?.add(time.trim());
        }
      });
    });

    // 6. Process availability
    const availability = distinctDates.map(dateStr => {
      // Find appointments for this date
      const dateAppointments = allAppointments.filter(appt => 
        appt.date.toISOString().split('T')[0] === dateStr
      );

      // Get all time slots
      const allTimeSlots = new Set<string>();
      dateAppointments.forEach(appt => {
        if (appt.times && Array.isArray(appt.times)) {
          appt.times.forEach(time => {
            if (time && typeof time === 'string') {
              allTimeSlots.add(time.trim());
            }
          });
        }
      });

      // Get booked slots
      const bookedTimeSlots = bookedSlotsMap.get(dateStr) || new Set<string>();

      // Calculate available slots
      const availableTimeSlots = Array.from(allTimeSlots).filter(
        time => !bookedTimeSlots.has(time)
      );

      return {
        date: dateStr,
        allTimeSlots: Array.from(allTimeSlots),
        bookedTimeSlots: Array.from(bookedTimeSlots),
        availableTimeSlots,
        isAvailable: availableTimeSlots.length > 0
      };
    });

    console.log("Final availability data:", availability);

    return NextResponse.json({
      success: true,
      data: {
        providerId,
        availability,
        stats: {
          totalDates: distinctDates.length,
          datesWithAvailability: availability.filter(d => d.isAvailable).length
        }
      }
    });

  } catch (error) {
    console.error("Error in availability endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Server error"
      },
      { status: 500 }
    );
  }
}