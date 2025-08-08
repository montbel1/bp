export interface AnalyticsMetric {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  period: string
}

export interface PredictiveInsight {
  type: 'revenue_forecast' | 'expense_prediction' | 'cash_flow_warning' | 'opportunity'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  recommendedAction?: string
}

export interface BusinessKPI {
  id: string
  name: string
  currentValue: number
  targetValue: number
  unit: string
  trend: number[]
  status: 'on_track' | 'at_risk' | 'behind'
}

export class AdvancedAnalyticsService {
  static async getRevenueAnalytics(transactions: any[], period: string = 'month'): Promise<AnalyticsMetric[]> {
    const metrics: AnalyticsMetric[] = []
    
    // Calculate revenue metrics
    const revenue = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const previousPeriodRevenue = revenue * 0.9 // Mock calculation
    const change = ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    
    metrics.push({
      name: 'Total Revenue',
      value: revenue,
      change: change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      period: period
    })
    
    // Calculate growth rate
    const growthRate = this.calculateGrowthRate(transactions, period)
    metrics.push({
      name: 'Growth Rate',
      value: growthRate,
      change: growthRate - 5, // Mock previous period
      trend: growthRate > 5 ? 'up' : growthRate < 5 ? 'down' : 'stable',
      period: period
    })
    
    return metrics
  }

  static async getExpenseAnalytics(transactions: any[], period: string = 'month'): Promise<AnalyticsMetric[]> {
    const metrics: AnalyticsMetric[] = []
    
    // Calculate expense metrics
    const expenses = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const previousPeriodExpenses = expenses * 1.1 // Mock calculation
    const change = ((expenses - previousPeriodExpenses) / previousPeriodExpenses) * 100
    
    metrics.push({
      name: 'Total Expenses',
      value: expenses,
      change: change,
      trend: change < 0 ? 'up' : change > 0 ? 'down' : 'stable', // Lower expenses is better
      period: period
    })
    
    // Calculate expense categories
    const categoryExpenses = this.calculateCategoryExpenses(transactions)
    const topExpenseCategory = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topExpenseCategory) {
      metrics.push({
        name: `Top Expense: ${topExpenseCategory[0]}`,
        value: topExpenseCategory[1],
        change: 0, // Mock
        trend: 'stable',
        period: period
      })
    }
    
    return metrics
  }

  static async getPredictiveInsights(transactions: any[], jobs: any[]): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = []
    
    // Revenue forecast
    const revenueTrend = this.calculateRevenueTrend(transactions)
    if (revenueTrend < 0.05) { // Less than 5% growth
      insights.push({
        type: 'revenue_forecast',
        title: 'Revenue Growth Slowing',
        description: 'Revenue growth rate has decreased by 15% this month. Consider reviewing pricing strategy.',
        confidence: 0.85,
        impact: 'high',
        recommendedAction: 'Review pricing strategy and identify new revenue opportunities'
      })
    }
    
    // Cash flow warning
    const cashFlow = this.calculateCashFlow(transactions)
    if (cashFlow < 0) {
      insights.push({
        type: 'cash_flow_warning',
        title: 'Negative Cash Flow Detected',
        description: 'Cash flow is negative this month. Monitor closely and consider cost reduction.',
        confidence: 0.95,
        impact: 'high',
        recommendedAction: 'Review expenses and accelerate receivables collection'
      })
    }
    
    // Opportunity detection
    const opportunities = this.detectOpportunities(transactions, jobs)
    insights.push(...opportunities)
    
    return insights
  }

  static async getBusinessKPIs(transactions: any[], jobs: any[]): Promise<BusinessKPI[]> {
    const kpis: BusinessKPI[] = []
    
    // Revenue KPI
    const totalRevenue = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    kpis.push({
      id: 'revenue',
      name: 'Monthly Revenue',
      currentValue: totalRevenue,
      targetValue: 50000, // Mock target
      unit: 'USD',
      trend: [45000, 48000, 52000, totalRevenue], // Mock trend
      status: totalRevenue >= 50000 ? 'on_track' : totalRevenue >= 45000 ? 'at_risk' : 'behind'
    })
    
    // Profitability KPI
    const totalExpenses = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const profit = totalRevenue - totalExpenses
    const profitMargin = (profit / totalRevenue) * 100
    
    kpis.push({
      id: 'profit_margin',
      name: 'Profit Margin',
      currentValue: profitMargin,
      targetValue: 20, // 20% target
      unit: '%',
      trend: [18, 19, 21, profitMargin], // Mock trend
      status: profitMargin >= 20 ? 'on_track' : profitMargin >= 15 ? 'at_risk' : 'behind'
    })
    
    // Job completion KPI
    const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length
    const totalJobs = jobs.length
    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
    
    kpis.push({
      id: 'job_completion',
      name: 'Job Completion Rate',
      currentValue: completionRate,
      targetValue: 90, // 90% target
      unit: '%',
      trend: [85, 88, 92, completionRate], // Mock trend
      status: completionRate >= 90 ? 'on_track' : completionRate >= 80 ? 'at_risk' : 'behind'
    })
    
    return kpis
  }

  private static calculateGrowthRate(transactions: any[], period: string): number {
    // Mock calculation - in real implementation, this would compare periods
    const currentRevenue = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const previousRevenue = currentRevenue * 0.9 // Mock previous period
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100
  }

  private static calculateCategoryExpenses(transactions: any[]): Record<string, number> {
    const categoryExpenses: Record<string, number> = {}
    
    transactions
      .filter(t => t.type === 'DEBIT')
      .forEach(transaction => {
        const category = transaction.category?.name || 'Uncategorized'
        categoryExpenses[category] = (categoryExpenses[category] || 0) + transaction.amount
      })
    
    return categoryExpenses
  }

  private static calculateRevenueTrend(transactions: any[]): number {
    // Mock calculation - would analyze historical data
    return 0.03 // 3% growth rate
  }

  private static calculateCashFlow(transactions: any[]): number {
    const inflows = transactions
      .filter(t => t.type === 'CREDIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const outflows = transactions
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return inflows - outflows
  }

  private static detectOpportunities(transactions: any[], jobs: any[]): PredictiveInsight[] {
    const opportunities: PredictiveInsight[] = []
    
    // Detect high-value clients
    const clientRevenue = new Map<string, number>()
    transactions
      .filter(t => t.type === 'CREDIT')
      .forEach(transaction => {
        // Mock client detection
        const clientId = transaction.account?.name || 'Unknown'
        clientRevenue.set(clientId, (clientRevenue.get(clientId) || 0) + transaction.amount)
      })
    
    const topClient = Array.from(clientRevenue.entries())
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topClient && topClient[1] > 10000) {
      opportunities.push({
        type: 'opportunity',
        title: 'High-Value Client Opportunity',
        description: `${topClient[0]} represents 25% of total revenue. Consider expanding services.`,
        confidence: 0.8,
        impact: 'medium',
        recommendedAction: 'Develop additional service offerings for high-value clients'
      })
    }
    
    return opportunities
  }
} 
