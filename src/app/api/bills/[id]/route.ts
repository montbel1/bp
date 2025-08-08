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

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: session.user.id, 
          email: session.user.email || 'dev@example.com', 
          name: session.user.name || 'Development User', 
          role: 'USER', 
          subscription: 'BASIC', 
          flowAccess: true 
        } 
      })
    }

    const bill = await prisma.bill.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true
          }
        },
        items: true
      }
    })

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json(
      { error: "Failed to fetch bill" },
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

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: session.user.id, 
          email: session.user.email || 'dev@example.com', 
          name: session.user.name || 'Development User', 
          role: 'USER', 
          subscription: 'BASIC', 
          flowAccess: true 
        } 
      })
    }

    const body = await request.json()
    const { vendorId, date, dueDate, items, notes, tax, status } = body

    // Check if bill exists and belongs to user
    const existingBill = await prisma.bill.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      }
    })

    if (!existingBill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Validate required fields
    if (!vendorId || !date || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Vendor, dates, and at least one item are required" },
        { status: 400 }
      )
    }

    // Check if vendor exists and belongs to user
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: user.id
      }
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Validate items
    for (const item of items) {
      if (!item.description || item.quantity <= 0 || item.unitPrice <= 0) {
        return NextResponse.json(
          { error: "All items must have description, quantity, and unit price" },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = tax || 0
    const total = subtotal + taxAmount

    // Update bill with items
    const updatedBill = await prisma.bill.update({
      where: { id: params.id },
      data: {
        vendorId,
        date: new Date(date),
        dueDate: new Date(dueDate),
        status: status || existingBill.status,
        subtotal,
        tax: taxAmount,
        total,
        notes: notes?.trim() || null,
        items: {
          deleteMany: {},
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: true
      }
    })

    return NextResponse.json(updatedBill)
  } catch (error) {
    console.error("Error updating bill:", error)
    return NextResponse.json(
      { error: "Failed to update bill" },
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

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      user = await prisma.user.create({ 
        data: { 
          id: session.user.id, 
          email: session.user.email || 'dev@example.com', 
          name: session.user.name || 'Development User', 
          role: 'USER', 
          subscription: 'BASIC', 
          flowAccess: true 
        } 
      })
    }

    // Check if bill exists and belongs to user
    const bill = await prisma.bill.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      }
    })

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Delete bill (items will be deleted automatically due to cascade)
    await prisma.bill.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Bill deleted successfully" })
  } catch (error) {
    console.error("Error deleting bill:", error)
    return NextResponse.json(
      { error: "Failed to delete bill" },
      { status: 500 }
    )
  }
} 