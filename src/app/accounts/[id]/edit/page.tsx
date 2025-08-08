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

interface Account {
  id: string
  name: string
  type: string
  number: string | null
  description: string | null
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const accountTypes = [
  { value: "ASSET", label: "Asset", description: "What you own (cash, equipment, etc.)" },
  { value: "LIABILITY", label: "Liability", description: "What you owe (loans, credit cards, etc.)" },
  { value: "EQUITY", label: "Equity", description: "Owner's investment and retained earnings" },
  { value: "REVENUE", label: "Revenue", description: "Income from sales and services" },
  { value: "EXPENSE", label: "Expense", description: "Costs of doing business" }
]

export default function EditAccountPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.id as string
  
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    number: "",
    description: "",
    isActive: true
  })

  useEffect(() => {
    fetchAccount()
  }, [accountId])

  const fetchAccount = async () => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch account")
      }

      const accountData = await response.json()
      setAccount(accountData)

      // Populate form with account data
      setFormData({
        name: accountData.name,
        type: accountData.type,
        number: accountData.number || "",
        description: accountData.description || "",
        isActive: accountData.isActive
      })
    } catch (error) {
      setError("Failed to load account data")
      console.error("Error fetching account:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update account")
      }

      // Redirect to accounts page
      router.push("/accounts")
    } catch (error) {
      console.error("Error updating account:", error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading account...</span>
        </div>
      </div>
    )
  }

  if (error && !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAccount}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Account not found</p>
          <Link href="/accounts">
            <Button>Back to Accounts</Button>
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
          <Link href="/accounts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Account</h1>
            <p className="text-gray-600">Update account information</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update the details below to modify this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm font-medium">Error: {error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Cash, Office Supplies, Sales Revenue"
                    required
                  />
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Account Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) => handleInputChange("type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-sm text-gray-500">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <Label htmlFor="number">Account Number</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    placeholder="e.g., 1000, 1100, 5000"
                  />
                  <p className="text-sm text-gray-500">
                    Optional: Standard account numbers help organize your chart of accounts
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of this account's purpose"
                    rows={3}
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Account</Label>
                    <p className="text-sm text-gray-500">
                      Inactive accounts won&apos;t appear in transaction forms
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>

                {/* Current Balance Display */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Balance</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(account.balance)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This balance cannot be changed directly. It is calculated from transactions.
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={saving || !formData.name || !formData.type}
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
                        Update Account
                      </>
                    )}
                  </Button>
                  <Link href="/accounts">
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