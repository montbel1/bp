import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, you'd fetch from the database
    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching bank transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { date, description, amount, type, reference, checkNumber, notes } = body

    if (!date || !description || !amount || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const bankTransaction = await prisma.bankTransaction.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        type,
        reference: reference || "",
        checkNumber: checkNumber || "",
        notes: notes || "",
        bankAccountId: params.id,
        userId: user.id
      },
      include: {
        matchedTransaction: true
      }
    })

    return NextResponse.json(bankTransaction, { status: 201 })
  } catch (error) {
    console.error("Error creating bank transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 