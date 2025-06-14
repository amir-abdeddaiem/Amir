import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  console.log("Received body:", body); // Debug log

  try {
    // Validate required fields based on accType
    if (!body.email || !body.password || body.email.trim() === "" || body.password.trim() === "") {
      return NextResponse.json(
        { message: "Email and password are required and cannot be empty.", success: false },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!body.phone || !/^\d{8}$/.test(body.phone)) {
      return NextResponse.json(
        { message: "Phone number must be exactly 8 digits.", success: false },
        { status: 400 }
      );
    }

   if (body.accType === "provider") {
  const missingFields = [];
  if (!body.firstName || body.firstName.trim() === "") missingFields.push("firstName");
  if (!body.lastName || body.lastName.trim() === "") missingFields.push("lastName");
  if (!body.businessName || body.businessName.trim() === "") missingFields.push("businessName");
  if (!body.businessType || body.businessType.trim() === "") missingFields.push("businessType");
  if (!body.description || body.description.trim() === "") missingFields.push("description");
  if (!body.phone || !/^\d{8}$/.test(body.phone)) missingFields.push("phone");
  if (!body.services || body.services.length === 0) missingFields.push("services");
  

  if (missingFields.length > 0) {
    console.log("Missing or invalid provider fields:", missingFields);
    return NextResponse.json(
      {
        message: `The following fields are required for providers: ${missingFields.join(", ")}.`,
        success: false,
      },
      { status: 400 }
    );
  }
}

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const existingUser = await User.findOne ({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered. Please use a different email.", success: false },
        { status: 800 }
      );
    }

    const userData = {
      accType: body.accType || "regular",
      birthDate: body.birthDate,
      email: body.email,
      firstName: body.firstName,
      gender: body.gender,
      lastName: body.lastName,
      location: body.location,
      password: hashedPassword,
      phone: body.phone,
      avatar: body.avatar,
      coordinates: body.coordinates||"",
      status: "authenticated",
      businessName: body.businessName || "",
      businessType:body.businessType|| "",
      boutiqueImage: body.boutiqueImage||"",
      services: body.services || [],
      certifications: body.certifications || "",
      description: body.description || "",
      website: body.website || "",
    };

    // Add coordinates if provided
    if (body.coordinates) {
      userData.coordinates = {
        type: "Point",
        coordinates: body.coordinates,
      };
    }

    const newUser = await User.create(userData);

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`,
          status: "authenticated",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { message: "Email already registered. Please use a different email.", success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create user. Please try again.", success: false },
      { status: 500 }
    );
  }
}