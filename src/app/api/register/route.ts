import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const newUser = await User.create({ name: body.name })
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User creation failed' }), {
      status: 500,
    })
  }
}
