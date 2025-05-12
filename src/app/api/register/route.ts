import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BusinessProvider } from '@/models/BusnessProvider'

const JWT_SECRET = 'your-secret-key'; // You should move this to an environment variable

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered. Please use a different email.' },
        { status: 400 }
      );
    }

    const userData: any = { 
      accType: body.accType || 'regular',
      birthDate: body.birthDate,
      email: body.email,
      firstName: body.firstName,
      gender: body.gender,
      lastName: body.lastName,
      location: body.location,
      password: hashedPassword,
      phone: body.phone,
      avatar: body.avatar,
    };

    // Add coordinates if provided
    if (body.coordinates) {
      userData.coordinates = {
        type: 'Point',
        coordinates: body.coordinates
      };
    }

    // Add provider-specific fields if user is a service provider
    if (body.accType === 'provider') {
      userData.businessName = body.businessName;
      userData.businessType = body.businessType;
      userData.services = body.services || [];
      userData.certifications = body.certifications;
      userData.description = body.description;
      userData.website = body.website;
    }

    const newUser = await User.create(userData);

    if (body.accType !== "regular") {
      await BusinessProvider.create({
        services: body.services,
        website: body.website,
        businessName: body.businessName,
        businessType: body.businessType,
        certifications: body.certifications,
        description: body.description,
        Userid: newUser
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        success: true,
        token,
        user: {
          _id: newUser._id,
          email: newUser.email
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Email already registered. Please use a different email.', success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create user. Please try again.', success: false },
      { status: 500 }
    );
  }
}
