'use client';

import { useState, useEffect } from 'react';
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
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Globe, 
  Building2, 
  Calendar,
  FileText,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  FileCheck,
  UserCheck,
  CalendarCheck,
  Lock,
  Unlock,
  Send,
  CheckSquare,
  Square,
  Save,
  X,
  MoreVertical,
  Filter as FilterIcon,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Activity
} from 'lucide-react';

interface EnhancedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  status: 'active' | 'inactive' | 'prospect' | 'onboarding' | 'engaged';
  assignedTo: string;
  totalRevenue: number;
  activeJobs: number;
  lastContact: string;
  nextFollowUp: string;
  documents: number;
  communications: number;
  
  // Practice Management Fields
  engagementStatus: 'pending' | 'active' | 'completed' | 'terminated';
  engagementLetter: boolean;
  conflictCheck: 'pending' | 'passed' | 'failed' | 'waived';
  riskAssessment: 'low' | 'medium' | 'high';
  riskFactors: string[];
  qualityReview: 'pending' | 'in_progress' | 'completed' | 'failed';
  complianceStatus: 'compliant' | 'non_compliant' | 'pending_review';
  billingModel: 'hourly' | 'fixed' | 'retainer' | 'contingency';
  retainerAmount?: number;
  hourlyRate?: number;
  specialInstructions: string;
  taxYear: string;
  filingStatus: 'single' | 'married' | 'head_of_household' | 'business';
  entityType: 'individual' | 'partnership' | 'corporation' | 'llc' | 'trust';
  deadlineReminders: boolean;
  portalAccess: boolean;
  secureMessaging: boolean;
  
  // Enhanced Fields
  address: string;
  website: string;
  primaryContact: string;
  secondaryContact?: string;
  notes: string;
  tags: string[];
  lastActivity: string;
  nextDeadline: string;
  outstandingBalance: number;
  paymentTerms: string;
  creditLimit: number;
  riskScore: number;
  satisfactionScore: number;
  referralSource: string;
  marketingConsent: boolean;
  dataRetention: string;
  auditTrail: AuditEntry[];
}

interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
  ipAddress: string;
}

const mockEnhancedClients: EnhancedClient[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@acme.com',
    phone: '(555) 123-4567',
    companyName: 'Acme Corporation',
    industry: 'Technology',
    status: 'active',
    assignedTo: 'Sarah Johnson',
    totalRevenue: 45000,
    activeJobs: 3,
    lastContact: '2024-01-15',
    nextFollowUp: '2024-01-30',
    documents: 12,
    communications: 8,
    engagementStatus: 'active',
    engagementLetter: true,
    conflictCheck: 'passed',
    riskAssessment: 'low',
    riskFactors: ['stable_revenue', 'good_payment_history'],
    qualityReview: 'completed',
    complianceStatus: 'compliant',
    billingModel: 'hourly',
    hourlyRate: 275,
    specialInstructions: 'Prefers email communication. Quarterly meetings required.',
    taxYear: '2024',
    filingStatus: 'business',
    entityType: 'corporation',
    deadlineReminders: true,
    portalAccess: true,
    secureMessaging: true,
    address: '123 Business Ave, Anytown, ST 12345',
    website: 'www.acmecorp.com',
    primaryContact: 'John Smith',
    secondaryContact: 'Jane Doe',
    notes: 'Excellent client with consistent growth. Expanding operations in Q2.',
    tags: ['technology', 'growth', 'reliable'],
    lastActivity: '2024-01-15',
    nextDeadline: '2024-03-15',
    outstandingBalance: 0,
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    riskScore: 15,
    satisfactionScore: 4.8,
    referralSource: 'Website',
    marketingConsent: true,
    dataRetention: '7 years',
    auditTrail: [
      {
        id: 'audit-1',
        action: 'Client Updated',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'Sarah Johnson',
        details: 'Updated billing rate to $275/hour',
        ipAddress: '192.168.1.100'
      }
    ]
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria@techstart.com',
    phone: '(555) 987-6543',
    companyName: 'TechStart Inc.',
    industry: 'Software Development',
    status: 'onboarding',
    assignedTo: 'Mike Chen',
    totalRevenue: 12500,
    activeJobs: 1,
    lastContact: '2024-01-10',
    nextFollowUp: '2024-01-25',
    documents: 5,
    communications: 3,
    engagementStatus: 'pending',
    engagementLetter: false,
    conflictCheck: 'pending',
    riskAssessment: 'medium',
    riskFactors: ['new_client', 'startup', 'limited_history'],
    qualityReview: 'pending',
    complianceStatus: 'pending_review',
    billingModel: 'fixed',
    retainerAmount: 5000,
    specialInstructions: 'Startup company. Flexible payment terms. Monthly retainer.',
    taxYear: '2024',
    filingStatus: 'business',
    entityType: 'llc',
    deadlineReminders: true,
    portalAccess: false,
    secureMessaging: false,
    address: '456 Innovation Dr, Tech City, ST 54321',
    website: 'www.techstart.io',
    primaryContact: 'Maria Rodriguez',
    notes: 'Promising startup. Need to establish payment history.',
    tags: ['startup', 'technology', 'new'],
    lastActivity: '2024-01-10',
    nextDeadline: '2024-02-15',
    outstandingBalance: 5000,
    paymentTerms: 'Net 15',
    creditLimit: 10000,
    riskScore: 45,
    satisfactionScore: 0,
    referralSource: 'Referral',
    marketingConsent: false,
    dataRetention: '7 years',
    auditTrail: [
      {
        id: 'audit-2',
        action: 'Client Created',
        timestamp: '2024-01-10T14:20:00Z',
        user: 'Mike Chen',
        details: 'New client onboarding initiated',
        ipAddress: '192.168.1.101'
      }
    ]
  },
  {
    id: '3',
    name: 'David Wilson',
    email: 'david@manufacturing.com',
    phone: '(555) 456-7890',
    companyName: 'Wilson Manufacturing',
    industry: 'Manufacturing',
    status: 'active',
    assignedTo: 'Sarah Johnson',
    totalRevenue: 87500,
    activeJobs: 2,
    lastContact: '2024-01-12',
    nextFollowUp: '2024-01-28',
    documents: 18,
    communications: 12,
    engagementStatus: 'active',
    engagementLetter: true,
    conflictCheck: 'passed',
    riskAssessment: 'medium',
    riskFactors: ['seasonal_business', 'large_revenue'],
    qualityReview: 'in_progress',
    complianceStatus: 'compliant',
    billingModel: 'hourly',
    hourlyRate: 300,
    specialInstructions: 'Complex manufacturing operations. Quarterly audits required.',
    taxYear: '2024',
    filingStatus: 'business',
    entityType: 'corporation',
    deadlineReminders: true,
    portalAccess: true,
    secureMessaging: true,
    address: '789 Industrial Blvd, Factory Town, ST 67890',
    website: 'www.wilsonmanufacturing.com',
    primaryContact: 'David Wilson',
    secondaryContact: 'Lisa Wilson',
    notes: 'Established manufacturing company. Consistent revenue but seasonal fluctuations.',
    tags: ['manufacturing', 'established', 'seasonal'],
    lastActivity: '2024-01-12',
    nextDeadline: '2024-04-15',
    outstandingBalance: 15000,
    paymentTerms: 'Net 45',
    creditLimit: 100000,
    riskScore: 35,
    satisfactionScore: 4.6,
    referralSource: 'Direct',
    marketingConsent: true,
    dataRetention: '7 years',
    auditTrail: [
      {
        id: 'audit-3',
        action: 'Quality Review Started',
        timestamp: '2024-01-12T09:15:00Z',
        user: 'Sarah Johnson',
        details: 'Initiated quarterly quality review',
        ipAddress: '192.168.1.100'
      }
    ]
  }
];

export default function EnhancedClientManagement() {
  const [clients, setClients] = useState<EnhancedClient[]>(mockEnhancedClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<EnhancedClient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<EnhancedClient>>({});

  // Enhanced filtering and search
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || client.riskAssessment === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Enhanced statistics
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    onboardingClients: clients.filter(c => c.status === 'onboarding').length,
    highRiskClients: clients.filter(c => c.riskAssessment === 'high').length,
    pendingReviews: clients.filter(c => c.qualityReview === 'pending').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    outstandingBalance: clients.reduce((sum, c) => sum + c.outstandingBalance, 0),
    avgSatisfaction: clients.reduce((sum, c) => sum + c.satisfactionScore, 0) / clients.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'onboarding': return 'bg-yellow-100 text-yellow-800';
      case 'engaged': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConflictColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClient = (client: EnhancedClient) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleSaveClient = () => {
    if (editingClient.id) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...editingClient } : c));
    } else {
      // Add new client
      const newClient: EnhancedClient = {
        id: Date.now().toString(),
        name: editingClient.name || '',
        email: editingClient.email || '',
        phone: editingClient.phone || '',
        companyName: editingClient.companyName || '',
        industry: editingClient.industry || '',
        status: 'prospect',
        assignedTo: editingClient.assignedTo || '',
        totalRevenue: 0,
        activeJobs: 0,
        lastContact: new Date().toISOString().split('T')[0],
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        documents: 0,
        communications: 0,
        engagementStatus: 'pending',
        engagementLetter: false,
        conflictCheck: 'pending',
        riskAssessment: 'medium',
        riskFactors: [],
        qualityReview: 'pending',
        complianceStatus: 'pending_review',
        billingModel: 'hourly',
        specialInstructions: editingClient.specialInstructions || '',
        taxYear: '2024',
        filingStatus: 'business',
        entityType: 'corporation',
        deadlineReminders: true,
        portalAccess: false,
        secureMessaging: false,
        address: editingClient.address || '',
        website: editingClient.website || '',
        primaryContact: editingClient.primaryContact || '',
        notes: editingClient.notes || '',
        tags: [],
        lastActivity: new Date().toISOString().split('T')[0],
        nextDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        outstandingBalance: 0,
        paymentTerms: 'Net 30',
        creditLimit: 10000,
        riskScore: 50,
        satisfactionScore: 0,
        referralSource: 'Direct',
        marketingConsent: false,
        dataRetention: '7 years',
        auditTrail: []
      };
      setClients([...clients, newClient]);
    }
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setEditingClient({});
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Client Management</h1>
          <p className="text-muted-foreground">
            Comprehensive client management with practice-specific features
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => {
            setEditingClient({});
            setIsAddDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeClients} active, {stats.onboardingClients} onboarding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.outstandingBalance.toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Management</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskClients}</div>
            <p className="text-xs text-muted-foreground">
              High risk clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Reviews</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Pending reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search clients by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="engaged">Engaged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Client Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            {filteredClients.length} clients found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedClient(client)}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.companyName}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(client.riskAssessment)}>
                      {client.riskAssessment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${client.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.activeJobs} active jobs
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(client.nextFollowUp).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleEditClient(client);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id);
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Enhanced Client Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details - {selectedClient?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive client information and practice management details
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                <TabsTrigger value="quality">Quality Control</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Client Name</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.website}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assigned To</label>
                    <p className="text-sm text-muted-foreground">{selectedClient.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Revenue:</span>
                          <span className="text-sm font-medium">${selectedClient.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Outstanding:</span>
                          <span className="text-sm font-medium">${selectedClient.outstandingBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Credit Limit:</span>
                          <span className="text-sm font-medium">${selectedClient.creditLimit.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Engagement Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge className={getStatusColor(selectedClient.status)}>
                            {selectedClient.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Risk Level:</span>
                          <Badge className={getRiskColor(selectedClient.riskAssessment)}>
                            {selectedClient.riskAssessment}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Satisfaction:</span>
                          <span className="text-sm font-medium">{selectedClient.satisfactionScore}/5.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Key Dates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Last Contact:</span>
                          <span className="text-sm font-medium">{new Date(selectedClient.lastContact).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Next Follow-up:</span>
                          <span className="text-sm font-medium">{new Date(selectedClient.nextFollowUp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Next Deadline:</span>
                          <span className="text-sm font-medium">{new Date(selectedClient.nextDeadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedClient.notes}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Special Instructions</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedClient.specialInstructions}</p>
                </div>
              </TabsContent>

              <TabsContent value="onboarding" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Engagement Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Engagement Status:</span>
                          <Badge className={getStatusColor(selectedClient.engagementStatus)}>
                            {selectedClient.engagementStatus}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Engagement Letter:</span>
                          <Badge className={selectedClient.engagementLetter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {selectedClient.engagementLetter ? 'Signed' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conflict Check:</span>
                          <Badge className={getConflictColor(selectedClient.conflictCheck)}>
                            {selectedClient.conflictCheck}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Billing Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Billing Model:</span>
                          <span className="text-sm font-medium">{selectedClient.billingModel}</span>
                        </div>
                        {selectedClient.hourlyRate && (
                          <div className="flex justify-between">
                            <span className="text-sm">Hourly Rate:</span>
                            <span className="text-sm font-medium">${selectedClient.hourlyRate}</span>
                          </div>
                        )}
                        {selectedClient.retainerAmount && (
                          <div className="flex justify-between">
                            <span className="text-sm">Retainer Amount:</span>
                            <span className="text-sm font-medium">${selectedClient.retainerAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm">Payment Terms:</span>
                          <span className="text-sm font-medium">{selectedClient.paymentTerms}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="risk" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                    <CardDescription>
                      Risk evaluation and mitigation strategies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Overall Risk Level:</span>
                        <Badge className={getRiskColor(selectedClient.riskAssessment)}>
                          {selectedClient.riskAssessment.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risk Score:</span>
                        <span className="text-sm font-medium">{selectedClient.riskScore}/100</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Risk Factors:</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedClient.riskFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Control</CardTitle>
                    <CardDescription>
                      Review status and quality metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quality Review Status:</span>
                        <Badge className={getStatusColor(selectedClient.qualityReview)}>
                          {selectedClient.qualityReview.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Compliance Status:</span>
                        <Badge className={getStatusColor(selectedClient.complianceStatus)}>
                          {selectedClient.complianceStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>
                      Document count and access settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Documents:</span>
                        <span className="text-sm font-medium">{selectedClient.documents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Portal Access:</span>
                        <Badge className={selectedClient.portalAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedClient.portalAccess ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Secure Messaging:</span>
                        <Badge className={selectedClient.secureMessaging ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedClient.secureMessaging ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication History</CardTitle>
                    <CardDescription>
                      Recent communications and activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Communications:</span>
                        <span className="text-sm font-medium">{selectedClient.communications}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Last Activity:</span>
                        <span className="text-sm font-medium">{new Date(selectedClient.lastActivity).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Deadline Reminders:</span>
                        <Badge className={selectedClient.deadlineReminders ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedClient.deadlineReminders ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Add/Edit Client Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={() => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingClient({});
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'Update client information' : 'Create a new client profile'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={editingClient.email || ''}
                  onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                  placeholder="client@company.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editingClient.phone || ''}
                  onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={editingClient.companyName || ''}
                  onChange={(e) => setEditingClient({...editingClient, companyName: e.target.value})}
                  placeholder="Company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Industry</label>
                <Select value={editingClient.industry || ''} onValueChange={(value) => setEditingClient({...editingClient, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Input
                  value={editingClient.assignedTo || ''}
                  onChange={(e) => setEditingClient({...editingClient, assignedTo: e.target.value})}
                  placeholder="Staff member"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={editingClient.address || ''}
                onChange={(e) => setEditingClient({...editingClient, address: e.target.value})}
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={editingClient.website || ''}
                onChange={(e) => setEditingClient({...editingClient, website: e.target.value})}
                placeholder="www.company.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Primary Contact</label>
              <Input
                value={editingClient.primaryContact || ''}
                onChange={(e) => setEditingClient({...editingClient, primaryContact: e.target.value})}
                placeholder="Primary contact name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={editingClient.notes || ''}
                onChange={(e) => setEditingClient({...editingClient, notes: e.target.value})}
                placeholder="Client notes and special instructions"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Special Instructions</label>
              <Textarea
                value={editingClient.specialInstructions || ''}
                onChange={(e) => setEditingClient({...editingClient, specialInstructions: e.target.value})}
                placeholder="Special handling instructions"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setEditingClient({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveClient}>
              <Save className="w-4 h-4 mr-2" />
              {isEditDialogOpen ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 