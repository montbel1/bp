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

    const customer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: true
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Calculate financial metrics
    const totalInvoiced = customer.invoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const totalPaid = customer.invoices
      .filter(invoice => invoice.status === 'PAID')
      .reduce((sum, invoice) => sum + invoice.total, 0)
    const balance = totalInvoiced - totalPaid

    const customerWithMetrics = {
      ...customer,
      totalInvoiced,
      totalPaid,
      balance,
      status: customer.isActive ? 'ACTIVE' : 'INACTIVE'
    }

    return NextResponse.json(customerWithMetrics)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    )
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

    const body = await request.json()
    const { name, email, phone, address, city, state, zipCode, country, status } = body

    // Check if customer exists and belongs to user
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Check if email is being changed and if it conflicts with another customer
    if (email && email !== existingCustomer.email) {
      const emailConflict = await prisma.customer.findFirst({
        where: {
          userId: session.user.id,
          email: email.toLowerCase(),
          id: { not: params.id }
        }
      })

      if (emailConflict) {
        return NextResponse.json(
          { error: "A customer with this email already exists" },
          { status: 400 }
        )
      }
    }

    // Update customer
    const updatedCustomer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name: name?.trim(),
        email: email?.toLowerCase().trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null,
        country: country?.trim() || null,
        isActive: status !== 'INACTIVE'
      }
    })

    return NextResponse.json(updatedCustomer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    )
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

    // Check if customer exists and belongs to user
    const customer = await prisma.customer.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        invoices: true
      }
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Check if customer has invoices
    if (customer.invoices.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete customer with existing invoices" },
        { status: 400 }
      )
    }

    // Delete customer
    await prisma.customer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    )
  }
} 