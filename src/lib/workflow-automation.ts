export interface WorkflowRule {
  id: string
  name: string
  description: string
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  isActive: boolean
  priority: number
}

export interface WorkflowCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

export interface WorkflowAction {
  type: 'create_job' | 'send_email' | 'create_invoice' | 'send_reminder' | 'update_status'
  data: any
}

export interface WorkflowTrigger {
  entityType: 'transaction' | 'invoice' | 'job' | 'client'
  entityId: string
  event: 'created' | 'updated' | 'completed' | 'overdue'
  data: any
}

export class WorkflowAutomationService {
  private static rules: WorkflowRule[] = [
    {
      id: 'auto_invoice_large_transactions',
      name: 'Auto-Create Invoice for Large Transactions',
      description: 'Automatically create invoices for transactions over $1000',
      conditions: [
        { field: 'amount', operator: 'greater_than', value: 1000 },
        { field: 'type', operator: 'equals', value: 'CREDIT' }
      ],
      actions: [
        {
          type: 'create_invoice',
          data: {
            template: 'standard',
            autoSend: false,
            includeTransaction: true
          }
        }
      ],
      isActive: true,
      priority: 1
    },
    {
      id: 'overdue_job_reminder',
      name: 'Overdue Job Reminder',
      description: 'Send reminder for jobs past due date',
      conditions: [
        { field: 'status', operator: 'equals', value: 'IN_PROGRESS' },
        { field: 'dueDate', operator: 'less_than', value: 'today' }
      ],
      actions: [
        {
          type: 'send_reminder',
          data: {
            template: 'overdue_job',
            recipients: ['assigned_to', 'client'],
            urgency: 'high'
          }
        }
      ],
      isActive: true,
      priority: 2
    },
    {
      id: 'month_end_reconciliation',
      name: 'Month-End Reconciliation',
      description: 'Create reconciliation job at month end',
      conditions: [
        { field: 'date', operator: 'equals', value: 'last_day_of_month' }
      ],
      actions: [
        {
          type: 'create_job',
          data: {
            template: 'month_end_reconciliation',
            priority: 'HIGH',
            autoAssign: true
          }
        }
      ],
      isActive: true,
      priority: 3
    },
    {
      id: 'new_client_welcome',
      name: 'New Client Welcome',
      description: 'Send welcome email to new clients',
      conditions: [
        { field: 'entityType', operator: 'equals', value: 'client' },
        { field: 'event', operator: 'equals', value: 'created' }
      ],
      actions: [
        {
          type: 'send_email',
          data: {
            template: 'welcome_client',
            recipients: ['client_email'],
            includeAttachments: ['welcome_packet']
          }
        }
      ],
      isActive: true,
      priority: 4
    }
  ]

  static async processTrigger(trigger: WorkflowTrigger): Promise<void> {
    const applicableRules = this.getApplicableRules(trigger)
    
    for (const rule of applicableRules) {
      if (this.evaluateConditions(rule.conditions, trigger.data)) {
        await this.executeActions(rule.actions, trigger.data)
      }
    }
  }

  private static getApplicableRules(trigger: WorkflowTrigger): WorkflowRule[] {
    return this.rules
      .filter(rule => rule.isActive)
      .filter(rule => 
        rule.conditions.some(condition => 
          condition.field === 'entityType' && 
          condition.value === trigger.entityType
        )
      )
      .sort((a, b) => a.priority - b.priority)
  }

  private static evaluateConditions(conditions: WorkflowCondition[], data: any): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getFieldValue(condition.field, data)
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value
        case 'contains':
          return String(fieldValue).includes(String(condition.value))
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value)
        case 'less_than':
          return Number(fieldValue) < Number(condition.value)
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue)
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue)
        default:
          return false
      }
    })
  }

  private static getFieldValue(field: string, data: any): any {
    const fieldPath = field.split('.')
    let value = data
    
    for (const path of fieldPath) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path]
      } else {
        return undefined
      }
    }
    
    return value
  }

  private static async executeActions(actions: WorkflowAction[], data: any): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'create_job':
            await this.createJob(action.data, data)
            break
          case 'send_email':
            await this.sendEmail(action.data, data)
            break
          case 'create_invoice':
            await this.createInvoice(action.data, data)
            break
          case 'send_reminder':
            await this.sendReminder(action.data, data)
            break
          case 'update_status':
            await this.updateStatus(action.data, data)
            break
        }
      } catch (error) {
        console.error(`Failed to execute workflow action ${action.type}:`, error)
      }
    }
  }

  private static async createJob(template: any, data: any): Promise<void> {
    console.log('Creating job from workflow:', template, data)
    // Implementation would call the job creation API
  }

  private static async sendEmail(template: any, data: any): Promise<void> {
    console.log('Sending email from workflow:', template, data)
    // Implementation would call the email service
  }

  private static async createInvoice(template: any, data: any): Promise<void> {
    console.log('Creating invoice from workflow:', template, data)
    // Implementation would call the invoice creation API
  }

  private static async sendReminder(template: any, data: any): Promise<void> {
    console.log('Sending reminder from workflow:', template, data)
    // Implementation would call the notification service
  }

  private static async updateStatus(status: any, data: any): Promise<void> {
    console.log('Updating status from workflow:', status, data)
    // Implementation would update the entity status
  }

  static async addRule(rule: WorkflowRule): Promise<void> {
    this.rules.push(rule)
  }

  static async updateRule(ruleId: string, updates: Partial<WorkflowRule>): Promise<void> {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates }
    }
  }

  static async deleteRule(ruleId: string): Promise<void> {
    this.rules = this.rules.filter(r => r.id !== ruleId)
  }

  static getRules(): WorkflowRule[] {
    return [...this.rules]
  }
} 
