'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Plus,
  Folder,
  Lock,
  Unlock,
  Calendar,
  User,
  Tag,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  MoreVertical,
  Save,
  X
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'tax_return' | 'financial_statement' | 'audit_report' | 'engagement_letter' | 'invoice' | 'contract' | 'compliance' | 'other';
  category: string;
  clientId: string;
  clientName: string;
  size: number; // in bytes
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  status: 'active' | 'archived' | 'deleted' | 'pending_review';
  security: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
  description: string;
  version: string;
  retentionPolicy: string;
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  id: string;
  action: 'created' | 'viewed' | 'downloaded' | 'modified' | 'deleted' | 'shared';
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Acme Corp - 2023 Tax Return.pdf',
    type: 'tax_return',
    category: 'Tax Returns',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    size: 2048576, // 2MB
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T14:20:00Z',
    status: 'active',
    security: 'confidential',
    tags: ['tax', '2023', 'acme'],
    description: '2023 corporate tax return for Acme Corporation',
    version: '1.0',
    retentionPolicy: '7 years',
    auditTrail: [
      {
        id: 'audit-1',
        action: 'created',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Document uploaded'
      },
      {
        id: 'audit-2',
        action: 'viewed',
        userId: 'user-2',
        userName: 'Mike Chen',
        timestamp: '2024-01-15T11:15:00Z',
        details: 'Document reviewed'
      }
    ]
  },
  {
    id: '2',
    name: 'TechStart Inc - Financial Statements Q4 2023.xlsx',
    type: 'financial_statement',
    category: 'Financial Statements',
    clientId: 'client-2',
    clientName: 'TechStart Inc.',
    size: 1048576, // 1MB
    uploadedBy: 'Mike Chen',
    uploadedAt: '2024-01-14T16:45:00Z',
    lastModified: '2024-01-15T09:10:00Z',
    status: 'active',
    security: 'internal',
    tags: ['financial', 'q4', '2023', 'techstart'],
    description: 'Q4 2023 financial statements for TechStart Inc.',
    version: '2.1',
    retentionPolicy: '7 years',
    auditTrail: [
      {
        id: 'audit-3',
        action: 'created',
        userId: 'user-2',
        userName: 'Mike Chen',
        timestamp: '2024-01-14T16:45:00Z',
        details: 'Document uploaded'
      }
    ]
  },
  {
    id: '3',
    name: 'Wilson Manufacturing - Audit Report 2023.pdf',
    type: 'audit_report',
    category: 'Audit Reports',
    clientId: 'client-3',
    clientName: 'Wilson Manufacturing',
    size: 5242880, // 5MB
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2024-01-13T14:20:00Z',
    lastModified: '2024-01-15T08:30:00Z',
    status: 'pending_review',
    security: 'restricted',
    tags: ['audit', '2023', 'wilson', 'manufacturing'],
    description: '2023 audit report for Wilson Manufacturing',
    version: '1.0',
    retentionPolicy: '7 years',
    auditTrail: [
      {
        id: 'audit-4',
        action: 'created',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        timestamp: '2024-01-13T14:20:00Z',
        details: 'Document uploaded'
      },
      {
        id: 'audit-5',
        action: 'viewed',
        userId: 'user-3',
        userName: 'David Wilson',
        timestamp: '2024-01-15T08:30:00Z',
        details: 'Document reviewed by client'
      }
    ]
  }
];

export default function EnhancedDocumentSystem() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<Partial<Document>>({});

  // Calculate statistics
  const stats = {
    totalDocuments: documents.length,
    totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
    activeDocuments: documents.filter(d => d.status === 'active').length,
    confidentialDocuments: documents.filter(d => d.security === 'confidential' || d.security === 'restricted').length,
    recentUploads: documents.filter(d => new Date(d.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityColor = (security: string) => {
    switch (security) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-orange-100 text-orange-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadDocument = () => {
    if (uploadingDocument.name && uploadingDocument.clientName && uploadingDocument.type) {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: uploadingDocument.name,
        type: uploadingDocument.type as any,
        category: uploadingDocument.category || 'Other',
        clientId: 'client-new',
        clientName: uploadingDocument.clientName,
        size: uploadingDocument.size || 1024000, // 1MB default
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'active',
        security: uploadingDocument.security as any || 'internal',
        tags: uploadingDocument.tags || [],
        description: uploadingDocument.description || '',
        version: '1.0',
        retentionPolicy: uploadingDocument.retentionPolicy || '7 years',
        auditTrail: [
          {
            id: `audit-${Date.now()}`,
            action: 'created',
            userId: 'current-user',
            userName: 'Current User',
            timestamp: new Date().toISOString(),
            details: 'Document uploaded'
          }
        ]
      };
      setDocuments([...documents, newDocument]);
      setIsUploadOpen(false);
      setUploadingDocument({});
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Document Management</h1>
          <p className="text-muted-foreground">
            Secure document storage and management for financial services
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeDocuments} active documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentUploads} recent uploads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidential</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confidentialDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Confidential and restricted documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground">
              Documents uploaded this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Recently uploaded and modified documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents
                    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                    .slice(0, 5)
                    .map((document) => (
                      <div key={document.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{document.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {document.clientName} • {formatFileSize(document.size)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Modified {formatDate(document.lastModified)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getSecurityColor(document.security)}>
                            {document.security}
                          </Badge>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Document Statistics</CardTitle>
                <CardDescription>Document analytics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</div>
                      <div className="text-sm text-muted-foreground">Total Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.activeDocuments}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.confidentialDocuments}</div>
                      <div className="text-sm text-muted-foreground">Confidential</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.recentUploads}</div>
                      <div className="text-sm text-muted-foreground">Recent</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tax Returns</span>
                        <span className="text-sm font-medium">{documents.filter(d => d.type === 'tax_return').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Financial Statements</span>
                        <span className="text-sm font-medium">{documents.filter(d => d.type === 'financial_statement').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Audit Reports</span>
                        <span className="text-sm font-medium">{documents.filter(d => d.type === 'audit_report').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Documents</h2>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage all uploaded documents and files</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">{document.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{document.clientName}</div>
                        <div className="text-sm text-muted-foreground">v{document.version}</div>
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{document.type.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{document.description}</div>
                      </TableCell>
                      <TableCell>{formatFileSize(document.size)}</TableCell>
                      <TableCell>
                        <div>{formatDate(document.uploadedAt)}</div>
                        <div className="text-sm text-muted-foreground">by {document.uploadedBy}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSecurityColor(document.security)}>
                          {document.security}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Document security and access controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Unlock className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Public</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Accessible to all users</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {documents.filter(d => d.security === 'public').length} documents
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Internal</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Internal staff only</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {documents.filter(d => d.security === 'internal').length} documents
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium">Confidential</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Limited access, logged</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {documents.filter(d => d.security === 'confidential').length} documents
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Restricted</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Authorized personnel only</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {documents.filter(d => d.security === 'restricted').length} documents
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Audit Trail</h3>
                  <div className="space-y-2">
                    {documents[0]?.auditTrail.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center space-x-3 p-2 border rounded">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{entry.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.action} • {formatDate(entry.timestamp)}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">{entry.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Document Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isUploadOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload Document</h2>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <Input
                value={uploadingDocument.name || ''}
                onChange={(e) => setUploadingDocument({...uploadingDocument, name: e.target.value})}
                placeholder="Document name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={uploadingDocument.clientName || ''}
                onChange={(e) => setUploadingDocument({...uploadingDocument, clientName: e.target.value})}
                placeholder="Client name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Document Type</label>
                <Select value={uploadingDocument.type || ''} onValueChange={(value) => setUploadingDocument({...uploadingDocument, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax_return">Tax Return</SelectItem>
                    <SelectItem value="financial_statement">Financial Statement</SelectItem>
                    <SelectItem value="audit_report">Audit Report</SelectItem>
                    <SelectItem value="engagement_letter">Engagement Letter</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Security Level</label>
                <Select value={uploadingDocument.security || ''} onValueChange={(value) => setUploadingDocument({...uploadingDocument, security: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select security" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={uploadingDocument.description || ''}
                onChange={(e) => setUploadingDocument({...uploadingDocument, description: e.target.value})}
                placeholder="Document description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Retention Policy</label>
              <Select value={uploadingDocument.retentionPolicy || ''} onValueChange={(value) => setUploadingDocument({...uploadingDocument, retentionPolicy: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select retention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="7 years">7 years</SelectItem>
                  <SelectItem value="10 years">10 years</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              <Save className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 