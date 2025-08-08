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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        customer: {
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

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { customerId, date, dueDate, items, notes, tax, status } = body

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Validation
    if (!customerId) {
      return NextResponse.json({ error: "Customer is required" }, { status: 400 })
    }

    if (!date || !dueDate) {
      return NextResponse.json({ error: "Invoice date and due date are required" }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 })
    }

    // Validate items
    for (const item of items) {
      if (!item.description || item.quantity <= 0 || item.unitPrice <= 0) {
        return NextResponse.json({ error: "All items must have description, quantity, and unit price" }, { status: 400 })
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0)
    const total = subtotal + (tax || 0)

    // Update invoice and items
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        date: new Date(date),
        dueDate: new Date(dueDate),
        subtotal,
        tax: tax || 0,
        total,
        notes: notes || null,
        status: status || existingInvoice.status,
        customerId,
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
        customer: {
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

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Delete invoice (items will be deleted automatically due to cascade)
    await prisma.invoice.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 })
  }
} 