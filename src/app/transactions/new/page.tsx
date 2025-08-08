"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, X, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { InlineClientSelector } from "@/components/ui/inline-client-form"

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

export default function NewTransactionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
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
  }, [])

  const fetchData = async () => {
    try {
      const [accountsRes, categoriesRes, customersRes] = await Promise.all([
        fetch("/api/accounts?isActive=true"),
        fetch("/api/categories?isActive=true"),
        fetch("/api/customers?isActive=true")
      ])

      if (!accountsRes.ok || !categoriesRes.ok || !customersRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const [accountsData, categoriesData, customersData] = await Promise.all([
        accountsRes.json(),
        categoriesRes.json(),
        customersRes.json()
      ])

      setAccounts(accountsData)
      setCategories(categoriesData)
      setCustomers(customersData)
    } catch (error) {
      setError("Failed to load accounts and categories")
      console.error("Error fetching data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
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
        throw new Error(errorData.error || "Failed to create transaction")
      }

      // Redirect to transactions page
      router.push("/transactions")
    } catch (error) {
      console.error("Error creating transaction:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
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

  const handleNewCustomerCreated = (newCustomer: any) => {
    setCustomers([...customers, newCustomer])
    setSelectedCustomer(newCustomer.id)
    setShowNewCustomerForm(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">New Transaction</h1>
            <p className="text-gray-600">Record a new financial transaction</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Fill in the details below to record a new transaction
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

                {/* Customer */}
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer (Optional)</Label>
                  <InlineClientSelector
                    clients={customers}
                    selectedClient={selectedCustomer}
                    onClientSelect={setSelectedCustomer}
                    onShowForm={() => setShowNewCustomerForm(true)}
                    showForm={showNewCustomerForm}
                    onClientCreated={handleNewCustomerCreated}
                    onCancel={() => setShowNewCustomerForm(false)}
                    type="customer"
                  />
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
                    disabled={isLoading || !formData.description || !formData.amount || !formData.type || !formData.accountId}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Transaction
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