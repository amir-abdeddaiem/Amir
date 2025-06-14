import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  const authHeader =  req.headers.get('x-user-id');


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
        error: 'User not found',
        data: null
      }, { status: 404 });
    }

    const userData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      gender: user.gender,
      location: user.location,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      pets: user.pets,
      posts: user.posts,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      error: null,
      data: userData
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
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

    await connectDB();

    // Parse the request body
    const body = await req.json();

    // Update the user data
    const user = await User.findByIdAndUpdate(
      authHeader,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        data: null
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      error: null,
      data: user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      data: null
    }, { status: 500 });
  }
}