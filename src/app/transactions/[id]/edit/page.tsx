"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  reference: string | null
  isReconciled: boolean
  account: {
    id: string
    name: string
    type: string
  }
  category: {
    id: string
    name: string
  } | null
}

interface Account {
  id: string
  name: string
  type: string
  balance: number
}

interface Category {
  id: string
  name: string
  type: string
}

export default function EditTransactionPage() {
  const router = useRouter()
  const params = useParams()
  const transactionId = params.id as string
  
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    type: "",
    accountId: "",
    categoryId: "none",
    reference: "",
    isReconciled: false
  })

  useEffect(() => {
    fetchData()
  }, [transactionId])

  const fetchData = async () => {
    try {
      const [transactionRes, accountsRes, categoriesRes] = await Promise.all([
        fetch(`/api/transactions/${transactionId}`),
        fetch("/api/accounts?isActive=true"),
        fetch("/api/categories?isActive=true")
      ])

      if (!transactionRes.ok || !accountsRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const [transactionData, accountsData, categoriesData] = await Promise.all([
        transactionRes.json(),
        accountsRes.json(),
        categoriesRes.json()
      ])

      setTransaction(transactionData)
      setAccounts(accountsData)
      setCategories(categoriesData)

      // Populate form with transaction data
      setFormData({
        date: new Date(transactionData.date).toISOString().split('T')[0],
        description: transactionData.description,
        amount: transactionData.amount.toString(),
        type: transactionData.type,
        accountId: transactionData.account.id,
        categoryId: transactionData.category?.id || "none",
        reference: transactionData.reference || "",
        isReconciled: transactionData.isReconciled
      })
    } catch (error) {
      setError("Failed to load transaction data")
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          categoryId: formData.categoryId === "none" ? null : formData.categoryId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update transaction")
      }

      // Redirect to transactions page
      router.push("/transactions")
    } catch (error) {
      console.error("Error updating transaction:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Filter categories based on transaction type
  const getFilteredCategories = () => {
    if (!formData.type) return categories
    
    const categoryType = formData.type === 'CREDIT' ? 'INCOME' : 'EXPENSE'
    return categories.filter(cat => cat.type === categoryType)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transaction...</span>
        </div>
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Transaction not found</p>
          <Link href="/transactions">
            <Button>Back to Transactions</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Transaction</h1>
            <p className="text-gray-600">Update transaction details</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Update the details below to modify this transaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm font-medium">Error: {error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Transaction Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="e.g., Office supplies purchase, Client payment"
                    required
                  />
                </div>

                {/* Amount and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: string) => handleInputChange("type", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CREDIT">
                          <div className="flex flex-col">
                            <span className="font-medium text-green-600">Credit</span>
                            <span className="text-sm text-gray-500">Money coming in</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DEBIT">
                          <div className="flex flex-col">
                            <span className="font-medium text-red-600">Debit</span>
                            <span className="text-sm text-gray-500">Money going out</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <Label htmlFor="accountId">Account *</Label>
                  <Select
                    value={formData.accountId}
                    onValueChange={(value: string) => handleInputChange("accountId", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-sm text-gray-500">
                              {account.type} • Balance: {formatCurrency(account.balance)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value: string) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {getFilteredCategories().map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Categories will be filtered based on the transaction type
                  </p>
                </div>

                {/* Reference */}
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => handleInputChange("reference", e.target.value)}
                    placeholder="e.g., Invoice #123, Check #456"
                  />
                  <p className="text-sm text-gray-500">
                    Optional reference number or identifier
                  </p>
                </div>

                {/* Reconciled Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isReconciled">Reconciled</Label>
                    <p className="text-sm text-gray-500">
                      Mark as reconciled with bank statement
                    </p>
                  </div>
                  <Switch
                    id="isReconciled"
                    checked={formData.isReconciled}
                    onCheckedChange={(checked) => handleInputChange("isReconciled", checked)}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={saving || !formData.description || !formData.amount || !formData.type || !formData.accountId}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Transaction
                      </>
                    )}
                  </Button>
                  <Link href="/transactions">
                    <Button type="button" variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 