"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  DollarSign,
  Settings,
  Save,
  X
} from "lucide-react"

interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  isDefault: boolean
  isActive: boolean
  exchangeRate: number
  lastUpdated: string
}

const defaultCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', exchangeRate: 0.73 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', exchangeRate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', exchangeRate: 1.35 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchangeRate: 110.0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', exchangeRate: 0.92 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchangeRate: 6.45 }
]

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1.0,
    isDefault: false,
    isActive: true
  })

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("/api/settings/currencies")
      if (!response.ok) {
        throw new Error("Failed to fetch currencies")
      }
      const data = await response.json()
      setCurrencies(data)
    } catch (error) {
      console.error("Error fetching currencies:", error)
      // Use default currencies if API fails
      setCurrencies(defaultCurrencies.map((c, index) => ({
        id: `currency-${index}`,
        ...c,
        isDefault: c.code === 'USD',
        isActive: true,
        lastUpdated: new Date().toISOString()
      })))
    } finally {
      setLoading(false)
    }
  }

  const handleAddCurrency = async () => {
    try {
      const response = await fetch("/api/settings/currencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCurrency),
      })

      if (!response.ok) {
        throw new Error("Failed to add currency")
      }

      const addedCurrency = await response.json()
      setCurrencies([...currencies, addedCurrency])
      setShowAddForm(false)
      setNewCurrency({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: 1.0,
        isDefault: false,
        isActive: true
      })
    } catch (error) {
      console.error("Error adding currency:", error)
    }
  }

  const handleUpdateCurrency = async (currency: Currency) => {
    try {
      const response = await fetch(`/api/settings/currencies/${currency.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currency),
      })

      if (!response.ok) {
        throw new Error("Failed to update currency")
      }

      setCurrencies(currencies.map(c => c.id === currency.id ? currency : c))
      setEditingCurrency(null)
    } catch (error) {
      console.error("Error updating currency:", error)
    }
  }

  const handleDeleteCurrency = async (currencyId: string) => {
    try {
      const response = await fetch(`/api/settings/currencies/${currencyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete currency")
      }

      setCurrencies(currencies.filter(c => c.id !== currencyId))
    } catch (error) {
      console.error("Error deleting currency:", error)
    }
  }

  const handleSetDefault = async (currencyId: string) => {
    try {
      const updatedCurrencies = currencies.map(c => ({
        ...c,
        isDefault: c.id === currencyId
      }))

      await Promise.all(
        updatedCurrencies.map(currency =>
          fetch(`/api/settings/currencies/${currency.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currency),
          })
        )
      )

      setCurrencies(updatedCurrencies)
    } catch (error) {
      console.error("Error setting default currency:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading currencies...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Currency Settings</h1>
            <p className="text-gray-600">Manage currencies and exchange rates</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Currency
          </Button>
        </div>

        {/* Add Currency Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Currency
              </CardTitle>
              <CardDescription>Add a new currency to your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Currency Code</Label>
                  <Input
                    id="code"
                    value={newCurrency.code}
                    onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                    placeholder="USD"
                    maxLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Currency Name</Label>
                  <Input
                    id="name"
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                    placeholder="US Dollar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    value={newCurrency.symbol}
                    onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                    placeholder="$"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exchangeRate">Exchange Rate</Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.0001"
                    value={newCurrency.exchangeRate}
                    onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: parseFloat(e.target.value) || 1.0})}
                    placeholder="1.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isDefault">Default Currency</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isDefault"
                      checked={newCurrency.isDefault}
                      onCheckedChange={(checked) => setNewCurrency({...newCurrency, isDefault: checked})}
                    />
                    <Label htmlFor="isDefault">Set as default</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newCurrency.isActive}
                      onCheckedChange={(checked) => setNewCurrency({...newCurrency, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Enable currency</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={handleAddCurrency} disabled={!newCurrency.code || !newCurrency.name}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Currency
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Currencies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currencies.map((currency) => (
            <Card key={currency.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{currency.code}</CardTitle>
                    {currency.isDefault && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingCurrency?.id === currency.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCurrency(editingCurrency)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCurrency(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCurrency(currency)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!currency.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCurrency(currency.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <CardDescription>{currency.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingCurrency?.id === currency.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`symbol-${currency.id}`}>Symbol</Label>
                      <Input
                        id={`symbol-${currency.id}`}
                        value={editingCurrency.symbol}
                        onChange={(e) => setEditingCurrency({...editingCurrency, symbol: e.target.value})}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`rate-${currency.id}`}>Exchange Rate</Label>
                      <Input
                        id={`rate-${currency.id}`}
                        type="number"
                        step="0.0001"
                        value={editingCurrency.exchangeRate}
                        onChange={(e) => setEditingCurrency({...editingCurrency, exchangeRate: parseFloat(e.target.value) || 1.0})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingCurrency.isDefault}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSetDefault(currency.id)
                          }
                        }}
                      />
                      <Label>Default Currency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingCurrency.isActive}
                        onCheckedChange={(checked) => setEditingCurrency({...editingCurrency, isActive: checked})}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Symbol:</span>
                      <span className="font-medium">{currency.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                      <span className="font-medium">{currency.exchangeRate.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={currency.isActive ? "default" : "secondary"}>
                        {currency.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-sm">{formatDate(currency.lastUpdated)}</span>
                    </div>
                    {!currency.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(currency.id)}
                        className="w-full"
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exchange Rate Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Exchange Rate Information
            </CardTitle>
            <CardDescription>
              Exchange rates are relative to your default currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Exchange rates are relative to your default currency</li>
                  <li>• Rates are used for currency conversion in transactions</li>
                  <li>• You can update rates manually or import from external sources</li>
                  <li>• Historical rates are maintained for reporting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep exchange rates updated for accurate reporting</li>
                  <li>• Consider using a currency API for automatic updates</li>
                  <li>• Set your primary business currency as default</li>
                  <li>• Disable currencies you don't use to reduce clutter</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 