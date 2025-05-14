import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database connection
    await db.$connect()
    console.log('✅ Database connection successful')
    
    return NextResponse.json({ status: 'ok', message: 'Database connection successful' })
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 500 }
    )
  } finally {
    await db.$disconnect()
  }
} 