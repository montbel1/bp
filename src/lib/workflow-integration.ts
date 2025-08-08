// Workflow Integration System for End-to-End Testing
// This connects all our practice management modules

export interface WorkflowStep {
  id: string
  name: string
  description: string
  module: string
  route: string
  required: boolean
  completed: boolean
  data?: any
}

export interface Workflow {
  id: string
  name: string
  description: string
  persona: string
  steps: WorkflowStep[]
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

export const workflows: Workflow[] = [
  {
    id: 'cpa-client-onboarding',
    name: 'CPA Client Onboarding',
    description: 'Complete client onboarding workflow for CPA practice',
    persona: 'CPA',
    status: 'pending',
    steps: [
      {
        id: 'client-creation',
        name: 'Create Client Profile',
        description: 'Add new client to the system',
        module: 'Client Management',
        route: '/flow/clients',
        required: true,
        completed: false
      },
      {
        id: 'risk-assessment',
        name: 'Complete Risk Assessment',
        description: 'Evaluate client risk factors',
        module: 'Risk Assessment',
        route: '/flow/clients/risk-assessment',
        required: true,
        completed: false
      },
      {
        id: 'document-upload',
        name: 'Upload Client Documents',
        description: 'Upload and organize client documents',
        module: 'Document Management',
        route: '/flow/documents',
        required: true,
        completed: false
      },
      {
        id: 'engagement-letter',
        name: 'Create Engagement Letter',
        description: 'Generate and send engagement letter',
        module: 'Workflow Automation',
        route: '/flow/workflow',
        required: true,
        completed: false
      },
      {
        id: 'billing-setup',
        name: 'Configure Billing',
        description: 'Set up billing rates and terms',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'calendar-scheduling',
        name: 'Schedule Initial Meeting',
        description: 'Schedule first client consultation',
        module: 'Calendar System',
        route: '/flow/calendar',
        required: true,
        completed: false
      }
    ]
  },
  {
    id: 'tax-preparer-document-workflow',
    name: 'Tax Preparer Document Management',
    description: 'Complete document management workflow for tax preparation',
    persona: 'Tax Preparer',
    status: 'pending',
    steps: [
      {
        id: 'document-upload-tax',
        name: 'Upload Tax Documents',
        description: 'Upload W-2s, 1099s, and other tax documents',
        module: 'Document Management',
        route: '/flow/documents',
        required: true,
        completed: false
      },
      {
        id: 'document-organization',
        name: 'Organize Documents',
        description: 'Categorize and organize uploaded documents',
        module: 'Document Management',
        route: '/flow/documents',
        required: true,
        completed: false
      },
      {
        id: 'security-setup',
        name: 'Set Security Controls',
        description: 'Configure document access and security',
        module: 'Document Management',
        route: '/flow/documents',
        required: true,
        completed: false
      },
      {
        id: 'client-communication',
        name: 'Notify Client',
        description: 'Send secure message to client about documents',
        module: 'Client Communication',
        route: '/flow/communication',
        required: true,
        completed: false
      },
      {
        id: 'quality-review',
        name: 'Quality Review',
        description: 'Review documents for completeness',
        module: 'Quality Control',
        route: '/flow/clients/quality-control',
        required: true,
        completed: false
      },
      {
        id: 'client-portal-access',
        name: 'Grant Portal Access',
        description: 'Set up client portal access for document review',
        module: 'Client Portal',
        route: '/flow/communication/client-portal',
        required: true,
        completed: false
      }
    ]
  },
  {
    id: 'cfo-analytics-workflow',
    name: 'CFO Analytics & Reporting',
    description: 'Complete analytics and reporting workflow for CFO',
    persona: 'CFO',
    status: 'pending',
    steps: [
      {
        id: 'access-dashboard',
        name: 'Access Analytics Dashboard',
        description: 'Open the main analytics dashboard',
        module: 'Reports & Analytics',
        route: '/flow/reports',
        required: true,
        completed: false
      },
      {
        id: 'revenue-analysis',
        name: 'Review Revenue Metrics',
        description: 'Analyze revenue trends and performance',
        module: 'Reports & Analytics',
        route: '/flow/reports',
        required: true,
        completed: false
      },
      {
        id: 'client-profitability',
        name: 'Client Profitability Analysis',
        description: 'Review client profitability metrics',
        module: 'Reports & Analytics',
        route: '/flow/reports',
        required: true,
        completed: false
      },
      {
        id: 'staff-productivity',
        name: 'Staff Productivity Review',
        description: 'Analyze team performance and productivity',
        module: 'Team Management',
        route: '/flow/team',
        required: true,
        completed: false
      },
      {
        id: 'generate-reports',
        name: 'Generate Reports',
        description: 'Create comprehensive financial reports',
        module: 'Reports & Analytics',
        route: '/flow/reports',
        required: true,
        completed: false
      },
      {
        id: 'export-data',
        name: 'Export Financial Data',
        description: 'Export data for external analysis',
        module: 'Reports & Analytics',
        route: '/flow/reports',
        required: true,
        completed: false
      }
    ]
  },
  {
    id: 'bookkeeper-billing-workflow',
    name: 'Bookkeeper Billing & Time Tracking',
    description: 'Complete billing and time tracking workflow for bookkeeper',
    persona: 'Bookkeeper',
    status: 'pending',
    steps: [
      {
        id: 'time-entry',
        name: 'Log Time Entries',
        description: 'Record billable time for clients',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'billing-rates',
        name: 'Set Billing Rates',
        description: 'Configure hourly rates and billing terms',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'generate-invoices',
        name: 'Generate Invoices',
        description: 'Create invoices from time entries',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'payment-tracking',
        name: 'Track Payments',
        description: 'Monitor invoice payment status',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'recurring-billing',
        name: 'Set Up Recurring Billing',
        description: 'Configure automated recurring invoices',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      },
      {
        id: 'billing-reports',
        name: 'Generate Billing Reports',
        description: 'Create billing and revenue reports',
        module: 'Billing & Time Tracking',
        route: '/flow/billing',
        required: true,
        completed: false
      }
    ]
  }
]

export const workflowService = {
  // Get all workflows
  getWorkflows: (): Workflow[] => {
    return workflows
  },

  // Get workflow by ID
  getWorkflow: (id: string): Workflow | undefined => {
    return workflows.find(w => w.id === id)
  },

  // Complete a workflow step
  completeStep: (workflowId: string, stepId: string): Workflow | undefined => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      const step = workflow.steps.find(s => s.id === stepId)
      if (step) {
        step.completed = true
        
        // Check if all required steps are completed
        const allRequiredCompleted = workflow.steps
          .filter(s => s.required)
          .every(s => s.completed)
        
        if (allRequiredCompleted) {
          workflow.status = 'completed'
        } else {
          workflow.status = 'in-progress'
        }
      }
    }
    return workflow
  },

  // Get workflow progress
  getProgress: (workflowId: string): { completed: number, total: number, percentage: number } => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      const completed = workflow.steps.filter(s => s.completed).length
      const total = workflow.steps.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      return { completed, total, percentage }
    }
    return { completed: 0, total: 0, percentage: 0 }
  },

  // Reset workflow
  resetWorkflow: (workflowId: string): Workflow | undefined => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      workflow.steps.forEach(step => {
        step.completed = false
      })
      workflow.status = 'pending'
    }
    return workflow
  }
} 
