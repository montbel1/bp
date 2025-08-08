import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for blockchain transactions
const mockTransactions = [
  {
    id: "1",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockchain: "ETHEREUM",
    fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
    amount: 0.5,
    currency: "ETH",
    gasFee: 0.002,
    status: "CONFIRMED",
    blockNumber: 12345678,
    confirmedAt: "2024-01-15T10:30:00Z",
    smartContractAddress: null,
    createdAt: "2024-01-15T10:25:00Z"
  },
  {
    id: "2",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockchain: "BITCOIN",
    fromAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    toAddress: "1B1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb",
    amount: 0.1,
    currency: "BTC",
    gasFee: null,
    status: "PENDING",
    blockNumber: null,
    confirmedAt: null,
    smartContractAddress: null,
    createdAt: "2024-01-15T09:15:00Z"
  },
  {
    id: "3",
    txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    blockchain: "POLYGON",
    fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8",
    toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9",
    amount: 100,
    currency: "MATIC",
    gasFee: 0.001,
    status: "CONFIRMED",
    blockNumber: 98765432,
    confirmedAt: "2024-01-14T16:45:00Z",
    smartContractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8ba",
    createdAt: "2024-01-14T16:40:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockTransactions)
  } catch (error) {
    console.error("Error fetching blockchain transactions:", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
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
    const { blockchain, toAddress, amount, currency } = body

    // Mock transaction creation
    const newTransaction = {
      id: Date.now().toString(),
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockchain,
      fromAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      toAddress,
      amount,
      currency,
      gasFee: blockchain === "ETHEREUM" ? 0.002 : null,
      status: "PENDING",
      blockNumber: null,
      confirmedAt: null,
      smartContractAddress: null,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newTransaction)
  } catch (error) {
    console.error("Error creating blockchain transaction:", error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
} 
