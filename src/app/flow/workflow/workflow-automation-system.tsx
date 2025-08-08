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
import { Switch } from '@/components/ui/switch';
import { 
  Workflow,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Share,
  Calendar,
  TrendingUp,
  AlertCircle,
  XCircle,
  Target,
  Award,
  Shield,
  Lock,
  Unlock,
  FileCheck,
  Clipboard,
  List,
  Zap,
  Activity,
  PieChart,
  RefreshCw,
  Play,
  Pause,
  Stop,
  Timer,
  UserCheck,
  UserX,
  CheckSquare,
  Square
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'engagement' | 'tax_preparation' | 'audit' | 'compliance' | 'consulting' | 'onboarding';
  steps: WorkflowStep[];
  isActive: boolean;
  estimatedDuration: number; // in hours
  requiredRoles: string[];
  autoAssign: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  order: number;
  isRequired: boolean;
  estimatedTime: number; // in minutes
  assignedRole: string;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completionDate?: string;
  notes: string;
}

interface EngagementLetter {
  id: string;
  clientId: string;
  clientName: string;
  templateId: string;
  templateName: string;
  status: 'draft' | 'review' | 'approved' | 'sent' | 'signed' | 'expired';
  issueDate: string;
  dueDate: string;
  signedDate?: string;
  content: string;
  customizations: Record<string, any>;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  category: 'license_renewal' | 'ce_requirements' | 'insurance' | 'bond' | 'registration' | 'filing_deadline';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reminderDays: number[];
  lastReminder: string;
  nextReminder: string;
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'engagement_letter' | 'tax_return' | 'financial_statement' | 'compliance_report' | 'expense_approval';
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled';
  currentStep: number;
  totalSteps: number;
  requestor: string;
  approvers: string[];
  currentApprover: string;
  submittedDate: string;
  dueDate: string;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'template-001',
    name: 'Tax Return Preparation',
    description: 'Standard workflow for individual tax return preparation',
    category: 'tax_preparation',
    steps: [
      {
        id: 'step-1',
        name: 'Client Information Gathering',
        description: 'Collect all necessary client information and documents',
        order: 1,
        isRequired: true,
        estimatedTime: 60,
        assignedRole: 'Tax Preparer',
        dependencies: [],
        status: 'completed',
        completionDate: '2024-01-15T10:00:00Z',
        notes: 'All documents received'
      },
      {
        id: 'step-2',
        name: 'Initial Review',
        description: 'Review documents for completeness and accuracy',
        order: 2,
        isRequired: true,
        estimatedTime: 45,
        assignedRole: 'Senior Tax Preparer',
        dependencies: ['step-1'],
        status: 'in_progress',
        notes: 'Reviewing W-2s and 1099s'
      },
      {
        id: 'step-3',
        name: 'Tax Calculation',
        description: 'Perform tax calculations and prepare return',
        order: 3,
        isRequired: true,
        estimatedTime: 120,
        assignedRole: 'Tax Preparer',
        dependencies: ['step-2'],
        status: 'pending',
        notes: ''
      }
    ],
    isActive: true,
    estimatedDuration: 4,
    requiredRoles: ['Tax Preparer', 'Senior Tax Preparer', 'Reviewer'],
    autoAssign: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const mockEngagementLetters: EngagementLetter[] = [
  {
    id: 'el-001',
    clientId: 'client-001',
    clientName: 'Acme Corporation',
    templateId: 'template-001',
    templateName: 'Standard Tax Preparation',
    status: 'review',
    issueDate: '2024-01-15',
    dueDate: '2024-01-30',
    content: 'This engagement letter outlines the terms and conditions for tax preparation services...',
    customizations: {
      serviceType: 'Tax Preparation',
      feeStructure: 'Hourly Rate',
      estimatedFee: 2500
    },
    assignedTo: 'Sarah Johnson',
    priority: 'high',
    notes: 'Client requested expedited review',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const mockComplianceItems: ComplianceItem[] = [
  {
    id: 'comp-001',
    name: 'CPA License Renewal',
    description: 'Annual CPA license renewal for Sarah Johnson',
    category: 'license_renewal',
    dueDate: '2024-03-31',
    status: 'pending',
    assignedTo: 'Sarah Johnson',
    priority: 'high',
    reminderDays: [90, 60, 30, 7],
    lastReminder: '2024-01-01T00:00:00Z',
    nextReminder: '2024-02-01T00:00:00Z',
    notes: 'Requires 40 CPE hours',
    attachments: ['cpe_transcript.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

const mockApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: 'approval-001',
    name: 'Tax Return Review',
    description: 'Review of 2023 tax return for Acme Corporation',
    type: 'tax_return',
    status: 'in_progress',
    currentStep: 2,
    totalSteps: 3,
    requestor: 'Mike Chen',
    approvers: ['Sarah Johnson', 'Lisa Wang', 'John Smith'],
    currentApprover: 'Lisa Wang',
    submittedDate: '2024-01-15T09:00:00Z',
    dueDate: '2024-01-20T17:00:00Z',
    priority: 'high',
    notes: 'Complex return with multiple entities',
    attachments: ['tax_return.pdf', 'supporting_docs.zip'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z'
  }
];

export default function WorkflowAutomationSystem() {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<EngagementLetter | null>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceItem | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalWorkflow | null>(null);
  const [activeTab, setActiveTab] = useState('templates');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
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

  const calculateProgress = (steps: WorkflowStep[]) => {
    const completed = steps.filter(step => step.status === 'completed').length;
    return Math.round((completed / steps.length) * 100);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workflow Automation & Compliance</h1>
          <p className="text-muted-foreground">
            Manage workflow templates, engagement letters, and compliance tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Items</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 due this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">
              Target: 2.5 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
          <TabsTrigger value="engagement-letters">Engagement Letters</TabsTrigger>
          <TabsTrigger value="approvals">Approval Workflows</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Management</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search templates..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tax_preparation">Tax Preparation</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="space-y-4">
            {mockWorkflowTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTemplate(template)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {template.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{template.estimatedDuration}h</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{template.steps.length} steps</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{calculateProgress(template.steps)}% complete</span>
                        </div>
                      </div>
                      
                      <Progress value={calculateProgress(template.steps)} className="w-full" />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
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

        <TabsContent value="engagement-letters" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search engagement letters..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Engagement Letter
            </Button>
          </div>

          <div className="space-y-4">
            {mockEngagementLetters.map((letter) => (
              <Card key={letter.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedEngagement(letter)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{letter.clientName}</h3>
                        <Badge className={getStatusColor(letter.status)}>
                          {letter.status}
                        </Badge>
                        <Badge className={getPriorityColor(letter.priority)}>
                          {letter.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-medium">{letter.templateName}</span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(letter.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {getDaysUntilDue(letter.dueDate)} days left
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {letter.assignedTo}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {letter.notes}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4" />
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

        <TabsContent value="approvals" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search approvals..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="engagement_letter">Engagement Letter</SelectItem>
                  <SelectItem value="tax_return">Tax Return</SelectItem>
                  <SelectItem value="financial_statement">Financial Statement</SelectItem>
                  <SelectItem value="compliance_report">Compliance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Approval Request
            </Button>
          </div>

          <div className="space-y-4">
            {mockApprovalWorkflows.map((approval) => (
              <Card key={approval.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedApproval(approval)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{approval.name}</h3>
                        <Badge className={getStatusColor(approval.status)}>
                          {approval.status}
                        </Badge>
                        <Badge className={getPriorityColor(approval.priority)}>
                          {approval.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-medium">{approval.type.replace('_', ' ')}</span>
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{approval.currentApprover}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Step {approval.currentStep} of {approval.totalSteps}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(approval.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {approval.notes}
                      </p>
                      
                      <Progress value={(approval.currentStep / approval.totalSteps) * 100} className="w-full mt-3" />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <XCircle className="w-4 h-4" />
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

        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search compliance items..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="license_renewal">License Renewal</SelectItem>
                  <SelectItem value="ce_requirements">CE Requirements</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="bond">Bond</SelectItem>
                  <SelectItem value="registration">Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Compliance Item
            </Button>
          </div>

          <div className="space-y-4">
            {mockComplianceItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCompliance(item)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {getDaysUntilDue(item.dueDate) <= 7 && (
                          <Badge className="bg-red-100 text-red-800">
                            Due Soon
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-medium">{item.category.replace('_', ' ')}</span>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {getDaysUntilDue(item.dueDate)} days left
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.assignedTo}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {item.reminderDays.join(', ')} day reminders
                        </Badge>
                        {item.attachments.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {item.attachments.length} attachments
                          </Badge>
                        )}
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
                        <CheckCircle className="w-4 h-4" />
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
      </Tabs>

      {/* Workflow Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Template Details</DialogTitle>
            <DialogDescription>
              Detailed view of workflow template and steps
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Template Name</label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Duration</label>
                  <p className="text-sm font-medium">{selectedTemplate.estimatedDuration} hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={selectedTemplate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Workflow Steps</label>
                <div className="space-y-3">
                  {selectedTemplate.steps.map((step) => (
                    <div key={step.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{step.order}</Badge>
                        <div>
                          <p className="text-sm font-medium">{step.name}</p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-auto">
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{step.estimatedTime}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start Workflow
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

      {/* Engagement Letter Detail Dialog */}
      <Dialog open={!!selectedEngagement} onOpenChange={() => setSelectedEngagement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Engagement Letter Details</DialogTitle>
            <DialogDescription>
              Detailed view of engagement letter and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedEngagement && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedEngagement.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <p className="text-sm text-muted-foreground">{selectedEngagement.templateName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedEngagement.status)}>
                    {selectedEngagement.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedEngagement.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <p className="text-sm text-muted-foreground">{selectedEngagement.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Badge className={getPriorityColor(selectedEngagement.priority)}>
                    {selectedEngagement.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedEngagement.notes}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Letter
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Send to Client
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compliance Item Detail Dialog */}
      <Dialog open={!!selectedCompliance} onOpenChange={() => setSelectedCompliance(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compliance Item Details</DialogTitle>
            <DialogDescription>
              Detailed view of compliance item and tracking
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompliance && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Item Name</label>
                  <p className="text-sm text-muted-foreground">{selectedCompliance.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-muted-foreground">{selectedCompliance.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedCompliance.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedCompliance.status)}>
                    {selectedCompliance.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <p className="text-sm text-muted-foreground">{selectedCompliance.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Badge className={getPriorityColor(selectedCompliance.priority)}>
                    {selectedCompliance.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedCompliance.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedCompliance.notes}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Item
                </Button>
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  View Attachments
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Workflow Detail Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approval Workflow Details</DialogTitle>
            <DialogDescription>
              Detailed view of approval workflow and progress
            </DialogDescription>
          </DialogHeader>
          
          {selectedApproval && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Workflow Name</label>
                  <p className="text-sm text-muted-foreground">{selectedApproval.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedApproval.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedApproval.status)}>
                    {selectedApproval.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Progress</label>
                  <p className="text-sm text-muted-foreground">
                    Step {selectedApproval.currentStep} of {selectedApproval.totalSteps}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Requestor</label>
                  <p className="text-sm text-muted-foreground">{selectedApproval.requestor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Approver</label>
                  <p className="text-sm text-muted-foreground">{selectedApproval.currentApprover}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedApproval.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedApproval.notes}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 