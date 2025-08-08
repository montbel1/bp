import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { EmailService } from "@/lib/email-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Fetch the invoice with customer details
    const invoice = await prisma.invoice.findFirst({
      where: { 
        id: params.id, 
        userId: user.id 
      },
      include: {
        customer: true,
        items: true
      }
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    if (!invoice.customer.email) {
      return NextResponse.json({ error: "Customer email is required to send invoice" }, { status: 400 })
    }

    // Send the invoice email
    const emailSent = await EmailService.sendInvoice({
      invoiceNumber: invoice.number,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      total: invoice.total,
      dueDate: invoice.dueDate.toLocaleDateString(),
      invoiceUrl: `${process.env.NEXTAUTH_URL}/invoices/${invoice.id}`
    })

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Update invoice status to SENT
    await prisma.invoice.update({
      where: { id: params.id },
      data: { status: 'SENT' }
    })

    return NextResponse.json({ 
      message: "Invoice sent successfully",
      emailSent: true
    })
  } catch (error) {
    console.error("Error sending invoice:", error)
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    )
  }
} 