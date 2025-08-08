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

    const vendor = await prisma.vendor.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      },
      include: {
        bills: {
          select: {
            id: true,
            number: true,
            date: true,
            dueDate: true,
            status: true,
            total: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    return NextResponse.json(vendor)
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor" },
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
    const { name, email, phone, address, city, state, zipCode, country, status } = body

    // Check if vendor exists and belongs to user
    const existingVendor = await prisma.vendor.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      }
    })

    if (!existingVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Check if name is being changed and if it conflicts with another vendor
    if (name && name !== existingVendor.name) {
      const nameConflict = await prisma.vendor.findFirst({
        where: {
          userId: user.id,
          name: name.trim(),
          id: { not: params.id }
        }
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: "A vendor with this name already exists" },
          { status: 400 }
        )
      }
    }

    // Update vendor
    const updatedVendor = await prisma.vendor.update({
      where: { id: params.id },
      data: {
        name: name?.trim() || existingVendor.name,
        email: email?.toLowerCase().trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null,
        country: country?.trim() || existingVendor.country,
        isActive: status !== 'INACTIVE'
      }
    })

    return NextResponse.json(updatedVendor)
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json(
      { error: "Failed to update vendor" },
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

    // Check if vendor exists and belongs to user
    const vendor = await prisma.vendor.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      },
      include: {
        bills: {
          select: { id: true }
        }
      }
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Check if vendor has associated bills
    if (vendor.bills.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete vendor with associated bills" },
        { status: 400 }
      )
    }

    // Delete vendor
    await prisma.vendor.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Vendor deleted successfully" })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json(
      { error: "Failed to delete vendor" },
      { status: 500 }
    )
  }
} 