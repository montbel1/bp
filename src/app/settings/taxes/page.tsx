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
  Percent, 
  Calculator,
  Settings,
  Save,
  X,
  FileText
} from "lucide-react"

interface TaxRate {
  id: string
  name: string
  rate: number
  type: 'PERCENTAGE' | 'FIXED'
  isCompound: boolean
  isActive: boolean
  description: string
  appliesTo: 'ALL' | 'SALES' | 'PURCHASES' | 'SERVICES' | 'GOODS'
  priority: number
  createdAt: string
}

const defaultTaxRates = [
  {
    name: 'Sales Tax',
    rate: 8.5,
    type: 'PERCENTAGE' as const,
    isCompound: false,
    isActive: true,
    description: 'Standard sales tax rate',
    appliesTo: 'SALES' as const,
    priority: 1
  },
  {
    name: 'VAT',
    rate: 20.0,
    type: 'PERCENTAGE' as const,
    isCompound: true,
    isActive: true,
    description: 'Value Added Tax',
    appliesTo: 'ALL' as const,
    priority: 2
  },
  {
    name: 'Import Duty',
    rate: 5.0,
    type: 'PERCENTAGE' as const,
    isCompound: false,
    isActive: true,
    description: 'Import duty on goods',
    appliesTo: 'GOODS' as const,
    priority: 3
  }
]

export default function TaxesPage() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTax, setEditingTax] = useState<TaxRate | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaxRate, setNewTaxRate] = useState({
    name: '',
    rate: 0,
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    isCompound: false,
    isActive: true,
    description: '',
    appliesTo: 'ALL' as 'ALL' | 'SALES' | 'PURCHASES' | 'SERVICES' | 'GOODS',
    priority: 1
  })

  useEffect(() => {
    fetchTaxRates()
  }, [])

  const fetchTaxRates = async () => {
    try {
      const response = await fetch("/api/settings/taxes")
      if (!response.ok) {
        throw new Error("Failed to fetch tax rates")
      }
      const data = await response.json()
      setTaxRates(data)
    } catch (error) {
      console.error("Error fetching tax rates:", error)
      // Use default tax rates if API fails
      setTaxRates(defaultTaxRates.map((t, index) => ({
        id: `tax-${index}`,
        ...t,
        createdAt: new Date().toISOString()
      })))
    } finally {
      setLoading(false)
    }
  }

  const handleAddTaxRate = async () => {
    try {
      const response = await fetch("/api/settings/taxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaxRate),
      })

      if (!response.ok) {
        throw new Error("Failed to add tax rate")
      }

      const addedTaxRate = await response.json()
      setTaxRates([...taxRates, addedTaxRate])
      setShowAddForm(false)
      setNewTaxRate({
        name: '',
        rate: 0,
        type: 'PERCENTAGE',
        isCompound: false,
        isActive: true,
        description: '',
        appliesTo: 'ALL',
        priority: 1
      })
    } catch (error) {
      console.error("Error adding tax rate:", error)
    }
  }

  const handleUpdateTaxRate = async (taxRate: TaxRate) => {
    try {
      const response = await fetch(`/api/settings/taxes/${taxRate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taxRate),
      })

      if (!response.ok) {
        throw new Error("Failed to update tax rate")
      }

      setTaxRates(taxRates.map(t => t.id === taxRate.id ? taxRate : t))
      setEditingTax(null)
    } catch (error) {
      console.error("Error updating tax rate:", error)
    }
  }

  const handleDeleteTaxRate = async (taxRateId: string) => {
    try {
      const response = await fetch(`/api/settings/taxes/${taxRateId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tax rate")
      }

      setTaxRates(taxRates.filter(t => t.id !== taxRateId))
    } catch (error) {
      console.error("Error deleting tax rate:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getAppliesToColor = (appliesTo: string) => {
    switch (appliesTo) {
      case 'ALL': return 'bg-blue-100 text-blue-800'
      case 'SALES': return 'bg-green-100 text-green-800'
      case 'PURCHASES': return 'bg-orange-100 text-orange-800'
      case 'SERVICES': return 'bg-purple-100 text-purple-800'
      case 'GOODS': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading tax rates...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Tax Settings</h1>
            <p className="text-gray-600">Manage tax rates and rules</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Tax Rate
          </Button>
        </div>

        {/* Add Tax Rate Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Tax Rate
              </CardTitle>
              <CardDescription>Configure a new tax rate for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tax Name</Label>
                  <Input
                    id="name"
                    value={newTaxRate.name}
                    onChange={(e) => setNewTaxRate({...newTaxRate, name: e.target.value})}
                    placeholder="Sales Tax"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={newTaxRate.rate}
                    onChange={(e) => setNewTaxRate({...newTaxRate, rate: parseFloat(e.target.value) || 0})}
                    placeholder="8.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newTaxRate.type}
                    onValueChange={(value: 'PERCENTAGE' | 'FIXED') => setNewTaxRate({...newTaxRate, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appliesTo">Applies To</Label>
                  <Select
                    value={newTaxRate.appliesTo}
                    onValueChange={(value: 'ALL' | 'SALES' | 'PURCHASES' | 'SERVICES' | 'GOODS') => 
                      setNewTaxRate({...newTaxRate, appliesTo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Transactions</SelectItem>
                      <SelectItem value="SALES">Sales Only</SelectItem>
                      <SelectItem value="PURCHASES">Purchases Only</SelectItem>
                      <SelectItem value="SERVICES">Services Only</SelectItem>
                      <SelectItem value="GOODS">Goods Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    value={newTaxRate.priority}
                    onChange={(e) => setNewTaxRate({...newTaxRate, priority: parseInt(e.target.value) || 1})}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTaxRate.description}
                    onChange={(e) => setNewTaxRate({...newTaxRate, description: e.target.value})}
                    placeholder="Tax description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isCompound">Compound Tax</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isCompound"
                      checked={newTaxRate.isCompound}
                      onCheckedChange={(checked) => setNewTaxRate({...newTaxRate, isCompound: checked})}
                    />
                    <Label htmlFor="isCompound">Apply to subtotal + other taxes</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Active</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={newTaxRate.isActive}
                      onCheckedChange={(checked) => setNewTaxRate({...newTaxRate, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Enable tax rate</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button onClick={handleAddTaxRate} disabled={!newTaxRate.name || newTaxRate.rate <= 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Add Tax Rate
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tax Rates List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxRates.map((taxRate) => (
            <Card key={taxRate.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">{taxRate.name}</CardTitle>
                    {taxRate.isCompound && (
                      <Badge variant="secondary">Compound</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingTax?.id === taxRate.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTaxRate(editingTax)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTax(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTax(taxRate)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTaxRate(taxRate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <CardDescription>{taxRate.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingTax?.id === taxRate.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`rate-${taxRate.id}`}>Rate</Label>
                      <Input
                        id={`rate-${taxRate.id}`}
                        type="number"
                        step="0.01"
                        value={editingTax.rate}
                        onChange={(e) => setEditingTax({...editingTax, rate: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`type-${taxRate.id}`}>Type</Label>
                      <Select
                        value={editingTax.type}
                        onValueChange={(value: 'PERCENTAGE' | 'FIXED') => setEditingTax({...editingTax, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`appliesTo-${taxRate.id}`}>Applies To</Label>
                      <Select
                        value={editingTax.appliesTo}
                        onValueChange={(value: 'ALL' | 'SALES' | 'PURCHASES' | 'SERVICES' | 'GOODS') => 
                          setEditingTax({...editingTax, appliesTo: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Transactions</SelectItem>
                          <SelectItem value="SALES">Sales Only</SelectItem>
                          <SelectItem value="PURCHASES">Purchases Only</SelectItem>
                          <SelectItem value="SERVICES">Services Only</SelectItem>
                          <SelectItem value="GOODS">Goods Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingTax.isCompound}
                        onCheckedChange={(checked) => setEditingTax({...editingTax, isCompound: checked})}
                      />
                      <Label>Compound Tax</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingTax.isActive}
                        onCheckedChange={(checked) => setEditingTax({...editingTax, isActive: checked})}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rate:</span>
                      <span className="font-medium">
                        {taxRate.type === 'PERCENTAGE' ? `${taxRate.rate}%` : `$${taxRate.rate.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="outline">
                        {taxRate.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Applies To:</span>
                      <Badge className={getAppliesToColor(taxRate.appliesTo)}>
                        {taxRate.appliesTo}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Priority:</span>
                      <span className="font-medium">{taxRate.priority}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={taxRate.isActive ? "default" : "secondary"}>
                        {taxRate.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="text-sm">{formatDate(taxRate.createdAt)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tax Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Calculation Information
            </CardTitle>
            <CardDescription>
              How taxes are calculated and applied in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Tax Types:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Percentage:</strong> Tax calculated as a percentage of the amount</li>
                  <li>• <strong>Fixed Amount:</strong> Fixed tax amount regardless of transaction value</li>
                  <li>• <strong>Compound:</strong> Tax applied to subtotal + other taxes</li>
                  <li>• <strong>Simple:</strong> Tax applied only to the subtotal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Application Rules:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>All:</strong> Applied to all transactions</li>
                  <li>• <strong>Sales:</strong> Only applied to sales/invoices</li>
                  <li>• <strong>Purchases:</strong> Only applied to purchases/bills</li>
                  <li>• <strong>Services:</strong> Only applied to service transactions</li>
                  <li>• <strong>Goods:</strong> Only applied to goods/products</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 