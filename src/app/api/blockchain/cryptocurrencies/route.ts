import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for cryptocurrencies
const mockCryptocurrencies = [
  {
    id: "1",
    symbol: "BTC",
    name: "Bitcoin",
    blockchain: "BITCOIN",
    decimals: 8,
    isActive: true,
    currentPrice: 45000,
    marketCap: 850000000000,
    volume24h: 25000000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    blockchain: "ETHEREUM",
    decimals: 18,
    isActive: true,
    currentPrice: 2800,
    marketCap: 350000000000,
    volume24h: 15000000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "3",
    symbol: "MATIC",
    name: "Polygon",
    blockchain: "POLYGON",
    decimals: 18,
    isActive: true,
    currentPrice: 0.85,
    marketCap: 8500000000,
    volume24h: 500000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "4",
    symbol: "BNB",
    name: "Binance Coin",
    blockchain: "BINANCE_SMART_CHAIN",
    decimals: 18,
    isActive: true,
    currentPrice: 320,
    marketCap: 48000000000,
    volume24h: 2000000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "5",
    symbol: "SOL",
    name: "Solana",
    blockchain: "SOLANA",
    decimals: 9,
    isActive: true,
    currentPrice: 95,
    marketCap: 42000000000,
    volume24h: 1800000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    id: "6",
    symbol: "ADA",
    name: "Cardano",
    blockchain: "CARDANO",
    decimals: 6,
    isActive: true,
    currentPrice: 0.45,
    marketCap: 16000000000,
    volume24h: 800000000,
    lastUpdated: "2024-01-15T12:00:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockCryptocurrencies)
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error)
    return NextResponse.json(
      { error: "Failed to fetch cryptocurrencies" },
      { status: 500 }
    )
  }
} 
