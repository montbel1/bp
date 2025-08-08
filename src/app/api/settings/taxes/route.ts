import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for tax settings
const mockTaxSettings = [
  {
    id: "1",
    name: "Federal Income Tax",
    rate: 22,
    type: "PERCENTAGE",
    isActive: true
  },
  {
    id: "2",
    name: "State Sales Tax",
    rate: 8.25,
    type: "PERCENTAGE",
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(mockTaxSettings)
    }
    
    // In production, require authentication
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockTaxSettings)
  } catch (error) {
    console.error("Error fetching tax settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch tax settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // In development, allow access even without session
    if (process.env.NODE_ENV !== "development" && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, rate, type } = body

    const newTaxSetting = {
      id: Date.now().toString(),
      name,
      rate,
      type,
      isActive: true
    }

    return NextResponse.json(newTaxSetting)
  } catch (error) {
    console.error("Error creating tax setting:", error)
    return NextResponse.json(
      { error: "Failed to create tax setting" },
      { status: 500 }
    )
  }
} 
