"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Building2, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  number: string | null
}

interface ReportData {
  assets: Account[]
  liabilities: Account[]
  equity: Account[]
  revenue: Account[]
  expenses: Account[]
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("pl")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    // Set default date range (current month)
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setDateFrom(firstDay.toISOString().split('T')[0])
    setDateTo(lastDay.toISOString().split('T')[0])
    
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      if (!response.ok) {
        throw new Error("Failed to fetch accounts")
      }
      const data = await response.json()
      setAccounts(data)
    } catch (error) {
      setError("Failed to load accounts")
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getReportData = (): ReportData => {
    const data: ReportData = {
      assets: [],
      liabilities: [],
      equity: [],
      revenue: [],
      expenses: []
    }

    accounts.forEach(account => {
      switch (account.type) {
        case 'ASSET':
          data.assets.push(account)
          break
        case 'LIABILITY':
          data.liabilities.push(account)
          break
        case 'EQUITY':
          data.equity.push(account)
          break
        case 'REVENUE':
          data.revenue.push(account)
          break
        case 'EXPENSE':
          data.expenses.push(account)
          break
      }
    })

    return data
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true)
    try {
      const response = await fetch(`/api/reports/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          dateFrom,
          dateTo,
          data: getReportData()
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}-report-${dateFrom}-${dateTo}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("PDF downloaded successfully!")
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast.error("Failed to download PDF")
    } finally {
      setGeneratingPDF(false)
    }
  }

  const calculateTotal = (accounts: Account[]) => {
    return accounts.reduce((sum, account) => sum + account.balance, 0)
  }

  const renderProfitLossReport = () => {
    const data = getReportData()
    const totalRevenue = calculateTotal(data.revenue)
    const totalExpenses = calculateTotal(data.expenses)
    const netIncome = totalRevenue - totalExpenses

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Income</p>
                  <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(netIncome)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenue.length > 0 ? (
              <div className="space-y-3">
                {data.revenue.map((account) => (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.number && (
                        <p className="text-sm text-gray-500">Account #{account.number}</p>
                      )}
                    </div>
                    <p className="font-medium text-green-600">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t-2 border-green-200">
                  <p className="font-bold">Total Revenue</p>
                  <p className="font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No revenue accounts found</p>
            )}
          </CardContent>
        </Card>

        {/* Expenses Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.expenses.length > 0 ? (
              <div className="space-y-3">
                {data.expenses.map((account) => (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.number && (
                        <p className="text-sm text-gray-500">Account #{account.number}</p>
                      )}
                    </div>
                    <p className="font-medium text-red-600">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t-2 border-red-200">
                  <p className="font-bold">Total Expenses</p>
                  <p className="font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No expense accounts found</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderBalanceSheetReport = () => {
    const data = getReportData()
    const totalAssets = calculateTotal(data.assets)
    const totalLiabilities = calculateTotal(data.liabilities)
    const totalEquity = calculateTotal(data.equity)
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAssets)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Equity</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalEquity)}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.assets.length > 0 ? (
              <div className="space-y-3">
                {data.assets.map((account) => (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.number && (
                        <p className="text-sm text-gray-500">Account #{account.number}</p>
                      )}
                    </div>
                    <p className="font-medium text-green-600">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t-2 border-green-200">
                  <p className="font-bold">Total Assets</p>
                  <p className="font-bold text-green-600">{formatCurrency(totalAssets)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No asset accounts found</p>
            )}
          </CardContent>
        </Card>

        {/* Liabilities Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.liabilities.length > 0 ? (
              <div className="space-y-3">
                {data.liabilities.map((account) => (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.number && (
                        <p className="text-sm text-gray-500">Account #{account.number}</p>
                      )}
                    </div>
                    <p className="font-medium text-red-600">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t-2 border-red-200">
                  <p className="font-bold">Total Liabilities</p>
                  <p className="font-bold text-red-600">{formatCurrency(totalLiabilities)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No liability accounts found</p>
            )}
          </CardContent>
        </Card>

        {/* Equity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Equity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.equity.length > 0 ? (
              <div className="space-y-3">
                {data.equity.map((account) => (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      {account.number && (
                        <p className="text-sm text-gray-500">Account #{account.number}</p>
                      )}
                    </div>
                    <p className="font-medium text-blue-600">{formatCurrency(account.balance)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t-2 border-blue-200">
                  <p className="font-bold">Total Equity</p>
                  <p className="font-bold text-blue-600">{formatCurrency(totalEquity)}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No equity accounts found</p>
            )}
          </CardContent>
        </Card>

        {/* Balance Check */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Balance Check</p>
              <p className={`text-lg font-bold ${totalAssets === totalLiabilitiesAndEquity ? 'text-green-600' : 'text-red-600'}`}>
                {totalAssets === totalLiabilitiesAndEquity ? '✓ Balanced' : '✗ Not Balanced'}
              </p>
              <p className="text-sm text-gray-500">
                Assets: {formatCurrency(totalAssets)} = Liabilities: {formatCurrency(totalLiabilities)} + Equity: {formatCurrency(totalEquity)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading reports...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAccounts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600">View your business financial performance</p>
          </div>
          <Button 
            onClick={handleDownloadPDF} 
            disabled={generatingPDF}
            className="flex items-center gap-2"
          >
            {generatingPDF ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {generatingPDF ? "Generating..." : "Export Report"}
          </Button>
        </div>

        {/* Report Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pl">Profit & Loss</SelectItem>
                    <SelectItem value="bs">Balance Sheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button className="w-full flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Update Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {reportType === "pl" ? renderProfitLossReport() : renderBalanceSheetReport()}
      </div>
    </div>
  )
} 