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
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  FileText,
  MessageSquare,
  Play,
  Pause,
  Square,
  Eye,
  Edit,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Timer,
  Target,
  Zap
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  client: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  startDate: string;
  budgetHours: number;
  actualHours: number;
  remainingHours: number;
  progress: number;
  revenue: number;
  isTimerRunning: boolean;
  currentTimerStart?: string;
  tasks: number;
  completedTasks: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Q4 Tax Preparation - Acme Corp',
    description: 'Complete quarterly tax preparation and filing for Acme Corporation',
    client: 'Acme Corporation',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-31',
    startDate: '2024-01-15',
    budgetHours: 40,
    actualHours: 24.5,
    remainingHours: 15.5,
    progress: 65,
    revenue: 8000,
    isTimerRunning: true,
    currentTimerStart: '2024-01-20T09:00:00Z',
    tasks: 8,
    completedTasks: 5
  },
  {
    id: '2',
    title: 'Annual Audit - TechStart Inc',
    description: 'Conduct annual financial audit for TechStart Inc',
    client: 'TechStart Inc',
    status: 'planning',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    dueDate: '2024-02-15',
    startDate: '2024-01-20',
    budgetHours: 60,
    actualHours: 0,
    remainingHours: 60,
    progress: 0,
    revenue: 12000,
    isTimerRunning: false,
    tasks: 12,
    completedTasks: 0
  },
  {
    id: '3',
    title: 'Monthly Bookkeeping - RetailCo',
    description: 'Monthly bookkeeping and financial reporting',
    client: 'RetailCo',
    status: 'completed',
    priority: 'low',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-15',
    startDate: '2024-01-01',
    budgetHours: 16,
    actualHours: 14.5,
    remainingHours: 0,
    progress: 100,
    revenue: 3200,
    isTimerRunning: false,
    tasks: 6,
    completedTasks: 6
  }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleTimer = (jobId: string) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          isTimerRunning: !job.isTimerRunning,
          currentTimerStart: !job.isTimerRunning ? new Date().toISOString() : undefined
        };
      }
      return job;
    }));
  };

  const getTimerDisplay = (job: Job) => {
    if (!job.isTimerRunning) return '00:00:00';
    
    if (job.currentTimerStart) {
      const start = new Date(job.currentTimerStart);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return '00:00:00';
  };

  const totalRevenue = jobs.reduce((sum, job) => sum + job.revenue, 0);
  const totalHours = jobs.reduce((sum, job) => sum + job.actualHours, 0);
  const activeJobs = jobs.filter(job => job.status === 'in_progress').length;
  const overdueJobs = jobs.filter(job => new Date(job.dueDate) < new Date() && job.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Track jobs, manage time, and monitor progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Jobs
          </Button>
          <Button onClick={() => setIsAddJobOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{overdueJobs}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Directory</CardTitle>
          <CardDescription>
            Manage jobs, track time, and monitor progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{job.client}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.assignedTo}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{job.progress}%</span>
                        <span>{job.completedTasks}/{job.tasks} tasks</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{job.actualHours}h / {job.budgetHours}h</span>
                      </div>
                      {job.isTimerRunning && (
                        <div className="text-xs text-green-600 font-mono">
                          {getTimerDisplay(job)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${job.revenue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(job.dueDate).toLocaleDateString()}
                      {new Date(job.dueDate) < new Date() && job.status !== 'completed' && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTimer(job.id)}
                        className={job.isTimerRunning ? 'text-red-600' : 'text-green-600'}
                      >
                        {job.isTimerRunning ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Job Details - {job.title}</DialogTitle>
                            <DialogDescription>
                              View and manage job information, tasks, and time tracking
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="tasks">Tasks</TabsTrigger>
                              <TabsTrigger value="time">Time Tracking</TabsTrigger>
                              <TabsTrigger value="documents">Documents</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Job Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Client:</strong> {job.client}</div>
                                    <div><strong>Assigned To:</strong> {job.assignedTo}</div>
                                    <div><strong>Start Date:</strong> {new Date(job.startDate).toLocaleDateString()}</div>
                                    <div><strong>Due Date:</strong> {new Date(job.dueDate).toLocaleDateString()}</div>
                                    <div><strong>Revenue:</strong> ${job.revenue.toLocaleString()}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Progress & Time</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Progress:</strong> {job.progress}%</div>
                                    <div><strong>Tasks:</strong> {job.completedTasks}/{job.tasks}</div>
                                    <div><strong>Budget Hours:</strong> {job.budgetHours}h</div>
                                    <div><strong>Actual Hours:</strong> {job.actualHours}h</div>
                                    <div><strong>Remaining:</strong> {job.remainingHours}h</div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="tasks" className="space-y-4">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Tasks</h4>
                                  <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Task
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <div className="font-medium">Review financial statements</div>
                                          <div className="text-sm text-gray-500">Due: Jan 25, 2024</div>
                                          <div className="text-sm text-gray-500">Estimated: 4 hours</div>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="time" className="space-y-4">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Time Tracking</h4>
                                  <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Time Entry
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <div className="font-medium">Document review</div>
                                          <div className="text-sm text-gray-500">Jan 20, 2024 - 2.5 hours</div>
                                          <div className="text-sm text-gray-500">Reviewed tax documents</div>
                                        </div>
                                        <div className="text-sm font-medium">$200</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="documents" className="space-y-4">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">Documents</h4>
                                  <Button size="sm">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Document
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="border rounded-lg p-3">
                                      <div className="flex items-center space-x-3">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                        <div className="flex-1">
                                          <div className="font-medium">Financial Statements.pdf</div>
                                          <div className="text-sm text-gray-500">Uploaded 2 days ago</div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Job Dialog */}
      <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Create a new job with client assignment and timeline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="Q4 Tax Preparation" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Complete quarterly tax preparation and filing" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corporation</SelectItem>
                    <SelectItem value="techstart">TechStart Inc</SelectItem>
                    <SelectItem value="retailco">RetailCo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Budget Hours</label>
                <Input type="number" placeholder="40" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Revenue</label>
              <Input type="number" placeholder="8000" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddJobOpen(false)}>
                Cancel
              </Button>
              <Button>Create Job</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 