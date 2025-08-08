"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Bitcoin, 
  Coins, 
  Wallet, 
  Send, 
  Download,
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
  Globe,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Hash,
  Link,
  Shield
} from "lucide-react"

interface BlockchainTransaction {
  id: string
  txHash: string
  blockchain: 'ETHEREUM' | 'BITCOIN' | 'POLYGON' | 'BINANCE_SMART_CHAIN' | 'SOLANA' | 'CARDANO' | 'OTHER'
  fromAddress: string
  toAddress: string
  amount: number
  currency: string
  gasFee: number | null
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED'
  blockNumber: number | null
  confirmedAt: string | null
  smartContractAddress: string | null
  createdAt: string
}

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  blockchain: string
  decimals: number
  isActive: boolean
  currentPrice: number | null
  marketCap: number | null
  volume24h: number | null
  lastUpdated: string | null
}

interface SmartContract {
  id: string
  name: string
  address: string
  blockchain: string
  type: 'PAYMENT' | 'INVOICE' | 'ESCROW' | 'TOKEN' | 'NFT' | 'GOVERNANCE' | 'OTHER'
  abi: string
  bytecode: string | null
  isVerified: boolean
  isActive: boolean
}

interface Wallet {
  id: string
  address: string
  blockchain: string
  balance: number
  currency: string
  isActive: boolean
  lastSync: string | null
}

export default function BlockchainPage() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([])
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [selectedBlockchain, setSelectedBlockchain] = useState("ETHEREUM")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchBlockchainData()
  }, [])

  const fetchBlockchainData = async () => {
    try {
      const [transactionsRes, cryptocurrenciesRes, contractsRes, walletsRes] = await Promise.all([
        fetch("/api/blockchain/transactions"),
        fetch("/api/blockchain/cryptocurrencies"),
        fetch("/api/blockchain/smart-contracts"),
        fetch("/api/blockchain/wallets")
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

      if (cryptocurrenciesRes.ok) {
        const cryptocurrenciesData = await cryptocurrenciesRes.json()
        setCryptocurrencies(cryptocurrenciesData)
      }

      if (contractsRes.ok) {
        const contractsData = await contractsRes.json()
        setSmartContracts(contractsData)
      }

      if (walletsRes.ok) {
        const walletsData = await walletsRes.json()
        setWallets(walletsData)
      }
    } catch (error) {
      console.error("Error fetching blockchain data:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendTransaction = async () => {
    setSending(true)
    try {
      const response = await fetch("/api/blockchain/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockchain: selectedBlockchain,
          toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          amount: 0.1,
          currency: "ETH"
        }),
      })

      if (response.ok) {
        await fetchBlockchainData()
      }
    } catch (error) {
      console.error("Error sending transaction:", error)
    } finally {
      setSending(false)
    }
  }

  const deploySmartContract = async () => {
    try {
      const response = await fetch("/api/blockchain/smart-contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Payment Contract",
          blockchain: selectedBlockchain,
          type: "PAYMENT",
          abi: "[]",
          bytecode: "0x"
        }),
      })

      if (response.ok) {
        await fetchBlockchainData()
      }
    } catch (error) {
      console.error("Error deploying smart contract:", error)
    }
  }

  const syncWallet = async (walletId: string) => {
    try {
      const response = await fetch(`/api/blockchain/wallets/${walletId}/sync`, {
        method: "POST",
      })

      if (response.ok) {
        await fetchBlockchainData()
      }
    } catch (error) {
      console.error("Error syncing wallet:", error)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    return filterStatus === "all" || transaction.status === filterStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain) {
      case 'ETHEREUM':
        return <Globe className="h-5 w-5 text-blue-600" />
      case 'BITCOIN':
        return <Bitcoin className="h-5 w-5 text-orange-600" />
      case 'POLYGON':
        return <Globe className="h-5 w-5 text-purple-600" />
      case 'BINANCE_SMART_CHAIN':
        return <Coins className="h-5 w-5 text-yellow-600" />
      case 'SOLANA':
        return <Zap className="h-5 w-5 text-green-600" />
      case 'CARDANO':
        return <Shield className="h-5 w-5 text-blue-500" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="default">Confirmed</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <Send className="h-4 w-4" />
      case 'INVOICE':
        return <Hash className="h-4 w-4" />
      case 'ESCROW':
        return <Lock className="h-4 w-4" />
      case 'TOKEN':
        return <Coins className="h-4 w-4" />
      case 'NFT':
        return <Link className="h-4 w-4" />
      case 'GOVERNANCE':
        return <Shield className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading blockchain data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blockchain Integration</h1>
          <p className="text-gray-600">Cryptocurrency payments, smart contracts, and DeFi features</p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-4">Send Transaction</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-500">Blockchain</Label>
                    <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                        <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                        <SelectItem value="POLYGON">Polygon</SelectItem>
                        <SelectItem value="BINANCE_SMART_CHAIN">Binance Smart Chain</SelectItem>
                        <SelectItem value="SOLANA">Solana</SelectItem>
                        <SelectItem value="CARDANO">Cardano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={sendTransaction} disabled={sending} className="w-full">
                    {sending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Transaction
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Deploy Smart Contract</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-500">Contract Type</Label>
                    <Select defaultValue="PAYMENT">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAYMENT">Payment</SelectItem>
                        <SelectItem value="INVOICE">Invoice</SelectItem>
                        <SelectItem value="ESCROW">Escrow</SelectItem>
                        <SelectItem value="TOKEN">Token</SelectItem>
                        <SelectItem value="NFT">NFT</SelectItem>
                        <SelectItem value="GOVERNANCE">Governance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={deploySmartContract} className="w-full">
                    <Link className="h-4 w-4 mr-2" />
                    Deploy Contract
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Wallet Management</h4>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    {wallets.length} wallets connected
                  </div>
                  <Button variant="outline" className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    Add Wallet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Bitcoin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.status === 'CONFIRMED').length} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions
                    .filter(t => t.status === 'CONFIRMED')
                    .reduce((sum, t) => sum + t.amount, 0),
                  'USD'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{smartContracts.length}</div>
              <p className="text-xs text-muted-foreground">
                {smartContracts.filter(c => c.isVerified).length} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cryptocurrencies</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cryptocurrencies.length}</div>
              <p className="text-xs text-muted-foreground">
                Supported currencies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cryptocurrency Prices */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cryptocurrency Prices</CardTitle>
            <CardDescription>Real-time cryptocurrency market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cryptocurrencies.slice(0, 6).map((crypto) => (
                <div key={crypto.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getBlockchainIcon(crypto.blockchain)}
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol}</div>
                      </div>
                    </div>
                    <Badge variant={crypto.isActive ? "default" : "secondary"}>
                      {crypto.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {crypto.currentPrice && (
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">
                          {formatCurrency(crypto.currentPrice, 'USD')}
                        </span>
                      </div>
                    )}
                    {crypto.marketCap && (
                      <div className="flex justify-between text-sm">
                        <span>Market Cap:</span>
                        <span className="text-gray-500">
                          {formatCurrency(crypto.marketCap, 'USD')}
                        </span>
                      </div>
                    )}
                    {crypto.volume24h && (
                      <div className="flex justify-between text-sm">
                        <span>24h Volume:</span>
                        <span className="text-gray-500">
                          {formatCurrency(crypto.volume24h, 'USD')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallets */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected Wallets</CardTitle>
            <CardDescription>Your blockchain wallets and balances</CardDescription>
          </CardHeader>
          <CardContent>
            {wallets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getBlockchainIcon(wallet.blockchain)}
                        <div>
                          <div className="font-medium">{wallet.blockchain}</div>
                          <div className="text-sm text-gray-500 font-mono">
                            {wallet.address.substring(0, 8)}...{wallet.address.substring(-6)}
                          </div>
                        </div>
                      </div>
                      <Badge variant={wallet.isActive ? "default" : "secondary"}>
                        {wallet.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Balance:</span>
                        <span className="font-medium">
                          {formatCurrency(wallet.balance, wallet.currency)}
                        </span>
                      </div>
                      {wallet.lastSync && (
                        <div className="flex justify-between text-sm">
                          <span>Last Sync:</span>
                          <span className="text-gray-500">
                            {formatDate(wallet.lastSync)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => syncWallet(wallet.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Wallet
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets connected</h3>
                <p className="text-gray-500">
                  Connect your blockchain wallets to start making transactions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Contracts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Smart Contracts</CardTitle>
            <CardDescription>Deployed smart contracts and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {smartContracts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smartContracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getContractTypeIcon(contract.type)}
                        <div>
                          <div className="font-medium">{contract.name}</div>
                          <div className="text-sm text-gray-500">{contract.type}</div>
                        </div>
                      </div>
                      <Badge variant={contract.isActive ? "default" : "secondary"}>
                        {contract.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Blockchain:</span>
                        <span className="text-gray-500">{contract.blockchain}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Address:</span>
                        <span className="text-gray-500 font-mono text-xs">
                          {contract.address.substring(0, 8)}...{contract.address.substring(-6)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Verified:</span>
                        <Badge variant={contract.isVerified ? "default" : "outline"}>
                          {contract.isVerified ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No smart contracts</h3>
                <p className="text-gray-500">
                  Deploy your first smart contract to enable automated transactions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blockchain</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getBlockchainIcon(transaction.blockchain)}
                          <span className="text-sm">{transaction.blockchain}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {transaction.txHash.substring(0, 8)}...{transaction.txHash.substring(-6)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {transaction.fromAddress.substring(0, 8)}...{transaction.fromAddress.substring(-6)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {transaction.toAddress.substring(0, 8)}...{transaction.toAddress.substring(-6)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                        {transaction.gasFee && (
                          <div className="text-sm text-gray-500">
                            Gas: {formatCurrency(transaction.gasFee, transaction.currency)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Bitcoin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {transactions.length === 0 
                    ? "Blockchain transactions will appear here when you make payments." 
                    : "Try adjusting your filter criteria."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 