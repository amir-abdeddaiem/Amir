import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      location,
      gender,
      birthDate,
      businessName,
      businessType,
      certifications, // assumed to be a string (ID)
      description,
      services = [], // assumed to be an array of string IDs
    } = body;

    // Basic validation (optional but recommended)
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 403 }
      );
    }

    const user = await prisma.test.create({
        data: {
            name: "test"
        }

      
    });

    return NextResponse.json(
      { success: true, message: "User created successfully", user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
}
