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
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  DollarSign, 
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Timer,
  Target,
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TimeEntry {
  id: string;
  job: string;
  client: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in hours
  isBillable: boolean;
  hourlyRate: number;
  totalAmount: number;
  status: 'running' | 'paused' | 'completed';
  tags: string[];
  notes?: string;
}

interface ActiveTimer {
  id: string;
  job: string;
  client: string;
  description: string;
  startTime: string;
  currentDuration: number;
  isRunning: boolean;
}

const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    job: 'Q4 Tax Preparation - Acme Corp',
    client: 'Acme Corporation',
    description: 'Review financial statements and prepare tax documents',
    startTime: '2024-01-20T09:00:00Z',
    endTime: '2024-01-20T11:30:00Z',
    duration: 2.5,
    isBillable: true,
    hourlyRate: 150,
    totalAmount: 375,
    status: 'completed',
    tags: ['tax', 'review'],
    notes: 'Completed initial review of Q4 financials'
  },
  {
    id: '2',
    job: 'Annual Audit - TechStart Inc',
    client: 'TechStart Inc',
    description: 'Audit planning and risk assessment',
    startTime: '2024-01-20T13:00:00Z',
    endTime: '2024-01-20T16:00:00Z',
    duration: 3,
    isBillable: true,
    hourlyRate: 175,
    totalAmount: 525,
    status: 'completed',
    tags: ['audit', 'planning'],
    notes: 'Completed audit planning phase'
  },
  {
    id: '3',
    job: 'Q4 Tax Preparation - Acme Corp',
    client: 'Acme Corporation',
    description: 'Document preparation and filing',
    startTime: '2024-01-21T08:00:00Z',
    duration: 0,
    isBillable: true,
    hourlyRate: 150,
    totalAmount: 0,
    status: 'running',
    tags: ['tax', 'filing']
  }
];

const mockActiveTimer: ActiveTimer = {
  id: '3',
  job: 'Q4 Tax Preparation - Acme Corp',
  client: 'Acme Corporation',
  description: 'Document preparation and filing',
  startTime: '2024-01-21T08:00:00Z',
  currentDuration: 2.75,
  isRunning: true
};

export default function TimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(mockActiveTimer);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer?.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev) return null;
          return {
            ...prev,
            currentDuration: prev.currentDuration + (1 / 3600) // Add 1 second
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer?.isRunning]);

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = (entry: TimeEntry) => {
    const newTimer: ActiveTimer = {
      id: entry.id,
      job: entry.job,
      client: entry.client,
      description: entry.description,
      startTime: new Date().toISOString(),
      currentDuration: 0,
      isRunning: true
    };
    setActiveTimer(newTimer);
    
    // Update entry status
    setTimeEntries(entries => 
      entries.map(e => 
        e.id === entry.id ? { ...e, status: 'running' as const } : e
      )
    );
  };

  const pauseTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, isRunning: false });
    }
  };

  const resumeTimer = () => {
    if (activeTimer) {
      setActiveTimer({ ...activeTimer, isRunning: true });
    }
  };

  const stopTimer = () => {
    if (activeTimer) {
      // Update the time entry with completed time
      setTimeEntries(entries => 
        entries.map(e => 
          e.id === activeTimer.id 
            ? { 
                ...e, 
                status: 'completed' as const,
                endTime: new Date().toISOString(),
                duration: activeTimer.currentDuration,
                totalAmount: activeTimer.currentDuration * e.hourlyRate
              } 
            : e
        )
      );
      setActiveTimer(null);
    }
  };

  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = clientFilter === 'all' || entry.client === clientFilter;
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesClient && matchesStatus;
  });

  const totalBillableHours = timeEntries
    .filter(entry => entry.isBillable && entry.status === 'completed')
    .reduce((sum, entry) => sum + entry.duration, 0);

  const totalBillableAmount = timeEntries
    .filter(entry => entry.isBillable && entry.status === 'completed')
    .reduce((sum, entry) => sum + entry.totalAmount, 0);

  const todayHours = timeEntries
    .filter(entry => {
      const today = new Date().toDateString();
      const entryDate = new Date(entry.startTime).toDateString();
      return entryDate === today && entry.status === 'completed';
    })
    .reduce((sum, entry) => sum + entry.duration, 0);

  const thisWeekHours = timeEntries
    .filter(entry => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const entryDate = new Date(entry.startTime);
      return entryDate >= weekStart && entry.status === 'completed';
    })
    .reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600">Track billable hours and manage time entries</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsAddEntryOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Time Entry
          </Button>
        </div>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5 text-green-600" />
              <span>Active Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600">Current Job</h4>
                <p className="text-lg font-semibold">{activeTimer.job}</p>
                <p className="text-sm text-gray-500">{activeTimer.client}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Description</h4>
                <p className="text-sm">{activeTimer.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Duration</h4>
                <p className="text-2xl font-mono font-bold text-green-600">
                  {formatDuration(activeTimer.currentDuration)}
                </p>
                <div className="flex space-x-2 mt-2">
                  {activeTimer.isRunning ? (
                    <Button onClick={pauseTimer} variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeTimer} variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopTimer} variant="destructive" size="sm">
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Hours</p>
                <p className="text-2xl font-bold text-gray-900">{todayHours.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{thisWeekHours.toFixed(1)}h</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalBillableHours.toFixed(1)}h</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billable Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalBillableAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
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
                  placeholder="Search time entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                <SelectItem value="TechStart Inc">TechStart Inc</SelectItem>
                <SelectItem value="RetailCo">RetailCo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>
            Track and manage your time entries and billable hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="font-medium">{entry.job}</div>
                  </TableCell>
                  <TableCell>{entry.client}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{entry.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">
                      {entry.status === 'completed' 
                        ? formatDuration(entry.duration)
                        : entry.status === 'running'
                        ? formatDuration(activeTimer?.currentDuration || 0)
                        : '00:00:00'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>${entry.hourlyRate}/h</span>
                      {entry.isBillable && (
                        <Badge variant="outline" className="text-xs">Billable</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${entry.status === 'completed' ? entry.totalAmount.toFixed(2) : '0.00'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      entry.status === 'running' ? 'bg-green-100 text-green-800' :
                      entry.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {entry.status === 'completed' ? (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startTimer(entry)}
                          className="text-green-600"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Time Entry Dialog */}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
            <DialogDescription>
              Create a new time entry for tracking billable hours
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the work performed..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input type="datetime-local" />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input type="datetime-local" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Hourly Rate</label>
                <Input type="number" placeholder="150" />
              </div>
              <div>
                <label className="text-sm font-medium">Billable</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Additional notes..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
                Cancel
              </Button>
              <Button>Add Entry</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 