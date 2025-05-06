import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { BusinessProvider } from '@/models/BusnessProvider'

export async function GET(req: Request) {
    await connectDB()
  
    try {
      // Get query parameters from the request URL
      const { searchParams } = new URL(req.url)
      const userId = searchParams.get('id')
      const userEmail = searchParams.get('email')
      if (!userId && !userEmail) {
        return NextResponse.json(
          { message: 'User ID or email is required' },
          { status: 400 }
        )
      }
      let user
      let businessProviderInfo = null
  

        // Find user by ID
        if (userId) {
          user = await User.findById(userId)
        } else {
          user = await User.findOne({ email: userEmail })
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
  
export async function PUT(req: Request) {
    await connectDB()
    const body = await req.json()
  
    try {
      const { id, ...updateData } = body
  
      // Update user information
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      })
  
      if (!updatedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
      }
  
      return NextResponse.json({ message: 'User updated successfully' }, { status: 200 })
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message: 'Failed to update user' }, { status: 500 })
    }
  } 