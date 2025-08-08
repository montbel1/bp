"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square
} from "lucide-react"

interface BankAccount {
  id: string
  name: string
  accountNumber: string
  bankName: string
  balance: number
  lastReconciled: string | null
}

interface BankTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  reference: string
  checkNumber: string
  isReconciled: boolean
  isMatched: boolean
  matchedTransactionId: string | null
  notes: string
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  reference: string
  isReconciled: boolean
}

export default function BankReconciliationPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchBankAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchBankTransactions()
      fetchTransactions()
    }
  }, [selectedAccount])

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch("/api/bank-accounts")
      if (response.ok) {
        const data = await response.json()
        setBankAccounts(data)
        if (data.length > 0) {
          setSelectedAccount(data[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching bank accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBankTransactions = async () => {
    try {
      const response = await fetch(`/api/bank-accounts/${selectedAccount}/transactions`)
      if (response.ok) {
        const data = await response.json()
        setBankTransactions(data)
      }
    } catch (error) {
      console.error("Error fetching bank transactions:", error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/accounts/${selectedAccount}/transactions`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bankAccountId', selectedAccount)

    try {
      const response = await fetch('/api/bank-accounts/import', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        await fetchBankTransactions()
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleMatchTransaction = async (bankTransactionId: string, transactionId: string) => {
    try {
      const response = await fetch(`/api/bank-accounts/transactions/${bankTransactionId}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      })

      if (response.ok) {
        await fetchBankTransactions()
      }
    } catch (error) {
      console.error("Error matching transaction:", error)
    }
  }

  const handleReconcileTransaction = async (bankTransactionId: string) => {
    try {
      const response = await fetch(`/api/bank-accounts/transactions/${bankTransactionId}/reconcile`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchBankTransactions()
      }
    } catch (error) {
      console.error("Error reconciling transaction:", error)
    }
  }

  const filteredBankTransactions = bankTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "unreconciled" && !transaction.isReconciled) ||
                         (filterStatus === "unmatched" && !transaction.isMatched)
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading bank reconciliation...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Reconciliation</h1>
          <p className="text-gray-600">Match and reconcile your bank transactions</p>
        </div>

        {/* Account Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Bank Account</CardTitle>
            <CardDescription>Choose the account you want to reconcile</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - {account.bankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedAccount && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(bankAccounts.find(a => a.id === selectedAccount)?.balance || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bankTransactions.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reconciled</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {bankTransactions.filter(t => t.isReconciled).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unmatched</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {bankTransactions.filter(t => !t.isMatched).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Import Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Import Bank Statement</CardTitle>
                <CardDescription>Upload CSV, OFX, or QIF files from your bank</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="file-upload">Choose file</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.ofx,.qif"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </div>
                  <Button disabled={uploading}>
                    {uploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="unreconciled">Unreconciled</SelectItem>
                        <SelectItem value="unmatched">Unmatched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Bank Transactions</CardTitle>
                <CardDescription>
                  {filteredBankTransactions.length} of {bankTransactions.length} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredBankTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Match</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBankTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {formatDate(transaction.date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              {transaction.checkNumber && (
                                <div className="text-sm text-gray-500">
                                  Check: {transaction.checkNumber}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {transaction.isReconciled ? (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Reconciled
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Unreconciled
                                </Badge>
                              )}
                              {transaction.isMatched && (
                                <Badge variant="outline">
                                  <CheckSquare className="h-3 w-3 mr-1" />
                                  Matched
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {!transaction.isMatched && (
                              <Select onValueChange={(value) => handleMatchTransaction(transaction.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Match" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transactions
                                    .filter(t => !t.isReconciled && Math.abs(t.amount - transaction.amount) < 0.01)
                                    .map((t) => (
                                      <SelectItem key={t.id} value={t.id}>
                                        {t.description} ({formatCurrency(t.amount)})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {!transaction.isReconciled && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReconcileTransaction(transaction.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-500">
                      Upload a bank statement to get started with reconciliation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 