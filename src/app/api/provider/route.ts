import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const authHeader = req.headers.get('x-user-id');

  try {
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header is missing',
        data: null
      }, { status: 401 });
    }

    await connectDB();
   const user = await User.findOne({ _id:authHeader }).select('-password');
  console.log("Authorization header:", authHeader);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Provider not found',
        data: null
      }, { status: 404 });
    }

    const providerData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      boutiqueImage: user.boutiqueImage || "/default-boutique.png",
      businessName: user.businessName || "Not provided",
      description: user.description || "No description provided",
      website: user.website || "Not provided",
      location: user.location || "Not provided",
      services: user.services || "Not provided",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      error: null,
      data: providerData
    });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authHeader = req.headers.get('x-user-id');
  
  try {
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'Authorization header is missing',
        data: null
      }, { status: 401 });
    }

    const body = await req.json();
    
    await connectDB();
    
    const user = await User.findOne({ _id: authHeader });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Provider not found',
        data: null
      }, { status: 404 });
    }

    // Update user fields
    user.firstName = body.firstName || user.firstName;
    user.lastName = body.lastName || user.lastName;
    user.email = body.email || user.email;
    user.phone = body.phone || user.phone;
    user.businessName = body.businessName || user.businessName;
    user.description = body.description || user.description;
    user.website = body.website || user.website;
    user.location = body.location || user.location;
    user.services = body.services || user.services;
    user.boutiqueImage = body.boutiqueImage || user.boutiqueImage;
    user.avatar = body.avatar || user.avatar;

    await user.save();

    const updatedProviderData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      boutiqueImage: user.boutiqueImage,
      businessName: user.businessName,
      description: user.description,
      website: user.website||"",
      location: user.location,
      services: user.services,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      error: null,
      data: updatedProviderData
    });
  } catch (error) {
    console.error("Error updating provider profile:", error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile',
      data: null
    }, { status: 500 });
  }
}