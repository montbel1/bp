import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for wallets
const mockWallets = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    blockchain: "ETHEREUM",
    balance: 2.5,
    currency: "ETH",
    isActive: true,
    lastSync: "2024-01-15T12:00:00Z"
  },
  {
    id: "2",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    blockchain: "BITCOIN",
    balance: 0.05,
    currency: "BTC",
    isActive: true,
    lastSync: "2024-01-15T11:30:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockWallets)
  } catch (error) {
    console.error("Error fetching wallets:", error)
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
      { status: 500 }
    )
  }
} 
