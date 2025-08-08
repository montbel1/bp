import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Ensure we have a user in the database
    let user = null
    if (session?.user?.email) {
      user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      
      if (!user) {
        // Create user if it doesn't exist
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || session.user.email.split('@')[0],
            role: 'USER',
            subscription: 'BASIC',
            flowAccess: true
          }
        })
      }
    } else {
      // For development, create a default user
      user = await prisma.user.findFirst({
        where: { email: 'dev@example.com' }
      })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'dev@example.com',
            name: 'Development User',
            role: 'USER',
            subscription: 'BASIC',
            flowAccess: true
          }
        })
      }
    }
    
    // Test customer creation
    const testCustomer = await prisma.customer.create({
      data: {
        name: "Test Customer",
        email: "test@example.com",
        userId: user.id
      }
    })
    
    // Clean up test customer
    await prisma.customer.delete({
      where: { id: testCustomer.id }
    })
    
    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 
