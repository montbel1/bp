import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for recurring transactions
const mockRecurringTransactions = [
  {
    id: "1",
    description: "Monthly Rent Payment",
    amount: 1500,
    frequency: "MONTHLY",
    nextDueDate: "2024-02-01",
    isActive: true,
    category: "Rent"
  },
  {
    id: "2", 
    description: "Quarterly Insurance",
    amount: 450,
    frequency: "QUARTERLY",
    nextDueDate: "2024-04-01",
    isActive: true,
    category: "Insurance"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockRecurringTransactions)
  } catch (error) {
    console.error("Error fetching recurring transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch recurring transactions" },
      { status: 500 }
    )
  }
} 
