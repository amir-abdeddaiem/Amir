import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Types } from "mongoose";

// Define the IUser interface
export interface IUser {
  _id: Types.ObjectId;
  accType: 'regular' | 'provider' | 'admin';
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid provider ID" }, { status: 400 });
    }

    // Fetch user with accType 'provider' by ID
    const user = await User.findOne({ _id: id, accType: 'provider' }).lean();

    if (!user) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error retrieving provider:', error);
    return NextResponse.json({ message: 'Error retrieving provider' }, { status: 500 });
  }
}