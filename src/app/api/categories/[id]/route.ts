import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, description, isActive } = body

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Validate type
    if (!["INCOME", "EXPENSE"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be either INCOME or EXPENSE" },
        { status: 400 }
      )
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if name already exists for this user (excluding current category)
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        type,
        userId: session.user.id,
        id: { not: params.id }
      }
    })

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Category with this name and type already exists" },
        { status: 400 }
      )
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        type,
        description: description || null,
        isActive: isActive ?? true
      }
    })

    console.log("Category updated successfully:", updatedCategory)
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
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

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if category is being used in transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        categoryId: params.id
      }
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is being used in transactions" },
        { status: 400 }
      )
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: params.id }
    })

    console.log("Category deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 