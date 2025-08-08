'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  FileText,
  Send,
  Copy,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  TrendingUp,
  User,
  Building,
  Briefcase,
  GraduationCap,
  Target,
  Award,
  Settings,
  Sync,
  Link,
  Unlink,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Monitor,
  CheckSquare,
  Square,
  List,
  Tag,
  Star,
  Flag,
  CalendarDays,
  Clock3,
  UserCheck,
  UserX,
  FileEdit,
  Save,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';

interface MeetingNote {
  id: string;
  meetingId: string;
  meetingTitle: string;
  clientName: string;
  meetingDate: string;
  noteType: 'general' | 'action_items' | 'decisions' | 'questions' | 'follow_up';
  content: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

interface FollowUp {
  id: string;
  meetingId: string;
  meetingTitle: string;
  clientName: string;
  title: string;
  description: string;
  type: 'action_item' | 'decision' | 'question' | 'deadline' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedByName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completionDate?: string;
  notes: string;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: string;
  createdAt: string;
  updatedAt: string;
}

interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedByName: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  category: 'tax' | 'audit' | 'consulting' | 'compliance' | 'billing' | 'client_communication';
  estimatedHours: number;
  actualHours?: number;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Attachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'spreadsheet' | 'presentation' | 'other';
  size: number;
  url: string;
  uploadedBy: string;
  uploadDate: string;
  isEncrypted: boolean;
}

interface MeetingTemplate {
  id: string;
  name: string;
  category: 'tax_planning' | 'audit_review' | 'consultation' | 'client_onboarding' | 'quarterly_review';
  sections: TemplateSection[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateSection {
  id: string;
  title: string;
  type: 'text' | 'checkbox' | 'dropdown' | 'date' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
  order: number;
}

const MeetingNotesSystem = () => {
  const [selectedTab, setSelectedTab] = useState('notes');
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<MeetingNote | null>(null);

  // Mock data
  const mockMeetingNotes: MeetingNote[] = [
    {
      id: '1',
      meetingId: 'meeting-1',
      meetingTitle: 'Q4 Tax Planning Consultation',
      clientName: 'Sarah Johnson',
      meetingDate: '2024-01-15T10:00:00Z',
      noteType: 'action_items',
      content: 'Client expressed concerns about R&D tax credits. Need to prepare detailed analysis of qualifying activities and expenses. Client also mentioned potential expansion plans that could impact tax strategy.',
      tags: ['tax-planning', 'r&d-credits', 'expansion', 'quarterly'],
      priority: 'high',
      assignedTo: 'michael.chen@accountingfirm.com',
      dueDate: '2024-01-22T10:00:00Z',
      status: 'in_progress',
      isPrivate: false,
      createdBy: 'michael.chen@accountingfirm.com',
      createdAt: '2024-01-15T11:30:00Z',
      updatedAt: '2024-01-15T11:30:00Z',
      attachments: [
        {
          id: 'att-1',
          name: 'R&D_Credit_Analysis.pdf',
          type: 'document',
          size: 2048576,
          url: '/documents/r&d-analysis.pdf',
          uploadedBy: 'michael.chen@accountingfirm.com',
          uploadDate: '2024-01-15T11:35:00Z',
          isEncrypted: true
        }
      ]
    },
    {
      id: '2',
      meetingId: 'meeting-2',
      meetingTitle: 'Financial Statement Review',
      clientName: 'Robert Martinez',
      meetingDate: '2024-01-16T14:00:00Z',
      noteType: 'decisions',
      content: 'Client approved the proposed audit adjustments. Agreed to implement new internal controls for cash management. Decided to schedule quarterly reviews instead of annual.',
      tags: ['audit', 'internal-controls', 'quarterly-reviews', 'cash-management'],
      priority: 'medium',
      status: 'completed',
      isPrivate: false,
      createdBy: 'jennifer.lee@accountingfirm.com',
      createdAt: '2024-01-16T15:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z',
      attachments: []
    }
  ];

  const mockFollowUps: FollowUp[] = [
    {
      id: '1',
      meetingId: 'meeting-1',
      meetingTitle: 'Q4 Tax Planning Consultation',
      clientName: 'Sarah Johnson',
      title: 'R&D Tax Credit Analysis',
      description: 'Prepare detailed analysis of R&D tax credits for TechStartup Inc. including qualifying activities, expenses, and documentation requirements.',
      type: 'action_item',
      priority: 'high',
      assignedTo: 'michael.chen@accountingfirm.com',
      assignedByName: 'Michael Chen',
      dueDate: '2024-01-22T10:00:00Z',
      status: 'in_progress',
      notes: 'Started analysis of qualifying R&D activities. Need to review technical documentation and expense records.',
      tags: ['tax-planning', 'r&d-credits', 'analysis'],
      isRecurring: false,
      createdAt: '2024-01-15T11:30:00Z',
      updatedAt: '2024-01-15T11:30:00Z'
    },
    {
      id: '2',
      meetingId: 'meeting-2',
      meetingTitle: 'Financial Statement Review',
      clientName: 'Robert Martinez',
      title: 'Implement Cash Management Controls',
      description: 'Set up new internal controls for cash management as discussed during the audit review.',
      type: 'action_item',
      priority: 'medium',
      assignedTo: 'jennifer.lee@accountingfirm.com',
      assignedByName: 'Jennifer Lee',
      dueDate: '2024-01-30T17:00:00Z',
      status: 'pending',
      notes: 'Need to schedule follow-up meeting to discuss implementation timeline.',
      tags: ['internal-controls', 'cash-management', 'implementation'],
      isRecurring: false,
      createdAt: '2024-01-16T15:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z'
    }
  ];

  const mockActionItems: ActionItem[] = [
    {
      id: '1',
      meetingId: 'meeting-1',
      title: 'R&D Tax Credit Analysis',
      description: 'Prepare detailed analysis of R&D tax credits for TechStartup Inc.',
      assignedTo: 'michael.chen@accountingfirm.com',
      assignedByName: 'Michael Chen',
      dueDate: '2024-01-22T10:00:00Z',
      priority: 'high',
      status: 'in_progress',
      category: 'tax',
      estimatedHours: 8,
      actualHours: 4,
      completionNotes: 'Analysis in progress. Need to review technical documentation.',
      createdAt: '2024-01-15T11:30:00Z',
      updatedAt: '2024-01-15T11:30:00Z'
    },
    {
      id: '2',
      meetingId: 'meeting-2',
      title: 'Implement Cash Management Controls',
      description: 'Set up new internal controls for cash management',
      assignedTo: 'jennifer.lee@accountingfirm.com',
      assignedByName: 'Jennifer Lee',
      dueDate: '2024-01-30T17:00:00Z',
      priority: 'medium',
      status: 'pending',
      category: 'consulting',
      estimatedHours: 12,
      createdAt: '2024-01-16T15:00:00Z',
      updatedAt: '2024-01-16T15:00:00Z'
    }
  ];

  const mockTemplates: MeetingTemplate[] = [
    {
      id: '1',
      name: 'Tax Planning Consultation',
      category: 'tax_planning',
      sections: [
        {
          id: 'section-1',
          title: 'Client Background',
          type: 'text',
          required: true,
          placeholder: 'Brief overview of client situation',
          order: 1
        },
        {
          id: 'section-2',
          title: 'Key Issues Discussed',
          type: 'text',
          required: true,
          placeholder: 'Main tax planning issues and concerns',
          order: 2
        },
        {
          id: 'section-3',
          title: 'Action Items',
          type: 'checkbox',
          required: false,
          options: ['Prepare tax projections', 'Review entity structure', 'Analyze deductions', 'Plan estimated payments'],
          order: 3
        },
        {
          id: 'section-4',
          title: 'Next Meeting Date',
          type: 'date',
          required: true,
          order: 4
        }
      ],
      isActive: true,
      createdBy: 'michael.chen@accountingfirm.com',
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-01T09:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
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

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'action_items': return <CheckSquare className="h-4 w-4" />;
      case 'decisions': return <Target className="h-4 w-4" />;
      case 'questions': return <MessageSquare className="h-4 w-4" />;
      case 'follow_up': return <RefreshCw className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Notes & Follow-up System</h1>
          <p className="text-gray-600 mt-2">
            Capture meeting notes, track action items, and manage follow-up tasks
          </p>
        </div>
        <Button onClick={() => setShowNewNoteDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMeetingNotes.length}</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFollowUps.filter(f => f.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActionItems.length}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFollowUps.filter(f => f.status === 'overdue').length}</div>
            <p className="text-xs text-muted-foreground">Past due</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Meeting Notes</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-ups</TabsTrigger>
          <TabsTrigger value="action-items">Action Items</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Meeting Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Meeting Notes</CardTitle>
                  <CardDescription>
                    Capture and organize meeting notes with action items and follow-ups
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMeetingNotes.map((note) => (
                  <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getNoteTypeIcon(note.noteType)}
                            <h3 className="font-semibold text-lg">{note.meetingTitle}</h3>
                            <Badge className={getPriorityColor(note.priority)}>
                              {note.priority}
                            </Badge>
                            <Badge className={getStatusColor(note.status)}>
                              {note.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {note.clientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDateTime(note.meetingDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {note.noteType.replace('_', ' ')}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{note.content}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {note.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {note.attachments.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4" />
                              <span>{note.attachments.length} attachment(s)</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Follow-ups Tab */}
        <TabsContent value="follow-ups" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Follow-up Tasks</CardTitle>
                  <CardDescription>
                    Track and manage follow-up tasks from meetings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Follow-up
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFollowUps.map((followUp) => (
                  <Card key={followUp.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{followUp.title}</h3>
                            <Badge className={getPriorityColor(followUp.priority)}>
                              {followUp.priority}
                            </Badge>
                            <Badge className={getStatusColor(followUp.status)}>
                              {followUp.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {followUp.clientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-4 w-4" />
                              {followUp.assignedByName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {formatDateTime(followUp.dueDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {followUp.type.replace('_', ' ')}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{followUp.description}</p>
                          
                          {followUp.notes && (
                            <div className="bg-gray-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-gray-700">{followUp.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            {followUp.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="action-items" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Action Items</CardTitle>
                  <CardDescription>
                    Track specific action items with time estimates and progress
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action Item
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActionItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckSquare className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <Badge variant="outline">
                              {item.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-4 w-4" />
                              {item.assignedByName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {formatDateTime(item.dueDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock3 className="h-4 w-4" />
                              Est: {item.estimatedHours}h
                              {item.actualHours && ` / Act: ${item.actualHours}h`}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{item.description}</p>
                          
                          {item.completionNotes && (
                            <div className="bg-blue-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-blue-700">{item.completionNotes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Meeting Templates</CardTitle>
                  <CardDescription>
                    Predefined templates for different types of meetings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{template.name}</h3>
                            <Badge variant="outline">
                              {template.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant={template.isActive ? 'default' : 'secondary'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <List className="h-4 w-4" />
                              {template.sections.length} sections
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {template.createdBy}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Sections:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {template.sections.slice(0, 4).map((section) => (
                                <div key={section.id} className="text-sm text-gray-600">
                                  • {section.title}
                                </div>
                              ))}
                              {template.sections.length > 4 && (
                                <div className="text-sm text-gray-500">
                                  +{template.sections.length - 4} more...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Note Dialog */}
      <Dialog open={showNewNoteDialog} onOpenChange={setShowNewNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Meeting Note</DialogTitle>
            <DialogDescription>
              Create a new meeting note with action items and follow-ups
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Meeting Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input id="meeting-title" placeholder="Enter meeting title" />
                </div>
                <div>
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" placeholder="Enter client name" />
                </div>
                <div>
                  <Label htmlFor="meeting-date">Meeting Date</Label>
                  <Input id="meeting-date" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="note-type">Note Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Notes</SelectItem>
                      <SelectItem value="action_items">Action Items</SelectItem>
                      <SelectItem value="decisions">Decisions</SelectItem>
                      <SelectItem value="questions">Questions</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Note Content</h3>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea 
                  id="note-content" 
                  placeholder="Enter meeting notes..."
                  className="mt-2"
                  rows={6}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assigned-to">Assigned To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="michael.chen@accountingfirm.com">Michael Chen</SelectItem>
                      <SelectItem value="jennifer.lee@accountingfirm.com">Jennifer Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="private-note" />
                <Label htmlFor="private-note">Private note (only visible to me)</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewNoteDialog(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingNotesSystem; 