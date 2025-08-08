"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, DollarSign, TrendingUp, TrendingDown, Building2, Users, CreditCard, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"

interface Account {
  id: string
  name: string
  type: string
  number: string | null
  balance: number
  isActive: boolean
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function AccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    accountId: string | null
    accountName: string
  }>({
    isOpen: false,
    accountId: null,
    accountName: ""
  })

  useEffect(() => {
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

  const handleDelete = async () => {
    if (!deleteDialog.accountId) return

    try {
      const response = await fetch(`/api/accounts/${deleteDialog.accountId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      // Remove the account from the local state
      setAccounts(prev => prev.filter(account => account.id !== deleteDialog.accountId))
      setDeleteDialog({ isOpen: false, accountId: null, accountName: "" })
    } catch (error) {
      console.error("Error deleting account:", error)
      alert(error instanceof Error ? error.message : "Failed to delete account")
    }
  }

  const openDeleteDialog = (account: Account) => {
    setDeleteDialog({
      isOpen: true,
      accountId: account.id,
      accountName: account.name
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, accountId: null, accountName: "" })
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "ASSET":
        return <DollarSign className="h-4 w-4 text-green-600" />
      case "LIABILITY":
        return <CreditCard className="h-4 w-4 text-red-600" />
      case "EQUITY":
        return <Building2 className="h-4 w-4 text-blue-600" />
      case "REVENUE":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "EXPENSE":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "ASSET":
        return "text-green-600 bg-green-50"
      case "LIABILITY":
        return "text-red-600 bg-red-50"
      case "EQUITY":
        return "text-blue-600 bg-blue-50"
      case "REVENUE":
        return "text-green-600 bg-green-50"
      case "EXPENSE":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(balance)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading accounts...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
            <p className="text-gray-600">Manage your business accounts and categories</p>
          </div>
          <Link href="/accounts/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatBalance(accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0))}
                  </p>
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
                  <p className="text-xl font-bold text-red-600">
                    {formatBalance(accounts.filter(a => a.type === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0))}
                  </p>
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
                  <p className="text-xl font-bold text-blue-600">
                    {formatBalance(accounts.filter(a => a.type === 'EQUITY').reduce((sum, a) => sum + a.balance, 0))}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatBalance(accounts.filter(a => a.type === 'REVENUE').reduce((sum, a) => sum + a.balance, 0))}
                  </p>
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
                  <p className="text-xl font-bold text-red-600">
                    {formatBalance(accounts.filter(a => a.type === 'EXPENSE').reduce((sum, a) => sum + a.balance, 0))}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} • Click to edit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Account</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Number</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account: Account) => (
                    <tr key={account.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{account.name}</p>
                          {account.description && (
                            <p className="text-sm text-gray-500">{account.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getAccountTypeIcon(account.type)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{account.number}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatBalance(account.balance)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link href={`/accounts/${account.id}/edit`}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openDeleteDialog(account)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          title="Delete Account"
          description="Are you sure you want to delete this account? This action cannot be undone."
          itemName={deleteDialog.accountName}
        />
      </div>
    </div>
  )
} 