import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for recurring bills
const mockRecurringBills = [
  {
    id: "1",
    vendorName: "Office Supplies Co",
    description: "Monthly Office Supplies",
    amount: 150,
    frequency: "MONTHLY",
    nextDueDate: "2024-02-01",
    isActive: true
  },
  {
    id: "2",
    vendorName: "Internet Provider",
    description: "Monthly Internet Service",
    amount: 89,
    frequency: "MONTHLY",
    nextDueDate: "2024-02-01",
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockRecurringBills)
  } catch (error) {
    console.error("Error fetching recurring bills:", error)
    return NextResponse.json(
      { error: "Failed to fetch recurring bills" },
      { status: 500 }
    )
  }
} 
