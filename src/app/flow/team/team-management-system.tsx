'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  User,
  Briefcase,
  GraduationCap,
  Star,
  Clock3,
  CalendarDays,
  Workflow,
  Settings,
  MoreVertical
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'partner' | 'senior_manager' | 'manager' | 'senior' | 'staff' | 'intern';
  department: 'tax' | 'audit' | 'consulting' | 'bookkeeping' | 'admin';
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: string;
  skills: Skill[];
  currentWorkload: number;
  maxCapacity: number;
  utilizationRate: number;
  performanceScore: number;
  activeProjects: number;
  completedProjects: number;
  totalHours: number;
  billableHours: number;
  efficiency: number;
  qualityScore: number;
  clientSatisfaction: number;
  certifications: string[];
  specializations: string[];
  availability: 'available' | 'busy' | 'unavailable';
  nextReviewDate: string;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'industry' | 'software';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsed: string;
  certification?: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
  type: 'tax_return' | 'audit' | 'review' | 'consulting' | 'bookkeeping';
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[];
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  progress: number;
  budget: number;
  actualCost: number;
}

interface CapacityPlan {
  id: string;
  period: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationTarget: number;
  actualUtilization: number;
  teamMembers: TeamMemberCapacity[];
}

interface TeamMemberCapacity {
  memberId: string;
  memberName: string;
  totalHours: number;
  allocatedHours: number;
  availableHours: number;
  utilizationRate: number;
  projects: string[];
}

const TeamManagementSystem: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [capacityPlans, setCapacityPlans] = useState<CapacityPlan[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCapacityPlanning, setShowCapacityPlanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const roles = [
    { value: 'partner', label: 'Partner', color: 'bg-purple-100 text-purple-800' },
    { value: 'senior_manager', label: 'Senior Manager', color: 'bg-blue-100 text-blue-800' },
    { value: 'manager', label: 'Manager', color: 'bg-green-100 text-green-800' },
    { value: 'senior', label: 'Senior', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'staff', label: 'Staff', color: 'bg-gray-100 text-gray-800' },
    { value: 'intern', label: 'Intern', color: 'bg-pink-100 text-pink-800' }
  ];

  const departments = [
    { value: 'tax', label: 'Tax', icon: '📊' },
    { value: 'audit', label: 'Audit', icon: '🔍' },
    { value: 'consulting', label: 'Consulting', icon: '💼' },
    { value: 'bookkeeping', label: 'Bookkeeping', icon: '📚' },
    { value: 'admin', label: 'Administration', icon: '⚙️' }
  ];

  const skillCategories = [
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'industry', label: 'Industry Knowledge' },
    { value: 'software', label: 'Software Proficiency' }
  ];

  // Mock data
  useEffect(() => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@firm.com',
        role: 'partner',
        department: 'tax',
        status: 'active',
        hireDate: '2018-03-15',
        skills: [
          { id: '1', name: 'Tax Planning', category: 'technical', proficiency: 'expert', yearsOfExperience: 12, lastUsed: '2024-01-20' },
          { id: '2', name: 'Client Management', category: 'soft', proficiency: 'expert', yearsOfExperience: 12, lastUsed: '2024-01-20' },
          { id: '3', name: 'QuickBooks', category: 'software', proficiency: 'advanced', yearsOfExperience: 8, lastUsed: '2024-01-18' }
        ],
        currentWorkload: 85,
        maxCapacity: 100,
        utilizationRate: 85,
        performanceScore: 95,
        activeProjects: 8,
        completedProjects: 45,
        totalHours: 1840,
        billableHours: 1656,
        efficiency: 90,
        qualityScore: 98,
        clientSatisfaction: 96,
        certifications: ['CPA', 'EA'],
        specializations: ['Corporate Tax', 'Partnership Tax', 'Estate Planning'],
        availability: 'busy',
        nextReviewDate: '2024-04-15'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@firm.com',
        role: 'senior_manager',
        department: 'audit',
        status: 'active',
        hireDate: '2020-06-10',
        skills: [
          { id: '4', name: 'Financial Auditing', category: 'technical', proficiency: 'advanced', yearsOfExperience: 6, lastUsed: '2024-01-19' },
          { id: '5', name: 'Risk Assessment', category: 'technical', proficiency: 'advanced', yearsOfExperience: 6, lastUsed: '2024-01-19' },
          { id: '6', name: 'Team Leadership', category: 'soft', proficiency: 'advanced', yearsOfExperience: 4, lastUsed: '2024-01-20' }
        ],
        currentWorkload: 70,
        maxCapacity: 100,
        utilizationRate: 70,
        performanceScore: 88,
        activeProjects: 5,
        completedProjects: 32,
        totalHours: 1560,
        billableHours: 1404,
        efficiency: 85,
        qualityScore: 92,
        clientSatisfaction: 89,
        certifications: ['CPA', 'CIA'],
        specializations: ['Financial Audits', 'Internal Controls', 'Compliance'],
        availability: 'available',
        nextReviewDate: '2024-03-20'
      }
    ];

    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Smith Corp Tax Return 2023',
        clientName: 'Smith Corporation',
        type: 'tax_return',
        status: 'in_progress',
        priority: 'high',
        assignedTo: ['1'],
        startDate: '2024-01-15',
        dueDate: '2024-03-15',
        estimatedHours: 40,
        actualHours: 25,
        progress: 62,
        budget: 8000,
        actualCost: 5000
      },
      {
        id: '2',
        name: 'Johnson LLC Audit Q4 2023',
        clientName: 'Johnson LLC',
        type: 'audit',
        status: 'planning',
        priority: 'medium',
        assignedTo: ['2'],
        startDate: '2024-02-01',
        dueDate: '2024-04-30',
        estimatedHours: 80,
        actualHours: 0,
        progress: 0,
        budget: 15000,
        actualCost: 0
      }
    ];

    setTeamMembers(mockTeamMembers);
    setProjects(mockProjects);
  }, []);

  const getRoleBadge = (role: string) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo ? (
      <Badge className={roleInfo.color}>{roleInfo.label}</Badge>
    ) : (
      <Badge variant="outline">{role}</Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'on_leave':
        return <Clock3 className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">Available</Badge>;
      case 'busy':
        return <Badge variant="secondary">Busy</Badge>;
      case 'unavailable':
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const teamStats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    averageUtilization: teamMembers.reduce((sum, m) => sum + m.utilizationRate, 0) / teamMembers.length,
    averagePerformance: teamMembers.reduce((sum, m) => sum + m.performanceScore, 0) / teamMembers.length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management & Capacity Planning</h1>
          <p className="text-muted-foreground">Manage team resources, workload distribution, and performance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCapacityPlanning(true)} className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Capacity Planning
          </Button>
          <Button onClick={() => setShowAddMember(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Team</p>
                <p className="text-2xl font-bold">{teamStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                <p className="text-2xl font-bold">{teamStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                <p className="text-2xl font-bold">{teamStats.averageUtilization.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">{teamStats.averagePerformance.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{teamStats.activeProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{teamStats.totalProjects}</p>
              </div>
              <Workflow className="h-8 w-8 text-orange-500" />
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.icon} {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
          <CardDescription>Manage team resources, skills, and capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(member.role)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{departments.find(d => d.value === member.department)?.icon}</span>
                      <span className="text-sm">{departments.find(d => d.value === member.department)?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(member.status)}
                      <span className="text-sm capitalize">{member.status.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{member.utilizationRate}%</span>
                        <span>{member.currentWorkload}/{member.maxCapacity}</span>
                      </div>
                      <Progress value={member.utilizationRate} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-700">{member.performanceScore}</span>
                      </div>
                      <span className="text-sm">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAvailabilityBadge(member.availability)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
            <DialogDescription>
              View detailed information about team member skills, performance, and capacity
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="capacity">Capacity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedMember.name}</div>
                      <div><span className="font-medium">Email:</span> {selectedMember.email}</div>
                      <div><span className="font-medium">Role:</span> {roles.find(r => r.value === selectedMember.role)?.label}</div>
                      <div><span className="font-medium">Department:</span> {departments.find(d => d.value === selectedMember.department)?.label}</div>
                      <div><span className="font-medium">Hire Date:</span> {selectedMember.hireDate}</div>
                      <div><span className="font-medium">Status:</span> {selectedMember.status}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Performance Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Performance Score:</span> {selectedMember.performanceScore}%</div>
                      <div><span className="font-medium">Quality Score:</span> {selectedMember.qualityScore}%</div>
                      <div><span className="font-medium">Client Satisfaction:</span> {selectedMember.clientSatisfaction}%</div>
                      <div><span className="font-medium">Efficiency:</span> {selectedMember.efficiency}%</div>
                      <div><span className="font-medium">Active Projects:</span> {selectedMember.activeProjects}</div>
                      <div><span className="font-medium">Completed Projects:</span> {selectedMember.completedProjects}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-4">Skills Matrix</h3>
                  <div className="space-y-4">
                    {skillCategories.map(category => {
                      const categorySkills = selectedMember.skills.filter(s => s.category === category.value);
                      return (
                        <Card key={category.value}>
                          <CardHeader>
                            <CardTitle className="text-lg">{category.label}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {categorySkills.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{skill.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {skill.yearsOfExperience} years experience • Last used: {skill.lastUsed}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className="capitalize">{skill.proficiency}</Badge>
                                    {skill.certification && (
                                      <p className="text-xs text-muted-foreground mt-1">{skill.certification}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Performance Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-green-700">{selectedMember.performanceScore}</span>
                          </div>
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Quality Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-700">{selectedMember.qualityScore}</span>
                          </div>
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Client Satisfaction</span>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-purple-700">{selectedMember.clientSatisfaction}</span>
                          </div>
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Projects</span>
                        <Badge variant="default">{selectedMember.activeProjects}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completed Projects</span>
                        <Badge variant="secondary">{selectedMember.completedProjects}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Hours</span>
                        <span className="text-sm font-medium">{selectedMember.totalHours}h</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Billable Hours</span>
                        <span className="text-sm font-medium">{selectedMember.billableHours}h</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="capacity" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capacity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Utilization Rate</span>
                          <span>{selectedMember.utilizationRate}%</span>
                        </div>
                        <Progress value={selectedMember.utilizationRate} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Current Workload</span>
                          <span>{selectedMember.currentWorkload}/{selectedMember.maxCapacity}</span>
                        </div>
                        <Progress value={(selectedMember.currentWorkload / selectedMember.maxCapacity) * 100} className="h-3" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Efficiency</span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-700">{selectedMember.efficiency}</span>
                          </div>
                          <span className="text-sm">%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Status</span>
                        {getAvailabilityBadge(selectedMember.availability)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Next Review</span>
                        <span className="text-sm">{selectedMember.nextReviewDate}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="available" defaultChecked={selectedMember.availability === 'available'} />
                          <label htmlFor="available" className="text-sm">Available for new assignments</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch id="overtime" defaultChecked={selectedMember.utilizationRate > 80} />
                          <label htmlFor="overtime" className="text-sm">Available for overtime</label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagementSystem; 