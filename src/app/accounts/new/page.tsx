"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"

const accountTypes = [
  { value: "ASSET", label: "Asset", description: "What you own (cash, equipment, etc.)" },
  { value: "LIABILITY", label: "Liability", description: "What you owe (loans, credit cards, etc.)" },
  { value: "EQUITY", label: "Equity", description: "Owner's investment and retained earnings" },
  { value: "REVENUE", label: "Revenue", description: "Income from sales and services" },
  { value: "EXPENSE", label: "Expense", description: "Costs of doing business" }
]

export default function NewAccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    number: "",
    description: "",
    isActive: true,
    openingBalance: "",
    openingBalanceDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create account")
      }

      // Redirect to accounts page
      router.push("/accounts")
    } catch (error) {
      console.error("Error creating account:", error)
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
            <h1 className="text-3xl font-bold text-gray-900">Create New Account</h1>
            <p className="text-gray-600">Add a new account to your chart of accounts</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Fill in the details below to create a new account
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

                {/* Opening Balance Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Opening Balance (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set an opening balance for existing accounts. This will create an opening balance transaction.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openingBalance">Opening Balance Amount</Label>
                      <Input
                        id="openingBalance"
                        type="number"
                        step="0.01"
                        value={formData.openingBalance}
                        onChange={(e) => handleInputChange("openingBalance", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingBalanceDate">Opening Balance Date</Label>
                      <Input
                        id="openingBalanceDate"
                        type="date"
                        value={formData.openingBalanceDate}
                        onChange={(e) => handleInputChange("openingBalanceDate", e.target.value)}
                      />
                    </div>
                  </div>
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

                {/* Form Actions */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.type}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Account
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