'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  FileText,
  Send,
  Copy,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  TrendingUp,
  User,
  Building,
  Briefcase,
  GraduationCap,
  Target,
  Award,
  Settings,
  Sync,
  Link,
  Unlink,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Monitor
} from 'lucide-react';

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

interface TeamAvailability {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  role: string;
  department: string;
  availability: AvailabilitySlot[];
  workingHours: WorkingHours;
  timezone: string;
  isAvailable: boolean;
  currentStatus: 'available' | 'busy' | 'away' | 'offline';
  nextAvailable?: string;
}

interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStart?: string;
  breakEnd?: string;
}

interface WorkingHours {
  monday: { start: string; end: string; available: boolean };
  tuesday: { start: string; end: string; available: boolean };
  wednesday: { start: string; end: string; available: boolean };
  thursday: { start: string; end: string; available: boolean };
  friday: { start: string; end: string; available: boolean };
  saturday: { start: string; end: string; available: boolean };
  sunday: { start: string; end: string; available: boolean };
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees: string[];
  source: 'internal' | 'google' | 'outlook' | 'apple' | 'exchange';
  isRecurring: boolean;
  recurrencePattern?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  lastModified: string;
}

interface SyncLog {
  id: string;
  calendarId: string;
  calendarName: string;
  syncType: 'import' | 'export' | 'bidirectional';
  status: 'success' | 'error' | 'partial';
  eventsProcessed: number;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  errorMessage?: string;
}

const CalendarIntegrationSystem = () => {
  const [selectedTab, setSelectedTab] = useState('integrations');
  const [showAddIntegrationDialog, setShowAddIntegrationDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<CalendarIntegration | null>(null);

  // Mock data
  const mockIntegrations: CalendarIntegration[] = [
    {
      id: '1',
      name: 'Google Calendar',
      type: 'google',
      status: 'connected',
      email: 'michael.chen@accountingfirm.com',
      lastSync: '2024-01-15T10:30:00Z',
      syncFrequency: 'realtime',
      permissions: ['read', 'write', 'delete'],
      isActive: true,
      nextSync: '2024-01-15T11:30:00Z'
    },
    {
      id: '2',
      name: 'Outlook Calendar',
      type: 'outlook',
      status: 'connected',
      email: 'jennifer.lee@accountingfirm.com',
      lastSync: '2024-01-15T09:15:00Z',
      syncFrequency: 'hourly',
      permissions: ['read', 'write'],
      isActive: true,
      nextSync: '2024-01-15T10:15:00Z'
    },
    {
      id: '3',
      name: 'Zoom Meetings',
      type: 'zoom',
      status: 'connected',
      email: 'team@accountingfirm.com',
      lastSync: '2024-01-15T08:45:00Z',
      syncFrequency: 'realtime',
      permissions: ['read', 'write'],
      isActive: true,
      nextSync: '2024-01-15T09:45:00Z'
    },
    {
      id: '4',
      name: 'Microsoft Teams',
      type: 'teams',
      status: 'error',
      email: 'admin@accountingfirm.com',
      lastSync: '2024-01-14T16:20:00Z',
      syncFrequency: 'hourly',
      permissions: ['read'],
      isActive: false,
      errorMessage: 'Authentication token expired. Please reconnect.',
      nextSync: '2024-01-15T10:20:00Z'
    }
  ];

  const mockTeamAvailability: TeamAvailability[] = [
    {
      id: '1',
      memberId: 'member-1',
      memberName: 'Michael Chen',
      memberEmail: 'michael.chen@accountingfirm.com',
      role: 'Partner',
      department: 'Tax',
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true }
      ],
      workingHours: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: false },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      timezone: 'America/New_York',
      isAvailable: true,
      currentStatus: 'available',
      nextAvailable: '2024-01-15T17:00:00Z'
    },
    {
      id: '2',
      memberId: 'member-2',
      memberName: 'Jennifer Lee',
      memberEmail: 'jennifer.lee@accountingfirm.com',
      role: 'Manager',
      department: 'Audit',
      availability: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true }
      ],
      workingHours: {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '18:00', available: true },
        saturday: { start: '09:00', end: '15:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      timezone: 'America/New_York',
      isAvailable: true,
      currentStatus: 'busy',
      nextAvailable: '2024-01-15T18:00:00Z'
    }
  ];

  const mockCalendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Q4 Tax Planning Consultation',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T11:30:00Z',
      location: 'Virtual Meeting',
      attendees: ['sarah.johnson@techstartup.com', 'michael.chen@accountingfirm.com'],
      source: 'internal',
      isRecurring: false,
      status: 'confirmed',
      lastModified: '2024-01-10T14:30:00Z'
    },
    {
      id: '2',
      title: 'Financial Statement Review',
      startTime: '2024-01-16T14:00:00Z',
      endTime: '2024-01-16T15:00:00Z',
      location: 'Conference Room A',
      attendees: ['robert.martinez@manufacturing.com', 'jennifer.lee@accountingfirm.com'],
      source: 'google',
      isRecurring: false,
      status: 'confirmed',
      lastModified: '2024-01-11T11:20:00Z'
    },
    {
      id: '3',
      title: 'Weekly Team Meeting',
      startTime: '2024-01-17T09:00:00Z',
      endTime: '2024-01-17T10:00:00Z',
      location: 'Team Room',
      attendees: ['michael.chen@accountingfirm.com', 'jennifer.lee@accountingfirm.com'],
      source: 'outlook',
      isRecurring: true,
      recurrencePattern: 'FREQ=WEEKLY;BYDAY=WE',
      status: 'confirmed',
      lastModified: '2024-01-08T13:00:00Z'
    }
  ];

  const mockSyncLogs: SyncLog[] = [
    {
      id: '1',
      calendarId: '1',
      calendarName: 'Google Calendar',
      syncType: 'bidirectional',
      status: 'success',
      eventsProcessed: 45,
      eventsCreated: 12,
      eventsUpdated: 8,
      eventsDeleted: 2,
      startTime: '2024-01-15T10:30:00Z',
      endTime: '2024-01-15T10:32:15Z',
      duration: 135
    },
    {
      id: '2',
      calendarId: '2',
      calendarName: 'Outlook Calendar',
      syncType: 'import',
      status: 'success',
      eventsProcessed: 23,
      eventsCreated: 5,
      eventsUpdated: 3,
      eventsDeleted: 0,
      startTime: '2024-01-15T09:15:00Z',
      endTime: '2024-01-15T09:16:45Z',
      duration: 105
    },
    {
      id: '3',
      calendarId: '4',
      calendarName: 'Microsoft Teams',
      syncType: 'export',
      status: 'error',
      eventsProcessed: 0,
      eventsCreated: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
      startTime: '2024-01-15T08:45:00Z',
      endTime: '2024-01-15T08:45:30Z',
      duration: 30,
      errorMessage: 'Authentication failed. Token expired.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCalendarTypeIcon = (type: string) => {
    switch (type) {
      case 'google': return <Globe className="h-4 w-4" />;
      case 'outlook': return <Mail className="h-4 w-4" />;
      case 'apple': return <Monitor className="h-4 w-4" />;
      case 'exchange': return <Building className="h-4 w-4" />;
      case 'zoom': return <Video className="h-4 w-4" />;
      case 'teams': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getAvailabilityStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'away': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar Integration System</h1>
          <p className="text-gray-600 mt-2">
            Sync with external calendars and manage team availability
          </p>
        </div>
        <Button onClick={() => setShowAddIntegrationDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Calendars</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIntegrations.filter(i => i.status === 'connected').length}</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Events</CardTitle>
            <Sync className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Available</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTeamAvailability.filter(t => t.currentStatus === 'available').length}</div>
            <p className="text-xs text-muted-foreground">of {mockTeamAvailability.length} members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIntegrations.filter(i => i.status === 'error').length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="availability">Team Availability</TabsTrigger>
          <TabsTrigger value="events">Calendar Events</TabsTrigger>
          <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Calendar Integrations</CardTitle>
                  <CardDescription>
                    Manage external calendar connections and sync settings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIntegrations.map((integration) => (
                  <Card key={integration.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {getCalendarTypeIcon(integration.type)}
                          <div>
                            <h3 className="font-semibold text-lg">{integration.name}</h3>
                            <p className="text-sm text-gray-600">{integration.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge className={getStatusColor(integration.status)}>
                              {integration.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Last sync: {formatDateTime(integration.lastSync)}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Sync className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {integration.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-700">{integration.errorMessage}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Sync: {integration.syncFrequency}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          Permissions: {integration.permissions.join(', ')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Switch checked={integration.isActive} />
                          <span>Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Availability</CardTitle>
                  <CardDescription>
                    View and manage team member availability and working hours
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamAvailability.map((member) => (
                  <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{member.memberName}</h3>
                            <p className="text-sm text-gray-600">{member.role} - {member.department}</p>
                            <p className="text-xs text-gray-500">{member.memberEmail}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge className={getAvailabilityStatusColor(member.currentStatus)}>
                              {member.currentStatus}
                            </Badge>
                            {member.nextAvailable && (
                              <p className="text-xs text-gray-500 mt-1">
                                Next: {formatDateTime(member.nextAvailable)}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Working Hours</h4>
                        <div className="grid grid-cols-7 gap-2 text-xs">
                          {Object.entries(member.workingHours).map(([day, hours]) => (
                            <div key={day} className="text-center p-2 border rounded">
                              <div className="font-medium capitalize">{day.slice(0, 3)}</div>
                              <div className="text-gray-600">
                                {hours.available ? `${hours.start}-${hours.end}` : 'Off'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Timezone: {member.timezone}
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Available: {member.isAvailable ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Calendar Events</CardTitle>
                  <CardDescription>
                    View all synced calendar events from external sources
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCalendarEvents.map((event) => (
                  <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">
                              {event.source}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.attendees.length} attendees
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {event.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                Recurring
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              Modified: {formatDateTime(event.lastModified)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="sync-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sync Logs</CardTitle>
                  <CardDescription>
                    Monitor calendar synchronization activity and performance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSyncLogs.map((log) => (
                  <Card key={log.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Sync className="h-4 w-4" />
                            <h3 className="font-semibold text-lg">{log.calendarName}</h3>
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                            <Badge variant="outline">
                              {log.syncType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Processed:</span> {log.eventsProcessed}
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {log.eventsCreated}
                            </div>
                            <div>
                              <span className="font-medium">Updated:</span> {log.eventsUpdated}
                            </div>
                            <div>
                              <span className="font-medium">Deleted:</span> {log.eventsDeleted}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Duration: {formatDuration(log.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDateTime(log.startTime)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {log.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-700">{log.errorMessage}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Integration Dialog */}
      <Dialog open={showAddIntegrationDialog} onOpenChange={setShowAddIntegrationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Calendar Integration</DialogTitle>
            <DialogDescription>
              Connect to external calendar services to sync events and availability
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Select Calendar Service</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Google Calendar</h4>
                    <p className="text-sm text-gray-600">Sync with Google Calendar</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Mail className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Outlook Calendar</h4>
                    <p className="text-sm text-gray-600">Sync with Microsoft Outlook</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Video className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Zoom Meetings</h4>
                    <p className="text-sm text-gray-600">Sync Zoom meeting schedules</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">Microsoft Teams</h4>
                    <p className="text-sm text-gray-600">Sync Teams meeting schedules</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Sync Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <Select>
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
                <div>
                  <Label htmlFor="sync-direction">Sync Direction</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">Import only</SelectItem>
                      <SelectItem value="export">Export only</SelectItem>
                      <SelectItem value="bidirectional">Bidirectional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="read-permission" defaultChecked />
                  <Label htmlFor="read-permission">Read events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="write-permission" defaultChecked />
                  <Label htmlFor="write-permission">Create events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="update-permission" defaultChecked />
                  <Label htmlFor="update-permission">Update events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="delete-permission" />
                  <Label htmlFor="delete-permission">Delete events</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddIntegrationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddIntegrationDialog(false)}>
              <Link className="h-4 w-4 mr-2" />
              Connect Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarIntegrationSystem; 