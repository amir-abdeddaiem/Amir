import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  console.log('Login request body:', body)
  try {
    const user = await User.findOne({ email: body.email })
    console.log('Found user:', user)
    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 401 }
      )
    }

    
    const isPasswordValid = await bcrypt.compare(body.password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid password', success: false },
        { status: 401 }
      )
    }

    // Update user status to authenticated
    user.status = 'authenticated'
    await user.save()

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email,role:user.accType },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      { 
        message: 'Login successful',
        success: true,
        token,
        user: {
          id: user._id,
          role:user.accType,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          status: 'authenticated'
        }
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Failed to login. Please try again.', success: false },
      { status: 500 }
    )
  }
}
