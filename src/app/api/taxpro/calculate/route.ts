import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { taxCalculationService } from "@/lib/tax-calculation-service"
import { TaxFormData } from "@/types/tax"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const taxData: TaxFormData = body

    // Validate required fields
    if (!taxData.income || !taxData.filingStatus || !taxData.taxYear) {
      return NextResponse.json(
        { error: "Missing required fields: income, filingStatus, taxYear" },
        { status: 400 }
      )
    }

    // Calculate tax using the service
    const calculation = await taxCalculationService.calculateTax(taxData)

    // Validate deductions if provided
    let validationResult = null
    if (taxData.deductions && taxData.deductions.length > 0) {
      validationResult = await taxCalculationService.validateDeductions(taxData.deductions)
    }

    return NextResponse.json({
      calculation,
      validation: validationResult,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error calculating tax:", error)
    return NextResponse.json(
      { error: "Failed to calculate tax" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current year tax rates
    const rates = await taxCalculationService.getCurrentYearRates()

    return NextResponse.json({
      rates,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error fetching tax rates:", error)
    return NextResponse.json(
      { error: "Failed to fetch tax rates" },
      { status: 500 }
    )
  }
} 
