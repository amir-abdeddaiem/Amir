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
