'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle, Plus, FileText } from 'lucide-react';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';
import { redirect } from 'next/navigation';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  overdueJobs: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  teamCapacity: number;
  totalHours: number;
  billableHours: number;
}

interface RecentJob {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  progress: number;
  assignedTo: string;
  priority: string;
}

export default function FlowDashboard() {
  const router = useRouter();
  const { user, loading } = useSimpleAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    overdueJobs: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    teamCapacity: 0,
    totalHours: 0,
    billableHours: 0,
  });
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      redirect('/auth/signin');
      return;
    }

    // Check if user has Flow access (allow in development)
    const isDevelopment = process.env.NODE_ENV === "development";
    if (!isDevelopment && !user.flowAccess) {
      redirect('/settings?upgrade=flow');
      return;
    }

    fetchDashboardData();
  }, [user, loading]);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // For now, using mock data
      setStats({
        totalJobs: 24,
        activeJobs: 12,
        completedJobs: 8,
        overdueJobs: 4,
        totalTasks: 156,
        completedTasks: 89,
        pendingTasks: 67,
        teamCapacity: 85,
        totalHours: 240,
        billableHours: 198,
      });

      setRecentJobs([
        {
          id: '1',
          title: 'Tax Return Preparation - ABC Corp',
          status: 'IN_PROGRESS',
          dueDate: '2024-04-15',
          progress: 65,
          assignedTo: 'John Smith',
          priority: 'HIGH',
        },
        {
          id: '2',
          title: 'Monthly Bookkeeping - XYZ Ltd',
          status: 'PLANNING',
          dueDate: '2024-04-20',
          progress: 0,
          assignedTo: 'Sarah Johnson',
          priority: 'MEDIUM',
        },
        {
          id: '3',
          title: 'Audit Preparation - DEF Inc',
          status: 'REVIEW',
          dueDate: '2024-04-10',
          progress: 90,
          assignedTo: 'Mike Wilson',
          priority: 'URGENT',
        },
      ]);

      setLoadingData(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'PLANNING':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice Management</h1>
          <p className="text-gray-600">Manage your accounting practice efficiently</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button onClick={() => router.push('/flow/jobs/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} active, {stats.completedJobs} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} completed, {stats.pendingTasks} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamCapacity}%</div>
            <p className="text-xs text-muted-foreground">
              Available for new work
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.billableHours}h</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.billableHours / stats.totalHours) * 100)}% billable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
          <CardDescription>
            Latest jobs and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Assigned to: {job.assignedTo}</span>
                    <span>Due: {new Date(job.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={job.progress} className="w-full" />
                    <span className="text-xs text-gray-500">{job.progress}% complete</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Season Overview - For CPAs like Michael */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Tax Season Overview
          </CardTitle>
          <CardDescription>
            Quick overview of all tax returns and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-red-100 rounded-lg">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-red-700">Urgent (Due &lt; 7 days)</div>
            </div>
            <div className="text-center p-3 bg-yellow-100 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-yellow-700">Missing Documents</div>
            </div>
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-blue-700">Ready to File</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">25</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              View Urgent Returns
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Missing Documents Report
            </Button>
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Ready to File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Create New Job
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Start Time Tracking
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Manage Team
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>4 overdue jobs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span>12 tasks due this week</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span>3 clients need follow-up</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>9:00 AM</span>
                <span>Client Meeting - ABC Corp</span>
              </div>
              <div className="flex justify-between">
                <span>2:00 PM</span>
                <span>Review Tax Returns</span>
              </div>
              <div className="flex justify-between">
                <span>4:00 PM</span>
                <span>Team Standup</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 