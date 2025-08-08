"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Calendar,
  Save,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Plus,
  Zap,
  Play
} from "lucide-react"
import { toast } from "sonner"
import { InlineClientSelector } from "@/components/ui/inline-client-form"

interface Client {
  id: string
  name: string
  email: string
  companyName?: string
}

interface JobTemplate {
  id: string
  name: string
  description: string
  estimatedHours: number
  tasks: string[]
}

const jobTemplates: JobTemplate[] = [
  {
    id: "tax-preparation",
    name: "Tax Return Preparation",
    description: "Complete tax return preparation for individual or business",
    estimatedHours: 8,
    tasks: [
      "Gather client documents",
      "Review financial records",
      "Prepare tax forms",
      "Calculate tax liability",
      "Review with client",
      "File tax return"
    ]
  },
  {
    id: "bookkeeping",
    name: "Monthly Bookkeeping",
    description: "Monthly bookkeeping and financial statement preparation",
    estimatedHours: 4,
    tasks: [
      "Reconcile bank accounts",
      "Categorize transactions",
      "Prepare financial statements",
      "Review with client"
    ]
  },
  {
    id: "audit-preparation",
    name: "Audit Preparation",
    description: "Prepare client for external audit",
    estimatedHours: 16,
    tasks: [
      "Review financial records",
      "Prepare audit schedules",
      "Gather supporting documentation",
      "Coordinate with auditors",
      "Address audit findings"
    ]
  },
  {
    id: "consulting",
    name: "Business Consulting",
    description: "Strategic business consulting and advisory services",
    estimatedHours: 12,
    tasks: [
      "Analyze business operations",
      "Identify improvement opportunities",
      "Develop recommendations",
      "Present findings to client",
      "Implement changes"
    ]
  }
]

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [quickStartLoading, setQuickStartLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    estimatedHours: 0,
    budget: 0,
    assignedTo: "",
    tags: ""
  })

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
      toast.error("Failed to load clients")
    }
  }

  const handleCreateJob = async () => {
    if (!selectedClient || !formData.title || !formData.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/flow/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          estimatedHours: formData.estimatedHours,
          budget: formData.budget,
          assignedTo: formData.assignedTo,
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
          clientId: selectedClient,
          templateId: selectedTemplate
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create job")
      }

      const result = await response.json()
      toast.success("Job created successfully!")
      router.push(`/flow/jobs/${result.job.id}`)
    } catch (error) {
      console.error("Error creating job:", error)
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleQuickStart = async () => {
    if (!selectedClient || !formData.title) {
      toast.error("Please select a client and provide a job title.")
      return
    }
    setQuickStartLoading(true)
    setFormData(prev => ({
      ...prev,
      dueDate: "", // Clear due date for quick start
      priority: "MEDIUM",
      estimatedHours: 0,
      budget: 0,
      assignedTo: "",
      tags: ""
    }))
    setSelectedTemplate("") // Clear template for quick start
    await handleCreateJob()
    setQuickStartLoading(false)
  }

  const getSelectedTemplate = () => {
    return jobTemplates.find(t => t.id === selectedTemplate)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = jobTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.name,
        description: template.description,
        estimatedHours: template.estimatedHours
      }))
    }
  }

  const handleNewClientCreated = (newClient: Client) => {
    setClients([...clients, newClient])
    setSelectedClient(newClient.id)
    setShowNewClientForm(false)
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
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground">Set up a new job for your practice</p>
        </div>
      </div>

      {/* Quick Start Section - For users like Sarah */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Start - Start Tracking Time Now
          </CardTitle>
          <CardDescription>
            Need to start tracking time immediately? Use this quick option and add details later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quickClient">Client</Label>
              <InlineClientSelector
                clients={clients}
                selectedClient={selectedClient}
                onClientSelect={setSelectedClient}
                onShowForm={() => setShowNewClientForm(true)}
                showForm={showNewClientForm}
                onClientCreated={handleNewClientCreated}
                onCancel={() => setShowNewClientForm(false)}
                type="client"
              />
            </div>
            <div>
              <Label htmlFor="quickTitle">Job Title</Label>
              <Input
                id="quickTitle"
                placeholder="e.g., Consulting Session"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleQuickStart}
                disabled={!selectedClient || !formData.title || quickStartLoading}
                className="w-full"
              >
                {quickStartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Tracking Time
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Enter the basic information for this job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Tax Return Preparation - ABC Corp"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client *</Label>
                  <InlineClientSelector
                    clients={clients}
                    selectedClient={selectedClient}
                    onClientSelect={setSelectedClient}
                    onShowForm={() => setShowNewClientForm(true)}
                    showForm={showNewClientForm}
                    onClientCreated={handleNewClientCreated}
                    onCancel={() => setShowNewClientForm(false)}
                    type="client"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the job requirements and objectives..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    placeholder="Team member name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="estimatedHours"
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({...formData, estimatedHours: parseFloat(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="tax, urgent, review (comma separated)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Job
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Job Templates</CardTitle>
              <CardDescription>Quick start with predefined job types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{template.name}</h4>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{template.estimatedHours}h estimated</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Template Details */}
          {selectedTemplate && getSelectedTemplate() && (
            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Tasks</Label>
                    <ul className="mt-2 space-y-1">
                      {getSelectedTemplate()?.tasks.map((task, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Estimated Hours:</span>
                      <span className="font-medium">{getSelectedTemplate()?.estimatedHours}h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-blue-600 mt-0.5" />
                  <span>Set realistic due dates to avoid delays</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-blue-600 mt-0.5" />
                  <span>Use templates to save time on common jobs</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-blue-600 mt-0.5" />
                  <span>Add tags for better organization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 