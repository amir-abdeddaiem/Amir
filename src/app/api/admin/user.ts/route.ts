// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { User } from "@/models/User";

// export async function GET() {
//   try {
//     await connectDB();
    
//     const users = await User.find(
//       {},
//       {
//         firstName: 1,
//         lastName: 1,
//         email: 1,
//         accType: 1,
//         avatar: 1,
//         createdAt: 1,
//         businessName: 1,
//         businessType: 1,
//         services: 1,
//       }
//     ).lean();

//     return NextResponse.json({
//       success: true,
//       users: users.map(user => ({
//         ...user,
//         _id: (user._id as { toString: () => string }).toString(),
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }