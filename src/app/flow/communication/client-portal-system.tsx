'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Lock, 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  Folder,
  Image,
  FileSpreadsheet,
  FileArchive,
  Star,
  Share,
  Copy,
  Trash2,
  Archive,
  RefreshCw,
  Activity,
  BarChart3,
  Users,
  Building
} from 'lucide-react';

interface ClientPortalUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: 'primary_contact' | 'authorized_user' | 'viewer';
  lastLogin: string;
  isActive: boolean;
  permissions: string[];
}

interface PortalDocument {
  id: string;
  name: string;
  type: 'tax_return' | 'financial_statement' | 'engagement_letter' | 'compliance' | 'correspondence' | 'workpaper';
  category: string;
  uploadedBy: string;
  uploadDate: string;
  lastModified: string;
  fileSize: number;
  version: number;
  status: 'active' | 'archived' | 'pending_review';
  security: 'public' | 'private' | 'restricted' | 'encrypted';
  tags: string[];
  description: string;
  downloadCount: number;
  isEncrypted: boolean;
  retentionPolicy: string;
  nextReviewDate: string;
}

interface PortalActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'logout' | 'download' | 'upload' | 'view' | 'share' | 'comment';
  timestamp: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

interface PortalNotification {
  id: string;
  type: 'document_ready' | 'deadline_reminder' | 'security_alert' | 'system_update';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const mockPortalUser: ClientPortalUser = {
  id: '1',
  name: 'John Smith',
  email: 'john@acmecorp.com',
  companyName: 'Acme Corporation',
  role: 'primary_contact',
  lastLogin: '2024-01-15T10:30:00',
  isActive: true,
  permissions: ['view_documents', 'download_documents', 'upload_documents', 'view_activity', 'manage_users']
};

const mockPortalDocuments: PortalDocument[] = [
  {
    id: '1',
    name: '2023_Tax_Return_Acme_Corp.pdf',
    type: 'tax_return',
    category: 'Tax Documents',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2024-01-10T14:30:00',
    lastModified: '2024-01-10T14:30:00',
    fileSize: 2048576,
    version: 1,
    status: 'active',
    security: 'encrypted',
    tags: ['tax_return', '2023', 'final'],
    description: '2023 Corporate Tax Return - Final Version',
    downloadCount: 3,
    isEncrypted: true,
    retentionPolicy: '7_years',
    nextReviewDate: '2024-04-15'
  },
  {
    id: '2',
    name: 'Q4_2023_Financial_Statements.xlsx',
    type: 'financial_statement',
    category: 'Financial Statements',
    uploadedBy: 'Mike Chen',
    uploadDate: '2024-01-08T09:15:00',
    lastModified: '2024-01-08T09:15:00',
    fileSize: 1048576,
    version: 1,
    status: 'active',
    security: 'restricted',
    tags: ['financial_statements', 'Q4', '2023'],
    description: 'Q4 2023 Financial Statements - Draft',
    downloadCount: 1,
    isEncrypted: true,
    retentionPolicy: '7_years',
    nextReviewDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Engagement_Letter_2024.pdf',
    type: 'engagement_letter',
    category: 'Engagement Letters',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2024-01-05T11:00:00',
    lastModified: '2024-01-05T11:00:00',
    fileSize: 512000,
    version: 1,
    status: 'active',
    security: 'private',
    tags: ['engagement_letter', '2024'],
    description: '2024 Engagement Letter - Signed',
    downloadCount: 2,
    isEncrypted: true,
    retentionPolicy: '7_years',
    nextReviewDate: '2024-12-31'
  }
];

const mockPortalActivities: PortalActivity[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Smith',
    action: 'login',
    timestamp: '2024-01-15T10:30:00',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Smith',
    action: 'download',
    timestamp: '2024-01-15T10:35:00',
    details: 'Downloaded 2023_Tax_Return_Acme_Corp.pdf',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Smith',
    action: 'upload',
    timestamp: '2024-01-15T11:00:00',
    details: 'Uploaded Q4_Supporting_Documents.zip',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

const mockPortalNotifications: PortalNotification[] = [
  {
    id: '1',
    type: 'document_ready',
    title: 'Q4 Financial Statements Ready',
    message: 'Your Q4 2023 financial statements are now available for review.',
    timestamp: '2024-01-15T09:00:00',
    isRead: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'deadline_reminder',
    title: 'Tax Filing Deadline Reminder',
    message: 'Reminder: Corporate tax return due in 30 days.',
    timestamp: '2024-01-14T14:30:00',
    isRead: true,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'security_alert',
    title: 'New Login Detected',
    message: 'New login detected from IP address 192.168.1.100.',
    timestamp: '2024-01-15T10:30:00',
    isRead: false,
    priority: 'low'
  }
];

export default function ClientPortalSystem() {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PortalDocument | null>(null);

  const filteredDocuments = mockPortalDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'tax_return': return <FileText className="h-4 w-4" />;
      case 'financial_statement': return <FileSpreadsheet className="h-4 w-4" />;
      case 'engagement_letter': return <FileText className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'correspondence': return <MessageSquare className="h-4 w-4" />;
      case 'workpaper': return <FileArchive className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Client Portal</h1>
                  <p className="text-sm text-gray-600">{mockPortalUser.companyName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {mockPortalNotifications.filter(n => !n.isRead).length > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs">
                    {mockPortalNotifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/api/avatar/${mockPortalUser.id}`} />
                  <AvatarFallback>{mockPortalUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{mockPortalUser.name}</p>
                  <p className="text-gray-600">{mockPortalUser.role.replace('_', ' ')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
                <p className="text-gray-600">Access and manage your documents securely</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
                <Button variant="outline" onClick={() => setShowUserManagement(true)}>
                  <Users className="h-4 w-4" />
                  Manage Users
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
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
                      <SelectItem value="tax_return">Tax Returns</SelectItem>
                      <SelectItem value="financial_statement">Financial Statements</SelectItem>
                      <SelectItem value="engagement_letter">Engagement Letters</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="correspondence">Correspondence</SelectItem>
                      <SelectItem value="workpaper">Workpapers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getDocumentIcon(document.type)}
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold">{document.name}</CardTitle>
                          <CardDescription className="text-xs">{document.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {document.isEncrypted && <Lock className="h-3 w-3 text-blue-600" />}
                        <Badge variant={document.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {document.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600 mb-3">{document.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>v{document.version}</span>
                      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{document.downloadCount} downloads</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Portal Activity</h2>
              <p className="text-gray-600">Track all portal activities and access logs</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockPortalActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          activity.action === 'login' ? 'bg-green-100 text-green-600' :
                          activity.action === 'download' ? 'bg-blue-100 text-blue-600' :
                          activity.action === 'upload' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.action === 'login' ? <User className="h-4 w-4" /> :
                           activity.action === 'download' ? <Download className="h-4 w-4" /> :
                           activity.action === 'upload' ? <Upload className="h-4 w-4" /> :
                           <Activity className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.userName}</p>
                          <p className="text-xs text-gray-600">{activity.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{activity.ipAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
              <p className="text-gray-600">Stay updated with important alerts and reminders</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockPortalNotifications.map((notification) => (
                    <div key={notification.id} className={`flex items-start gap-4 p-4 border rounded-lg ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                    }`}>
                      <div className={`p-2 rounded-full ${
                        notification.type === 'document_ready' ? 'bg-green-100 text-green-600' :
                        notification.type === 'deadline_reminder' ? 'bg-orange-100 text-orange-600' :
                        notification.type === 'security_alert' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'document_ready' ? <FileText className="h-4 w-4" /> :
                         notification.type === 'deadline_reminder' ? <Clock className="h-4 w-4" /> :
                         notification.type === 'security_alert' ? <Shield className="h-4 w-4" /> :
                         <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm">{notification.title}</h3>
                          {!notification.isRead && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                          <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-xs">
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Portal Settings</h2>
              <p className="text-gray-600">Manage your portal preferences and security settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Profile</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={mockPortalUser.name} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={mockPortalUser.email} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input value={mockPortalUser.companyName} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Input value={mockPortalUser.role.replace('_', ' ')} readOnly />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Settings</CardTitle>
                  <CardDescription>Configure security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Session Timeout</p>
                      <p className="text-xs text-gray-600">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the portal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input placeholder="Enter document name" />
            </div>
            <div>
              <label className="text-sm font-medium">Document Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_return">Tax Return</SelectItem>
                  <SelectItem value="financial_statement">Financial Statement</SelectItem>
                  <SelectItem value="engagement_letter">Engagement Letter</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="correspondence">Correspondence</SelectItem>
                  <SelectItem value="workpaper">Workpaper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Enter document description" />
            </div>
            <div>
              <label className="text-sm font-medium">File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, Excel, Word up to 10MB</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked />
              <label className="text-sm font-medium">Encrypt document</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button>Upload Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 