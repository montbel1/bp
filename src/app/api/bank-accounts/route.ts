import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return mock bank accounts since we don't have a BankAccount model
    // In a real implementation, you'd fetch from the database
    const mockBankAccounts = [
      {
        id: "bank-1",
        name: "Main Business Account",
        accountNumber: "****1234",
        bankName: "Chase Bank",
        balance: 15420.50,
        lastReconciled: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bank-2",
        name: "Savings Account",
        accountNumber: "****5678",
        bankName: "Wells Fargo",
        balance: 25000.00,
        lastReconciled: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "bank-3",
        name: "Credit Card",
        accountNumber: "****9012",
        bankName: "American Express",
        balance: -1250.75,
        lastReconciled: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json(mockBankAccounts)
  } catch (error) {
    console.error("Error fetching bank accounts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, accountNumber, bankName, balance } = body

    // Validate required fields
    if (!name || !bankName) {
      return NextResponse.json(
        { error: "Name and bank name are required" },
        { status: 400 }
      )
    }

    // In a real implementation, you'd save to the database
    // For now, return a mock response
    const newBankAccount = {
      id: `bank-${Date.now()}`,
      name,
      accountNumber: accountNumber || "****" + Math.floor(Math.random() * 10000),
      bankName,
      balance: balance || 0,
      lastReconciled: null
    }

    return NextResponse.json(newBankAccount, { status: 201 })
  } catch (error) {
    console.error("Error creating bank account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
