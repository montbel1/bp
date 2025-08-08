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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  Star,
  Zap,
  Filter,
  Search
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  capacity: number; // hours per week
  currentWorkload: number; // hours this week
  utilization: number; // percentage
  skills: string[];
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
  lastActive: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  totalCapacity: number;
  totalWorkload: number;
  averageUtilization: number;
  activeProjects: number;
  totalRevenue: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@avanee.com',
    role: 'Senior Accountant',
    status: 'active',
    capacity: 40,
    currentWorkload: 32,
    utilization: 80,
    skills: ['Tax Preparation', 'Audit', 'Financial Analysis'],
    activeJobs: 5,
    completedJobs: 12,
    totalRevenue: 45000,
    lastActive: '2024-01-21T14:30:00Z'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@avanee.com',
    role: 'Audit Manager',
    status: 'active',
    capacity: 40,
    currentWorkload: 38,
    utilization: 95,
    skills: ['Audit', 'Risk Assessment', 'Compliance'],
    activeJobs: 3,
    completedJobs: 8,
    totalRevenue: 52000,
    lastActive: '2024-01-21T15:00:00Z'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@avanee.com',
    role: 'Junior Accountant',
    status: 'away',
    capacity: 35,
    currentWorkload: 25,
    utilization: 71,
    skills: ['Bookkeeping', 'Tax Preparation'],
    activeJobs: 4,
    completedJobs: 6,
    totalRevenue: 28000,
    lastActive: '2024-01-21T12:00:00Z'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@avanee.com',
    role: 'Tax Specialist',
    status: 'offline',
    capacity: 40,
    currentWorkload: 0,
    utilization: 0,
    skills: ['Tax Planning', 'Corporate Tax', 'International Tax'],
    activeJobs: 0,
    completedJobs: 15,
    totalRevenue: 38000,
    lastActive: '2024-01-20T17:00:00Z'
  }
];

const mockTeam: Team = {
  id: '1',
  name: 'Accounting Team',
  description: 'Core accounting and tax services team',
  members: mockTeamMembers,
  totalCapacity: 155,
  totalWorkload: 95,
  averageUtilization: 61,
  activeProjects: 12,
  totalRevenue: 163000
};

export default function TeamsPage() {
  const [team, setTeam] = useState<Team>(mockTeam);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const filteredMembers = team.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'away': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'away': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'offline': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage team capacity, workload, and collaboration</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Team Settings
          </Button>
          <Button onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{team.members.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{team.totalCapacity}h/week</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{team.averageUtilization}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{team.activeProjects}</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Planning */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Planning</CardTitle>
          <CardDescription>
            Monitor team workload and capacity utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Team Utilization</h4>
                <p className="text-sm text-gray-600">
                  {team.totalWorkload}h used of {team.totalCapacity}h available
                </p>
              </div>
              <Badge className={getUtilizationColor(team.averageUtilization)}>
                {team.averageUtilization}% utilized
              </Badge>
            </div>
            <Progress value={team.averageUtilization} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {team.members.filter(m => m.utilization < 75).length}
                </div>
                <div className="text-sm text-gray-600">Under-utilized</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {team.members.filter(m => m.utilization >= 75 && m.utilization < 90).length}
                </div>
                <div className="text-sm text-gray-600">Optimal</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {team.members.filter(m => m.utilization >= 90).length}
                </div>
                <div className="text-sm text-gray-600">Overloaded</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search team members..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Senior Accountant">Senior Accountant</SelectItem>
                <SelectItem value="Audit Manager">Audit Manager</SelectItem>
                <SelectItem value="Junior Accountant">Junior Accountant</SelectItem>
                <SelectItem value="Tax Specialist">Tax Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage team members, monitor workload, and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{member.role}</div>
                    <div className="text-sm text-gray-500">
                      {member.skills.slice(0, 2).join(', ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(member.status)}
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.capacity}h/week
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.currentWorkload}h
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{member.utilization}%</span>
                      </div>
                      <Progress value={member.utilization} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.activeJobs} active
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${member.totalRevenue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Team Member Details - {member.name}</DialogTitle>
                            <DialogDescription>
                              View detailed information about team member performance and workload
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="performance">Performance</TabsTrigger>
                              <TabsTrigger value="workload">Workload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Contact Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><strong>Email:</strong> {member.email}</div>
                                    <div><strong>Role:</strong> {member.role}</div>
                                    <div><strong>Status:</strong> {member.status}</div>
                                    <div><strong>Last Active:</strong> {new Date(member.lastActive).toLocaleString()}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Skills</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {member.skills.map((skill, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="performance" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {member.completedJobs}
                                  </div>
                                  <div className="text-sm text-gray-600">Completed Jobs</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    ${member.totalRevenue.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-600">Total Revenue</div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="workload" className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Current Week</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Capacity</span>
                                      <span>{member.capacity}h</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Workload</span>
                                      <span>{member.currentWorkload}h</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Utilization</span>
                                      <span>{member.utilization}%</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Active Jobs</h4>
                                  <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                      <div key={i} className="border rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <div className="font-medium">Q4 Tax Preparation</div>
                                            <div className="text-sm text-gray-500">Due: Jan 31, 2024</div>
                                          </div>
                                          <Badge className="bg-green-100 text-green-800">In Progress</Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to your practice management team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="John" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="john@avanee.com" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior-accountant">Senior Accountant</SelectItem>
                  <SelectItem value="audit-manager">Audit Manager</SelectItem>
                  <SelectItem value="junior-accountant">Junior Accountant</SelectItem>
                  <SelectItem value="tax-specialist">Tax Specialist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Weekly Capacity (hours)</label>
              <Input type="number" placeholder="40" />
            </div>
            <div>
              <label className="text-sm font-medium">Skills</label>
              <Input placeholder="Tax Preparation, Audit, Financial Analysis" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button>Add Member</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 