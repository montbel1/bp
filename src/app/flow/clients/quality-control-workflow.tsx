'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Eye,
  Edit,
  Send,
  Download,
  Upload,
  Star,
  Flag,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface QualityChecklist {
  id: string;
  category: string;
  item: string;
  required: boolean;
  completed: boolean;
  reviewer: string;
  notes: string;
  dueDate: string;
}

interface QualityReview {
  id: string;
  clientId: string;
  clientName: string;
  reviewType: 'tax_return' | 'financial_statement' | 'compliance' | 'engagement';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  checklist: QualityChecklist[];
  overallScore: number;
  comments: string;
  nextReviewDate: string;
}

const qualityChecklists = {
  tax_return: [
    { id: '1', category: 'Documentation', item: 'All source documents received and verified', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '2', category: 'Documentation', item: 'Client information forms completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '3', category: 'Documentation', item: 'Prior year returns reviewed for consistency', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '4', category: 'Calculations', item: 'All calculations verified and cross-checked', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '5', category: 'Calculations', item: 'Tax liability calculations accurate', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '6', category: 'Compliance', item: 'All required schedules included', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '7', category: 'Compliance', item: 'E-filing requirements met', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '8', category: 'Quality', item: 'Peer review completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '9', category: 'Quality', item: 'Client approval obtained', required: true, completed: false, reviewer: '', notes: '', dueDate: '' }
  ],
  financial_statement: [
    { id: '1', category: 'Documentation', item: 'All supporting documents reviewed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '2', category: 'Documentation', item: 'Client representations obtained', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '3', category: 'Calculations', item: 'Mathematical accuracy verified', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '4', category: 'Calculations', item: 'Account balances reconciled', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '5', category: 'Compliance', item: 'GAAP compliance verified', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '6', category: 'Compliance', item: 'Disclosure requirements met', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '7', category: 'Quality', item: 'Senior review completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '8', category: 'Quality', item: 'Client approval obtained', required: true, completed: false, reviewer: '', notes: '', dueDate: '' }
  ],
  compliance: [
    { id: '1', category: 'Documentation', item: 'Regulatory requirements identified', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '2', category: 'Documentation', item: 'Compliance procedures documented', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '3', category: 'Review', item: 'Compliance testing completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '4', category: 'Review', item: 'Exceptions identified and resolved', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '5', category: 'Reporting', item: 'Compliance report prepared', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '6', category: 'Reporting', item: 'Management letter issued', required: true, completed: false, reviewer: '', notes: '', dueDate: '' }
  ],
  engagement: [
    { id: '1', category: 'Documentation', item: 'Engagement letter signed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '2', category: 'Documentation', item: 'Conflict check completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '3', category: 'Documentation', item: 'Risk assessment completed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '4', category: 'Planning', item: 'Work plan developed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '5', category: 'Planning', item: 'Team assigned and briefed', required: true, completed: false, reviewer: '', notes: '', dueDate: '' },
    { id: '6', category: 'Quality', item: 'Senior partner approval obtained', required: true, completed: false, reviewer: '', notes: '', dueDate: '' }
  ]
};

const mockReviews: QualityReview[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Smith - Acme Corporation',
    reviewType: 'tax_return',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    assignedDate: '2024-01-15',
    dueDate: '2024-01-25',
    checklist: qualityChecklists.tax_return,
    overallScore: 75,
    comments: 'Tax return preparation in progress. All documentation received.',
    nextReviewDate: '2024-01-30'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Maria Garcia - TechStart Inc',
    reviewType: 'financial_statement',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    assignedDate: '2024-01-20',
    dueDate: '2024-01-30',
    checklist: qualityChecklists.financial_statement,
    overallScore: 0,
    comments: 'Financial statement review scheduled.',
    nextReviewDate: '2024-02-15'
  }
];

export default function QualityControlWorkflow() {
  const [reviews, setReviews] = useState<QualityReview[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<QualityReview | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || review.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReviewTypeIcon = (type: string) => {
    switch (type) {
      case 'tax_return': return <FileText className="w-4 h-4" />;
      case 'financial_statement': return <TrendingUp className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'engagement': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const calculateProgress = (checklist: QualityChecklist[]) => {
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleChecklistToggle = (reviewId: string, itemId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const updatedChecklist = review.checklist.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const progress = calculateProgress(updatedChecklist);
        return {
          ...review,
          checklist: updatedChecklist,
          overallScore: progress,
          status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending'
        };
      }
      return review;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Control Workflow</h1>
          <p className="text-gray-600">Manage review processes and ensure quality standards</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => new Date(r.dueDate) < new Date() && r.status !== 'completed').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0 ? Math.round(reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length) : 0}%
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Reviews</CardTitle>
          <CardDescription>
            Track and manage quality control reviews across all engagements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getReviewTypeIcon(review.reviewType)}
                    <div>
                      <h4 className="font-medium">{review.clientName}</h4>
                      <p className="text-sm text-gray-600">
                        {review.reviewType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(review.status)}>
                      {review.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(review.priority)}>
                      {review.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium">{review.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{new Date(review.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${review.overallScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{review.overallScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Review</p>
                    <p className="font-medium">{new Date(review.nextReviewDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Quality Review - {review.clientName}</DialogTitle>
                          <DialogDescription>
                            Review checklist and quality control procedures
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="checklist" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="checklist">Checklist</TabsTrigger>
                            <TabsTrigger value="progress">Progress</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="checklist" className="space-y-4">
                            <div className="space-y-4">
                              {review.checklist.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4">
                                  <div className="flex items-start space-x-3">
                                    <input
                                      type="checkbox"
                                      checked={item.completed}
                                      onChange={() => handleChecklistToggle(review.id, item.id)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="font-medium">{item.item}</h4>
                                        {item.required && (
                                          <Badge variant="destructive" className="text-xs">Required</Badge>
                                        )}
                                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {item.reviewer && `Reviewed by: ${item.reviewer}`}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="progress" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Overall Progress</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm">Completion</span>
                                    <span className="text-sm font-medium">{review.overallScore}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                      className="bg-blue-600 h-3 rounded-full" 
                                      style={{ width: `${review.overallScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Timeline</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Assigned:</span>
                                    <span>{new Date(review.assignedDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Due:</span>
                                    <span>{new Date(review.dueDate).toLocaleDateString()}</span>
                                  </div>
                                  {review.completedDate && (
                                    <div className="flex justify-between">
                                      <span>Completed:</span>
                                      <span>{new Date(review.completedDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="comments" className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Review Comments</h4>
                              <Textarea 
                                value={review.comments}
                                placeholder="Add review comments..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Save Comments</Button>
                              <Button>Complete Review</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.dueDate) < new Date() && review.status !== 'completed' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Overdue</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 