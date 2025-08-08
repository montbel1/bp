"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Settings, 
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Target
} from "lucide-react"
import { AISuggestionService, AISuggestion } from "@/lib/ai-suggestions"
import { SmartCategorizationService, CategorySuggestion } from "@/lib/smart-categorization"
import { WorkflowAutomationService, WorkflowRule } from "@/lib/workflow-automation"
import { AdvancedAnalyticsService, PredictiveInsight, BusinessKPI } from "@/lib/advanced-analytics"
import { toast } from "sonner"

export default function AdvancedFeaturesPage() {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<CategorySuggestion[]>([])
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([])
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([])
  const [businessKPIs, setBusinessKPIs] = useState<BusinessKPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdvancedFeatures()
  }, [])

  const loadAdvancedFeatures = async () => {
    try {
      // Load AI suggestions
      const suggestions = await AISuggestionService.getSuggestions('user-123', 'job_creation')
      setAiSuggestions(suggestions)

      // Load workflow rules
      const rules = WorkflowAutomationService.getRules()
      setWorkflowRules(rules)

      // Mock data for other features
      setCategorySuggestions([
        {
          categoryId: 'office_supplies',
          categoryName: 'Office Supplies',
          confidence: 0.95,
          keywords: ['staples', 'paper', 'ink']
        },
        {
          categoryId: 'travel',
          categoryName: 'Travel & Transportation',
          confidence: 0.87,
          keywords: ['uber', 'hotel']
        }
      ])

      setPredictiveInsights([
        {
          type: 'revenue_forecast',
          title: 'Revenue Growth Slowing',
          description: 'Revenue growth rate has decreased by 15% this month.',
          confidence: 0.85,
          impact: 'high',
          recommendedAction: 'Review pricing strategy and identify new revenue opportunities'
        },
        {
          type: 'opportunity',
          title: 'High-Value Client Opportunity',
          description: 'ABC Corp represents 25% of total revenue. Consider expanding services.',
          confidence: 0.8,
          impact: 'medium',
          recommendedAction: 'Develop additional service offerings for high-value clients'
        }
      ])

      setBusinessKPIs([
        {
          id: 'revenue',
          name: 'Monthly Revenue',
          currentValue: 52000,
          targetValue: 50000,
          unit: 'USD',
          trend: [45000, 48000, 52000],
          status: 'on_track'
        },
        {
          id: 'profit_margin',
          name: 'Profit Margin',
          currentValue: 22,
          targetValue: 20,
          unit: '%',
          trend: [18, 19, 22],
          status: 'on_track'
        }
      ])

    } catch (error) {
      console.error('Error loading advanced features:', error)
      toast.error('Failed to load advanced features')
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionAction = async (suggestion: AISuggestion) => {
    try {
      await AISuggestionService.recordUserAction('user-123', suggestion.action, true)
      toast.success(`Applied suggestion: ${suggestion.title}`)
    } catch (error) {
      toast.error('Failed to apply suggestion')
    }
  }

  const handleWorkflowToggle = async (ruleId: string, isActive: boolean) => {
    try {
      await WorkflowAutomationService.updateRule(ruleId, { isActive })
      setWorkflowRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive } : rule
      ))
      toast.success(`Workflow ${isActive ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error('Failed to update workflow')
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Advanced Features Dashboard</h1>
        <p className="text-muted-foreground">AI-powered insights and automation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Suggestions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI-Powered Suggestions
            </CardTitle>
            <CardDescription>
              Smart recommendations based on your usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <Badge variant="outline">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => handleSuggestionAction(suggestion)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Apply Suggestion
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Categorization */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              Smart Categorization
            </CardTitle>
            <CardDescription>
              AI-powered transaction categorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categorySuggestions.map((suggestion) => (
                <div key={suggestion.categoryId} className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{suggestion.categoryName}</h4>
                    <Badge variant="outline">
                      {Math.round(suggestion.confidence * 100)}% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {suggestion.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Automation */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Workflow Automation
            </CardTitle>
            <CardDescription>
              Automated business processes and rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workflowRules.map((rule) => (
                <div key={rule.id} className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Button
                      size="sm"
                      variant={rule.isActive ? "default" : "outline"}
                      onClick={() => handleWorkflowToggle(rule.id, !rule.isActive)}
                    >
                      {rule.isActive ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Inactive
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">Priority: {rule.priority}</Badge>
                    <Badge variant="outline">{rule.conditions.length} conditions</Badge>
                    <Badge variant="outline">{rule.actions.length} actions</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Analytics */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Predictive Insights
            </CardTitle>
            <CardDescription>
              AI-powered business intelligence and forecasting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictiveInsights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant={insight.impact === 'high' ? 'destructive' : 'outline'}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.description}
                  </p>
                  {insight.recommendedAction && (
                    <div className="text-xs text-blue-600">
                      <strong>Recommended:</strong> {insight.recommendedAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business KPIs */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Business KPIs
          </CardTitle>
          <CardDescription>
            Key performance indicators with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessKPIs.map((kpi) => (
              <div key={kpi.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{kpi.name}</h4>
                  <Badge 
                    variant={
                      kpi.status === 'on_track' ? 'default' : 
                      kpi.status === 'at_risk' ? 'secondary' : 'destructive'
                    }
                  >
                    {kpi.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2">
                  {kpi.currentValue.toLocaleString()} {kpi.unit}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Target: {kpi.targetValue.toLocaleString()} {kpi.unit}
                  </span>
                </div>
                <Progress 
                  value={(kpi.currentValue / kpi.targetValue) * 100} 
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 