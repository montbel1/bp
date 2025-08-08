import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for IoT devices
const mockIoTDevices = [
  {
    id: "1",
    name: "Smart POS Terminal",
    type: "POS_TERMINAL",
    isActive: true,
    lastSync: "2024-01-15T12:00:00Z"
  },
  {
    id: "2",
    name: "Inventory Scanner",
    type: "SCANNER",
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

    return NextResponse.json(mockIoTDevices)
  } catch (error) {
    console.error("Error fetching IoT devices:", error)
    return NextResponse.json(
      { error: "Failed to fetch IoT devices" },
      { status: 500 }
    )
  }
} 
