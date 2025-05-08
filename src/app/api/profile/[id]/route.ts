import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { BusinessProvider } from '@/models/BusnessProvider'

export async function GET(req: Request, context: { params: { id: string } }) {
    await connectDB()
  
    try {
      // Get ID from the URL path parameter
      const { id } = context.params
  
      let user
      let businessProviderInfo = null
  
      // Find user by ID
      user = await User.findById(id)
      
  
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          data: null
        }, { status: 404 })
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
  
      return NextResponse.json({
        success: true,
        error: null,
        data: userData
      }, { status: 200 })
    } catch (error) {
      console.log(error)
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve user information',
        data: null
      }, { status: 500 })
    }
    
  }
  
export async function PUT(req: Request, context: { params: { id: string } }) {
    await connectDB()
    const body = await req.json()
  
    try {
      const { id } = context.params
      // Get the update data directly from body, we're now using id from params
      const updateData = body
      console.log("Updating user with ID:", id);
  
      // Update user information
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      })
  
      if (!updatedUser) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          data: null
        }, { status: 404 })
      }
  
      return NextResponse.json({
          success: true,
          error: null,
          data: {
            message: 'User updated successfully',
            user: updatedUser
          }
      }, { status: 200 })
    } catch (error) {
      console.log(error)
      return NextResponse.json({
        success: false,
        error: 'Failed to update user',
        data: null
      }, { status: 500 })
    }
  }