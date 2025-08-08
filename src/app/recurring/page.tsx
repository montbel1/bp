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
  Repeat, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Receipt
} from "lucide-react"

interface RecurringTransaction {
  id: string
  description: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  interval: number
  startDate: string
  endDate: string | null
  lastProcessed: string | null
  nextDueDate: string
  isActive: boolean
  categoryId: string | null
  accountId: string
  notes: string
  category?: { name: string }
  account?: { name: string }
}

interface RecurringInvoice {
  id: string
  number: string
  description: string
  subtotal: number
  tax: number
  total: number
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  interval: number
  startDate: string
  endDate: string | null
  lastProcessed: string | null
  nextDueDate: string
  isActive: boolean
  customerId: string
  notes: string
  customer?: { name: string }
}

interface RecurringBill {
  id: string
  number: string
  description: string
  subtotal: number
  tax: number
  total: number
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  interval: number
  startDate: string
  endDate: string | null
  lastProcessed: string | null
  nextDueDate: string
  isActive: boolean
  vendorId: string
  notes: string
  vendor?: { name: string }
}

export default function RecurringPage() {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([])
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([])
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices' | 'bills'>('transactions')

  useEffect(() => {
    fetchRecurringItems()
  }, [])

  const fetchRecurringItems = async () => {
    try {
      const [transactionsRes, invoicesRes, billsRes] = await Promise.all([
        fetch("/api/recurring/transactions"),
        fetch("/api/recurring/invoices"),
        fetch("/api/recurring/bills")
      ])

      if (transactionsRes.ok) {
        const transactions = await transactionsRes.json()
        setRecurringTransactions(transactions)
      }

      if (invoicesRes.ok) {
        const invoices = await invoicesRes.json()
        setRecurringInvoices(invoices)
      }

      if (billsRes.ok) {
        const bills = await billsRes.json()
        setRecurringBills(bills)
      }
    } catch (error) {
      console.error("Error fetching recurring items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (type: string, id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/recurring/${type}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        await fetchRecurringItems()
      }
    } catch (error) {
      console.error("Error toggling active status:", error)
    }
  }

  const handleDelete = async (type: string, id: string) => {
    try {
      const response = await fetch(`/api/recurring/${type}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchRecurringItems()
      }
    } catch (error) {
      console.error("Error deleting recurring item:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getFrequencyLabel = (frequency: string, interval: number) => {
    const intervalText = interval > 1 ? `every ${interval} ` : ''
    switch (frequency) {
      case 'DAILY': return `${intervalText}day${interval > 1 ? 's' : ''}`
      case 'WEEKLY': return `${intervalText}week${interval > 1 ? 's' : ''}`
      case 'MONTHLY': return `${intervalText}month${interval > 1 ? 's' : ''}`
      case 'QUARTERLY': return `${intervalText}quarter${interval > 1 ? 's' : ''}`
      case 'YEARLY': return `${intervalText}year${interval > 1 ? 's' : ''}`
      default: return frequency.toLowerCase()
    }
  }

  const getDaysUntilNext = (nextDueDate: string) => {
    const today = new Date()
    const next = new Date(nextDueDate)
    const diffTime = next.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading recurring items...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recurring Items</h1>
          <p className="text-gray-600">Manage your recurring transactions, invoices, and bills</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recurring</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recurringTransactions.length + recurringInvoices.length + recurringBills.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {recurringTransactions.filter(t => t.isActive).length + 
                 recurringInvoices.filter(i => i.isActive).length + 
                 recurringBills.filter(b => b.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {[...recurringTransactions, ...recurringInvoices, ...recurringBills]
                  .filter(item => getDaysUntilNext(item.nextDueDate) <= 7 && item.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  recurringTransactions
                    .filter(t => t.isActive)
                    .reduce((sum, t) => {
                      const monthlyAmount = t.frequency === 'MONTHLY' ? t.amount * t.interval :
                                           t.frequency === 'WEEKLY' ? t.amount * t.interval * 4.33 :
                                           t.frequency === 'YEARLY' ? t.amount * t.interval / 12 :
                                           t.frequency === 'QUARTERLY' ? t.amount * t.interval / 3 :
                                           t.amount * t.interval * 30 // Daily
                      return sum + monthlyAmount
                    }, 0) +
                  recurringInvoices
                    .filter(i => i.isActive)
                    .reduce((sum, i) => {
                      const monthlyAmount = i.frequency === 'MONTHLY' ? i.total * i.interval :
                                           i.frequency === 'WEEKLY' ? i.total * i.interval * 4.33 :
                                           i.frequency === 'YEARLY' ? i.total * i.interval / 12 :
                                           i.frequency === 'QUARTERLY' ? i.total * i.interval / 3 :
                                           i.total * i.interval * 30 // Daily
                      return sum + monthlyAmount
                    }, 0) +
                  recurringBills
                    .filter(b => b.isActive)
                    .reduce((sum, b) => {
                      const monthlyAmount = b.frequency === 'MONTHLY' ? b.total * b.interval :
                                           b.frequency === 'WEEKLY' ? b.total * b.interval * 4.33 :
                                           b.frequency === 'YEARLY' ? b.total * b.interval / 12 :
                                           b.frequency === 'QUARTERLY' ? b.total * b.interval / 3 :
                                           b.total * b.interval * 30 // Daily
                      return sum + monthlyAmount
                    }, 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === 'transactions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('transactions')}
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Transactions ({recurringTransactions.length})
            </Button>
            <Button
              variant={activeTab === 'invoices' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('invoices')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Invoices ({recurringInvoices.length})
            </Button>
            <Button
              variant={activeTab === 'bills' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('bills')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Bills ({recurringBills.length})
            </Button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recurring Transactions</CardTitle>
                  <CardDescription>Automated transactions that repeat on schedule</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recurringTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-500">
                              {transaction.account?.name} • {transaction.category?.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFrequencyLabel(transaction.frequency, transaction.interval)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">{formatDate(transaction.nextDueDate)}</div>
                              <div className="text-xs text-gray-500">
                                {getDaysUntilNext(transaction.nextDueDate)} days
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={transaction.isActive}
                              onCheckedChange={() => handleToggleActive('transactions', transaction.id, transaction.isActive)}
                            />
                            <Badge variant={transaction.isActive ? "default" : "secondary"}>
                              {transaction.isActive ? "Active" : "Paused"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('transactions', transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Repeat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring transactions</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first recurring transaction to automate regular income and expenses.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recurring Transaction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'invoices' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recurring Invoices</CardTitle>
                  <CardDescription>Automated invoices that generate on schedule</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recurringInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-gray-500">{invoice.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{invoice.customer?.name}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFrequencyLabel(invoice.frequency, invoice.interval)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">{formatDate(invoice.nextDueDate)}</div>
                              <div className="text-xs text-gray-500">
                                {getDaysUntilNext(invoice.nextDueDate)} days
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={invoice.isActive}
                              onCheckedChange={() => handleToggleActive('invoices', invoice.id, invoice.isActive)}
                            />
                            <Badge variant={invoice.isActive ? "default" : "secondary"}>
                              {invoice.isActive ? "Active" : "Paused"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('invoices', invoice.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring invoices</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first recurring invoice to automate regular billing.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recurring Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'bills' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recurring Bills</CardTitle>
                  <CardDescription>Automated bills that generate on schedule</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Bill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recurringBills.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recurringBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{bill.number}</div>
                            <div className="text-sm text-gray-500">{bill.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{bill.vendor?.name}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatCurrency(bill.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFrequencyLabel(bill.frequency, bill.interval)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">{formatDate(bill.nextDueDate)}</div>
                              <div className="text-xs text-gray-500">
                                {getDaysUntilNext(bill.nextDueDate)} days
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={bill.isActive}
                              onCheckedChange={() => handleToggleActive('bills', bill.id, bill.isActive)}
                            />
                            <Badge variant={bill.isActive ? "default" : "secondary"}>
                              {bill.isActive ? "Active" : "Paused"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('bills', bill.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recurring bills</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first recurring bill to automate regular expenses.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recurring Bill
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 