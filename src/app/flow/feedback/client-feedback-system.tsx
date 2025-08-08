'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Share,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Heart,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface ClientFeedback {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  surveyType: 'satisfaction' | 'service_quality' | 'engagement' | 'retention';
  overallRating: number;
  serviceQualityRating: number;
  communicationRating: number;
  responsivenessRating: number;
  valueRating: number;
  recommendationLikelihood: number;
  feedback: string;
  improvementSuggestions: string;
  categories: string[];
  status: 'pending' | 'completed' | 'reviewed' | 'actioned';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface FeedbackSurvey {
  id: string;
  name: string;
  type: 'satisfaction' | 'service_quality' | 'engagement' | 'retention';
  questions: FeedbackQuestion[];
  isActive: boolean;
  targetAudience: string[];
  frequency: 'one_time' | 'quarterly' | 'annually' | 'after_service';
  createdBy: string;
  createdAt: string;
}

interface FeedbackQuestion {
  id: string;
  question: string;
  type: 'rating' | 'multiple_choice' | 'text' | 'yes_no';
  required: boolean;
  options?: string[];
  category: string;
}

interface ClientSatisfactionMetrics {
  totalResponses: number;
  averageRating: number;
  satisfactionTrend: 'improving' | 'stable' | 'declining';
  topCategories: string[];
  improvementAreas: string[];
  retentionRate: number;
  recommendationScore: number;
}

const mockFeedbackData: ClientFeedback[] = [
  {
    id: '1',
    clientId: 'client-001',
    clientName: 'Acme Corporation',
    clientEmail: 'contact@acme.com',
    surveyType: 'satisfaction',
    overallRating: 4.8,
    serviceQualityRating: 5.0,
    communicationRating: 4.5,
    responsivenessRating: 4.7,
    valueRating: 4.6,
    recommendationLikelihood: 9,
    feedback: 'Excellent service and communication throughout our tax preparation process. The team was responsive and professional.',
    improvementSuggestions: 'Consider offering more digital document upload options.',
    categories: ['tax_preparation', 'communication', 'professionalism'],
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    tags: ['positive', 'tax_season', 'repeat_client']
  },
  {
    id: '2',
    clientId: 'client-002',
    clientName: 'TechStart Inc.',
    clientEmail: 'finance@techstart.com',
    surveyType: 'service_quality',
    overallRating: 3.2,
    serviceQualityRating: 3.0,
    communicationRating: 2.8,
    responsivenessRating: 3.5,
    valueRating: 3.1,
    recommendationLikelihood: 5,
    feedback: 'Service was adequate but communication could be improved. Some delays in response times.',
    improvementSuggestions: 'Implement faster response times and more frequent updates.',
    categories: ['audit_support', 'communication', 'timeliness'],
    status: 'reviewed',
    priority: 'high',
    assignedTo: 'Mike Chen',
    dueDate: '2024-02-10',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    tags: ['needs_improvement', 'new_client', 'audit']
  }
];

const mockSurveys: FeedbackSurvey[] = [
  {
    id: 'survey-001',
    name: 'Annual Client Satisfaction Survey',
    type: 'satisfaction',
    questions: [
      {
        id: 'q1',
        question: 'How satisfied are you with our overall service?',
        type: 'rating',
        required: true,
        category: 'overall_satisfaction'
      },
      {
        id: 'q2',
        question: 'How would you rate our communication quality?',
        type: 'rating',
        required: true,
        category: 'communication'
      },
      {
        id: 'q3',
        question: 'How likely are you to recommend our services?',
        type: 'rating',
        required: true,
        category: 'recommendation'
      },
      {
        id: 'q4',
        question: 'What areas could we improve?',
        type: 'text',
        required: false,
        category: 'improvement'
      }
    ],
    isActive: true,
    targetAudience: ['all_clients'],
    frequency: 'annually',
    createdBy: 'Admin',
    createdAt: '2024-01-01'
  }
];

const mockMetrics: ClientSatisfactionMetrics = {
  totalResponses: 156,
  averageRating: 4.3,
  satisfactionTrend: 'improving',
  topCategories: ['tax_preparation', 'communication', 'professionalism'],
  improvementAreas: ['response_time', 'digital_services', 'cost_transparency'],
  retentionRate: 87.5,
  recommendationScore: 8.2
};

export default function ClientFeedbackSystem() {
  const [selectedFeedback, setSelectedFeedback] = useState<ClientFeedback | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'actioned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client Feedback & Satisfaction</h1>
          <p className="text-muted-foreground">
            Track client satisfaction, collect feedback, and improve service quality
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Survey
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockMetrics.satisfactionTrend === 'improving' ? 'text-green-600' : 'text-red-600'}>
                {mockMetrics.satisfactionTrend === 'improving' ? '↗' : '↘'}
              </span>
              {mockMetrics.satisfactionTrend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendation Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.recommendationScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.5 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="feedback">Client Feedback</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Client satisfaction over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Satisfaction</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">4.3/5.0</span>
                    </div>
                  </div>
                  <Progress value={86} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Service Quality</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">4.5/5.0</span>
                    </div>
                  </div>
                  <Progress value={90} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Communication</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">4.1/5.0</span>
                    </div>
                  </div>
                  <Progress value={82} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Improvement Areas</CardTitle>
                <CardDescription>Areas identified for service enhancement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMetrics.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{area.replace('_', ' ')}</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 30) + 10}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search feedback..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="actioned">Actioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {mockFeedbackData.map((feedback) => (
              <Card key={feedback.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedFeedback(feedback)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{feedback.clientName}</h3>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                        <Badge className={getPriorityColor(feedback.priority)}>
                          {feedback.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className={`w-4 h-4 mr-1 ${getRatingColor(feedback.overallRating)}`} />
                          <span className={`text-sm font-medium ${getRatingColor(feedback.overallRating)}`}>
                            {feedback.overallRating}/5.0
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {feedback.surveyType.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {feedback.feedback}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {feedback.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Feedback Surveys</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSurveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{survey.name}</CardTitle>
                    <Badge variant={survey.isActive ? "default" : "secondary"}>
                      {survey.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {survey.questions.length} questions • {survey.frequency.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Type:</span>
                      <span className="capitalize">{survey.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Target:</span>
                      <span>{survey.targetAudience.length} audience(s)</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Created:</span>
                      <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Rate by Survey Type</CardTitle>
                <CardDescription>Client participation across different survey types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfaction Surveys</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Quality</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={72} className="w-24" />
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Engagement</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={68} className="w-24" />
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Satisfaction by Category</CardTitle>
                <CardDescription>Average ratings across service categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tax Preparation</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">4.6</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Support</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">4.2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consulting</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">4.4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">4.1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feedback Detail Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Detailed view of client feedback and recommendations
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedFeedback.clientEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Overall Rating</label>
                  <div className="flex items-center">
                    <Star className={`w-4 h-4 mr-1 ${getRatingColor(selectedFeedback.overallRating)}`} />
                    <span className={`font-medium ${getRatingColor(selectedFeedback.overallRating)}`}>
                      {selectedFeedback.overallRating}/5.0
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Recommendation Likelihood</label>
                  <p className="text-sm font-medium">{selectedFeedback.recommendationLikelihood}/10</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Detailed Ratings</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Quality</span>
                    <span className="text-sm font-medium">{selectedFeedback.serviceQualityRating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Communication</span>
                    <span className="text-sm font-medium">{selectedFeedback.communicationRating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Responsiveness</span>
                    <span className="text-sm font-medium">{selectedFeedback.responsivenessRating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Value</span>
                    <span className="text-sm font-medium">{selectedFeedback.valueRating}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Feedback</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFeedback.feedback}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Improvement Suggestions</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedFeedback.improvementSuggestions}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Assign Action
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Feedback
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 