import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for mobile devices
const mockMobileDevices = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    type: "SMARTPHONE",
    isActive: true,
    lastSync: "2024-01-15T12:00:00Z"
  },
  {
    id: "2",
    name: "iPad Pro",
    type: "TABLET",
    isActive: true,
    lastSync: "2024-01-15T11:30:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockMobileDevices)
  } catch (error) {
    console.error("Error fetching mobile devices:", error)
    return NextResponse.json(
      { error: "Failed to fetch mobile devices" },
      { status: 500 }
    )
  }
} 
