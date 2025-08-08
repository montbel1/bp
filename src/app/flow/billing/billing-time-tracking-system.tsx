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
  Clock, 
  DollarSign, 
  FileText, 
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
  Play,
  Pause,
  Stop,
  Timer,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  Target,
  Award,
  Receipt,
  CreditCard,
  Banknote,
  Calculator,
  Settings,
  RefreshCw,
  Zap,
  Activity,
  PieChart
} from 'lucide-react';

interface TimeEntry {
  id: string;
  staffId: string;
  staffName: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  billableHours: number;
  nonBillableHours: number;
  billingRate: number;
  totalAmount: number;
  description: string;
  category: 'tax_preparation' | 'audit' | 'consulting' | 'compliance' | 'administrative' | 'research' | 'meeting' | 'other';
  status: 'active' | 'paused' | 'completed' | 'approved' | 'billed';
  isBillable: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BillingRate {
  id: string;
  staffId: string;
  staffName: string;
  rateType: 'hourly' | 'fixed' | 'percentage';
  hourlyRate: number;
  fixedRate?: number;
  percentageRate?: number;
  effectiveDate: string;
  isActive: boolean;
  notes: string;
}

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes: string;
  timeEntries: string[];
  createdAt: string;
  updatedAt: string;
}

interface RevenueMetrics {
  totalRevenue: number;
  billedAmount: number;
  outstandingAmount: number;
  averageHourlyRate: number;
  billableUtilization: number;
  revenueTrend: 'increasing' | 'stable' | 'decreasing';
  topClients: string[];
  topServices: string[];
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    staffId: 'staff-001',
    staffName: 'Sarah Johnson',
    clientId: 'client-001',
    clientName: 'Acme Corporation',
    projectId: 'project-001',
    projectName: '2024 Tax Return Preparation',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '12:30',
    duration: 210,
    billableHours: 3.5,
    nonBillableHours: 0,
    billingRate: 250,
    totalAmount: 875,
    description: 'Reviewed financial statements and prepared tax calculations for Q4 adjustments',
    category: 'tax_preparation',
    status: 'completed',
    isBillable: true,
    tags: ['tax_season', 'review', 'q4'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z'
  },
  {
    id: '2',
    staffId: 'staff-002',
    staffName: 'Mike Chen',
    clientId: 'client-002',
    clientName: 'TechStart Inc.',
    projectId: 'project-002',
    projectName: 'Audit Planning & Risk Assessment',
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    billableHours: 1.5,
    nonBillableHours: 0,
    billingRate: 300,
    totalAmount: 450,
    description: 'Conducted initial audit planning meeting and risk assessment',
    category: 'audit',
    status: 'active',
    isBillable: true,
    tags: ['audit', 'planning', 'risk_assessment'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  }
];

const mockBillingRates: BillingRate[] = [
  {
    id: 'rate-001',
    staffId: 'staff-001',
    staffName: 'Sarah Johnson',
    rateType: 'hourly',
    hourlyRate: 250,
    effectiveDate: '2024-01-01',
    isActive: true,
    notes: 'Senior Manager rate'
  },
  {
    id: 'rate-002',
    staffId: 'staff-002',
    staffName: 'Mike Chen',
    rateType: 'hourly',
    hourlyRate: 300,
    effectiveDate: '2024-01-01',
    isActive: true,
    notes: 'Partner rate'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    clientId: 'client-001',
    clientName: 'Acme Corporation',
    invoiceNumber: 'INV-2024-001',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    subtotal: 8750,
    taxAmount: 875,
    totalAmount: 9625,
    status: 'sent',
    paymentTerms: 'Net 30',
    notes: 'Q4 2023 tax preparation services',
    timeEntries: ['1', '3', '5'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

const mockRevenueMetrics: RevenueMetrics = {
  totalRevenue: 125000,
  billedAmount: 87500,
  outstandingAmount: 37500,
  averageHourlyRate: 275,
  billableUtilization: 78.5,
  revenueTrend: 'increasing',
  topClients: ['Acme Corporation', 'TechStart Inc.', 'Global Solutions'],
  topServices: ['Tax Preparation', 'Audit Services', 'Consulting']
};

export default function BillingTimeTrackingSystem() {
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<TimeEntry | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'billed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing & Time Tracking</h1>
          <p className="text-muted-foreground">
            Track billable time, manage billing rates, and generate invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Timer className="w-4 h-4 mr-2" />
            {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Time Entry
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockRevenueMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={mockRevenueMetrics.revenueTrend === 'increasing' ? 'text-green-600' : 'text-red-600'}>
                {mockRevenueMetrics.revenueTrend === 'increasing' ? '↗' : '↘'}
              </span>
              {mockRevenueMetrics.revenueTrend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockRevenueMetrics.outstandingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockRevenueMetrics.outstandingAmount / mockRevenueMetrics.billedAmount) * 100)}% of billed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Utilization</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRevenueMetrics.billableUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 85%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hourly Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockRevenueMetrics.averageHourlyRate)}</div>
            <p className="text-xs text-muted-foreground">
              Per billable hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
          <TabsTrigger value="billing-rates">Billing Rates</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Category</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tax Preparation</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(56250)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Audit Services</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={30} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(37500)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Consulting</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={25} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(31250)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
                <CardDescription>Highest revenue generating clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueMetrics.topClients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{client}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={80 - (index * 15)} className="w-24" />
                        <span className="text-sm font-medium">{formatCurrency(25000 - (index * 5000))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time-entries" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search time entries..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="billed">Billed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {mockTimeEntries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedTimeEntry(entry)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{entry.clientName}</h3>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                        <Badge variant={entry.isBillable ? "default" : "secondary"}>
                          {entry.isBillable ? "Billable" : "Non-Billable"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatHours(entry.duration)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatCurrency(entry.totalAmount)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {entry.staffName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {entry.category.replace('_', ' ')}
                        </Badge>
                        {entry.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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

        <TabsContent value="billing-rates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Billing Rates</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Billing Rate
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBillingRates.map((rate) => (
              <Card key={rate.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rate.staffName}</CardTitle>
                    <Badge variant={rate.isActive ? "default" : "secondary"}>
                      {rate.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {rate.rateType} • Effective {new Date(rate.effectiveDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Rate Type:</span>
                      <span className="capitalize">{rate.rateType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Hourly Rate:</span>
                      <span className="font-medium">{formatCurrency(rate.hourlyRate)}</span>
                    </div>
                    {rate.fixedRate && (
                      <div className="flex items-center justify-between text-sm">
                        <span>Fixed Rate:</span>
                        <span className="font-medium">{formatCurrency(rate.fixedRate)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>Effective Date:</span>
                      <span>{new Date(rate.effectiveDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search invoices..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </div>

          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <Card key={invoice.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedInvoice(invoice)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getInvoiceStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="text-sm font-medium">{invoice.clientName}</span>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span className="text-sm font-medium">{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {invoice.paymentTerms}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {invoice.notes}
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
                        <Download className="w-4 h-4" />
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

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">January 2024</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(125000)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">December 2023</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={72} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(110000)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">November 2023</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm font-medium">{formatCurrency(95000)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Productivity</CardTitle>
                <CardDescription>Billable hours by staff member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sarah Johnson</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-24" />
                      <span className="text-sm font-medium">160 hrs</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mike Chen</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-24" />
                      <span className="text-sm font-medium">140 hrs</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lisa Wang</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24" />
                      <span className="text-sm font-medium">150 hrs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Time Entry Detail Dialog */}
      <Dialog open={!!selectedTimeEntry} onOpenChange={() => setSelectedTimeEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Time Entry Details</DialogTitle>
            <DialogDescription>
              Detailed view of time entry and billing information
            </DialogDescription>
          </DialogHeader>
          
          {selectedTimeEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedTimeEntry.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Staff Member</label>
                  <p className="text-sm text-muted-foreground">{selectedTimeEntry.staffName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Project</label>
                  <p className="text-sm text-muted-foreground">{selectedTimeEntry.projectName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedTimeEntry.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm font-medium">{formatHours(selectedTimeEntry.duration)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedTimeEntry.totalAmount)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTimeEntry.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Entry
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Add to Invoice
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

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Detailed view of invoice and payment information
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Subtotal</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedInvoice.subtotal)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Amount</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedInvoice.notes}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Invoice
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Send to Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 