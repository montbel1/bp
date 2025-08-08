"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar,
  Save,
  Send,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calculator,
  Upload,
  Lock,
  Unlock
} from "lucide-react"
import { toast } from "sonner"

interface TaxForm {
  id: string
  formType: string
  taxYear: number
  status: string
  data: any
  notes?: string
  client: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface FormField {
  id: string
  label: string
  type: "text" | "number" | "currency" | "date" | "select" | "textarea"
  value: any
  required?: boolean
  description?: string
  options?: string[]
}

export default function TaxFormEditorPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string
  
  const [taxForm, setTaxForm] = useState<TaxForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchTaxForm()
  }, [formId])

  const fetchTaxForm = async () => {
    try {
      const response = await fetch(`/api/taxpro/forms/${formId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tax form")
      }
      const data = await response.json()
      setTaxForm(data.taxForm)
      setFormData(data.taxForm.data || {})
    } catch (error) {
      console.error("Error fetching tax form:", error)
      setError("Failed to load tax form")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!taxForm) return

    setSaving(true)
    try {
      const response = await fetch(`/api/taxpro/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          status: taxForm.status
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save tax form")
      }

      toast.success("Tax form saved successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving tax form:", error)
      setError("Failed to save tax form")
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!taxForm) return

    setSaving(true)
    try {
      const response = await fetch(`/api/taxpro/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData,
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      setTaxForm(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-500"
      case "IN_REVIEW": return "bg-yellow-500"
      case "PENDING_SIGNATURE": return "bg-orange-500"
      case "FINALIZED": return "bg-green-500"
      case "SUBMITTED": return "bg-blue-500"
      case "REJECTED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getFormFields = (): FormField[] => {
    if (!taxForm) return []

    // Define form fields based on form type
    const baseFields: FormField[] = [
      {
        id: "preparerName",
        label: "Preparer Name",
        type: "text",
        value: formData.preparerName || "",
        required: true
      },
      {
        id: "preparerPTIN",
        label: "Preparer PTIN",
        type: "text",
        value: formData.preparerPTIN || "",
        required: true
      }
    ]

    switch (taxForm.formType) {
      case "1040":
        return [
          ...baseFields,
          {
            id: "filingStatus",
            label: "Filing Status",
            type: "select",
            value: formData.filingStatus || "",
            required: true,
            options: ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household", "Qualifying Widow(er)"]
          },
          {
            id: "wages",
            label: "Wages, salaries, tips, etc.",
            type: "currency",
            value: formData.wages || 0,
            required: true
          },
          {
            id: "interest",
            label: "Taxable interest",
            type: "currency",
            value: formData.interest || 0
          },
          {
            id: "dividends",
            label: "Qualified dividends",
            type: "currency",
            value: formData.dividends || 0
          },
          {
            id: "businessIncome",
            label: "Business income or (loss)",
            type: "currency",
            value: formData.businessIncome || 0
          },
          {
            id: "capitalGains",
            label: "Capital gains or (losses)",
            type: "currency",
            value: formData.capitalGains || 0
          },
          {
            id: "otherIncome",
            label: "Other income",
            type: "currency",
            value: formData.otherIncome || 0
          },
          {
            id: "adjustments",
            label: "Adjustments to income",
            type: "currency",
            value: formData.adjustments || 0
          },
          {
            id: "itemizedDeductions",
            label: "Itemized deductions",
            type: "currency",
            value: formData.itemizedDeductions || 0
          },
          {
            id: "exemptions",
            label: "Exemptions",
            type: "number",
            value: formData.exemptions || 0
          },
          {
            id: "taxWithheld",
            label: "Federal income tax withheld",
            type: "currency",
            value: formData.taxWithheld || 0
          },
          {
            id: "estimatedPayments",
            label: "Estimated tax payments",
            type: "currency",
            value: formData.estimatedPayments || 0
          }
        ]
      
      case "1120":
        return [
          ...baseFields,
          {
            id: "corporationName",
            label: "Corporation Name",
            type: "text",
            value: formData.corporationName || "",
            required: true
          },
          {
            id: "ein",
            label: "Employer Identification Number",
            type: "text",
            value: formData.ein || "",
            required: true
          },
          {
            id: "grossReceipts",
            label: "Gross receipts or sales",
            type: "currency",
            value: formData.grossReceipts || 0,
            required: true
          },
          {
            id: "costOfGoods",
            label: "Cost of goods sold",
            type: "currency",
            value: formData.costOfGoods || 0
          },
          {
            id: "grossProfit",
            label: "Gross profit",
            type: "currency",
            value: formData.grossProfit || 0
          },
          {
            id: "totalDeductions",
            label: "Total deductions",
            type: "currency",
            value: formData.totalDeductions || 0
          },
          {
            id: "taxableIncome",
            label: "Taxable income",
            type: "currency",
            value: formData.taxableIncome || 0
          },
          {
            id: "totalTax",
            label: "Total tax",
            type: "currency",
            value: formData.totalTax || 0
          }
        ]
      
      default:
        return baseFields
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const calculateTax = () => {
    // Basic tax calculation logic
    if (taxForm?.formType === "1040") {
      const adjustedGrossIncome = (formData.wages || 0) + (formData.interest || 0) + (formData.dividends || 0) + (formData.businessIncome || 0) + (formData.capitalGains || 0) + (formData.otherIncome || 0) - (formData.adjustments || 0)
      const taxableIncome = adjustedGrossIncome - (formData.itemizedDeductions || 0) - (formData.exemptions || 0) * 4050 // 2023 exemption amount
      
      // Simplified tax calculation (this would be much more complex in reality)
      let tax = 0
      if (taxableIncome <= 11000) {
        tax = taxableIncome * 0.10
      } else if (taxableIncome <= 44725) {
        tax = 1100 + (taxableIncome - 11000) * 0.12
      } else if (taxableIncome <= 95375) {
        tax = 5147 + (taxableIncome - 44725) * 0.22
      } else {
        tax = 16290 + (taxableIncome - 95375) * 0.24
      }
      
      return {
        adjustedGrossIncome,
        taxableIncome,
        tax,
        refund: (formData.taxWithheld || 0) + (formData.estimatedPayments || 0) - tax
      }
    }
    return null
  }

  const renderField = (field: FormField) => {
    const value = field.value || ""
    
    switch (field.type) {
      case "currency":
        return (
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
              className="pl-10"
              disabled={!isEditing}
            />
          </div>
        )
      
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)} disabled={!isEditing}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      case "textarea":
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        )
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={!isEditing}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !taxForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-800">{error || "Tax form not found"}</span>
        </div>
      </div>
    )
  }

  const calculation = calculateTax()
  const fields = getFormFields()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{taxForm.formType} - {taxForm.taxYear}</h1>
            <p className="text-muted-foreground">
              {taxForm.client.name} • Created {new Date(taxForm.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(taxForm.status)}>
            {taxForm.status.replace('_', ' ')}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Lock className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Lock" : "Edit"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Tax Form</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Form Data</CardTitle>
                <CardDescription>
                  Enter the tax information for {taxForm.client.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                    {field.description && (
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status and Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status & Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(taxForm.status)}>
                        {taxForm.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Change Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {["DRAFT", "IN_REVIEW", "PENDING_SIGNATURE", "FINALIZED"].map((status) => (
                        <Button
                          key={status}
                          variant={taxForm.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(status)}
                          disabled={saving}
                        >
                          {status.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        E-File
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={taxForm.notes || ""}
                    placeholder="Add notes about this tax form..."
                    rows={4}
                    disabled={!isEditing}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Calculation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calculation ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Adjusted Gross Income</Label>
                      <p className="text-2xl font-bold">${calculation.adjustedGrossIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Taxable Income</Label>
                      <p className="text-2xl font-bold">${calculation.taxableIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Total Tax</Label>
                      <p className="text-2xl font-bold text-red-600">${calculation.tax.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Refund/Due</Label>
                      <p className={`text-2xl font-bold ${calculation.refund >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${calculation.refund.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Calculation not available for this form type.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload and manage tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Document management coming soon</p>
                <Button className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Form Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(taxForm.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Created</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(taxForm.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Modified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 