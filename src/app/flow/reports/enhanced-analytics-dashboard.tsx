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
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Trophy,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Percent,
  Timer,
  UserCheck,
  UserX,
  CalendarDays,
  Clock3,
  DollarSign as DollarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    outstanding: number;
    collected: number;
  };
  clients: {
    total: number;
    active: number;
    new: number;
    churn: number;
    satisfaction: number;
  };
  productivity: {
    billableHours: number;
    utilization: number;
    efficiency: number;
    averageRate: number;
  };
  performance: {
    projects: number;
    completed: number;
    overdue: number;
    onTime: number;
  };
  trends: {
    monthlyRevenue: number[];
    clientGrowth: number[];
    utilizationRate: number[];
    satisfactionScores: number[];
  };
}

const mockAnalyticsData: AnalyticsData = {
  revenue: {
    total: 1250000,
    monthly: 104167,
    growth: 12.5,
    outstanding: 187500,
    collected: 1062500
  },
  clients: {
    total: 85,
    active: 72,
    new: 8,
    churn: 2,
    satisfaction: 4.6
  },
  productivity: {
    billableHours: 1840,
    utilization: 78.5,
    efficiency: 92.3,
    averageRate: 275
  },
  performance: {
    projects: 156,
    completed: 142,
    overdue: 3,
    onTime: 95.5
  },
  trends: {
    monthlyRevenue: [95000, 98000, 102000, 104167, 108000, 112000],
    clientGrowth: [78, 80, 82, 85, 87, 89],
    utilizationRate: [72, 75, 78, 78.5, 79, 80],
    satisfactionScores: [4.4, 4.5, 4.6, 4.6, 4.7, 4.8]
  }
};

export default function EnhancedAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence for financial professionals
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
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
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className={getGrowthColor(data.revenue.growth)}>
                {getGrowthIcon(data.revenue.growth)}
              </span>
              <span className={getGrowthColor(data.revenue.growth)}>
                {formatPercentage(data.revenue.growth)}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monthly avg: {formatCurrency(data.revenue.monthly)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.clients.active}</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-green-600">
                <ArrowUpRight className="w-4 h-4" />
              </span>
              <span className="text-green-600">+{data.clients.new}</span>
              <span className="text-muted-foreground">new this period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercentage((data.clients.active / data.clients.total) * 100)} retention rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Utilization</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.productivity.utilization)}</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-green-600">
                <ArrowUpRight className="w-4 h-4" />
              </span>
              <span className="text-green-600">+2.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.productivity.billableHours} billable hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.clients.satisfaction}/5.0</div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-green-600">
                <ArrowUpRight className="w-4 h-4" />
              </span>
              <span className="text-green-600">+0.2</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {data.clients.active} client surveys
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue distribution and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm font-bold">{formatCurrency(data.revenue.total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Collected</span>
                    <span className="text-sm text-green-600">{formatCurrency(data.revenue.collected)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Outstanding</span>
                    <span className="text-sm text-orange-600">{formatCurrency(data.revenue.outstanding)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Average</span>
                    <span className="text-sm">{formatCurrency(data.revenue.monthly)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Collection Rate</span>
                    <span className="text-sm font-bold">
                      {formatPercentage((data.revenue.collected / data.revenue.total) * 100)}
                    </span>
                  </div>
                  <Progress value={(data.revenue.collected / data.revenue.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Client Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Client Metrics</CardTitle>
                <CardDescription>Client engagement and satisfaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.clients.total}</div>
                    <div className="text-sm text-muted-foreground">Total Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{data.clients.active}</div>
                    <div className="text-sm text-muted-foreground">Active Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{data.clients.new}</div>
                    <div className="text-sm text-muted-foreground">New This Period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{data.clients.churn}</div>
                    <div className="text-sm text-muted-foreground">Churned</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm font-bold">{data.clients.satisfaction}/5.0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(data.clients.satisfaction)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">6-Month Trend</span>
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUpIcon className="w-3 h-3 mr-1" />
                      +{formatPercentage(data.revenue.growth)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {data.trends.monthlyRevenue.map((revenue, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Month {index + 1}
                        </span>
                        <span className="text-sm font-medium">
                          {formatCurrency(revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tax Preparation</span>
                      <span className="text-sm font-medium">{formatCurrency(500000)}</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Services</span>
                      <span className="text-sm font-medium">{formatCurrency(375000)}</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consulting</span>
                      <span className="text-sm font-medium">{formatCurrency(250000)}</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Services</span>
                      <span className="text-sm font-medium">{formatCurrency(125000)}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Productivity Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Productivity Metrics</CardTitle>
                <CardDescription>Team performance and efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Billable Utilization</span>
                      <span className="text-sm font-bold">{formatPercentage(data.productivity.utilization)}</span>
                    </div>
                    <Progress value={data.productivity.utilization} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Efficiency Rate</span>
                      <span className="text-sm font-bold">{formatPercentage(data.productivity.efficiency)}</span>
                    </div>
                    <Progress value={data.productivity.efficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Average Hourly Rate</span>
                      <span className="text-sm font-bold">{formatCurrency(data.productivity.averageRate)}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>Billable hours and project time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.productivity.billableHours}</div>
                      <div className="text-sm text-muted-foreground">Billable Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2,340</div>
                      <div className="text-sm text-muted-foreground">Total Hours</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tax Preparation</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Services</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consulting</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Administrative</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
                <CardDescription>Project completion and deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.performance.projects}</div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{data.performance.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm font-bold">{formatPercentage(data.performance.onTime)}</span>
                    </div>
                    <Progress value={data.performance.onTime} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overdue Projects</span>
                    <Badge variant="destructive">{data.performance.overdue}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Client Growth</span>
                      <span className="text-sm font-medium">+{data.clients.new} this period</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenue Growth</span>
                      <span className="text-sm font-medium text-green-600">+{formatPercentage(data.revenue.growth)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Utilization Growth</span>
                      <span className="text-sm font-medium text-green-600">+2.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfaction Growth</span>
                      <span className="text-sm font-medium text-green-600">+0.2 points</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analytics tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Generate Charts</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Schedule Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">View Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 