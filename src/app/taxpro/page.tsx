"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  FileCheck, 
  Users, 
  Calendar, 
  Upload, 
  Calculator,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Zap,
  Shield,
  Lock,
  Unlock,
  RefreshCw,
  BarChart3,
  Settings,
  Bell,
  Star
} from "lucide-react"
import { toast } from "sonner"

interface TaxForm {
  id: string
  formType: string
  taxYear: number
  status: string
  clientName: string
  dueDate: string
  isEligibleForEfile: boolean
  efileStatus?: string
  progress: number
  lastUpdated: string
}

interface TaxDocument {
  id: string
  name: string
  status: string
  clientName: string
  isRequired: boolean
  isReceived: boolean
  dueDate?: string
  uploadedAt?: string
}

interface TaxClient {
  id: string
  name: string
  email: string
  filingStatus: string
  dependents: number
  previousYearIncome: number
  previousYearRefund: number
  estimatedTaxPayments: number
  formsCount: number
  documentsCount: number
  lastActivity: string
}

interface TaxDeadline {
  id: string
  deadlineType: string
  dueDate: string
  description: string
  clientName: string
  isCompleted: boolean
  daysRemaining: number
}

// Sample data for Drake-like functionality
const sampleTaxForms: TaxForm[] = [
  {
    id: "1",
    formType: "1040",
    taxYear: 2024,
    status: "IN_REVIEW",
    clientName: "John Smith",
    dueDate: "2025-04-15",
    isEligibleForEfile: true,
    efileStatus: "READY",
    progress: 85,
    lastUpdated: "2025-01-15"
  },
  {
    id: "2",
    formType: "1120",
    taxYear: 2024,
    status: "DRAFT",
    clientName: "ABC Corporation",
    dueDate: "2025-03-15",
    isEligibleForEfile: true,
    efileStatus: "READY",
    progress: 45,
    lastUpdated: "2025-01-14"
  },
  {
    id: "3",
    formType: "1065",
    taxYear: 2024,
    status: "PENDING_SIGNATURE",
    clientName: "Smith Partnership",
    dueDate: "2025-03-15",
    isEligibleForEfile: true,
    efileStatus: "READY",
    progress: 95,
    lastUpdated: "2025-01-15"
  }
]

const sampleDocuments: TaxDocument[] = [
  {
    id: "1",
    name: "W-2 Form",
    status: "RECEIVED",
    clientName: "John Smith",
    isRequired: true,
    isReceived: true,
    uploadedAt: "2025-01-10"
  },
  {
    id: "2",
    name: "1099-INT",
    status: "PENDING",
    clientName: "John Smith",
    isRequired: true,
    isReceived: false,
    dueDate: "2025-01-20"
  },
  {
    id: "3",
    name: "Schedule C",
    status: "RECEIVED",
    clientName: "John Smith",
    isRequired: false,
    isReceived: true,
    uploadedAt: "2025-01-12"
  }
]

const sampleClients: TaxClient[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    filingStatus: "MARRIED",
    dependents: 2,
    previousYearIncome: 75000,
    previousYearRefund: 2500,
    estimatedTaxPayments: 18000,
    formsCount: 1,
    documentsCount: 8,
    lastActivity: "2025-01-15"
  },
  {
    id: "2",
    name: "ABC Corporation",
    email: "contact@abc.com",
    filingStatus: "CORPORATE",
    dependents: 0,
    previousYearIncome: 250000,
    previousYearRefund: 0,
    estimatedTaxPayments: 75000,
    formsCount: 1,
    documentsCount: 12,
    lastActivity: "2025-01-14"
  }
]

const sampleDeadlines: TaxDeadline[] = [
  {
    id: "1",
    deadlineType: "1040",
    dueDate: "2025-04-15",
    description: "Individual Tax Return Due",
    clientName: "John Smith",
    isCompleted: false,
    daysRemaining: 89
  },
  {
    id: "2",
    deadlineType: "1120",
    dueDate: "2025-03-15",
    description: "Corporate Tax Return Due",
    clientName: "ABC Corporation",
    isCompleted: false,
    daysRemaining: 58
  },
  {
    id: "3",
    deadlineType: "ESTIMATED",
    dueDate: "2025-01-15",
    description: "Q4 Estimated Tax Payment",
    clientName: "John Smith",
    isCompleted: true,
    daysRemaining: 0
  }
]

export default function TaxProPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [taxForms, setTaxForms] = useState<TaxForm[]>(sampleTaxForms)
  const [documents, setDocuments] = useState<TaxDocument[]>(sampleDocuments)
  const [clients, setClients] = useState<TaxClient[]>(sampleClients)
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>(sampleDeadlines)

  const stats = {
    totalForms: taxForms.length,
    pendingForms: taxForms.filter(f => f.status === "DRAFT" || f.status === "IN_REVIEW").length,
    completedForms: taxForms.filter(f => f.status === "FINALIZED" || f.status === "SUBMITTED").length,
    overdueForms: taxForms.filter(f => new Date(f.dueDate) < new Date()).length,
    totalDocuments: documents.length,
    pendingDocuments: documents.filter(d => d.status === "PENDING").length,
    totalClients: clients.length,
    activeClients: clients.filter(c => new Date(c.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    upcomingDeadlines: deadlines.filter(d => !d.isCompleted && d.daysRemaining <= 30).length,
    efileReady: taxForms.filter(f => f.efileStatus === "READY").length
  }

  const handleSyncBookkeeping = () => {
    toast.success("Syncing financial data from Avanee BookPro...")
    // Simulate API call
    setTimeout(() => {
      toast.success("Financial data synced successfully!")
    }, 2000)
  }

  const handleSyncPracticeMgmt = () => {
    toast.success("Syncing client data from Flow Practice Management...")
    // Simulate API call
    setTimeout(() => {
      toast.success("Client data synced successfully!")
    }, 2000)
  }

  const handleCreateTaxForm = () => {
    router.push("/taxpro/new")
  }

  const handleUploadDocument = () => {
    toast.success("Uploading document...")
    // Simulate API call
    setTimeout(() => {
      toast.success("Document uploaded successfully!")
    }, 1500)
  }

  const handleEfileForm = (formId: string) => {
    toast.success("Preparing for e-filing...")
    // Simulate API call
    setTimeout(() => {
      toast.success("Tax form submitted for e-filing!")
    }, 2000)
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

  const getEfileStatusColor = (status?: string) => {
    switch (status) {
      case "READY": return "bg-green-500"
      case "SUBMITTED": return "bg-blue-500"
      case "ACCEPTED": return "bg-green-600"
      case "REJECTED": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileCheck className="h-8 w-8 text-blue-600" />
            TaxPro
          </h1>
          <p className="text-muted-foreground">Professional tax preparation and filing</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            PRO
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax Forms</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingForms} pending, {stats.completedForms} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-File Ready</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.efileReady}</div>
            <p className="text-xs text-muted-foreground">
              Ready for electronic filing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalClients} total clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              Due within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Tax Forms</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tax Forms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Tax Forms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {taxForms.slice(0, 3).map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{form.formType} - {form.taxYear}</span>
                        <Badge className={getStatusColor(form.status)}>
                          {form.status.replace('_', ' ')}
                        </Badge>
                        {form.isEligibleForEfile && form.efileStatus === "READY" && (
                          <Badge className="bg-green-500">E-File Ready</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{form.clientName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={form.progress} className="flex-1" />
                        <span className="text-sm">{form.progress}%</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleEfileForm(form.id)}
                      disabled={!form.isEligibleForEfile || form.efileStatus !== "READY"}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      E-File
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleCreateTaxForm} className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tax Form
                </Button>
                <Button onClick={handleUploadDocument} variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button onClick={handleSyncBookkeeping} variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Bookkeeping Data
                </Button>
                <Button onClick={handleSyncPracticeMgmt} variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Practice Management
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deadlines.filter(d => !d.isCompleted && d.daysRemaining <= 30).map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${deadline.daysRemaining <= 7 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <div className="font-medium">{deadline.description}</div>
                        <div className="text-sm text-muted-foreground">{deadline.clientName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{deadline.daysRemaining} days</div>
                      <div className="text-sm text-muted-foreground">{deadline.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Forms Tab */}
        <TabsContent value="forms" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tax forms..."
                className="px-3 py-2 border rounded-md"
              />
            </div>
            <Button onClick={handleCreateTaxForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Tax Form
            </Button>
          </div>

          <div className="space-y-4">
            {taxForms.map((form) => (
              <Card key={form.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{form.formType} - {form.taxYear}</h3>
                        <Badge className={getStatusColor(form.status)}>
                          {form.status.replace('_', ' ')}
                        </Badge>
                        {form.isEligibleForEfile && (
                          <Badge className={getEfileStatusColor(form.efileStatus)}>
                            {form.efileStatus || 'NOT_READY'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{form.clientName}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Due: {form.dueDate}</span>
                        <span>Progress: {form.progress}%</span>
                        <span>Updated: {form.lastUpdated}</span>
                      </div>
                      <Progress value={form.progress} className="mt-3" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => router.push(`/taxpro/forms/${form.id}`)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/taxpro/forms/${form.id}`)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {form.isEligibleForEfile && form.efileStatus === "READY" && (
                        <Button size="sm" onClick={() => handleEfileForm(form.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          E-File
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="px-3 py-2 border rounded-md"
              />
            </div>
            <Button onClick={handleUploadDocument}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{doc.name}</h3>
                        <Badge variant={doc.isRequired ? "default" : "secondary"}>
                          {doc.isRequired ? "Required" : "Optional"}
                        </Badge>
                        <Badge className={doc.isReceived ? "bg-green-500" : "bg-yellow-500"}>
                          {doc.isReceived ? "Received" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{doc.clientName}</p>
                      {doc.dueDate && (
                        <p className="text-sm text-muted-foreground">Due: {doc.dueDate}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients..."
                className="px-3 py-2 border rounded-md"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <p className="text-muted-foreground">{client.email}</p>
                    </div>
                    <Badge variant="outline">{client.filingStatus}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Dependents</p>
                      <p className="font-medium">{client.dependents}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Previous Income</p>
                      <p className="font-medium">${client.previousYearIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Previous Refund</p>
                      <p className="font-medium">${client.previousYearRefund.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Payments</p>
                      <p className="font-medium">${client.estimatedTaxPayments.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Forms: {client.formsCount}</p>
                      <p className="text-muted-foreground">Documents: {client.documentsCount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Deadlines Tab */}
        <TabsContent value="deadlines" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select className="px-3 py-2 border rounded-md">
                <option>All Deadlines</option>
                <option>Overdue</option>
                <option>Due This Week</option>
                <option>Due This Month</option>
              </select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Deadline
            </Button>
          </div>

          <div className="space-y-4">
            {deadlines.map((deadline) => (
              <Card key={deadline.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{deadline.description}</h3>
                        <Badge variant={deadline.isCompleted ? "default" : "secondary"}>
                          {deadline.isCompleted ? "Completed" : "Pending"}
                        </Badge>
                        <Badge variant={deadline.daysRemaining <= 7 ? "destructive" : "outline"}>
                          {deadline.daysRemaining} days
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{deadline.clientName}</p>
                      <p className="text-sm text-muted-foreground">Due: {deadline.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {!deadline.isCompleted && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tax Calendar
              </CardTitle>
              <CardDescription>
                View and manage tax-related deadlines and appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Calendar integration coming soon. This will show tax deadlines, 
                  client appointments, and important dates.
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Calendar Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 