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
  CreditCard, 
  DollarSign, 
  Settings, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Zap
} from "lucide-react"

interface StripeAccount {
  id: string
  businessType: string
  country: string
  defaultCurrency: string
  email: string
  isActive: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requirementsCompleted: boolean
}

interface StripePayment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  customerEmail: string
  description: string
  created: string
  invoiceId?: string
}

interface StripeCustomer {
  id: string
  email: string
  name: string
  phone: string
  created: string
  totalSpent: number
  currency: string
}

export default function StripeIntegrationPage() {
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null)
  const [payments, setPayments] = useState<StripePayment[]>([])
  const [customers, setCustomers] = useState<StripeCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>("")

  useEffect(() => {
    checkStripeConnection()
  }, [])

  const checkStripeConnection = async () => {
    try {
      const response = await fetch("/api/integrations/stripe/status")
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.isConnected)
        if (data.isConnected) {
          setStripeAccount(data.account)
          await fetchStripeData()
        }
      }
    } catch (error) {
      console.error("Error checking Stripe connection:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStripeData = async () => {
    try {
      const [paymentsRes, customersRes] = await Promise.all([
        fetch("/api/integrations/stripe/payments"),
        fetch("/api/integrations/stripe/customers")
      ])

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData)
      }
    } catch (error) {
      console.error("Error fetching Stripe data:", error)
    }
  }

  const connectStripe = async () => {
    setConnecting(true)
    try {
      const response = await fetch("/api/integrations/stripe/connect", {
        method: "POST"
      })
      
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectStripe = async () => {
    try {
      const response = await fetch("/api/integrations/stripe/disconnect", {
        method: "POST"
      })
      
      if (response.ok) {
        setIsConnected(false)
        setStripeAccount(null)
        setPayments([])
        setCustomers([])
      }
    } catch (error) {
      console.error("Error disconnecting Stripe:", error)
    }
  }

  const syncStripeData = async () => {
    setSyncStatus("syncing")
    try {
      const response = await fetch("/api/integrations/stripe/sync", {
        method: "POST"
      })
      
      if (response.ok) {
        await fetchStripeData()
        setSyncStatus("completed")
        setTimeout(() => setSyncStatus(""), 3000)
      }
    } catch (error) {
      console.error("Error syncing Stripe data:", error)
      setSyncStatus("error")
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Stripe amounts are in cents
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge variant="default">Succeeded</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading Stripe integration...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stripe Integration</h1>
          <p className="text-gray-600">Connect and manage your Stripe payment processing</p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium">
                  {isConnected ? 'Connected to Stripe' : 'Not connected'}
                </span>
              </div>
              <div className="flex gap-2">
                {isConnected ? (
                  <>
                    <Button variant="outline" onClick={syncStripeData} disabled={syncStatus === "syncing"}>
                      {syncStatus === "syncing" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Data
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={disconnectStripe}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button onClick={connectStripe} disabled={connecting}>
                    {connecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Connect Stripe
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            {syncStatus === "completed" && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Data synced successfully
              </div>
            )}
            {syncStatus === "error" && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Error syncing data
              </div>
            )}
          </CardContent>
        </Card>

        {isConnected && stripeAccount && (
          <>
            {/* Account Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your Stripe account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Business Type</Label>
                    <p className="font-medium">{stripeAccount.businessType}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Country</Label>
                    <p className="font-medium">{stripeAccount.country}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Currency</Label>
                    <p className="font-medium">{stripeAccount.defaultCurrency.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="font-medium">{stripeAccount.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stripeAccount.chargesEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Charges {stripeAccount.chargesEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stripeAccount.payoutsEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Payouts {stripeAccount.payoutsEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stripeAccount.requirementsCompleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Requirements {stripeAccount.requirementsCompleted ? 'Complete' : 'Incomplete'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{payments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {payments.filter(p => p.status === 'succeeded').length} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      payments
                        .filter(p => p.status === 'succeeded')
                        .reduce((sum, p) => sum + p.amount, 0),
                      stripeAccount.defaultCurrency
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {payments.length > 0 
                      ? Math.round((payments.filter(p => p.status === 'succeeded').length / payments.length) * 100)
                      : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment transactions from Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.slice(0, 10).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {payment.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.customerEmail}</div>
                              <div className="text-sm text-gray-500">{payment.paymentMethod}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount, payment.currency)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {formatDate(payment.created)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-500">
                      Payment data will appear here after syncing with Stripe.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers with highest total spending</CardDescription>
              </CardHeader>
              <CardContent>
                {customers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 10)
                        .map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.name || 'Unknown'}
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(customer.totalSpent, customer.currency)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {formatDate(customer.created)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                    <p className="text-gray-500">
                      Customer data will appear here after syncing with Stripe.
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