import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB')
    return
  }
  try {
    await mongoose.connect(process.env.DB_URL as string)
    isConnected = true
    console.log('MongoDB Connected...')
  } catch (err: any) {
    console.error(err.message)
  }
}