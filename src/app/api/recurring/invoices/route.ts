import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for recurring invoices
const mockRecurringInvoices = [
  {
    id: "1",
    customerName: "ABC Company",
    description: "Monthly Consulting Services",
    amount: 2500,
    frequency: "MONTHLY",
    nextDueDate: "2024-02-01",
    isActive: true
  },
  {
    id: "2",
    customerName: "XYZ Corp",
    description: "Quarterly Maintenance",
    amount: 1200,
    frequency: "QUARTERLY", 
    nextDueDate: "2024-04-01",
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockRecurringInvoices)
  } catch (error) {
    console.error("Error fetching recurring invoices:", error)
    return NextResponse.json(
      { error: "Failed to fetch recurring invoices" },
      { status: 500 }
    )
  }
} 
