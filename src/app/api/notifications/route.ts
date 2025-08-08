import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for notifications
const mockNotifications = [
  {
    id: "1",
    title: "Invoice Overdue",
    message: "Invoice #INV-001 is 5 days overdue",
    type: "WARNING",
    isRead: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Payment Received",
    message: "Payment of $1,500 received from ABC Company",
    type: "SUCCESS",
    isRead: true,
    createdAt: "2024-01-14T15:30:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockNotifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
} 
