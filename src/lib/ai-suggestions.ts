export interface AISuggestion {
  id: string
  type: 'workflow' | 'template' | 'category' | 'reminder'
  title: string
  description: string
  confidence: number
  action: string
  data?: any
}

export interface UserPattern {
  userId: string
  action: string
  frequency: number
  lastUsed: Date
  success: boolean
}

export class AISuggestionService {
  private static patterns: Map<string, UserPattern[]> = new Map()

  static async getSuggestions(userId: string, context: string): Promise<AISuggestion[]> {
    const userPatterns = this.patterns.get(userId) || []
    const suggestions: AISuggestion[] = []

    // Analyze patterns and generate suggestions
    const frequentActions = this.analyzePatterns(userPatterns)
    
    // Generate workflow suggestions
    if (context === 'job_creation') {
      suggestions.push(...this.generateJobSuggestions(frequentActions))
    }
    
    if (context === 'invoice_creation') {
      suggestions.push(...this.generateInvoiceSuggestions(frequentActions))
    }
    
    if (context === 'time_tracking') {
      suggestions.push(...this.generateTimeTrackingSuggestions(frequentActions))
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence)
  }

  private static analyzePatterns(patterns: UserPattern[]): Map<string, number> {
    const actionFrequency = new Map<string, number>()
    
    patterns.forEach(pattern => {
      const current = actionFrequency.get(pattern.action) || 0
      actionFrequency.set(pattern.action, current + pattern.frequency)
    })
    
    return actionFrequency
  }

  private static generateJobSuggestions(frequentActions: Map<string, number>): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    
    // Suggest based on frequent job types
    if ((frequentActions.get('tax_preparation') || 0) > 5) {
      suggestions.push({
        id: 'tax_template',
        type: 'template',
        title: 'Tax Preparation Template',
        description: 'Based on your frequent tax preparation work',
        confidence: 0.9,
        action: 'use_template',
        data: { templateId: 'tax-preparation' }
      })
    }
    
    if ((frequentActions.get('consulting') || 0) > 3) {
      suggestions.push({
        id: 'consulting_template',
        type: 'template',
        title: 'Consulting Session Template',
        description: 'Quick start for your consulting sessions',
        confidence: 0.8,
        action: 'use_template',
        data: { templateId: 'consulting' }
      })
    }
    
    return suggestions
  }

  private static generateInvoiceSuggestions(frequentActions: Map<string, number>): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    
    // Suggest frequent clients
    if ((frequentActions.get('client_abc_corp') || 0) > 3) {
      suggestions.push({
        id: 'frequent_client',
        type: 'workflow',
        title: 'Invoice for ABC Corp',
        description: 'You frequently invoice this client',
        confidence: 0.85,
        action: 'select_client',
        data: { clientId: 'abc-corp-id' }
      })
    }
    
    return suggestions
  }

  private static generateTimeTrackingSuggestions(frequentActions: Map<string, number>): AISuggestion[] {
    const suggestions: AISuggestion[] = []
    
    // Suggest common time tracking patterns
    if ((frequentActions.get('morning_consulting') || 0) > 2) {
      suggestions.push({
        id: 'morning_session',
        type: 'workflow',
        title: 'Morning Consulting Session',
        description: 'You often start consulting sessions in the morning',
        confidence: 0.7,
        action: 'quick_start',
        data: { jobTitle: 'Morning Consulting Session' }
      })
    }
    
    return suggestions
  }

  static async recordUserAction(userId: string, action: string, success: boolean = true): Promise<void> {
    const userPatterns = this.patterns.get(userId) || []
    
    const existingPattern = userPatterns.find(p => p.action === action)
    if (existingPattern) {
      existingPattern.frequency += 1
      existingPattern.lastUsed = new Date()
      existingPattern.success = success
    } else {
      userPatterns.push({
        userId,
        action,
        frequency: 1,
        lastUsed: new Date(),
        success
      })
    }
    
    this.patterns.set(userId, userPatterns)
  }
} 
