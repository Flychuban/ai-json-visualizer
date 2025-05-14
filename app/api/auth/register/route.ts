import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { RegisterSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedFields = RegisterSchema.safeParse(body)
    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedFields.data

    // Check for existing user
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Failed to create account" },
      { status: 500 }
    )
  }
} 