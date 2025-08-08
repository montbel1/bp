"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface TaxCalculation {
  grossIncome: number
  adjustedGrossIncome: number
  taxableIncome: number
  taxOwed: number
  refund: number
  effectiveRate: number
  stateTax?: number
  salesTax?: number
  totalTax?: number
  breakdown: {
    federalTax: number
    stateTax: number
    localTax: number
    credits: number
  }
  confidence?: number
  recommendations?: string[]
}

export default function TaxCalculatorPage() {
  const [loading, setLoading] = useState(false)
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null)
  const [formData, setFormData] = useState({
    income: 75000,
    filingStatus: "SINGLE",
    state: "CA",
    salesAmount: 0,
    deductions: 12950 // 2024 standard deduction
  })

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/taxpro/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income: formData.income,
          deductions: [{ id: "1", type: "STANDARD_DEDUCTION", amount: formData.deductions, description: "Standard Deduction", isEligible: true }],
          filingStatus: formData.filingStatus,
          state: formData.state,
          salesAmount: formData.salesAmount,
          taxYear: 2024
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate tax")
      }

      const result = await response.json()
      setCalculation(result.calculation)
      toast.success("Tax calculation completed!")
    } catch (error) {
      console.error("Error calculating tax:", error)
      toast.error("Failed to calculate tax")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800"
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tax Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your tax liability using our integrated tax calculation engine
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Information
            </CardTitle>
            <CardDescription>
              Enter your tax information to calculate your liability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Annual Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="income"
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: parseFloat(e.target.value) || 0 })}
                  className="pl-10"
                  placeholder="75000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filingStatus">Filing Status</Label>
              <Select value={formData.filingStatus} onValueChange={(value) => setFormData({ ...formData, filingStatus: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married Filing Jointly</SelectItem>
                  <SelectItem value="HEAD_OF_HOUSEHOLD">Head of Household</SelectItem>
                  <SelectItem value="QUALIFYING_WIDOW">Qualifying Widow(er)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deductions">Standard Deduction</Label>
              <Input
                id="deductions"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) || 0 })}
                placeholder="12950"
              />
            </div>

            <div>
              <Label htmlFor="salesAmount">Sales Amount (for sales tax)</Label>
              <Input
                id="salesAmount"
                type="number"
                value={formData.salesAmount}
                onChange={(e) => setFormData({ ...formData, salesAmount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Tax
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tax Calculation Results
            </CardTitle>
            <CardDescription>
              Your calculated tax liability and breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-4">
                {/* Confidence Score */}
                {calculation.confidence && (
                  <div className="flex items-center gap-2">
                    <Badge className={getConfidenceColor(calculation.confidence)}>
                      {Math.round(calculation.confidence * 100)}% Confidence
                    </Badge>
                    {calculation.confidence >= 0.9 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                )}

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Gross Income</Label>
                    <p className="text-lg font-semibold">{formatCurrency(calculation.grossIncome)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Taxable Income</Label>
                    <p className="text-lg font-semibold">{formatCurrency(calculation.taxableIncome)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Federal Tax</Label>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(calculation.breakdown.federalTax)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">State Tax</Label>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(calculation.breakdown.stateTax)}</p>
                  </div>
                </div>

                {/* Total Tax */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Total Tax</Label>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(calculation.totalTax || calculation.taxOwed)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Effective Rate: {calculation.effectiveRate.toFixed(1)}%
                  </p>
                </div>

                {/* Recommendations */}
                {calculation.recommendations && calculation.recommendations.length > 0 && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold">Recommendations</Label>
                    <ul className="mt-2 space-y-1">
                      {calculation.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 mt-0.5 text-yellow-600" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>Enter your tax information and click "Calculate Tax" to see your results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 