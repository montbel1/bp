'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Send,
  Users,
  FileText,
  CalendarDays,
  Target,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Filter,
  Search,
  MoreVertical,
  RefreshCw,
  Activity,
  BarChart3
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'portal' | 'all';
  category: 'document_ready' | 'deadline_reminder' | 'security_alert' | 'system_update' | 'meeting_reminder' | 'custom';
  subject: string;
  message: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipients: string[];
  conditions: NotificationCondition[];
  schedule: NotificationSchedule;
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

interface NotificationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string;
  logicalOperator: 'and' | 'or';
}

interface NotificationSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  time?: string;
  date?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone: string;
}

interface NotificationLog {
  id: string;
  templateId: string;
  templateName: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  type: 'email' | 'sms' | 'portal';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

interface ClientNotificationPreference {
  clientId: string;
  clientName: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  portalNotifications: boolean;
  emailAddress: string;
  phoneNumber: string;
  categories: {
    document_ready: boolean;
    deadline_reminder: boolean;
    security_alert: boolean;
    system_update: boolean;
    meeting_reminder: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Document Ready Notification',
    type: 'all',
    category: 'document_ready',
    subject: 'Your {{document_name}} is ready for review',
    message: 'Dear {{client_name}},\n\nYour {{document_name}} has been completed and is now available in your client portal.\n\nPlease log in to review and download the document.\n\nBest regards,\n{{firm_name}}',
    isActive: true,
    priority: 'high',
    recipients: ['client', 'assigned_team_member'],
    conditions: [
      { id: '1', field: 'document_status', operator: 'equals', value: 'ready', logicalOperator: 'and' }
    ],
    schedule: { type: 'immediate', timezone: 'UTC' },
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-10T10:00:00',
    lastModified: '2024-01-10T10:00:00'
  },
  {
    id: '2',
    name: 'Tax Deadline Reminder',
    type: 'email',
    category: 'deadline_reminder',
    subject: 'Tax Filing Deadline Reminder - {{deadline_date}}',
    message: 'Dear {{client_name}},\n\nThis is a friendly reminder that your {{tax_type}} is due on {{deadline_date}}.\n\nPlease ensure all required documents are submitted by {{submission_deadline}}.\n\nIf you have any questions, please contact us immediately.\n\nBest regards,\n{{firm_name}}',
    isActive: true,
    priority: 'urgent',
    recipients: ['client', 'assigned_team_member'],
    conditions: [
      { id: '1', field: 'days_until_deadline', operator: 'less_than', value: '30', logicalOperator: 'and' }
    ],
    schedule: { type: 'scheduled', time: '09:00', date: '2024-01-15', timezone: 'UTC' },
    createdBy: 'Mike Chen',
    createdAt: '2024-01-08T14:30:00',
    lastModified: '2024-01-08T14:30:00'
  },
  {
    id: '3',
    name: 'Security Alert',
    type: 'all',
    category: 'security_alert',
    subject: 'Security Alert - New Login Detected',
    message: 'Dear {{client_name}},\n\nWe detected a new login to your client portal from {{ip_address}} at {{login_time}}.\n\nIf this was not you, please contact us immediately.\n\nBest regards,\n{{firm_name}}',
    isActive: true,
    priority: 'high',
    recipients: ['client'],
    conditions: [
      { id: '1', field: 'login_location', operator: 'not_equals', value: 'usual_location', logicalOperator: 'and' }
    ],
    schedule: { type: 'immediate', timezone: 'UTC' },
    createdBy: 'System',
    createdAt: '2024-01-05T12:00:00',
    lastModified: '2024-01-05T12:00:00'
  }
];

const mockNotificationLogs: NotificationLog[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Document Ready Notification',
    recipientId: '1',
    recipientName: 'John Smith',
    recipientEmail: 'john@acmecorp.com',
    type: 'email',
    status: 'delivered',
    sentAt: '2024-01-15T10:30:00',
    deliveredAt: '2024-01-15T10:31:00',
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: '2',
    templateId: '1',
    templateName: 'Document Ready Notification',
    recipientId: '1',
    recipientName: 'John Smith',
    recipientEmail: 'john@acmecorp.com',
    type: 'portal',
    status: 'sent',
    sentAt: '2024-01-15T10:30:00',
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: '3',
    templateId: '2',
    templateName: 'Tax Deadline Reminder',
    recipientId: '2',
    recipientName: 'Maria Garcia',
    recipientEmail: 'maria@techstart.com',
    type: 'email',
    status: 'failed',
    sentAt: '2024-01-15T09:00:00',
    errorMessage: 'Email address not found',
    retryCount: 3,
    maxRetries: 3
  }
];

const mockClientPreferences: ClientNotificationPreference[] = [
  {
    clientId: '1',
    clientName: 'John Smith',
    emailNotifications: true,
    smsNotifications: false,
    portalNotifications: true,
    emailAddress: 'john@acmecorp.com',
    phoneNumber: '+1-555-0123',
    categories: {
      document_ready: true,
      deadline_reminder: true,
      security_alert: true,
      system_update: false,
      meeting_reminder: true
    },
    frequency: 'immediate',
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00'
    }
  }
];

export default function AutomatedNotificationsSystem() {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);

  const filteredTemplates = mockNotificationTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4 text-blue-600" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'portal': return <Bell className="h-4 w-4" />;
      case 'all': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Automated Notifications</h1>
                  <p className="text-sm text-gray-600">Manage client communication and alerts</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowNewTemplateDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Template
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Notification Logs</TabsTrigger>
            <TabsTrigger value="preferences">Client Preferences</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Notification Templates</h2>
                <p className="text-gray-600">Create and manage automated notification templates</p>
              </div>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="portal">Portal</SelectItem>
                      <SelectItem value="all">All Channels</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="document_ready">Document Ready</SelectItem>
                      <SelectItem value="deadline_reminder">Deadline Reminder</SelectItem>
                      <SelectItem value="security_alert">Security Alert</SelectItem>
                      <SelectItem value="system_update">System Update</SelectItem>
                      <SelectItem value="meeting_reminder">Meeting Reminder</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                          <CardDescription className="text-xs">{template.category.replace('_', ' ')}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch checked={template.isActive} />
                        <Badge variant={template.priority === 'urgent' ? 'destructive' : 
                                       template.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {template.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 mb-3">{template.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Created by {template.createdBy}</span>
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {template.recipients.map((recipient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notification Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Logs</h2>
              <p className="text-gray-600">Track all sent notifications and delivery status</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockNotificationLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{log.templateName}</p>
                          <p className="text-xs text-gray-600">{log.recipientName} ({log.recipientEmail})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(log.type)}
                        <Badge variant={log.status === 'delivered' ? 'default' : 
                                       log.status === 'failed' ? 'destructive' : 'secondary'} className="text-xs">
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{new Date(log.sentAt).toLocaleString()}</p>
                        {log.errorMessage && (
                          <p className="text-xs text-red-500">{log.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Notification Preferences</h2>
              <p className="text-gray-600">Manage how clients receive notifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockClientPreferences.map((preference) => (
                <Card key={preference.clientId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{preference.clientName}</CardTitle>
                    <CardDescription>Notification preferences and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Email Notifications</p>
                          <p className="text-xs text-gray-600">{preference.emailAddress}</p>
                        </div>
                        <Switch checked={preference.emailNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">SMS Notifications</p>
                          <p className="text-xs text-gray-600">{preference.phoneNumber}</p>
                        </div>
                        <Switch checked={preference.smsNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Portal Notifications</p>
                          <p className="text-xs text-gray-600">In-app notifications</p>
                        </div>
                        <Switch checked={preference.portalNotifications} />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Notification Categories</p>
                      <div className="space-y-2">
                        {Object.entries(preference.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-xs">{category.replace('_', ' ')}</span>
                            <Switch checked={enabled} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Frequency</p>
                      <Select value={preference.frequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Quiet Hours</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Enable quiet hours</span>
                          <Switch checked={preference.quietHours.enabled} />
                        </div>
                        {preference.quietHours.enabled && (
                          <div className="flex items-center gap-2">
                            <Input value={preference.quietHours.startTime} className="text-xs" />
                            <span className="text-xs">to</span>
                            <Input value={preference.quietHours.endTime} className="text-xs" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Analytics</h2>
              <p className="text-gray-600">Track notification performance and engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Send className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-gray-600">Total Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">1,189</p>
                      <p className="text-sm text-gray-600">Delivered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">58</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">95.3%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email</span>
                      <span className="text-sm font-medium">847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS</span>
                      <span className="text-sm font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Portal</span>
                      <span className="text-sm font-medium">166</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Document Ready</span>
                      <span className="text-sm font-medium">456</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Deadline Reminder</span>
                      <span className="text-sm font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Alert</span>
                      <span className="text-sm font-medium">123</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Template Dialog */}
      <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Notification Template</DialogTitle>
            <DialogDescription>
              Create a new automated notification template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input placeholder="Enter template name" />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="portal">Portal</SelectItem>
                  <SelectItem value="all">All Channels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document_ready">Document Ready</SelectItem>
                  <SelectItem value="deadline_reminder">Deadline Reminder</SelectItem>
                  <SelectItem value="security_alert">Security Alert</SelectItem>
                  <SelectItem value="system_update">System Update</SelectItem>
                  <SelectItem value="meeting_reminder">Meeting Reminder</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Enter subject line" />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Enter message content" className="min-h-[100px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewTemplateDialog(false)}>
                Cancel
              </Button>
              <Button>Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 