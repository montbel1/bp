'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  User,
  Building2,
  FileText,
  MessageSquare,
  Send,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Percent,
  Timer,
  UserCheck,
  UserX,
  Save,
  X,
  CalendarDays,
  Clock3,
  Zap,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  EyeOff,
  Eye as EyeIcon,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  Info,
  HelpCircle,
  Settings,
  Bell,
  BellOff,
  CheckSquare,
  Square,
  Play,
  Pause,
  Stop,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero
} from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  meetingType: 'consultation' | 'review' | 'planning' | 'follow_up' | 'presentation' | 'training';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  location: 'virtual' | 'office' | 'client_site' | 'conference_room';
  meetingUrl?: string;
  phoneNumber?: string;
  address?: string;
  description: string;
  agenda: string[];
  attendees: Attendee[];
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  reminders: Reminder[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  role: 'host' | 'attendee' | 'presenter';
  status: 'confirmed' | 'pending' | 'declined' | 'tentative';
  responseDate?: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'popup' | 'calendar';
  time: number; // minutes before meeting
  sent: boolean;
  sentAt?: string;
}

interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'exchange' | 'zoom' | 'teams';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  email: string;
  lastSync: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  permissions: string[];
  isActive: boolean;
  errorMessage?: string;
  nextSync?: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Q4 Tax Planning Review',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    clientEmail: 'john@acme.com',
    clientPhone: '(555) 123-4567',
    meetingType: 'review',
    status: 'confirmed',
    startTime: '2024-01-16T10:00:00Z',
    endTime: '2024-01-16T11:30:00Z',
    duration: 90,
    location: 'virtual',
    meetingUrl: 'https://zoom.us/j/123456789',
    description: 'Review Q4 tax planning strategies and discuss year-end tax optimization opportunities',
    agenda: [
      'Review current tax position',
      'Discuss Q4 planning opportunities',
      'Year-end tax optimization strategies',
      'Next steps and action items'
    ],
    attendees: [
      {
        id: 'attendee-1',
        name: 'John Smith',
        email: 'john@acme.com',
        role: 'host',
        status: 'confirmed',
        responseDate: '2024-01-15T14:30:00Z'
      },
      {
        id: 'attendee-2',
        name: 'Sarah Johnson',
        email: 'sarah@accountingfirm.com',
        role: 'presenter',
        status: 'confirmed',
        responseDate: '2024-01-15T09:15:00Z'
      }
    ],
    assignedTo: 'Sarah Johnson',
    priority: 'high',
    tags: ['tax', 'planning', 'q4'],
    reminders: [
      {
        id: 'reminder-1',
        type: 'email',
        time: 1440, // 24 hours
        sent: true,
        sentAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'reminder-2',
        type: 'popup',
        time: 15, // 15 minutes
        sent: false
      }
    ],
    notes: 'Client requested focus on R&D tax credits and bonus depreciation opportunities',
    followUpRequired: true,
    followUpDate: '2024-01-18T10:00:00Z',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  },
  {
    id: '2',
    title: 'Startup Financial Setup Consultation',
    clientId: 'client-2',
    clientName: 'TechStart Inc.',
    clientEmail: 'maria@techstart.com',
    clientPhone: '(555) 987-6543',
    meetingType: 'consultation',
    status: 'scheduled',
    startTime: '2024-01-16T14:00:00Z',
    endTime: '2024-01-16T15:00:00Z',
    duration: 60,
    location: 'office',
    address: '123 Business Ave, Anytown, ST 12345',
    description: 'Initial consultation for new startup financial system setup and accounting structure',
    agenda: [
      'Review business structure and goals',
      'Discuss accounting system requirements',
      'Tax planning for startups',
      'Next steps and timeline'
    ],
    attendees: [
      {
        id: 'attendee-3',
        name: 'Maria Rodriguez',
        email: 'maria@techstart.com',
        role: 'host',
        status: 'confirmed',
        responseDate: '2024-01-14T11:20:00Z'
      },
      {
        id: 'attendee-4',
        name: 'Mike Chen',
        email: 'mike@accountingfirm.com',
        role: 'presenter',
        status: 'confirmed',
        responseDate: '2024-01-14T15:45:00Z'
      }
    ],
    assignedTo: 'Mike Chen',
    priority: 'medium',
    tags: ['startup', 'consultation', 'setup'],
    reminders: [
      {
        id: 'reminder-3',
        type: 'email',
        time: 1440, // 24 hours
        sent: true,
        sentAt: '2024-01-15T14:00:00Z'
      }
    ],
    notes: 'First-time client, focus on building relationship and understanding their needs',
    followUpRequired: false,
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-14T16:00:00Z'
  },
  {
    id: '3',
    title: 'Audit Preparation Meeting',
    clientId: 'client-3',
    clientName: 'Wilson Manufacturing',
    clientEmail: 'david@wilsonmanufacturing.com',
    clientPhone: '(555) 456-7890',
    meetingType: 'planning',
    status: 'confirmed',
    startTime: '2024-01-17T09:00:00Z',
    endTime: '2024-01-17T10:30:00Z',
    duration: 90,
    location: 'client_site',
    address: '789 Industrial Blvd, Factory Town, ST 67890',
    description: 'Pre-audit planning meeting to discuss audit scope, timeline, and required documentation',
    agenda: [
      'Review audit scope and objectives',
      'Discuss timeline and key dates',
      'Required documentation checklist',
      'Team assignments and responsibilities'
    ],
    attendees: [
      {
        id: 'attendee-5',
        name: 'David Wilson',
        email: 'david@wilsonmanufacturing.com',
        role: 'host',
        status: 'confirmed',
        responseDate: '2024-01-15T13:20:00Z'
      },
      {
        id: 'attendee-6',
        name: 'Sarah Johnson',
        email: 'sarah@accountingfirm.com',
        role: 'presenter',
        status: 'confirmed',
        responseDate: '2024-01-15T10:45:00Z'
      },
      {
        id: 'attendee-7',
        name: 'Lisa Wilson',
        email: 'lisa@wilsonmanufacturing.com',
        role: 'attendee',
        status: 'confirmed',
        responseDate: '2024-01-15T14:15:00Z'
      }
    ],
    assignedTo: 'Sarah Johnson',
    priority: 'high',
    tags: ['audit', 'planning', 'manufacturing'],
    reminders: [
      {
        id: 'reminder-4',
        type: 'email',
        time: 1440, // 24 hours
        sent: true,
        sentAt: '2024-01-16T09:00:00Z'
      },
      {
        id: 'reminder-5',
        type: 'sms',
        time: 60, // 1 hour
        sent: false
      }
    ],
    notes: 'Complex manufacturing audit, need to review inventory valuation methods',
    followUpRequired: true,
    followUpDate: '2024-01-19T14:00:00Z',
    createdAt: '2024-01-13T11:00:00Z',
    updatedAt: '2024-01-15T16:00:00Z'
  }
];

const mockCalendarIntegrations: CalendarIntegration[] = [
  {
    id: 'integration-1',
    name: 'Google Calendar',
    type: 'google',
    status: 'connected',
    email: 'sarah@accountingfirm.com',
    lastSync: '2024-01-15T16:30:00Z',
    syncFrequency: 'realtime',
    permissions: ['read', 'write', 'delete'],
    isActive: true,
    nextSync: '2024-01-15T16:31:00Z'
  },
  {
    id: 'integration-2',
    name: 'Outlook Calendar',
    type: 'outlook',
    status: 'connected',
    email: 'mike@accountingfirm.com',
    lastSync: '2024-01-15T15:45:00Z',
    syncFrequency: 'hourly',
    permissions: ['read', 'write'],
    isActive: true,
    nextSync: '2024-01-15T16:45:00Z'
  },
  {
    id: 'integration-3',
    name: 'Zoom',
    type: 'zoom',
    status: 'connected',
    email: 'admin@accountingfirm.com',
    lastSync: '2024-01-15T14:20:00Z',
    syncFrequency: 'realtime',
    permissions: ['read', 'write'],
    isActive: true,
    nextSync: '2024-01-15T16:31:00Z'
  }
];

export default function EnhancedCalendarSystem() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>(mockCalendarIntegrations);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isAddIntegrationOpen, setIsAddIntegrationOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Partial<Meeting>>({});
  const [editingIntegration, setEditingIntegration] = useState<Partial<CalendarIntegration>>({});

  // Calculate statistics
  const stats = {
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter(m => new Date(m.startTime) > new Date() && m.status !== 'cancelled').length,
    completedMeetings: meetings.filter(m => m.status === 'completed').length,
    cancelledMeetings: meetings.filter(m => m.status === 'cancelled').length,
    virtualMeetings: meetings.filter(m => m.location === 'virtual').length,
    inPersonMeetings: meetings.filter(m => m.location !== 'virtual').length,
    highPriorityMeetings: meetings.filter(m => m.priority === 'high' || m.priority === 'urgent').length,
    activeIntegrations: integrations.filter(i => i.isActive).length
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'virtual': return <Video className="w-4 h-4" />;
      case 'office': return <Building2 className="w-4 h-4" />;
      case 'client_site': return <MapPin className="w-4 h-4" />;
      case 'conference_room': return <Users className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const handleAddMeeting = () => {
    if (editingMeeting.title && editingMeeting.clientName && editingMeeting.startTime) {
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: editingMeeting.title,
        clientId: 'client-new',
        clientName: editingMeeting.clientName,
        clientEmail: editingMeeting.clientEmail || 'client@example.com',
        clientPhone: editingMeeting.clientPhone || '(555) 000-0000',
        meetingType: editingMeeting.meetingType as any || 'consultation',
        status: 'scheduled',
        startTime: editingMeeting.startTime,
        endTime: editingMeeting.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        duration: editingMeeting.duration || 60,
        location: editingMeeting.location as any || 'virtual',
        meetingUrl: editingMeeting.meetingUrl,
        address: editingMeeting.address,
        description: editingMeeting.description || '',
        agenda: editingMeeting.agenda || [],
        attendees: editingMeeting.attendees || [],
        assignedTo: editingMeeting.assignedTo || 'Unassigned',
        priority: editingMeeting.priority as any || 'medium',
        tags: editingMeeting.tags || [],
        reminders: editingMeeting.reminders || [],
        notes: editingMeeting.notes || '',
        followUpRequired: editingMeeting.followUpRequired || false,
        followUpDate: editingMeeting.followUpDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMeetings([...meetings, newMeeting]);
      setIsAddMeetingOpen(false);
      setEditingMeeting({});
    }
  };

  const handleAddIntegration = () => {
    if (editingIntegration.name && editingIntegration.type && editingIntegration.email) {
      const newIntegration: CalendarIntegration = {
        id: Date.now().toString(),
        name: editingIntegration.name,
        type: editingIntegration.type as any,
        status: 'disconnected',
        email: editingIntegration.email,
        lastSync: new Date().toISOString(),
        syncFrequency: editingIntegration.syncFrequency as any || 'hourly',
        permissions: editingIntegration.permissions || ['read'],
        isActive: false,
        nextSync: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      };
      setIntegrations([...integrations, newIntegration]);
      setIsAddIntegrationOpen(false);
      setEditingIntegration({});
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Calendar System</h1>
          <p className="text-muted-foreground">
            Professional meeting management and calendar integration
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddMeetingOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingMeetings} upcoming, {stats.completedMeetings} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Types</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.virtualMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Virtual meetings, {stats.inPersonMeetings} in-person
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriorityMeetings}</div>
            <p className="text-xs text-muted-foreground">
              High and urgent priority meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIntegrations}</div>
            <p className="text-xs text-muted-foreground">
              Active calendar integrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Meetings */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Next scheduled meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings
                    .filter(m => new Date(m.startTime) > new Date() && m.status !== 'cancelled')
                    .slice(0, 5)
                    .map((meeting) => (
                      <div key={meeting.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {getLocationIcon(meeting.location)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {meeting.clientName} • {formatDateTime(meeting.startTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDuration(meeting.duration)} • {meeting.attendees.length} attendees
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getPriorityColor(meeting.priority)}>
                            {meeting.priority}
                          </Badge>
                          <Badge className={getStatusColor(meeting.status)}>
                            {meeting.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Statistics</CardTitle>
                <CardDescription>Meeting analytics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalMeetings}</div>
                      <div className="text-sm text-muted-foreground">Total Meetings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.upcomingMeetings}</div>
                      <div className="text-sm text-muted-foreground">Upcoming</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{stats.completedMeetings}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.cancelledMeetings}</div>
                      <div className="text-sm text-muted-foreground">Cancelled</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Virtual Meetings</span>
                        <span className="text-sm font-medium">{stats.virtualMeetings}</span>
                      </div>
                      <Progress value={(stats.virtualMeetings / stats.totalMeetings) * 100} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In-Person Meetings</span>
                        <span className="text-sm font-medium">{stats.inPersonMeetings}</span>
                      </div>
                      <Progress value={(stats.inPersonMeetings / stats.totalMeetings) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Meetings</h2>
            <Button onClick={() => setIsAddMeetingOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meetings</CardTitle>
              <CardDescription>Manage all scheduled meetings and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-sm text-muted-foreground">{meeting.meetingType}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{meeting.clientName}</div>
                        <div className="text-sm text-muted-foreground">{meeting.clientEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div>{formatDateTime(meeting.startTime)}</div>
                        <div className="text-sm text-muted-foreground">
                          {meeting.attendees.length} attendees
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(meeting.duration)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getLocationIcon(meeting.location)}
                          <span className="capitalize">{meeting.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(meeting.priority)}>
                          {meeting.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="w-4 h-4" />
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

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Calendar Integrations</h2>
            <Button onClick={() => setIsAddIntegrationOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Manage calendar integrations and sync settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Sync Frequency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {integration.permissions.join(', ')} permissions
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{integration.type}</TableCell>
                      <TableCell>{integration.email}</TableCell>
                      <TableCell>
                        <Badge className={
                          integration.status === 'connected' ? 'bg-green-100 text-green-800' :
                          integration.status === 'error' ? 'bg-red-100 text-red-800' :
                          integration.status === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {integration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(integration.lastSync).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(integration.lastSync).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{integration.syncFrequency}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
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

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Settings</CardTitle>
              <CardDescription>Configure calendar preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive meeting reminders via email</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive meeting reminders via SMS</div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Desktop Notifications</div>
                        <div className="text-sm text-muted-foreground">Show desktop notifications for meetings</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Default Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Default Meeting Duration</label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Location</label>
                      <Select defaultValue="virtual">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="client_site">Client Site</SelectItem>
                          <SelectItem value="conference_room">Conference Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Meeting Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isAddMeetingOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedule Meeting</h2>
            <Button variant="ghost" onClick={() => setIsAddMeetingOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meeting Title</label>
              <Input
                value={editingMeeting.title || ''}
                onChange={(e) => setEditingMeeting({...editingMeeting, title: e.target.value})}
                placeholder="Meeting title"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={editingMeeting.clientName || ''}
                onChange={(e) => setEditingMeeting({...editingMeeting, clientName: e.target.value})}
                placeholder="Client name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Client Email</label>
              <Input
                value={editingMeeting.clientEmail || ''}
                onChange={(e) => setEditingMeeting({...editingMeeting, clientEmail: e.target.value})}
                placeholder="client@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date & Time</label>
                <Input
                  type="datetime-local"
                  value={editingMeeting.startTime || ''}
                  onChange={(e) => setEditingMeeting({...editingMeeting, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={editingMeeting.duration || ''}
                  onChange={(e) => setEditingMeeting({...editingMeeting, duration: parseInt(e.target.value)})}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Meeting Type</label>
                <Select value={editingMeeting.meetingType || ''} onValueChange={(value) => setEditingMeeting({...editingMeeting, meetingType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Select value={editingMeeting.location || ''} onValueChange={(value) => setEditingMeeting({...editingMeeting, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="client_site">Client Site</SelectItem>
                    <SelectItem value="conference_room">Conference Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editingMeeting.description || ''}
                onChange={(e) => setEditingMeeting({...editingMeeting, description: e.target.value})}
                placeholder="Meeting description"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={editingMeeting.priority || ''} onValueChange={(value) => setEditingMeeting({...editingMeeting, priority: value})}>
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
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddMeetingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMeeting}>
              <Save className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Add Integration Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isAddIntegrationOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Calendar Integration</h2>
            <Button variant="ghost" onClick={() => setIsAddIntegrationOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Integration Name</label>
              <Input
                value={editingIntegration.name || ''}
                onChange={(e) => setEditingIntegration({...editingIntegration, name: e.target.value})}
                placeholder="Integration name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Integration Type</label>
              <Select value={editingIntegration.type || ''} onValueChange={(value) => setEditingIntegration({...editingIntegration, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Calendar</SelectItem>
                  <SelectItem value="outlook">Outlook Calendar</SelectItem>
                  <SelectItem value="apple">Apple Calendar</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                value={editingIntegration.email || ''}
                onChange={(e) => setEditingIntegration({...editingIntegration, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sync Frequency</label>
              <Select value={editingIntegration.syncFrequency || ''} onValueChange={(value) => setEditingIntegration({...editingIntegration, syncFrequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsAddIntegrationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIntegration}>
              <Save className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 