'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  Award
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
  role: 'client' | 'team_member' | 'external';
  status: 'invited' | 'confirmed' | 'declined' | 'pending';
  responseDate?: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'portal' | 'calendar';
  timeBeforeMeeting: number; // in minutes
  sent: boolean;
  sentAt?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  engagementStatus: 'active' | 'prospective' | 'inactive';
  lastMeeting?: string;
  nextMeeting?: string;
  totalMeetings: number;
  averageRating: number;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'partner' | 'manager' | 'senior' | 'staff' | 'assistant';
  department: 'tax' | 'audit' | 'consulting' | 'bookkeeping' | 'admin';
  availability: Availability[];
  maxMeetingsPerDay: number;
  currentMeetingsToday: number;
}

interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const MeetingSchedulingSystem = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [showNewMeetingDialog, setShowNewMeetingDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Mock data
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Q4 Tax Planning Consultation',
      clientId: 'client-1',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.johnson@techstartup.com',
      clientPhone: '(555) 123-4567',
      meetingType: 'planning',
      status: 'confirmed',
      startTime: '2024-01-15T10:00:00Z',
      endTime: '2024-01-15T11:30:00Z',
      duration: 90,
      location: 'virtual',
      meetingUrl: 'https://zoom.us/j/123456789',
      description: 'Quarterly tax planning session to review year-end strategies and optimize tax position.',
      agenda: [
        'Review current year financial performance',
        'Discuss tax-saving opportunities',
        'Plan for Q4 estimated payments',
        'Address any compliance concerns'
      ],
      attendees: [
        {
          id: 'attendee-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techstartup.com',
          role: 'client',
          status: 'confirmed',
          responseDate: '2024-01-10T14:30:00Z'
        },
        {
          id: 'attendee-2',
          name: 'Michael Chen',
          email: 'michael.chen@accountingfirm.com',
          role: 'team_member',
          status: 'confirmed',
          responseDate: '2024-01-10T09:15:00Z'
        }
      ],
      assignedTo: 'michael.chen@accountingfirm.com',
      priority: 'high',
      tags: ['tax-planning', 'quarterly', 'virtual'],
      reminders: [
        {
          id: 'reminder-1',
          type: 'email',
          timeBeforeMeeting: 1440, // 24 hours
          sent: true,
          sentAt: '2024-01-14T10:00:00Z'
        },
        {
          id: 'reminder-2',
          type: 'sms',
          timeBeforeMeeting: 30,
          sent: false
        }
      ],
      notes: 'Client expressed concerns about R&D tax credits. Prepare detailed analysis.',
      followUpRequired: true,
      followUpDate: '2024-01-22T10:00:00Z',
      createdAt: '2024-01-05T09:00:00Z',
      updatedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: '2',
      title: 'Financial Statement Review',
      clientId: 'client-2',
      clientName: 'Robert Martinez',
      clientEmail: 'robert.martinez@manufacturing.com',
      clientPhone: '(555) 234-5678',
      meetingType: 'review',
      status: 'scheduled',
      startTime: '2024-01-16T14:00:00Z',
      endTime: '2024-01-16T15:00:00Z',
      duration: 60,
      location: 'office',
      address: '123 Business Ave, Suite 200, City, State 12345',
      description: 'Annual financial statement review and discussion of audit findings.',
      agenda: [
        'Review financial statements',
        'Discuss audit findings',
        'Address management letter comments',
        'Plan for next year improvements'
      ],
      attendees: [
        {
          id: 'attendee-3',
          name: 'Robert Martinez',
          email: 'robert.martinez@manufacturing.com',
          role: 'client',
          status: 'invited'
        },
        {
          id: 'attendee-4',
          name: 'Jennifer Lee',
          email: 'jennifer.lee@accountingfirm.com',
          role: 'team_member',
          status: 'confirmed',
          responseDate: '2024-01-11T11:20:00Z'
        }
      ],
      assignedTo: 'jennifer.lee@accountingfirm.com',
      priority: 'medium',
      tags: ['audit', 'financial-statements', 'annual'],
      reminders: [
        {
          id: 'reminder-3',
          type: 'email',
          timeBeforeMeeting: 1440,
          sent: false
        }
      ],
      notes: 'Client requested focus on cash flow analysis and working capital management.',
      followUpRequired: false,
      createdAt: '2024-01-08T13:00:00Z',
      updatedAt: '2024-01-11T11:20:00Z'
    }
  ];

  const mockClients: Client[] = [
    {
      id: 'client-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techstartup.com',
      phone: '(555) 123-4567',
      company: 'TechStartup Inc.',
      engagementStatus: 'active',
      lastMeeting: '2024-01-10T10:00:00Z',
      nextMeeting: '2024-01-15T10:00:00Z',
      totalMeetings: 12,
      averageRating: 4.8
    },
    {
      id: 'client-2',
      name: 'Robert Martinez',
      email: 'robert.martinez@manufacturing.com',
      phone: '(555) 234-5678',
      company: 'Martinez Manufacturing',
      engagementStatus: 'active',
      lastMeeting: '2024-01-05T14:00:00Z',
      nextMeeting: '2024-01-16T14:00:00Z',
      totalMeetings: 8,
      averageRating: 4.6
    }
  ];

  const mockTeamMembers: TeamMember[] = [
    {
      id: 'member-1',
      name: 'Michael Chen',
      email: 'michael.chen@accountingfirm.com',
      role: 'partner',
      department: 'tax',
      availability: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true }
      ],
      maxMeetingsPerDay: 6,
      currentMeetingsToday: 3
    },
    {
      id: 'member-2',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@accountingfirm.com',
      role: 'manager',
      department: 'audit',
      availability: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '18:00', isAvailable: true }
      ],
      maxMeetingsPerDay: 8,
      currentMeetingsToday: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
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

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Target className="h-4 w-4" />;
      case 'review': return <FileText className="h-4 w-4" />;
      case 'planning': return <TrendingUp className="h-4 w-4" />;
      case 'follow_up': return <RefreshCw className="h-4 w-4" />;
      case 'presentation': return <Award className="h-4 w-4" />;
      case 'training': return <GraduationCap className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'virtual': return <Video className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      case 'client_site': return <MapPin className="h-4 w-4" />;
      case 'conference_room': return <Users className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Scheduling System</h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage client meetings with calendar integration and automated reminders
          </p>
        </div>
        <Button onClick={() => setShowNewMeetingDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Meeting
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMeetings.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meetings List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Meetings</CardTitle>
                  <CardDescription>
                    Manage all client meetings and appointments
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
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {mockMeetings.map((meeting) => (
                    <Card key={meeting.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getMeetingTypeIcon(meeting.meetingType)}
                              <h3 className="font-semibold text-lg">{meeting.title}</h3>
                              <Badge className={getStatusColor(meeting.status)}>
                                {meeting.status}
                              </Badge>
                              <Badge className={getPriorityColor(meeting.priority)}>
                                {meeting.priority}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDateTime(meeting.startTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {meeting.clientName}
                              </div>
                              <div className="flex items-center gap-1">
                                {getLocationIcon(meeting.location)}
                                {meeting.location === 'virtual' ? 'Virtual' : 'In-person'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {meeting.attendees.length} attendees
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{meeting.description}</p>
                            
                            <div className="flex items-center gap-2">
                              {meeting.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMeeting(meeting)}
                            >
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
                </TabsContent>
                
                <TabsContent value="today" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No meetings scheduled for today</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No completed meetings to display</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No cancelled meetings to display</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Schedule Virtual Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Schedule In-Person Meeting
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Meeting Reminders
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Meeting Reports
              </Button>
            </CardContent>
          </Card>

          {/* Team Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Availability</CardTitle>
              <CardDescription>Today's schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {member.currentMeetingsToday}/{member.maxMeetingsPerDay}
                    </p>
                    <p className="text-xs text-gray-500">meetings</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">Tax Return Review</p>
                  <p className="text-xs text-gray-500">Sarah Johnson</p>
                </div>
                <Badge variant="destructive">Tomorrow</Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">Financial Planning</p>
                  <p className="text-xs text-gray-500">Robert Martinez</p>
                </div>
                <Badge variant="secondary">Jan 20</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Meeting Dialog */}
      <Dialog open={showNewMeetingDialog} onOpenChange={setShowNewMeetingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Create a new client meeting with all necessary details and reminders
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Meeting Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input id="title" placeholder="Enter meeting title" />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select>
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
                  <Label htmlFor="priority">Priority</Label>
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
              </div>
            </div>

            <Separator />

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="font-semibold">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select>
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
            </div>

            <Separator />

            {/* Description and Agenda */}
            <div className="space-y-4">
              <h3 className="font-semibold">Details</h3>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter meeting description" />
              </div>
              <div>
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea id="agenda" placeholder="Enter meeting agenda items" />
              </div>
            </div>

            <Separator />

            {/* Reminders */}
            <div className="space-y-4">
              <h3 className="font-semibold">Reminders</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="email-reminder" />
                  <Label htmlFor="email-reminder">Email reminder (24 hours before)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sms-reminder" />
                  <Label htmlFor="sms-reminder">SMS reminder (30 minutes before)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="calendar-reminder" />
                  <Label htmlFor="calendar-reminder">Calendar notification</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewMeetingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewMeetingDialog(false)}>
              Schedule Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Meeting Details Dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-4xl">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getMeetingTypeIcon(selectedMeeting.meetingType)}
                  {selectedMeeting.title}
                </DialogTitle>
                <DialogDescription>
                  Meeting details and management options
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="attendees">Attendees</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Client</Label>
                      <p className="text-sm">{selectedMeeting.clientName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedMeeting.status)}>
                        {selectedMeeting.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date & Time</Label>
                      <p className="text-sm">{formatDateTime(selectedMeeting.startTime)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Duration</Label>
                      <p className="text-sm">{formatDuration(selectedMeeting.duration)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <div className="flex items-center gap-1">
                        {getLocationIcon(selectedMeeting.location)}
                        <span className="text-sm">
                          {selectedMeeting.location === 'virtual' ? 'Virtual Meeting' : 'In-person Meeting'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge className={getPriorityColor(selectedMeeting.priority)}>
                        {selectedMeeting.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">{selectedMeeting.description}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Agenda</Label>
                    <ul className="text-sm mt-1 space-y-1">
                      {selectedMeeting.agenda.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="attendees" className="space-y-4">
                  <div className="space-y-3">
                    {selectedMeeting.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-gray-600">{attendee.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={attendee.status === 'confirmed' ? 'default' : 'secondary'}>
                            {attendee.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reminders" className="space-y-4">
                  <div className="space-y-3">
                    {selectedMeeting.reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{reminder.type} Reminder</p>
                          <p className="text-sm text-gray-600">
                            {reminder.timeBeforeMeeting} minutes before meeting
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={reminder.sent ? 'default' : 'secondary'}>
                            {reminder.sent ? 'Sent' : 'Pending'}
                          </Badge>
                          {reminder.sent && (
                            <p className="text-xs text-gray-500">
                              {reminder.sentAt && formatDateTime(reminder.sentAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label htmlFor="meeting-notes">Meeting Notes</Label>
                    <Textarea 
                      id="meeting-notes" 
                      placeholder="Add meeting notes here..."
                      defaultValue={selectedMeeting.notes}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="follow-up" defaultChecked={selectedMeeting.followUpRequired} />
                    <Label htmlFor="follow-up">Follow-up required</Label>
                  </div>
                  {selectedMeeting.followUpRequired && (
                    <div>
                      <Label htmlFor="follow-up-date">Follow-up Date</Label>
                      <Input 
                        id="follow-up-date" 
                        type="datetime-local"
                        defaultValue={selectedMeeting.followUpDate?.slice(0, 16)}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Meeting Link
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminders
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Meeting
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingSchedulingSystem; 