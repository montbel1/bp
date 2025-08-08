"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSimpleAuth } from "@/components/providers/simple-auth-provider"
import { workflowService, type Workflow } from "@/lib/workflow-integration"
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Building2, 
  FileText, 
  Calendar,
  DollarSign,
  Shield,
  Users,
  MessageSquare,
  BarChart3,
  Play,
  RotateCcw,
  ExternalLink
} from "lucide-react"

export default function TestWorkflows() {
  const router = useRouter()
  const { user } = useSimpleAuth()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)

  useEffect(() => {
    // Load workflows
    setWorkflows(workflowService.getWorkflows())
  }, [])

  const runWorkflowStep = (workflowId: string, stepId: string) => {
    const updatedWorkflow = workflowService.completeStep(workflowId, stepId)
    if (updatedWorkflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? updatedWorkflow : w
      ))
      setSelectedWorkflow(updatedWorkflow)
    }
  }

  const resetWorkflow = (workflowId: string) => {
    const resetWorkflow = workflowService.resetWorkflow(workflowId)
    if (resetWorkflow) {
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId ? resetWorkflow : w
      ))
      setSelectedWorkflow(resetWorkflow)
    }
  }

  const navigateToStep = (route: string) => {
    router.push(route)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'CPA':
        return <Building2 className="h-4 w-4" />
      case 'Tax Preparer':
        return <FileText className="h-4 w-4" />
      case 'CFO':
        return <BarChart3 className="h-4 w-4" />
      case 'Bookkeeper':
        return <DollarSign className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'in-progress':
        return 'bg-blue-50 border-blue-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          End-to-End Workflow Testing
        </h1>
        <p className="text-gray-600">
          Test complete workflows for financial professionals from login to completion
        </p>
        {user && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current User:</strong> {user.email} ({user.name || 'Unknown'})
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {workflows.map((workflow) => {
          const progress = workflowService.getProgress(workflow.id)
          
          return (
            <Card key={workflow.id} className={`border-2 ${getStatusColor(workflow.status)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPersonaIcon(workflow.persona)}
                    <Badge variant="outline">{workflow.persona}</Badge>
                  </div>
                  {getStatusIcon(workflow.status)}
                </div>
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.completed}/{progress.total} ({progress.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Workflow Steps:</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {workflow.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          step.completed 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {step.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-gray-300" />
                          )}
                          <span className="flex-1">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {step.module}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigateToStep(step.route)}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      const nextIncompleteStep = workflow.steps.find(s => !s.completed)
                      if (nextIncompleteStep) {
                        runWorkflowStep(workflow.id, nextIncompleteStep.id)
                      }
                    }}
                    disabled={workflow.status === 'completed'}
                    className="flex-1"
                  >
                    {workflow.status === 'completed' ? 'Completed' : 'Complete Next Step'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => resetWorkflow(workflow.id)}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
          <CardDescription>
            Overall application functionality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {workflows.filter(w => w.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {workflows.filter(w => w.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {workflows.filter(w => w.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {workflows.filter(w => w.status === 'failed').length}
              </div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">How to Test:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Click &quot;Complete Next Step&quot; to simulate workflow progress</li>
              <li>Click the external link icon to navigate to the actual module</li>
              <li>Test the real functionality in each module</li>
              <li>Use &quot;Reset&quot; to start over</li>
              <li>Complete all steps to finish the workflow</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 