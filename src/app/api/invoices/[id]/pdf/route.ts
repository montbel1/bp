import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { PDFService } from "@/lib/pdf-service"

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

    // Fetch the invoice with customer and items
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

    // Company information (in a real app, this would come from user settings)
    const companyInfo = {
      name: user.name || "Your Company",
      address: "123 Business Street, City, State 12345",
      phone: "(555) 123-4567",
      email: user.email || "contact@yourcompany.com",
      website: "www.yourcompany.com"
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateInvoicePDF({
      invoice,
      companyInfo
    })

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.number}.pdf"`
      }
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
} 