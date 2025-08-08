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
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target,
  Award,
  Activity,
  Calendar,
  Filter,
  Download,
  Share,
  Eye,
  Settings,
  RefreshCw,
  Plus,
  Search,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock3,
  Calculator,
  FileText,
  UserCheck,
  UserX,
  Zap,
  Shield,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Percent,
  BarChart,
  LineChart,
  Scatter,
  PieChart as PieChartIcon
} from 'lucide-react';

interface PracticeMetrics {
  totalRevenue: number;
  totalClients: number;
  activeEngagements: number;
  averageHourlyRate: number;
  billableUtilization: number;
  clientSatisfaction: number;
  revenueGrowth: number;
  profitMargin: number;
  outstandingReceivables: number;
  averageCollectionTime: number;
}

interface ClientProfitability {
  clientId: string;
  clientName: string;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  hoursBilled: number;
  averageRate: number;
  lastEngagement: string;
  status: 'active' | 'inactive' | 'prospect';
}

interface StaffProductivity {
  staffId: string;
  staffName: string;
  role: string;
  billableHours: number;
  totalHours: number;
  utilization: number;
  averageRate: number;
  revenueGenerated: number;
  clientSatisfaction: number;
  qualityScore: number;
}

interface ServiceAnalytics {
  serviceType: string;
  revenue: number;
  hours: number;
  clients: number;
  averageRate: number;
  profitMargin: number;
  growthRate: number;
}

interface RevenueTrend {
  period: string;
  revenue: number;
  growth: number;
  clients: number;
  engagements: number;
}

const mockPracticeMetrics: PracticeMetrics = {
  totalRevenue: 1250000,
  totalClients: 85,
  activeEngagements: 42,
  averageHourlyRate: 275,
  billableUtilization: 78.5,
  clientSatisfaction: 4.6,
  revenueGrowth: 12.5,
  profitMargin: 35.2,
  outstandingReceivables: 187500,
  averageCollectionTime: 28
};

const mockClientProfitability: ClientProfitability[] = [
  {
    clientId: 'client-001',
    clientName: 'Acme Corporation',
    totalRevenue: 125000,
    totalCost: 87500,
    profit: 37500,
    profitMargin: 30.0,
    hoursBilled: 450,
    averageRate: 278,
    lastEngagement: '2024-01-15',
    status: 'active'
  },
  {
    clientId: 'client-002',
    clientName: 'TechStart Inc.',
    totalRevenue: 87500,
    totalCost: 61250,
    profit: 26250,
    profitMargin: 30.0,
    hoursBilled: 315,
    averageRate: 278,
    lastEngagement: '2024-01-10',
    status: 'active'
  }
];

const mockStaffProductivity: StaffProductivity[] = [
  {
    staffId: 'staff-001',
    staffName: 'Sarah Johnson',
    role: 'Senior Manager',
    billableHours: 160,
    totalHours: 180,
    utilization: 88.9,
    averageRate: 300,
    revenueGenerated: 48000,
    clientSatisfaction: 4.8,
    qualityScore: 95
  },
  {
    staffId: 'staff-002',
    staffName: 'Mike Chen',
    role: 'Partner',
    billableHours: 140,
    totalHours: 160,
    utilization: 87.5,
    averageRate: 350,
    revenueGenerated: 49000,
    clientSatisfaction: 4.7,
    qualityScore: 92
  }
];

const mockServiceAnalytics: ServiceAnalytics[] = [
  {
    serviceType: 'Tax Preparation',
    revenue: 562500,
    hours: 2045,
    clients: 45,
    averageRate: 275,
    profitMargin: 32.5,
    growthRate: 15.2
  },
  {
    serviceType: 'Audit Services',
    revenue: 375000,
    hours: 1364,
    clients: 12,
    averageRate: 275,
    profitMargin: 28.0,
    growthRate: 8.5
  },
  {
    serviceType: 'Consulting',
    revenue: 312500,
    hours: 1136,
    clients: 28,
    averageRate: 275,
    profitMargin: 45.0,
    growthRate: 22.1
  }
];

const mockRevenueTrends: RevenueTrend[] = [
  {
    period: 'Jan 2024',
    revenue: 125000,
    growth: 12.5,
    clients: 85,
    engagements: 42
  },
  {
    period: 'Dec 2023',
    revenue: 110000,
    growth: 8.2,
    clients: 78,
    engagements: 38
  },
  {
    period: 'Nov 2023',
    revenue: 95000,
    growth: 5.1,
    clients: 72,
    engagements: 35
  }
];

export default function ReportingAnalyticsSystem() {
  const [selectedClient, setSelectedClient] = useState<ClientProfitability | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffProductivity | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('last_30_days');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reporting & Analytics</h1>
          <p className="text-muted-foreground">
            Practice performance insights and business intelligence
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockPracticeMetrics.totalRevenue)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {getGrowthIcon(mockPracticeMetrics.revenueGrowth)}
              <span className={getGrowthColor(mockPracticeMetrics.revenueGrowth)}>
                {formatPercentage(mockPracticeMetrics.revenueGrowth)}
              </span>
              <span>from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPracticeMetrics.totalClients}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{mockPracticeMetrics.activeEngagements} active engagements</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Utilization</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(mockPracticeMetrics.billableUtilization)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Target: 85%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPracticeMetrics.clientSatisfaction}/5.0</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Excellent rating</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="client-profitability">Client Profitability</TabsTrigger>
          <TabsTrigger value="staff-productivity">Staff Productivity</TabsTrigger>
          <TabsTrigger value="service-analytics">Service Analytics</TabsTrigger>
          <TabsTrigger value="revenue-trends">Revenue Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue performance and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm font-medium">{formatCurrency(mockPracticeMetrics.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-medium">{formatPercentage(mockPracticeMetrics.profitMargin)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Outstanding Receivables</span>
                    <span className="text-sm font-medium">{formatCurrency(mockPracticeMetrics.outstandingReceivables)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Collection Time</span>
                    <span className="text-sm font-medium">{mockPracticeMetrics.averageCollectionTime} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Hourly Rate</span>
                    <span className="text-sm font-medium">{formatCurrency(mockPracticeMetrics.averageHourlyRate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Billable Utilization</span>
                    <span className="text-sm font-medium">{formatPercentage(mockPracticeMetrics.billableUtilization)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm font-medium">{mockPracticeMetrics.clientSatisfaction}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Revenue Growth</span>
                    <span className={`text-sm font-medium ${getGrowthColor(mockPracticeMetrics.revenueGrowth)}`}>
                      {formatPercentage(mockPracticeMetrics.revenueGrowth)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="client-profitability" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search clients..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          <div className="space-y-4">
            {mockClientProfitability.map((client) => (
              <Card key={client.clientId} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedClient(client)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{client.clientName}</h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Revenue</span>
                          <p className="text-sm font-medium">{formatCurrency(client.totalRevenue)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Profit</span>
                          <p className="text-sm font-medium">{formatCurrency(client.profit)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Margin</span>
                          <p className="text-sm font-medium">{formatPercentage(client.profitMargin)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Hours</span>
                          <p className="text-sm font-medium">{client.hoursBilled}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          Avg Rate: {formatCurrency(client.averageRate)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Last: {new Date(client.lastEngagement).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
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

        <TabsContent value="staff-productivity" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Input placeholder="Search staff..." className="w-64" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="senior_manager">Senior Manager</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          <div className="space-y-4">
            {mockStaffProductivity.map((staff) => (
              <Card key={staff.staffId} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedStaff(staff)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{staff.staffName}</h3>
                        <Badge variant="outline">
                          {staff.role}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Utilization</span>
                          <p className="text-sm font-medium">{formatPercentage(staff.utilization)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Revenue</span>
                          <p className="text-sm font-medium">{formatCurrency(staff.revenueGenerated)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Satisfaction</span>
                          <p className="text-sm font-medium">{staff.clientSatisfaction}/5.0</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Quality</span>
                          <p className="text-sm font-medium">{staff.qualityScore}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {staff.billableHours}/{staff.totalHours} hours
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Avg Rate: {formatCurrency(staff.averageRate)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
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

        <TabsContent value="service-analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServiceAnalytics.map((service) => (
                    <div key={service.serviceType} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{service.serviceType}</span>
                        <Badge variant="outline" className="text-xs">
                          {service.clients} clients
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{formatCurrency(service.revenue)}</span>
                        <span className={`text-xs ${getGrowthColor(service.growthRate)}`}>
                          {formatPercentage(service.growthRate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Profitability</CardTitle>
                <CardDescription>Profit margins by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServiceAnalytics.map((service) => (
                    <div key={service.serviceType} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.serviceType}</span>
                        <span className="text-sm font-medium">{formatPercentage(service.profitMargin)}</span>
                      </div>
                      <Progress value={service.profitMargin} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue-trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueTrends.map((trend) => (
                    <div key={trend.period} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{trend.period}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{formatCurrency(trend.revenue)}</span>
                        <span className={`text-xs ${getGrowthColor(trend.growth)}`}>
                          {formatPercentage(trend.growth)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Client and engagement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueTrends.map((trend) => (
                    <div key={trend.period} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.period}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-muted-foreground">{trend.clients} clients</span>
                          <span className="text-xs text-muted-foreground">{trend.engagements} engagements</span>
                        </div>
                      </div>
                      <Progress value={(trend.engagements / trend.clients) * 100} className="w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Profitability Detail Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Profitability Details</DialogTitle>
            <DialogDescription>
              Detailed profitability analysis for {selectedClient?.clientName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client Name</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.clientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedClient.status)}>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Revenue</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedClient.totalRevenue)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total Cost</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedClient.totalCost)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Profit</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedClient.profit)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Profit Margin</label>
                  <p className="text-sm font-medium">{formatPercentage(selectedClient.profitMargin)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Hours Billed</label>
                  <p className="text-sm font-medium">{selectedClient.hoursBilled}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Average Rate</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedClient.averageRate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Staff Productivity Detail Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Staff Productivity Details</DialogTitle>
            <DialogDescription>
              Detailed productivity analysis for {selectedStaff?.staffName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStaff && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Staff Name</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.staffName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Utilization</label>
                  <p className="text-sm font-medium">{formatPercentage(selectedStaff.utilization)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Revenue Generated</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedStaff.revenueGenerated)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Client Satisfaction</label>
                  <p className="text-sm font-medium">{selectedStaff.clientSatisfaction}/5.0</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Quality Score</label>
                  <p className="text-sm font-medium">{selectedStaff.qualityScore}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Billable Hours</label>
                  <p className="text-sm font-medium">{selectedStaff.billableHours}/{selectedStaff.totalHours}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Average Rate</label>
                  <p className="text-sm font-medium">{formatCurrency(selectedStaff.averageRate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Analysis
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 