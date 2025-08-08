import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const account = await prisma.chartAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error fetching account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, number, description, isActive } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.chartAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    // Check if account number already exists (if provided and different from current)
    if (number && number !== existingAccount.number) {
      const duplicateAccount = await prisma.chartAccount.findUnique({
        where: { number }
      })
      if (duplicateAccount) {
        return NextResponse.json(
          { error: "Account number already exists" },
          { status: 400 }
        )
      }
    }

    // Update the account
    const updatedAccount = await prisma.chartAccount.update({
      where: { id: params.id },
      data: {
        name,
        type,
        number: number || null,
        description: description || null,
        isActive: isActive ?? true
      }
    })

    console.log("Account updated successfully:", updatedAccount)
    return NextResponse.json(updatedAccount)
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if account exists and belongs to user
    const account = await prisma.chartAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    // Check if account has transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        accountId: params.id
      }
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete account that has transactions. Please delete all transactions first." },
        { status: 400 }
      )
    }

    // Delete the account
    await prisma.chartAccount.delete({
      where: { id: params.id }
    })

    console.log("Account deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 