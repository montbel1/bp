import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return default currencies since we don't have a Currency model
    // In a real implementation, you'd fetch from the database
    const defaultCurrencies = [
      { id: "usd", code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0, isDefault: true, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "eur", code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "gbp", code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "cad", code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.25, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "aud", code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.35, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "jpy", code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.0, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "chf", code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', exchangeRate: 0.92, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() },
      { id: "cny", code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchangeRate: 6.45, isDefault: false, isActive: true, lastUpdated: new Date().toISOString() }
    ]

    return NextResponse.json(defaultCurrencies)
  } catch (error) {
    console.error("Error fetching currencies:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // In a real implementation, you'd save to the database
    // For now, return a mock response
    const newCurrency = {
      id: `currency-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      symbol,
      exchangeRate: exchangeRate || 1.0,
      isDefault: isDefault || false,
      isActive: isActive !== false,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(newCurrency, { status: 201 })
  } catch (error) {
    console.error("Error creating currency:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
