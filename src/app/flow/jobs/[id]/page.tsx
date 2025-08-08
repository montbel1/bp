"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Edit, 
  Clock, 
  DollarSign, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Plus,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  budgetHours: number
  budget: number
  progress: number
  assignedToId: string
  client: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  tasks: Task[]
  timeEntries: TimeEntry[]
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  estimatedHours: number
  actualHours: number
}

interface TimeEntry {
  id: string
  description: string
  startTime: string
  endTime: string
  duration: number
  isBillable: boolean
}

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [timerRunning, setTimerRunning] = useState(false)
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null)

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/flow/jobs/${jobId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch job details")
      }
      const data = await response.json()
      setJob(data.job)
    } catch (error) {
      console.error("Error fetching job details:", error)
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const updateJobStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/flow/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) {
        throw new Error("Failed to update job status")
      }
      
      await fetchJobDetails()
      toast.success("Job status updated successfully!")
    } catch (error) {
      console.error("Error updating job status:", error)
      toast.error("Failed to update job status")
    }
  }

  const startTimer = async () => {
    try {
      const response = await fetch(`/api/flow/jobs/${jobId}/time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Time tracking for job",
          billable: true
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to start timer")
      }
      
      const data = await response.json()
      setCurrentTimeEntry(data.timeEntry)
      setTimerRunning(true)
      toast.success("Timer started!")
    } catch (error) {
      console.error("Error starting timer:", error)
      toast.error("Failed to start timer")
    }
  }

  const stopTimer = async () => {
    try {
      const response = await fetch(`/api/flow/jobs/${jobId}/time/${currentTimeEntry?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endTime: new Date().toISOString() })
      })
      
      if (!response.ok) {
        throw new Error("Failed to stop timer")
      }
      
      setTimerRunning(false)
      setCurrentTimeEntry(null)
      await fetchJobDetails()
      toast.success("Timer stopped!")
    } catch (error) {
      console.error("Error stopping timer:", error)
      toast.error("Failed to stop timer")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "ON_HOLD": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW": return "bg-green-100 text-green-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "HIGH": return "bg-orange-100 text-orange-800"
      case "URGENT": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
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

  if (!job) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
          <p className="text-gray-600 mt-2">The job you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground">Job Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/flow/jobs/${jobId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {!timerRunning ? (
            <Button onClick={startTimer}>
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopTimer}>
              <Square className="h-4 w-4 mr-2" />
              Stop Timer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Priority</Label>
                  <Badge className={getPriorityColor(job.priority)}>
                    {job.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Due Date</Label>
                  <p className="font-medium">{new Date(job.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Progress</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={job.progress} className="flex-1" />
                    <span className="text-sm font-medium">{job.progress}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="mt-1">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                {job.tasks.length} tasks for this job
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {job.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'COMPLETED' ? 'bg-green-500' : 
                        task.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{task.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {task.actualHours || task.estimatedHours}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>
                Tracked time for this job
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {job.timeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.startTime).toLocaleString()} - {new Date(entry.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.isBillable ? "default" : "secondary"}>
                        {entry.isBillable ? "Billable" : "Non-billable"}
                      </Badge>
                      <span className="font-medium">{entry.duration}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{job.client.name}</span>
                </div>
                {job.client.companyName && (
                  <p className="text-sm text-muted-foreground">{job.client.companyName}</p>
                )}
                <p className="text-sm text-muted-foreground">{job.client.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Budget Info */}
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Budget Hours</span>
                  <span className="font-medium">{job.budgetHours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Budget Amount</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.budget)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => updateJobStatus("IN_PROGRESS")}
                disabled={job.status === "IN_PROGRESS"}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Job
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => updateJobStatus("COMPLETED")}
                disabled={job.status === "COMPLETED"}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => updateJobStatus("ON_HOLD")}
                disabled={job.status === "ON_HOLD"}
              >
                <Pause className="h-4 w-4 mr-2" />
                Put On Hold
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 