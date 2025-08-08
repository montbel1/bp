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
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Zap, 
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Target,
  BarChart3
} from "lucide-react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  date: string
  aiCategory: string | null
  confidence: number | null
  categoryId: string | null
  category?: { name: string }
  isAutoCategorized: boolean
}

interface Category {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
  aiKeywords: string
  transactionCount: number
  accuracy: number
}

interface AIModel {
  id: string
  name: string
  type: string
  version: string
  accuracy: number
  lastTrained: string
  isActive: boolean
  trainingProgress: number
}

export default function TransactionCategorizationPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [aiModels, setAiModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [autoCategorization, setAutoCategorization] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes, modelsRes] = await Promise.all([
        fetch("/api/ai/transactions"),
        fetch("/api/ai/categories"),
        fetch("/api/ai/models")
      ])

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (modelsRes.ok) {
        const modelsData = await modelsRes.json()
        setAiModels(modelsData)
        if (modelsData.length > 0) {
          setSelectedModel(modelsData[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const processTransactions = async () => {
    setProcessing(true)
    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: selectedModel,
          autoCategorize: autoCategorization
        }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error processing transactions:", error)
    } finally {
      setProcessing(false)
    }
  }

  const updateCategory = async (transactionId: string, categoryId: string) => {
    try {
      const response = await fetch(`/api/ai/transactions/${transactionId}/category`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const trainModel = async () => {
    try {
      const response = await fetch("/api/ai/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelId: selectedModel }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error("Error training model:", error)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "uncategorized" && !transaction.categoryId) ||
                         (filterStatus === "auto_categorized" && transaction.isAutoCategorized) ||
                         (filterStatus === "manual" && !transaction.isAutoCategorized && transaction.categoryId)
    return matchesStatus
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge variant="default">High</Badge>
    if (confidence >= 0.6) return <Badge variant="secondary">Medium</Badge>
    return <Badge variant="destructive">Low</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading AI categorization...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Transaction Categorization</h1>
          <p className="text-gray-600">Machine learning-powered automatic transaction categorization</p>
        </div>

        {/* AI Model Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Model Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm text-gray-500">Active Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} v{model.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Model Accuracy</Label>
                <div className="flex items-center gap-2">
                  <Progress value={aiModels.find(m => m.id === selectedModel)?.accuracy || 0} className="flex-1" />
                  <span className="text-sm font-medium">
                    {Math.round((aiModels.find(m => m.id === selectedModel)?.accuracy || 0) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Last Trained</Label>
                <p className="font-medium">
                  {aiModels.find(m => m.id === selectedModel)?.lastTrained 
                    ? formatDate(aiModels.find(m => m.id === selectedModel)!.lastTrained)
                    : 'Never'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={trainModel} variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Train Model
              </Button>
              <Button onClick={processTransactions} disabled={processing}>
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Process Transactions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure AI categorization behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoCategorization}
                onCheckedChange={setAutoCategorization}
              />
              <Label>Auto-categorize new transactions</Label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              When enabled, new transactions will be automatically categorized using AI
            </p>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.categoryId).length} categorized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Categorized</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {transactions.filter(t => t.isAutoCategorized).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactions.length > 0 
                  ? Math.round((transactions.filter(t => t.isAutoCategorized).length / transactions.length) * 100)
                  : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.confidence).length > 0
                  ? Math.round(transactions.filter(t => t.confidence).reduce((sum, t) => sum + (t.confidence || 0), 0) / transactions.filter(t => t.confidence).length * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                AI-trained categories
              </p>
            </CardContent>
          </Card>
        </div>

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
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    <SelectItem value="auto_categorized">Auto-Categorized</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>AI Category</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Current Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
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
                          {transaction.isAutoCategorized && (
                            <Badge variant="outline" className="text-xs">
                              AI
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.aiCategory ? (
                          <div>
                            <div className="font-medium">{transaction.aiCategory}</div>
                            {transaction.confidence && (
                              <div className={`text-sm ${getConfidenceColor(transaction.confidence)}`}>
                                {Math.round(transaction.confidence * 100)}% confidence
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No AI suggestion</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.confidence ? (
                          getConfidenceBadge(transaction.confidence)
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={transaction.categoryId || ""}
                          onValueChange={(value) => updateCategory(transaction.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {transaction.aiCategory && !transaction.categoryId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const aiCategory = categories.find(c => c.name === transaction.aiCategory)
                                if (aiCategory) {
                                  updateCategory(transaction.id, aiCategory.id)
                                }
                              }}
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
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {transactions.length === 0 
                    ? "Add transactions to start using AI categorization." 
                    : "Try adjusting your filter criteria."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>AI accuracy by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <Badge variant={category.accuracy >= 0.8 ? "default" : category.accuracy >= 0.6 ? "secondary" : "destructive"}>
                      {Math.round(category.accuracy * 100)}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transactions:</span>
                      <span>{category.transactionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Keywords:</span>
                      <span className="text-gray-500">{category.aiKeywords.split(',').length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 