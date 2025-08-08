import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data for smart contracts
const mockSmartContracts = [
  {
    id: "1",
    name: "Payment Processor",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8ba",
    blockchain: "ETHEREUM",
    type: "PAYMENT",
    abi: "[]",
    bytecode: "0x",
    isVerified: true,
    isActive: true
  },
  {
    id: "2",
    name: "Invoice Escrow",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8bb",
    blockchain: "POLYGON",
    type: "ESCROW",
    abi: "[]",
    bytecode: "0x",
    isVerified: false,
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(mockSmartContracts)
  } catch (error) {
    console.error("Error fetching smart contracts:", error)
    return NextResponse.json(
      { error: "Failed to fetch smart contracts" },
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
    const { name, blockchain, type, abi, bytecode } = body

    // Mock contract creation
    const newContract = {
      id: Date.now().toString(),
      name,
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      blockchain,
      type,
      abi: abi || "[]",
      bytecode: bytecode || "0x",
      isVerified: false,
      isActive: true
    }

    return NextResponse.json(newContract)
  } catch (error) {
    console.error("Error creating smart contract:", error)
    return NextResponse.json(
      { error: "Failed to create smart contract" },
      { status: 500 }
    )
  }
} 
