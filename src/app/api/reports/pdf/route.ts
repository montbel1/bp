import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PDFService } from "@/lib/pdf-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { reportType, dateFrom, dateTo, data } = body

    if (!reportType || !dateFrom || !dateTo || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Determine report type and title
    let type: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'custom'
    let title: string

    switch (reportType) {
      case 'pl':
        type = 'profit-loss'
        title = 'Profit & Loss Statement'
        break
      case 'bs':
        type = 'balance-sheet'
        title = 'Balance Sheet'
        break
      case 'cf':
        type = 'cash-flow'
        title = 'Cash Flow Statement'
        break
      default:
        type = 'custom'
        title = 'Financial Report'
    }

    // Generate PDF
    const pdfBuffer = await PDFService.generateReportPDF({
      title,
      data,
      type,
      dateRange: {
        from: dateFrom,
        to: dateTo
      }
    })

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}-report-${dateFrom}-${dateTo}.pdf"`
      }
    })
  } catch (error) {
    console.error("Error generating report PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
} 
