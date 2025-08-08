"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  Calculator,
  DollarSign,
  TrendingUp,
  Upload,
  Receipt,
  Building2,
  CreditCard
} from "lucide-react"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  email: string
  companyName?: string
}

interface IncomeSource {
  id: string
  type: 'W2' | '1099_NEC' | '1099_INT' | '1099_DIV' | 'SCHEDULE_C' | 'SCHEDULE_E' | 'OTHER'
  description: string
  amount: number
  employer?: string
  payer?: string
  isActive: boolean
}

interface Document {
  id: string
  type: string
  name: string
  description: string
  isUploaded: boolean
  isRequired: boolean
}

interface Deduction {
  id: string
  type: string
  description: string
  amount: number
  isEligible: boolean
  category: 'BUSINESS' | 'ITEMIZED' | 'STANDARD' | 'OTHER'
}

// Remove the taxFormTemplates array and getSelectedTemplate function since we're not using them anymore

export default function NewTaxFormPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [taxYear, setTaxYear] = useState(new Date().getFullYear())
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientData, setNewClientData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    taxId: ""
  })
  const [creatingClient, setCreatingClient] = useState(false)
  
  // Tax preparer workflow state
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [taxCalculation, setTaxCalculation] = useState<any>(null)
  const [calculatingTax, setCalculatingTax] = useState(false)
  const [filingStatus, setFilingStatus] = useState("SINGLE")
  const [state, setState] = useState("CA")
  
  // Document collection state
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentTypes, setDocumentTypes] = useState<string[]>([])
  
  // Document upload and processing state
  const [uploadingDocuments, setUploadingDocuments] = useState(false)
  const [processingDocuments, setProcessingDocuments] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients?isActive=true")
      if (!response.ok) {
        throw new Error("Failed to fetch clients")
      }
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error("Error fetching clients:", error)
      setError("Failed to load clients")
    }
  }

  const handleCreateNewClient = async () => {
    if (!newClientData.name) {
      setError("Client name is required")
      return
    }

    setCreatingClient(true)
    setError(null)

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create client")
      }

      const newClient = await response.json()
      
      // Add the new client to the list and select it
      setClients([...clients, newClient])
      setSelectedClient(newClient.id)
      setShowNewClientForm(false)
      setNewClientData({ name: "", email: "", phone: "", companyName: "", taxId: "" })
      
      toast.success("Client created successfully!")
    } catch (error) {
      console.error("Error creating client:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setCreatingClient(false)
    }
  }

  const handleCreateTaxForm = async () => {
    if (!selectedClient || !taxYear) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/taxpro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "taxForm",
          data: {
            formType: "1040", // Default to 1040, will be determined by income sources
            taxYear: parseInt(taxYear.toString()),
            clientId: selectedClient,
            notes: notes,
            data: {
              incomeSources,
              deductions,
              taxCalculation
            }
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tax form")
      }

      const result = await response.json()
      toast.success("Tax form created successfully!")
      router.push(`/taxpro/forms/${result.taxForm.id}`)
    } catch (error) {
      console.error("Error creating tax form:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Remove the getSelectedTemplate function since we're not using it anymore

  const calculateTax = async () => {
    setCalculatingTax(true)
    try {
      const response = await fetch("/api/taxpro/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          income: incomeSources.reduce((sum, source) => sum + source.amount, 0),
          filingStatus: filingStatus,
          state: state,
          deductions: deductions,
          taxYear: taxYear
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate tax")
      }

      const result = await response.json()
      setTaxCalculation(result.calculation)
      toast.success("Tax calculation completed!")
    } catch (error) {
      console.error("Error calculating tax:", error)
      toast.error("Failed to calculate tax")
    } finally {
      setCalculatingTax(false)
    }
  }

  const handleDocumentUpload = async (file: File) => {
    setUploadingDocuments(true)
    setUploadedFiles([...uploadedFiles, file])
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('taxYear', taxYear.toString())
      formData.append('clientId', selectedClient)
      
      const response = await fetch("/api/taxpro/process-document", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process document")
      }

      const result = await response.json()
      
      // Update income sources with extracted data
      if (result.incomeSources) {
        setIncomeSources([...incomeSources, ...result.incomeSources])
      }
      
      // Update deductions with extracted data
      if (result.deductions) {
        setDeductions([...deductions, ...result.deductions])
      }
      
      toast.success("Document processed successfully!")
    } catch (error) {
      console.error("Error processing document:", error)
      toast.error("Failed to process document")
    } finally {
      setUploadingDocuments(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedClient !== "" && documents.length > 0
      case 2:
        return incomeSources.length > 0
      case 3:
        return deductions.length > 0
      case 4:
        return taxCalculation !== null
      default:
        return true
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Tax Form</h1>
          <p className="text-muted-foreground">Set up a new tax form for your client</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              }`}>
                {step > stepNumber ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 5 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Client & Documents"}
            {step === 2 && "Income Sources"}
            {step === 3 && "Deductions & Credits"}
            {step === 4 && "Tax Calculation"}
            {step === 5 && "Review & Finalize"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Select client and gather required documents"}
            {step === 2 && "Enter all income sources (W-2s, 1099s, business income)"}
            {step === 3 && "Add deductions and credits to maximize refund"}
            {step === 4 && "Calculate tax liability and identify optimization opportunities"}
            {step === 5 && "Review all information and create tax form"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Client & Documents */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Client Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Information</h3>
                <div>
                  <Label htmlFor="client">Client *</Label>
                  <div className="space-y-2">
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{client.name}</span>
                              {client.companyName && (
                                <Badge variant="outline">{client.companyName}</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm text-gray-500 px-2">or</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewClientForm(true)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                </div>
                
                {selectedClient && (
                  <Card className="bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">
                          {clients.find(c => c.id === selectedClient)?.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Inline New Client Form */}
                {showNewClientForm && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Client</CardTitle>
                    <CardDescription>
                      Create a new client for this tax form
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Name *</Label>
                        <Input
                          id="clientName"
                          value={newClientData.name}
                          onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                          placeholder="Client name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={newClientData.email}
                          onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                          placeholder="client@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Phone</Label>
                        <Input
                          id="clientPhone"
                          value={newClientData.phone}
                          onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientCompany">Company Name</Label>
                        <Input
                          id="clientCompany"
                          value={newClientData.companyName}
                          onChange={(e) => setNewClientData({ ...newClientData, companyName: e.target.value })}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientTaxId">Tax ID</Label>
                        <Input
                          id="clientTaxId"
                          value={newClientData.taxId}
                          onChange={(e) => setNewClientData({ ...newClientData, taxId: e.target.value })}
                          placeholder="Tax ID"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCreateNewClient}
                        disabled={creatingClient || !newClientData.name}
                      >
                        {creatingClient ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create Client
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowNewClientForm(false)
                          setNewClientData({ name: "", email: "", phone: "", companyName: "", taxId: "" })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Document Collection */}
            {selectedClient && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Select the types of income and documents your client has provided
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* W-2 Documents */}
                  <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <Label className="font-medium">W-2 Forms</Label>
                          <p className="text-sm text-muted-foreground">Employment income</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDoc = {
                              id: Date.now().toString(),
                              type: "W2",
                              name: "W-2 Form",
                              description: "Employment income",
                              isUploaded: false,
                              isRequired: true
                            }
                            setDocuments([...documents, newDoc])
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 1099 Documents */}
                  <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <Label className="font-medium">1099 Forms</Label>
                          <p className="text-sm text-muted-foreground">Contractor, interest, dividends</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDoc = {
                              id: Date.now().toString(),
                              type: "1099",
                              name: "1099 Form",
                              description: "Contractor, interest, dividends",
                              isUploaded: false,
                              isRequired: true
                            }
                            setDocuments([...documents, newDoc])
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business Documents */}
                  <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                          <Label className="font-medium">Business Documents</Label>
                          <p className="text-sm text-muted-foreground">P&L, Schedule C, S-Corp</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDoc = {
                              id: Date.now().toString(),
                              type: "BUSINESS",
                              name: "Business Document",
                              description: "P&L, Schedule C, S-Corp",
                              isUploaded: false,
                              isRequired: true
                            }
                            setDocuments([...documents, newDoc])
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Other Documents */}
                  <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-orange-600" />
                        <div className="flex-1">
                          <Label className="font-medium">Other Documents</Label>
                          <p className="text-sm text-muted-foreground">Trading, rental, other income</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDoc = {
                              id: Date.now().toString(),
                              type: "OTHER",
                              name: "Other Document",
                              description: "Trading, rental, other income",
                              isUploaded: false,
                              isRequired: true
                            }
                            setDocuments([...documents, newDoc])
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Documents */}
                {documents.length > 0 && (
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Documents to Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={doc.isUploaded ? "default" : "secondary"}>
                                {doc.isUploaded ? "Uploaded" : "Pending"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDocuments(documents.filter(d => d.id !== doc.id))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Income Sources */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Income Sources</h3>
                <p className="text-sm text-muted-foreground">
                  Enter income from the documents you've uploaded or add manually
                </p>
                
                {/* Document Upload Section */}
                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Tax Documents
                    </CardTitle>
                    <CardDescription>
                      Take photos or upload W-2s, 1099s, P&L statements, and other tax documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Camera Upload */}
                      <div className="space-y-2">
                        <Label>Take Photo</Label>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Trigger camera
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.capture = 'environment'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) {
                                handleDocumentUpload(file)
                              }
                            }
                            input.click()
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Camera
                        </Button>
                      </div>
                      
                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label>Upload File</Label>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*,.pdf'
                            input.multiple = true
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files
                              if (files) {
                                Array.from(files).forEach(file => {
                                  handleDocumentUpload(file)
                                })
                              }
                            }
                            input.click()
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    
                    {/* Upload Progress */}
                    {uploadingDocuments && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">Uploading documents...</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Processing Progress */}
                    {processingDocuments && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          <span className="text-sm">Processing documents with AI...</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Extracting income data, deductions, and tax information
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Uploaded Documents */}
                {uploadedFiles.length > 0 && (
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Processing</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Manual Income Entry */}
                <Card>
                  <CardHeader>
                    <CardTitle>Manual Income Entry</CardTitle>
                    <CardDescription>
                      Add income sources manually if documents haven't been processed yet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Income Type</Label>
                        <Select onValueChange={(value) => {
                          const newIncome = {
                            id: Date.now().toString(),
                            type: value as any,
                            description: `New ${value} Income`,
                            amount: 0,
                            isActive: true
                          }
                          setIncomeSources([...incomeSources, newIncome])
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select income type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="W2">W-2 Employment</SelectItem>
                            <SelectItem value="1099_NEC">1099-NEC Contractor</SelectItem>
                            <SelectItem value="1099_INT">1099-INT Interest</SelectItem>
                            <SelectItem value="1099_DIV">1099-DIV Dividends</SelectItem>
                            <SelectItem value="SCHEDULE_C">Schedule C Business</SelectItem>
                            <SelectItem value="SCHEDULE_E">Schedule E Rental</SelectItem>
                            <SelectItem value="OTHER">Other Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Sources List */}
                {incomeSources.length > 0 && (
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Income Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {incomeSources.map((income, index) => (
                          <div key={income.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Receipt className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="font-medium">{income.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(income.amount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={income.amount}
                                onChange={(e) => {
                                  const newIncomeSources = [...incomeSources]
                                  newIncomeSources[index].amount = parseFloat(e.target.value) || 0
                                  setIncomeSources(newIncomeSources)
                                }}
                                className="w-32"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIncomeSources(incomeSources.filter((_, i) => i !== index))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Deductions & Credits */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deductions & Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Add deductions and credits to maximize your refund
                </p>
                
                {/* Filing Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filing Status</CardTitle>
                    <CardDescription>
                      Your filing status affects your standard deduction and tax brackets
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Filing Status</Label>
                        <Select value={filingStatus} onValueChange={setFilingStatus}>
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
                        <Label>State</Label>
                        <Select value={state} onValueChange={setState}>
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
                    </div>
                  </CardContent>
                </Card>

                {/* Standard vs Itemized Deductions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Standard vs Itemized Deductions</CardTitle>
                    <CardDescription>
                      Choose between standard deduction or itemized deductions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">Standard Deduction</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {filingStatus === 'SINGLE' ? '$13,850' : 
                               filingStatus === 'MARRIED' ? '$27,700' : 
                               filingStatus === 'HEAD_OF_HOUSEHOLD' ? '$20,800' : '$27,700'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Automatic deduction based on filing status
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-2 border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">Itemized Deductions</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {deductions.filter(d => d.category === 'ITEMIZED').reduce((sum, d) => sum + d.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Medical, state taxes, mortgage interest, charitable
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Deductions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Deductions</CardTitle>
                    <CardDescription>
                      Add itemized deductions to potentially reduce your tax liability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Deduction Type</Label>
                        <Select onValueChange={(value) => {
                          const newDeduction = {
                            id: Date.now().toString(),
                            type: value,
                            description: `New ${value.replace('_', ' ')}`,
                            amount: 0,
                            isEligible: true,
                            category: value.includes('BUSINESS') ? 'BUSINESS' as const : 'ITEMIZED' as const
                          }
                          setDeductions([...deductions, newDeduction])
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deduction type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEDICAL_EXPENSE">Medical Expenses</SelectItem>
                            <SelectItem value="STATE_TAXES">State & Local Taxes</SelectItem>
                            <SelectItem value="MORTGAGE_INTEREST">Mortgage Interest</SelectItem>
                            <SelectItem value="CHARITABLE_CONTRIBUTION">Charitable Contributions</SelectItem>
                            <SelectItem value="BUSINESS_EXPENSE">Business Expenses</SelectItem>
                            <SelectItem value="HOME_OFFICE">Home Office</SelectItem>
                            <SelectItem value="VEHICLE_EXPENSE">Vehicle Expenses</SelectItem>
                            <SelectItem value="OTHER_DEDUCTION">Other Deductions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Deductions */}
                {deductions.length > 0 && (
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Current Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {deductions.map((deduction, index) => (
                          <div key={deduction.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="font-medium">{deduction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deduction.amount)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={deduction.amount}
                                onChange={(e) => {
                                  const newDeductions = [...deductions]
                                  newDeductions[index].amount = parseFloat(e.target.value) || 0
                                  setDeductions(newDeductions)
                                }}
                                className="w-32"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setDeductions(deductions.filter((_, i) => i !== index))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Tax Calculation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tax Information Input */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tax Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="income">Annual Income *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="income"
                          type="number"
                          value={taxCalculation?.grossIncome || 0}
                          onChange={(e) => {
                            const newTaxCalculation = { ...taxCalculation };
                            newTaxCalculation.grossIncome = parseFloat(e.target.value) || 0;
                            setTaxCalculation(newTaxCalculation);
                          }}
                          className="pl-10"
                          placeholder="75000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="filingStatus">Filing Status</Label>
                      <Select value={filingStatus} onValueChange={(value) => setFilingStatus(value)}>
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
                      <Select value={state} onValueChange={(value) => setState(value)}>
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
                      <Label htmlFor="salesAmount">Sales Amount (for sales tax)</Label>
                      <Input
                        id="salesAmount"
                        type="number"
                        value={taxCalculation?.salesAmount || 0}
                        onChange={(e) => {
                          const newTaxCalculation = { ...taxCalculation };
                          newTaxCalculation.salesAmount = parseFloat(e.target.value) || 0;
                          setTaxCalculation(newTaxCalculation);
                        }}
                        placeholder="0"
                      />
                    </div>

                    <Button 
                      onClick={calculateTax} 
                      disabled={calculatingTax || taxCalculation?.grossIncome <= 0} 
                      className="w-full"
                    >
                      {calculatingTax ? (
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
                  </div>
                </div>

                {/* Tax Calculation Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tax Calculation Results</h3>
                  {taxCalculation ? (
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          {/* Confidence Score */}
                          {taxCalculation.confidence && (
                            <div className="flex items-center gap-2">
                              <Badge className={taxCalculation.confidence >= 0.9 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                {Math.round(taxCalculation.confidence * 100)}% Confidence
                              </Badge>
                              {taxCalculation.confidence >= 0.9 ? (
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
                              <p className="text-lg font-semibold">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.grossIncome)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Taxable Income</Label>
                              <p className="text-lg font-semibold">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.taxableIncome)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">Federal Tax</Label>
                              <p className="text-lg font-semibold text-red-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.breakdown.federalTax)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm text-muted-foreground">State Tax</Label>
                              <p className="text-lg font-semibold text-red-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.breakdown.stateTax)}
                              </p>
                            </div>
                          </div>

                          {/* Total Tax */}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-lg font-semibold">Total Tax</Label>
                              <p className="text-2xl font-bold text-red-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.totalTax || taxCalculation.taxOwed)}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Effective Rate: {taxCalculation.effectiveRate.toFixed(1)}%
                            </p>
                          </div>

                          {/* Recommendations */}
                          {taxCalculation.recommendations && taxCalculation.recommendations.length > 0 && (
                            <div className="border-t pt-4">
                              <Label className="text-sm font-semibold">Recommendations</Label>
                              <ul className="mt-2 space-y-1">
                                {taxCalculation.recommendations.map((rec: string, index: number) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <AlertCircle className="h-3 w-3 mt-0.5 text-yellow-600" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50">
                      <CardContent className="pt-4">
                        <div className="text-center py-8 text-muted-foreground">
                          <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p>Enter tax information and click "Calculate Tax" to see results</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Deductions & Review */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Tax Calculation Summary */}
              {taxCalculation && (
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Tax Calculation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Gross Income</Label>
                        <p className="text-lg font-semibold">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.grossIncome)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Total Tax</Label>
                        <p className="text-lg font-semibold text-red-600">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCalculation.totalTax || taxCalculation.taxOwed)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Effective Rate</Label>
                        <p className="text-lg font-semibold">{taxCalculation.effectiveRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Confidence</Label>
                        <p className="text-lg font-semibold">{Math.round(taxCalculation.confidence * 100)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Deductions Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Deductions & Itemizations</CardTitle>
                  <CardDescription>
                    Add deductions to reduce taxable income and optimize tax liability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {deductions.map((deduction, index) => (
                      <div key={deduction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium">{deduction.description}</Label>
                            <Badge variant={deduction.isEligible ? "default" : "secondary"}>
                              {deduction.isEligible ? "Eligible" : "Ineligible"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(deduction.amount)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDeductions = deductions.filter((_, i) => i !== index)
                            setDeductions(newDeductions)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const newDeduction = {
                        id: Date.now().toString(),
                        type: "ITEMIZED_DEDUCTION",
                        amount: 0,
                        description: "New Deduction",
                        isEligible: true,
                        category: "ITEMIZED" as const
                      }
                      setDeductions([...deductions, newDeduction])
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deduction
                  </Button>
                </CardContent>
              </Card>

              {/* Form Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Form Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Client</Label>
                      <p className="font-medium">
                        {clients.find(c => c.id === selectedClient)?.name}
                      </p>
                    </div>
                    <div>
                      <Label>Form Type</Label>
                      <p className="font-medium">
                        {/* The form type is now determined by income sources, not a template */}
                        {incomeSources.length > 0 ? incomeSources[0].type : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label>Tax Year</Label>
                      <p className="font-medium">{taxYear}</p>
                    </div>
                    <div>
                      <Label>Form Code</Label>
                      <p className="font-medium">1040</p> {/* Defaulting to 1040 for now */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this tax form..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCreateTaxForm}
                disabled={loading || !canProceed()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Tax Form
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 