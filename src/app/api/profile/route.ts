import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(reqest: Request) {
  // search fo params named authorization on headers
  const authHeader = reqest.headers.get('authorization');
  try {
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        data: null
      }, { status: 401 });
    }

    await connectDB();

    // Use email or id from session to find the user
    const user = await User.findOne({ email:authHeader }).select('-password');
    console.log("User data:", user);

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