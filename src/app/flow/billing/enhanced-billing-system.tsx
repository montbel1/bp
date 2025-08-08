'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  Clock, 
  Calendar,
  FileText,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Timer,
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  CalendarDays,
  Clock3,
  Zap,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Percent,
  UserCheck,
  UserX,
  Save,
  X
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface BillingRate {
  id: string;
  staffId: string;
  staffName: string;
  rateType: 'hourly' | 'fixed' | 'retainer';
  hourlyRate: number;
  fixedRate?: number;
  retainerAmount?: number;
  effectiveDate: string;
  isActive: boolean;
  category: string;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    staffId: 'staff-1',
    staffName: 'Sarah Johnson',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    projectId: 'project-1',
    projectName: '2024 Tax Preparation',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '12:30',
    duration: 210,
    billableHours: 3.5,
    nonBillableHours: 0,
    billingRate: 275,
    totalAmount: 962.50,
    description: 'Reviewed financial statements and prepared tax calculations for Q4',
    category: 'tax_preparation',
    status: 'approved',
    isBillable: true,
    tags: ['tax', 'review', 'q4'],
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z'
  },
  {
    id: '2',
    staffId: 'staff-2',
    staffName: 'Mike Chen',
    clientId: 'client-2',
    clientName: 'TechStart Inc.',
    projectId: 'project-2',
    projectName: 'Startup Financial Setup',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '17:00',
    duration: 180,
    billableHours: 3.0,
    nonBillableHours: 0,
    billingRate: 225,
    totalAmount: 675.00,
    description: 'Set up accounting system and chart of accounts for new startup',
    category: 'consulting',
    status: 'completed',
    isBillable: true,
    tags: ['setup', 'startup', 'consulting'],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T17:00:00Z'
  },
  {
    id: '3',
    staffId: 'staff-1',
    staffName: 'Sarah Johnson',
    clientId: 'client-3',
    clientName: 'Wilson Manufacturing',
    projectId: 'project-3',
    projectName: 'Audit Preparation',
    date: '2024-01-15',
    startTime: '08:00',
    endTime: '11:00',
    duration: 180,
    billableHours: 3.0,
    nonBillableHours: 0,
    billingRate: 300,
    totalAmount: 900.00,
    description: 'Prepared audit documentation and reviewed internal controls',
    category: 'audit',
    status: 'active',
    isBillable: true,
    tags: ['audit', 'preparation', 'controls'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    clientEmail: 'john@acme.com',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    subtotal: 4500.00,
    taxAmount: 450.00,
    totalAmount: 4950.00,
    paidAmount: 0,
    outstandingAmount: 4950.00,
    status: 'sent',
    paymentTerms: 'Net 30',
    notes: 'Q4 2023 tax preparation services',
    items: [
      {
        id: 'item-1',
        description: 'Tax Preparation Services - Q4 2023',
        quantity: 16.5,
        unitPrice: 275.00,
        totalPrice: 4537.50,
        category: 'tax_preparation'
      },
      {
        id: 'item-2',
        description: 'Additional Consulting - Tax Planning',
        quantity: 1.5,
        unitPrice: 275.00,
        totalPrice: 412.50,
        category: 'consulting'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientId: 'client-2',
    clientName: 'TechStart Inc.',
    clientEmail: 'maria@techstart.com',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    subtotal: 5000.00,
    taxAmount: 500.00,
    totalAmount: 5500.00,
    paidAmount: 5500.00,
    outstandingAmount: 0,
    status: 'paid',
    paymentTerms: 'Net 15',
    notes: 'Startup financial setup and consulting services',
    items: [
      {
        id: 'item-3',
        description: 'Financial System Setup',
        quantity: 1,
        unitPrice: 2500.00,
        totalPrice: 2500.00,
        category: 'consulting'
      },
      {
        id: 'item-4',
        description: 'Ongoing Consulting Services',
        quantity: 11.1,
        unitPrice: 225.00,
        totalPrice: 2500.00,
        category: 'consulting'
      }
    ],
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-12T09:30:00Z'
  }
];

const mockBillingRates: BillingRate[] = [
  {
    id: 'rate-1',
    staffId: 'staff-1',
    staffName: 'Sarah Johnson',
    rateType: 'hourly',
    hourlyRate: 275,
    effectiveDate: '2024-01-01',
    isActive: true,
    category: 'Senior CPA'
  },
  {
    id: 'rate-2',
    staffId: 'staff-2',
    staffName: 'Mike Chen',
    rateType: 'hourly',
    hourlyRate: 225,
    effectiveDate: '2024-01-01',
    isActive: true,
    category: 'CPA'
  },
  {
    id: 'rate-3',
    staffId: 'staff-3',
    staffName: 'David Wilson',
    rateType: 'hourly',
    hourlyRate: 300,
    effectiveDate: '2024-01-01',
    isActive: true,
    category: 'Partner'
  }
];

export default function EnhancedBillingSystem() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [billingRates, setBillingRates] = useState<BillingRate[]>(mockBillingRates);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAddTimeEntryOpen, setIsAddTimeEntryOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [editingTimeEntry, setEditingTimeEntry] = useState<Partial<TimeEntry>>({});
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice>>({});

  // Calculate statistics
  const stats = {
    totalRevenue: timeEntries.reduce((sum, entry) => sum + entry.totalAmount, 0),
    billableHours: timeEntries.reduce((sum, entry) => sum + entry.billableHours, 0),
    outstandingInvoices: invoices.reduce((sum, invoice) => sum + invoice.outstandingAmount, 0),
    averageHourlyRate: timeEntries.length > 0 ? timeEntries.reduce((sum, entry) => sum + entry.billingRate, 0) / timeEntries.length : 0,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
    overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'billed': return 'bg-orange-100 text-orange-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTimeEntry = () => {
    if (editingTimeEntry.staffName && editingTimeEntry.clientName && editingTimeEntry.description) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        staffId: 'staff-new',
        staffName: editingTimeEntry.staffName,
        clientId: 'client-new',
        clientName: editingTimeEntry.clientName,
        projectId: 'project-new',
        projectName: editingTimeEntry.projectName || 'General Services',
        date: editingTimeEntry.date || new Date().toISOString().split('T')[0],
        startTime: editingTimeEntry.startTime || '09:00',
        endTime: editingTimeEntry.endTime || '10:00',
        duration: 60,
        billableHours: 1.0,
        nonBillableHours: 0,
        billingRate: editingTimeEntry.billingRate || 250,
        totalAmount: (editingTimeEntry.billingRate || 250) * 1.0,
        description: editingTimeEntry.description,
        category: editingTimeEntry.category as any || 'consulting',
        status: 'active',
        isBillable: true,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTimeEntries([...timeEntries, newEntry]);
      setIsAddTimeEntryOpen(false);
      setEditingTimeEntry({});
    }
  };

  const handleAddInvoice = () => {
    if (editingInvoice.clientName && editingInvoice.totalAmount) {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        clientId: 'client-new',
        clientName: editingInvoice.clientName,
        clientEmail: editingInvoice.clientEmail || 'client@example.com',
        issueDate: editingInvoice.issueDate || new Date().toISOString().split('T')[0],
        dueDate: editingInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: editingInvoice.subtotal || editingInvoice.totalAmount || 0,
        taxAmount: editingInvoice.taxAmount || 0,
        totalAmount: editingInvoice.totalAmount || 0,
        paidAmount: 0,
        outstandingAmount: editingInvoice.totalAmount || 0,
        status: 'draft',
        paymentTerms: editingInvoice.paymentTerms || 'Net 30',
        notes: editingInvoice.notes || '',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInvoices([...invoices, newInvoice]);
      setIsAddInvoiceOpen(false);
      setEditingInvoice({});
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Billing & Time Tracking</h1>
          <p className="text-muted-foreground">
            Professional billing and time management for financial services
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddTimeEntryOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Time Entry
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
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {timeEntries.length} time entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatHours(stats.billableHours)}</div>
            <p className="text-xs text-muted-foreground">
              Avg rate: {formatCurrency(stats.averageHourlyRate)}/hr
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.outstandingInvoices)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.overdueInvoices} overdue invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.paidInvoices} paid, {stats.overdueInvoices} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="billing-rates">Billing Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tax Preparation</span>
                      <span className="text-sm font-medium">{formatCurrency(1862.50)}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consulting</span>
                      <span className="text-sm font-medium">{formatCurrency(675.00)}</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Services</span>
                      <span className="text-sm font-medium">{formatCurrency(900.00)}</span>
                    </div>
                    <Progress value={29} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest time entries and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeEntries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{entry.staffName}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.clientName} - {formatHours(entry.billableHours)}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{formatCurrency(entry.totalAmount)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time-entries" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Time Entries</h2>
            <Button onClick={() => setIsAddTimeEntryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Time Entry
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>Track billable and non-billable time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="font-medium">{entry.staffName}</div>
                        <div className="text-sm text-muted-foreground">{entry.category}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{entry.clientName}</div>
                        <div className="text-sm text-muted-foreground">{entry.projectName}</div>
                      </TableCell>
                      <TableCell>
                        <div>{new Date(entry.date).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatHours(entry.billableHours)}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.nonBillableHours > 0 && `${formatHours(entry.nonBillableHours)} non-billable`}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(entry.billingRate)}/hr</TableCell>
                      <TableCell className="font-medium">{formatCurrency(entry.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
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

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <Button onClick={() => setIsAddInvoiceOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Manage client invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
                      </TableCell>
                      <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{formatCurrency(invoice.paidAmount)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(invoice.outstandingAmount)} outstanding
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
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
                            <Send className="w-4 h-4" />
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

        <TabsContent value="billing-rates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Billing Rates</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Rate
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing Rates</CardTitle>
              <CardDescription>Manage staff billing rates and categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.staffName}</TableCell>
                      <TableCell>{rate.category}</TableCell>
                      <TableCell className="capitalize">{rate.rateType}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(rate.hourlyRate)}/hr</TableCell>
                      <TableCell>{new Date(rate.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={rate.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rate.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
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
      </Tabs>

      {/* Add Time Entry Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isAddTimeEntryOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Time Entry</h2>
            <Button variant="ghost" onClick={() => setIsAddTimeEntryOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Staff Member</label>
              <Input
                value={editingTimeEntry.staffName || ''}
                onChange={(e) => setEditingTimeEntry({...editingTimeEntry, staffName: e.target.value})}
                placeholder="Staff name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Client</label>
              <Input
                value={editingTimeEntry.clientName || ''}
                onChange={(e) => setEditingTimeEntry({...editingTimeEntry, clientName: e.target.value})}
                placeholder="Client name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Project</label>
              <Input
                value={editingTimeEntry.projectName || ''}
                onChange={(e) => setEditingTimeEntry({...editingTimeEntry, projectName: e.target.value})}
                placeholder="Project name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editingTimeEntry.date || ''}
                  onChange={(e) => setEditingTimeEntry({...editingTimeEntry, date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Billing Rate</label>
                <Input
                  type="number"
                  value={editingTimeEntry.billingRate || ''}
                  onChange={(e) => setEditingTimeEntry({...editingTimeEntry, billingRate: parseFloat(e.target.value)})}
                  placeholder="250"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingTimeEntry.description || ''}
                onChange={(e) => setEditingTimeEntry({...editingTimeEntry, description: e.target.value})}
                placeholder="Describe the work performed"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={editingTimeEntry.category || ''} onValueChange={(value) => setEditingTimeEntry({...editingTimeEntry, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax_preparation">Tax Preparation</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddTimeEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeEntry}>
              <Save className="w-4 h-4 mr-2" />
              Add Time Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Add Invoice Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isAddInvoiceOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Invoice</h2>
            <Button variant="ghost" onClick={() => setIsAddInvoiceOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={editingInvoice.clientName || ''}
                onChange={(e) => setEditingInvoice({...editingInvoice, clientName: e.target.value})}
                placeholder="Client name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Client Email</label>
              <Input
                value={editingInvoice.clientEmail || ''}
                onChange={(e) => setEditingInvoice({...editingInvoice, clientEmail: e.target.value})}
                placeholder="client@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Issue Date</label>
                <Input
                  type="date"
                  value={editingInvoice.issueDate || ''}
                  onChange={(e) => setEditingInvoice({...editingInvoice, issueDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input
                  type="date"
                  value={editingInvoice.dueDate || ''}
                  onChange={(e) => setEditingInvoice({...editingInvoice, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Total Amount</label>
              <Input
                type="number"
                value={editingInvoice.totalAmount || ''}
                onChange={(e) => setEditingInvoice({...editingInvoice, totalAmount: parseFloat(e.target.value)})}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Payment Terms</label>
              <Select value={editingInvoice.paymentTerms || ''} onValueChange={(value) => setEditingInvoice({...editingInvoice, paymentTerms: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={editingInvoice.notes || ''}
                onChange={(e) => setEditingInvoice({...editingInvoice, notes: e.target.value})}
                placeholder="Invoice notes"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInvoice}>
              <Save className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 