import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { BusinessProvider } from '@/models/BusnessProvider'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)

    const newUser = await User.create({ 
      birthDate :body.birthDate,
      email :body.email,
      firstName:body.firstName,
      gender:body.gender,
      lastName:body.lastName,
      location:body.location,
      password: hashedPassword,
      phone:body.phone ,
      avatar:body.avatar,  
    })

console.log(body.accType)


    if(body.accType!="regular"){
      const serviceP = await BusinessProvider.create({
        services: body.services,
        website: body.website,
        businessName:body.businessName,
        businessType:body.businessType,
        certifications: body.certifications,
        description: body.description,
        Userid: newUser

      })
    }


    return NextResponse.json({message:'user created successfully'},{status:201})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message:'faild to create this user'},{status:500})
  }
}
export async function GET(req: Request) {
  await connectDB()

  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('id')

    let user
    let businessProviderInfo = null

    if (email) {
      // Find user by email
      user = await User.findOne({ email })
    } else if (userId) {
      // Find user by ID
      user = await User.findById(userId)
    } else {
      return NextResponse.json(
        { message: 'Please provide either email or user ID' },
        { status: 400 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if this user is a business provider and get additional info
    const businessProvider = await BusinessProvider.findOne({ Userid: user._id })
    if (businessProvider) {
      businessProviderInfo = {
        services: businessProvider.services,
        website: businessProvider.website,
        businessName: businessProvider.businessName,
        businessType: businessProvider.businessType,
        certifications: businessProvider.certifications,
        description: businessProvider.description
      }
    }

    // Return user data (excluding password) and business provider info if exists
    const userData = {
      id: user._id,
      birthDate: user.birthDate,
      email: user.email,
      firstName: user.firstName,
      gender: user.gender,
      lastName: user.lastName,
      location: user.location,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      businessProvider: businessProviderInfo
    }

    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: 'Failed to retrieve user information' },
      { status: 500 }
    )
  }
}