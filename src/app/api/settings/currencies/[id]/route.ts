import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code, name, symbol, exchangeRate, isDefault, isActive } = body

    // Validate required fields
    if (!code || !name || !symbol) {
      return NextResponse.json(
        { error: "Code, name, and symbol are required" },
        { status: 400 }
      )
    }

    // In a real implementation, you'd update the database
    // For now, return a mock response
    const updatedCurrency = {
      id: params.id,
      code: code.toUpperCase(),
      name,
      symbol,
      exchangeRate: exchangeRate || 1.0,
      isDefault: isDefault || false,
      isActive: isActive !== false,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(updatedCurrency)
  } catch (error) {
    console.error("Error updating currency:", error)
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

    // In a real implementation, you'd delete from the database
    // For now, return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting currency:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 