import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Types } from "mongoose";

// Define the IUser interface
export interface IUser {
  _id: Types.ObjectId;
  accType: 'regular' | 'provider' | 'admin'; // Include 'admin' in the type
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  location: string;
  coordinates?: {
    type: string;
    coordinates: [number, number];
  };
  phone: string;
  avatar?: string;
  bio?: string;
  businessName?: string;
  boutiqueImage?: string;
  businessType?: string;
  services?: string[];
  certifications?: string;
  description?: string;
  website?: string;
  status: 'authenticated' | 'unauthenticated';
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    await connectDB();

    // Fetch all users without filtering by accType
    const users = await User.find({}).lean();

    // Map users to ensure proper typing and remove sensitive data
    const formattedUsers: IUser[] = users.map(user => ({
      _id: user.id,
      accType: user.accType,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      birthDate: user.birthDate,
      location: user.location,
      coordinates: user.coordinates,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      businessName: user.businessName,
      boutiqueImage: user.boutiqueImage,
      services: user.services,
      certifications: user.certifications,
      description: user.description,
      website: user.website,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json({ message: 'Error retrieving users' }, { status: 500 });
  }
}