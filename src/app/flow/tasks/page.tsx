'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  FileText,
  Star,
  Zap,
  Target
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  job: string;
  client: string;
  tags: string[];
  isTimerRunning: boolean;
  currentTimerStart?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 Financial Statements',
    description: 'Complete initial review of Q4 financial statements for Acme Corp',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    dueDate: '2024-01-25',
    estimatedHours: 4,
    actualHours: 2.5,
    job: 'Q4 Tax Preparation - Acme Corp',
    client: 'Acme Corporation',
    tags: ['tax', 'review'],
    isTimerRunning: true,
    currentTimerStart: '2024-01-21T09:00:00Z'
  },
  {
    id: '2',
    title: 'Prepare Tax Documents',
    description: 'Prepare and organize tax documents for filing',
    status: 'todo',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    dueDate: '2024-01-30',
    estimatedHours: 6,
    actualHours: 0,
    job: 'Q4 Tax Preparation - Acme Corp',
    client: 'Acme Corporation',
    tags: ['tax', 'filing'],
    isTimerRunning: false
  },
  {
    id: '3',
    title: 'Audit Planning Meeting',
    description: 'Conduct initial audit planning meeting with client',
    status: 'completed',
    priority: 'high',
    assignedTo: 'Emily Rodriguez',
    dueDate: '2024-01-20',
    estimatedHours: 2,
    actualHours: 2,
    job: 'Annual Audit - TechStart Inc',
    client: 'TechStart Inc',
    tags: ['audit', 'planning'],
    isTimerRunning: false
  },
  {
    id: '4',
    title: 'Risk Assessment',
    description: 'Complete risk assessment for annual audit',
    status: 'review',
    priority: 'urgent',
    assignedTo: 'David Kim',
    dueDate: '2024-01-22',
    estimatedHours: 8,
    actualHours: 6,
    job: 'Annual Audit - TechStart Inc',
    client: 'TechStart Inc',
    tags: ['audit', 'risk'],
    isTimerRunning: false
  }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.job.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Play className="w-4 h-4 text-blue-600" />;
      case 'review': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'todo': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleTimer = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isTimerRunning: !task.isTimerRunning,
          currentTimerStart: !task.isTimerRunning ? new Date().toISOString() : undefined
        };
      }
      return task;
    }));
  };

  const getTimerDisplay = (task: Task) => {
    if (!task.isTimerRunning) return '00:00:00';
    
    if (task.currentTimerStart) {
      const start = new Date(task.currentTimerStart);
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return '00:00:00';
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Manage tasks, track progress, and monitor deadlines</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Tasks
          </Button>
          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
              </div>
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
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
                  placeholder="Search tasks..."
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
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* To Do */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-gray-600" />
              <span>To Do</span>
              <Badge variant="secondary">{tasks.filter(t => t.status === 'todo').length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.filter(task => task.status === 'todo').map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{task.assignedTo}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTimer(task.id)}
                    className="text-green-600"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-blue-600" />
              <span>In Progress</span>
              <Badge variant="secondary">{tasks.filter(t => t.status === 'in_progress').length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.filter(task => task.status === 'in_progress').map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{task.assignedTo}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{task.actualHours}/{task.estimatedHours}h</span>
                  {task.isTimerRunning && (
                    <span className="text-xs font-mono text-green-600">
                      {getTimerDisplay(task)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span>Review</span>
              <Badge variant="secondary">{tasks.filter(t => t.status === 'review').length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.filter(task => task.status === 'review').map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{task.assignedTo}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{task.actualHours}/{task.estimatedHours}h</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Completed</span>
              <Badge variant="secondary">{tasks.filter(t => t.status === 'completed').length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.filter(task => task.status === 'completed').map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{task.assignedTo}</span>
                  <span>Completed: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{task.actualHours}/{task.estimatedHours}h</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a new task with assignment and timeline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Title</label>
              <Input placeholder="Review financial statements" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the task in detail..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Job</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q4-tax">Q4 Tax Preparation - Acme Corp</SelectItem>
                    <SelectItem value="annual-audit">Annual Audit - TechStart Inc</SelectItem>
                    <SelectItem value="monthly-bookkeeping">Monthly Bookkeeping - RetailCo</SelectItem>
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
                    <SelectItem value="emily">Emily Rodriguez</SelectItem>
                    <SelectItem value="david">David Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Hours</label>
                <Input type="number" placeholder="4" />
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
                <label className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                Cancel
              </Button>
              <Button>Create Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 