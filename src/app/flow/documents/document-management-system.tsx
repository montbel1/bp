'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  Download, 
  Eye, 
  Lock, 
  Unlock, 
  FileText, 
  Folder, 
  Search, 
  Filter, 
  MoreVertical,
  Calendar,
  User,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  Share,
  Copy,
  Edit,
  History,
  Tag,
  Star
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'tax_return' | 'financial_statement' | 'engagement_letter' | 'compliance' | 'correspondence' | 'other';
  category: string;
  clientId: string;
  clientName: string;
  uploadedBy: string;
  uploadDate: string;
  lastModified: string;
  fileSize: number;
  version: number;
  status: 'active' | 'archived' | 'deleted';
  security: 'public' | 'private' | 'restricted' | 'encrypted';
  tags: string[];
  description: string;
  retentionPolicy: string;
  nextReviewDate: string;
  isEncrypted: boolean;
  accessLevel: 'view' | 'edit' | 'admin';
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  id: string;
  action: 'created' | 'viewed' | 'modified' | 'downloaded' | 'shared' | 'archived' | 'deleted';
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  retentionPolicy: string;
  securityLevel: 'public' | 'private' | 'restricted' | 'encrypted';
}

const DocumentManagementSystem: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSecurity, setFilterSecurity] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: '',
    category: '',
    clientId: '',
    description: '',
    tags: '',
    security: 'private',
    retentionPolicy: '7_years'
  });

  const documentTypes = [
    { value: 'tax_return', label: 'Tax Return', icon: '📊' },
    { value: 'financial_statement', label: 'Financial Statement', icon: '📈' },
    { value: 'engagement_letter', label: 'Engagement Letter', icon: '📝' },
    { value: 'compliance', label: 'Compliance Document', icon: '🛡️' },
    { value: 'correspondence', label: 'Correspondence', icon: '✉️' },
    { value: 'other', label: 'Other', icon: '📄' }
  ];

  const categories = [
    { id: 'tax_documents', name: 'Tax Documents', color: 'bg-red-100 text-red-800' },
    { id: 'financial_statements', name: 'Financial Statements', color: 'bg-blue-100 text-blue-800' },
    { id: 'engagement_letters', name: 'Engagement Letters', color: 'bg-green-100 text-green-800' },
    { id: 'compliance', name: 'Compliance', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'correspondence', name: 'Correspondence', color: 'bg-purple-100 text-purple-800' },
    { id: 'workpapers', name: 'Workpapers', color: 'bg-gray-100 text-gray-800' }
  ];

  const retentionPolicies = [
    { value: '3_years', label: '3 Years' },
    { value: '7_years', label: '7 Years' },
    { value: '10_years', label: '10 Years' },
    { value: 'permanent', label: 'Permanent' },
    { value: 'until_audit', label: 'Until Audit Complete' }
  ];

  // Mock data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: '2023 Tax Return - Smith Corp',
        type: 'tax_return',
        category: 'Tax Documents',
        clientId: 'client-1',
        clientName: 'Smith Corporation',
        uploadedBy: 'John CPA',
        uploadDate: '2024-01-15',
        lastModified: '2024-01-20',
        fileSize: 2048576,
        version: 3,
        status: 'active',
        security: 'encrypted',
        tags: ['2023', 'corporate', 'reviewed'],
        description: 'Complete 2023 corporate tax return with supporting documentation',
        retentionPolicy: '7_years',
        nextReviewDate: '2024-04-15',
        isEncrypted: true,
        accessLevel: 'edit',
        auditTrail: [
          {
            id: 'audit-1',
            action: 'created',
            userId: 'user-1',
            userName: 'John CPA',
            timestamp: '2024-01-15T10:30:00Z',
            details: 'Document uploaded',
            ipAddress: '192.168.1.100'
          },
          {
            id: 'audit-2',
            action: 'viewed',
            userId: 'user-2',
            userName: 'Sarah Reviewer',
            timestamp: '2024-01-18T14:20:00Z',
            details: 'Document reviewed for quality control',
            ipAddress: '192.168.1.101'
          }
        ]
      },
      {
        id: '2',
        name: 'Financial Statements - Q4 2023',
        type: 'financial_statement',
        category: 'Financial Statements',
        clientId: 'client-2',
        clientName: 'Johnson LLC',
        uploadedBy: 'Mike Accountant',
        uploadDate: '2024-01-10',
        lastModified: '2024-01-12',
        fileSize: 1536000,
        version: 2,
        status: 'active',
        security: 'restricted',
        tags: ['Q4', '2023', 'reviewed'],
        description: 'Fourth quarter financial statements with notes',
        retentionPolicy: '7_years',
        nextReviewDate: '2024-02-10',
        isEncrypted: false,
        accessLevel: 'view',
        auditTrail: []
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'encrypted':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'restricted':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'private':
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <Unlock className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSecurity = filterSecurity === 'all' || doc.security === filterSecurity;
    
    return matchesSearch && matchesType && matchesStatus && matchesSecurity;
  });

  const handleUpload = () => {
    const newDocument: Document = {
      id: Date.now().toString(),
      name: uploadForm.name,
      type: uploadForm.type as any,
      category: uploadForm.category,
      clientId: uploadForm.clientId,
      clientName: 'Client Name', // Would be fetched from client data
      uploadedBy: 'Current User',
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      fileSize: Math.floor(Math.random() * 5000000) + 100000,
      version: 1,
      status: 'active',
      security: uploadForm.security as any,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      description: uploadForm.description,
      retentionPolicy: uploadForm.retentionPolicy,
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isEncrypted: uploadForm.security === 'encrypted',
      accessLevel: 'edit',
      auditTrail: []
    };
    
    setDocuments([newDocument, ...documents]);
    setShowUploadDialog(false);
    setUploadForm({
      name: '',
      type: '',
      category: '',
      clientId: '',
      description: '',
      tags: '',
      security: 'private',
      retentionPolicy: '7_years'
    });
  };

  const documentStats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    encrypted: documents.filter(d => d.isEncrypted).length,
    overdue: documents.filter(d => new Date(d.nextReviewDate) < new Date()).length,
    totalSize: documents.reduce((sum, doc) => sum + doc.fileSize, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management System</h1>
          <p className="text-muted-foreground">Secure document storage and management for financial professionals</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documentStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Documents</p>
                <p className="text-2xl font-bold">{documentStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encrypted</p>
                <p className="text-2xl font-bold">{documentStats.encrypted}</p>
              </div>
              <Lock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue Review</p>
                <p className="text-2xl font-bold">{documentStats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(documentStats.totalSize)}</p>
              </div>
              <Folder className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, clients, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterSecurity} onValueChange={setFilterSecurity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Security Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Security</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="encrypted">Encrypted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
          <CardDescription>Secure document management with version control and audit trails</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">v{doc.version}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{doc.clientName}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSecurityIcon(doc.security)}
                      <span className="text-sm capitalize">{doc.security}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(doc.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{doc.lastModified}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatFileSize(doc.fileSize)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowDocumentDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Upload a new document with security settings and categorization
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Document Name</label>
                <Input
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Document Type</label>
                <Select value={uploadForm.type} onValueChange={(value) => setUploadForm({...uploadForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Security Level</label>
                <Select value={uploadForm.security} onValueChange={(value) => setUploadForm({...uploadForm, security: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select security" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="encrypted">Encrypted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Retention Policy</label>
                <Select value={uploadForm.retentionPolicy} onValueChange={(value) => setUploadForm({...uploadForm, retentionPolicy: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention" />
                  </SelectTrigger>
                  <SelectContent>
                    {retentionPolicies.map(policy => (
                      <SelectItem key={policy.value} value={policy.value}>
                        {policy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="encryption" checked={uploadForm.security === 'encrypted'} />
              <label htmlFor="encryption" className="text-sm font-medium">
                Enable encryption for sensitive documents
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Details Dialog */}
      <Dialog open={showDocumentDetails} onOpenChange={setShowDocumentDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              View document information, security settings, and audit trail
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Document Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedDocument.name}</div>
                      <div><span className="font-medium">Type:</span> {documentTypes.find(t => t.value === selectedDocument.type)?.label}</div>
                      <div><span className="font-medium">Category:</span> {selectedDocument.category}</div>
                      <div><span className="font-medium">Client:</span> {selectedDocument.clientName}</div>
                      <div><span className="font-medium">Size:</span> {formatFileSize(selectedDocument.fileSize)}</div>
                      <div><span className="font-medium">Version:</span> {selectedDocument.version}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Security & Access</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Security Level:</span> {selectedDocument.security}</div>
                      <div><span className="font-medium">Encrypted:</span> {selectedDocument.isEncrypted ? 'Yes' : 'No'}</div>
                      <div><span className="font-medium">Access Level:</span> {selectedDocument.accessLevel}</div>
                      <div><span className="font-medium">Retention Policy:</span> {selectedDocument.retentionPolicy}</div>
                      <div><span className="font-medium">Next Review:</span> {selectedDocument.nextReviewDate}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Encryption</span>
                        <Badge variant={selectedDocument.isEncrypted ? "default" : "secondary"}>
                          {selectedDocument.isEncrypted ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Access Level</span>
                        <Badge variant="outline">{selectedDocument.accessLevel}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Security Level</span>
                        <Badge variant="outline">{selectedDocument.security}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Audit Trail</span>
                        <Badge variant="outline">{selectedDocument.auditTrail.length} entries</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Access Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="view-access" defaultChecked />
                        <label htmlFor="view-access" className="text-sm">View Access</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="edit-access" defaultChecked />
                        <label htmlFor="edit-access" className="text-sm">Edit Access</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="download-access" defaultChecked />
                        <label htmlFor="download-access" className="text-sm">Download Access</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="share-access" />
                        <label htmlFor="share-access" className="text-sm">Share Access</label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="audit" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-4">Audit Trail</h3>
                  <div className="space-y-2">
                    {selectedDocument.auditTrail.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-muted-foreground">{entry.userName} • {entry.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{entry.ipAddress}</p>
                          <p className="text-xs">{entry.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="versions" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-4">Version History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Version {selectedDocument.version}</p>
                          <p className="text-xs text-muted-foreground">Current version</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{selectedDocument.lastModified}</p>
                        <p className="text-xs">{formatFileSize(selectedDocument.fileSize)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagementSystem; 