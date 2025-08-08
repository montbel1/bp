"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Eye
} from "lucide-react"

interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  cashFlow: number
  accountsReceivable: number
  accountsPayable: number
  workingCapital: number
  currentRatio: number
  quickRatio: number
  debtToEquity: number
  returnOnAssets: number
  returnOnEquity: number
  monthlyGrowth: number
  yearOverYearGrowth: number
}

interface MonthlyData {
  month: string
  revenue: number
  expenses: number
  profit: number
  cashFlow: number
}

export default function AdvancedReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("12")
  const [selectedReport, setSelectedReport] = useState("overview")
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdvancedReports()
  }, [selectedPeriod])

  const fetchAdvancedReports = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports/advanced?period=${selectedPeriod}`)
      if (!response.ok) {
        throw new Error("Failed to fetch advanced reports")
      }
      const data = await response.json()
      setMetrics(data.metrics)
      setMonthlyData(data.monthlyData)
    } catch (error) {
      console.error("Error fetching advanced reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading advanced reports...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reports</h1>
          <p className="text-gray-600">Comprehensive financial analytics and business insights</p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 Months</SelectItem>
                <SelectItem value="6">Last 6 Months</SelectItem>
                <SelectItem value="12">Last 12 Months</SelectItem>
                <SelectItem value="24">Last 2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="profitability">Profitability</SelectItem>
                <SelectItem value="liquidity">Liquidity</SelectItem>
                <SelectItem value="cashflow">Cash Flow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {metrics && (
          <>
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(metrics.netProfit)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getGrowthColor(metrics.monthlyGrowth)}`}>
                    {getGrowthIcon(metrics.monthlyGrowth)}
                    {formatPercentage(metrics.monthlyGrowth)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Profit Margin: {metrics.profitMargin.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.cashFlow)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Net operating cash flow
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.workingCapital >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.workingCapital)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current Ratio: {metrics.currentRatio.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROE</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(metrics.returnOnEquity)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Return on Equity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Profitability Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Profitability Analysis
                  </CardTitle>
                  <CardDescription>Key profitability metrics and ratios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Gross Profit Margin</p>
                      <p className="text-lg font-semibold">{metrics.profitMargin.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return on Assets</p>
                      <p className="text-lg font-semibold">{formatPercentage(metrics.returnOnAssets)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Return on Equity</p>
                      <p className="text-lg font-semibold">{formatPercentage(metrics.returnOnEquity)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Year-over-Year Growth</p>
                      <p className={`text-lg font-semibold ${getGrowthColor(metrics.yearOverYearGrowth)}`}>
                        {formatPercentage(metrics.yearOverYearGrowth)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liquidity Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Liquidity Analysis
                  </CardTitle>
                  <CardDescription>Short-term financial health indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Ratio</p>
                      <p className="text-lg font-semibold">{metrics.currentRatio.toFixed(2)}</p>
                      <Badge variant={metrics.currentRatio >= 1.5 ? "default" : "secondary"}>
                        {metrics.currentRatio >= 1.5 ? "Good" : "Monitor"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quick Ratio</p>
                      <p className="text-lg font-semibold">{metrics.quickRatio.toFixed(2)}</p>
                      <Badge variant={metrics.quickRatio >= 1 ? "default" : "secondary"}>
                        {metrics.quickRatio >= 1 ? "Good" : "Monitor"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Working Capital</p>
                      <p className={`text-lg font-semibold ${metrics.workingCapital >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(metrics.workingCapital)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Debt-to-Equity</p>
                      <p className="text-lg font-semibold">{metrics.debtToEquity.toFixed(2)}</p>
                      <Badge variant={metrics.debtToEquity <= 0.5 ? "default" : "secondary"}>
                        {metrics.debtToEquity <= 0.5 ? "Low Risk" : "Monitor"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Analysis */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cash Flow Analysis
                </CardTitle>
                <CardDescription>Monthly cash flow trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Accounts Receivable</p>
                      <p className="text-lg font-semibold text-orange-600">
                        {formatCurrency(metrics.accountsReceivable)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accounts Payable</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(metrics.accountsPayable)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                      <p className={`text-lg font-semibold ${metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(metrics.cashFlow)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cash Conversion</p>
                      <p className="text-lg font-semibold">
                        {metrics.accountsReceivable > 0 ? (metrics.cashFlow / metrics.accountsReceivable * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            {monthlyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Monthly Trends
                  </CardTitle>
                  <CardDescription>Revenue, expenses, and profit trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{data.month}</p>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Revenue</p>
                              <p className="text-sm font-medium text-green-600">
                                {formatCurrency(data.revenue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Expenses</p>
                              <p className="text-sm font-medium text-red-600">
                                {formatCurrency(data.expenses)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Profit</p>
                              <p className={`text-sm font-medium ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(data.profit)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Badge variant={data.cashFlow >= 0 ? "default" : "secondary"}>
                            Cash Flow: {formatCurrency(data.cashFlow)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
} 