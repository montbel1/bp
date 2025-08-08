'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, Users, ShoppingCart, Store, Truck, Coffee, Building2, Palette, Wrench, Stethoscope, Scale, Calculator, Mic, Camera, Car, Home, Briefcase, Heart, Gavel, FileText, Database, Clock, Target, Zap, Shield, Globe, Star, TrendingUp, Settings, BarChart3 } from 'lucide-react';

interface TestPersona {
  id: string;
  name: string;
  business: string;
  type: string;
  annualRevenue: string;
  employees: number;
  description: string;
  icon: React.ReactNode;
  testScenarios: TestScenario[];
  color: string;
  industry: string;
}

interface TestScenario {
  id: string;
  title: string;
  description: string;
  endpoints: string[];
  expectedResults: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const testPersonas: TestPersona[] = [
  // Healthcare Professionals
  {
    id: 'family-physician',
    name: 'Dr. Sarah Johnson',
    business: 'Johnson Family Medicine',
    type: 'Family Physician',
    annualRevenue: '$350,000',
    employees: 6,
    description: 'Primary care practice with patient scheduling and insurance billing',
    icon: <Stethoscope className="h-6 w-6" />,
    color: 'bg-blue-500',
    industry: 'Healthcare',
    testScenarios: [
      {
        id: 'health-1',
        title: 'Patient Scheduling & Appointments',
        description: 'Test patient appointment booking, calendar management, and scheduling conflicts',
        endpoints: ['/api/calendar', '/api/clients', '/api/flow/jobs'],
        expectedResults: ['Appointments scheduled', 'Calendar conflicts resolved', 'Patient reminders sent'],
        status: 'pending'
      },
      {
        id: 'health-2',
        title: 'Insurance Billing & Claims',
        description: 'Test insurance claim processing, payment tracking, and reimbursement management',
        endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
        expectedResults: ['Claims processed', 'Payments tracked', 'Reimbursements managed'],
        status: 'pending'
      },
      {
        id: 'health-3',
        title: 'Medical Records Management',
        description: 'Test patient records, document storage, and HIPAA compliance',
        endpoints: ['/api/documents', '/api/clients', '/api/settings'],
        expectedResults: ['Records secured', 'Documents stored', 'Compliance maintained'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'dental-practice',
    name: 'Dr. Michael Chen',
    business: 'Bright Smile Dental',
    type: 'Dental Practice',
    annualRevenue: '$280,000',
    employees: 8,
    description: 'Dental practice with treatment planning and equipment tracking',
    icon: <Heart className="h-6 w-6" />,
    color: 'bg-green-500',
    industry: 'Healthcare',
    testScenarios: [
      {
        id: 'dental-1',
        title: 'Treatment Planning & Scheduling',
        description: 'Test treatment plan creation, appointment scheduling, and follow-up tracking',
        endpoints: ['/api/flow/jobs', '/api/calendar', '/api/projects'],
        expectedResults: ['Treatment plans created', 'Appointments scheduled', 'Follow-ups tracked'],
        status: 'pending'
      },
      {
        id: 'dental-2',
        title: 'Equipment & Supply Management',
        description: 'Test dental equipment tracking, supply inventory, and maintenance scheduling',
        endpoints: ['/api/transactions', '/api/categories', '/api/calendar'],
        expectedResults: ['Equipment tracked', 'Supplies managed', 'Maintenance scheduled'],
        status: 'pending'
      },
      {
        id: 'dental-3',
        title: 'Insurance & Payment Processing',
        description: 'Test dental insurance claims, payment processing, and patient billing',
        endpoints: ['/api/invoices', '/api/payments', '/api/reports'],
        expectedResults: ['Claims processed', 'Payments tracked', 'Billing automated'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'physical-therapist',
    name: 'Lisa Rodriguez',
    business: 'Active Recovery PT',
    type: 'Physical Therapy Clinic',
    annualRevenue: '$180,000',
    employees: 4,
    description: 'Physical therapy practice with treatment sessions and progress tracking',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-purple-500',
    industry: 'Healthcare',
    testScenarios: [
      {
        id: 'pt-1',
        title: 'Treatment Session Management',
        description: 'Test session scheduling, progress tracking, and outcome measurement',
        endpoints: ['/api/calendar', '/api/flow/jobs', '/api/reports'],
        expectedResults: ['Sessions scheduled', 'Progress tracked', 'Outcomes measured'],
        status: 'pending'
      },
      {
        id: 'pt-2',
        title: 'Insurance & Medicare Billing',
        description: 'Test Medicare billing, insurance claims, and payment processing',
        endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
        expectedResults: ['Medicare billed', 'Claims processed', 'Payments tracked'],
        status: 'pending'
      },
      {
        id: 'pt-3',
        title: 'Patient Progress Documentation',
        description: 'Test progress notes, treatment plans, and outcome documentation',
        endpoints: ['/api/documents', '/api/clients', '/api/projects'],
        expectedResults: ['Notes documented', 'Plans updated', 'Outcomes recorded'],
        status: 'pending'
      }
    ]
  },
  // Legal Professionals
  {
    id: 'family-lawyer',
    name: 'Jennifer Martinez',
    business: 'Martinez Family Law',
    type: 'Family Law Attorney',
    annualRevenue: '$220,000',
    employees: 3,
    description: 'Family law practice with case management and court scheduling',
    icon: <Gavel className="h-6 w-6" />,
    color: 'bg-red-500',
    industry: 'Legal',
    testScenarios: [
      {
        id: 'law-1',
        title: 'Case Management & Court Dates',
        description: 'Test case tracking, court date scheduling, and deadline management',
        endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
        expectedResults: ['Cases tracked', 'Court dates scheduled', 'Deadlines managed'],
        status: 'pending'
      },
      {
        id: 'law-2',
        title: 'Client Billing & Trust Accounts',
        description: 'Test hourly billing, trust account management, and payment tracking',
        endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
        expectedResults: ['Hours billed', 'Trust accounts managed', 'Payments tracked'],
        status: 'pending'
      },
      {
        id: 'law-3',
        title: 'Document Management & Filing',
        description: 'Test legal document storage, court filing, and document versioning',
        endpoints: ['/api/documents', '/api/clients', '/api/projects'],
        expectedResults: ['Documents stored', 'Filings tracked', 'Versions managed'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'criminal-lawyer',
    name: 'Robert Thompson',
    business: 'Thompson Defense Law',
    type: 'Criminal Defense Attorney',
    annualRevenue: '$190,000',
    employees: 2,
    description: 'Criminal defense practice with case tracking and court appearances',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-orange-500',
    industry: 'Legal',
    testScenarios: [
      {
        id: 'criminal-1',
        title: 'Case Tracking & Court Appearances',
        description: 'Test case management, court appearance scheduling, and evidence tracking',
        endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
        expectedResults: ['Cases tracked', 'Appearances scheduled', 'Evidence managed'],
        status: 'pending'
      },
      {
        id: 'criminal-2',
        title: 'Client Communication & Billing',
        description: 'Test client communication, retainer agreements, and payment processing',
        endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
        expectedResults: ['Communication tracked', 'Retainers managed', 'Payments processed'],
        status: 'pending'
      },
      {
        id: 'criminal-3',
        title: 'Evidence & Document Management',
        description: 'Test evidence tracking, document discovery, and case file organization',
        endpoints: ['/api/documents', '/api/projects', '/api/categories'],
        expectedResults: ['Evidence tracked', 'Discovery managed', 'Files organized'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'corporate-lawyer',
    name: 'David Wilson',
    business: 'Wilson Corporate Law',
    type: 'Corporate Attorney',
    annualRevenue: '$450,000',
    employees: 5,
    description: 'Corporate law practice with contract management and business formation',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'bg-indigo-500',
    industry: 'Legal',
    testScenarios: [
      {
        id: 'corporate-1',
        title: 'Contract Management & Review',
        description: 'Test contract drafting, review processes, and version control',
        endpoints: ['/api/documents', '/api/projects', '/api/flow/jobs'],
        expectedResults: ['Contracts drafted', 'Reviews tracked', 'Versions controlled'],
        status: 'pending'
      },
      {
        id: 'corporate-2',
        title: 'Business Formation & Compliance',
        description: 'Test business formation, compliance tracking, and regulatory filings',
        endpoints: ['/api/projects', '/api/calendar', '/api/reports'],
        expectedResults: ['Formations tracked', 'Compliance monitored', 'Filings managed'],
        status: 'pending'
      },
      {
        id: 'corporate-3',
        title: 'Client Relationship Management',
        description: 'Test client onboarding, relationship tracking, and service delivery',
        endpoints: ['/api/clients', '/api/flow/jobs', '/api/reports'],
        expectedResults: ['Clients onboarded', 'Relationships tracked', 'Services delivered'],
        status: 'pending'
      }
    ]
  },
  // Accounting & Financial Services
  {
    id: 'cpa-firm',
    name: 'Maria Garcia',
    business: 'Garcia & Associates CPA',
    type: 'CPA Firm',
    annualRevenue: '$320,000',
    employees: 7,
    description: 'Certified public accounting firm with tax preparation and audit services',
    icon: <Calculator className="h-6 w-6" />,
    color: 'bg-emerald-500',
    industry: 'Accounting',
    testScenarios: [
      {
        id: 'cpa-1',
        title: 'Tax Preparation & Filing',
        description: 'Test tax return preparation, filing deadlines, and client communication',
        endpoints: ['/api/taxpro/forms', '/api/calendar', '/api/clients'],
        expectedResults: ['Returns prepared', 'Deadlines tracked', 'Clients notified'],
        status: 'pending'
      },
      {
        id: 'cpa-2',
        title: 'Audit & Review Services',
        description: 'Test audit planning, fieldwork scheduling, and report generation',
        endpoints: ['/api/projects', '/api/flow/jobs', '/api/reports'],
        expectedResults: ['Audits planned', 'Fieldwork scheduled', 'Reports generated'],
        status: 'pending'
      },
      {
        id: 'cpa-3',
        title: 'Client Financial Management',
        description: 'Test client bookkeeping, financial reporting, and advisory services',
        endpoints: ['/api/transactions', '/api/reports', '/api/clients'],
        expectedResults: ['Books maintained', 'Reports generated', 'Advisory provided'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'bookkeeping-service',
    name: 'Alex Kim',
    business: 'Precision Bookkeeping',
    type: 'Bookkeeping Service',
    annualRevenue: '$95,000',
    employees: 3,
    description: 'Bookkeeping service with monthly reconciliation and financial reporting',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-teal-500',
    industry: 'Accounting',
    testScenarios: [
      {
        id: 'bookkeeping-1',
        title: 'Monthly Reconciliation',
        description: 'Test bank reconciliation, account balancing, and error detection',
        endpoints: ['/api/bank-accounts', '/api/transactions', '/api/reports'],
        expectedResults: ['Accounts reconciled', 'Balances verified', 'Errors detected'],
        status: 'pending'
      },
      {
        id: 'bookkeeping-2',
        title: 'Financial Reporting',
        description: 'Test financial statement generation, cash flow analysis, and reporting',
        endpoints: ['/api/reports', '/api/reports/advanced', '/api/transactions'],
        expectedResults: ['Statements generated', 'Cash flow analyzed', 'Reports delivered'],
        status: 'pending'
      },
      {
        id: 'bookkeeping-3',
        title: 'Client Communication & Billing',
        description: 'Test client communication, monthly billing, and service delivery',
        endpoints: ['/api/clients', '/api/invoices', '/api/calendar'],
        expectedResults: ['Communication tracked', 'Billing automated', 'Services delivered'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'financial-advisor',
    name: 'Sarah Williams',
    business: 'Williams Financial Planning',
    type: 'Financial Advisor',
    annualRevenue: '$180,000',
    employees: 2,
    description: 'Financial planning practice with investment management and client meetings',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-yellow-500',
    industry: 'Financial Services',
    testScenarios: [
      {
        id: 'advisor-1',
        title: 'Client Meeting Management',
        description: 'Test client meeting scheduling, preparation, and follow-up tracking',
        endpoints: ['/api/calendar', '/api/clients', '/api/flow/jobs'],
        expectedResults: ['Meetings scheduled', 'Preparation tracked', 'Follow-ups managed'],
        status: 'pending'
      },
      {
        id: 'advisor-2',
        title: 'Investment Portfolio Tracking',
        description: 'Test portfolio monitoring, performance analysis, and rebalancing',
        endpoints: ['/api/reports/advanced', '/api/transactions', '/api/reports'],
        expectedResults: ['Portfolios monitored', 'Performance analyzed', 'Rebalancing tracked'],
        status: 'pending'
      },
      {
        id: 'advisor-3',
        title: 'Financial Planning & Goals',
        description: 'Test financial plan creation, goal tracking, and progress monitoring',
        endpoints: ['/api/projects', '/api/reports', '/api/clients'],
        expectedResults: ['Plans created', 'Goals tracked', 'Progress monitored'],
        status: 'pending'
      }
    ]
  },
  // Creative & Media Services
  {
    id: 'video-production',
    name: 'Mark Johnson',
    business: 'Johnson Video Productions',
    type: 'Video Production Company',
    annualRevenue: '$150,000',
    employees: 4,
    description: 'Video production company with project management and equipment tracking',
    icon: <Camera className="h-6 w-6" />,
    color: 'bg-pink-500',
    industry: 'Media',
    testScenarios: [
      {
        id: 'video-1',
        title: 'Project Management & Scheduling',
        description: 'Test project planning, crew scheduling, and equipment allocation',
        endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
        expectedResults: ['Projects planned', 'Crew scheduled', 'Equipment allocated'],
        status: 'pending'
      },
      {
        id: 'video-2',
        title: 'Client Communication & Billing',
        description: 'Test client communication, milestone billing, and payment tracking',
        endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
        expectedResults: ['Communication tracked', 'Milestones billed', 'Payments tracked'],
        status: 'pending'
      },
      {
        id: 'video-3',
        title: 'Equipment & Asset Management',
        description: 'Test equipment tracking, maintenance scheduling, and asset depreciation',
        endpoints: ['/api/transactions', '/api/categories', '/api/calendar'],
        expectedResults: ['Equipment tracked', 'Maintenance scheduled', 'Depreciation calculated'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'podcast-studio',
    name: 'Emily Davis',
    business: 'Davis Podcast Studio',
    type: 'Podcast Production Studio',
    annualRevenue: '$85,000',
    employees: 2,
    description: 'Podcast production studio with episode scheduling and content management',
    icon: <Mic className="h-6 w-6" />,
    color: 'bg-violet-500',
    industry: 'Media',
    testScenarios: [
      {
        id: 'podcast-1',
        title: 'Episode Production & Scheduling',
        description: 'Test episode planning, recording scheduling, and content calendar',
        endpoints: ['/api/calendar', '/api/projects', '/api/flow/jobs'],
        expectedResults: ['Episodes planned', 'Recording scheduled', 'Content managed'],
        status: 'pending'
      },
      {
        id: 'podcast-2',
        title: 'Client & Guest Management',
        description: 'Test client onboarding, guest scheduling, and communication tracking',
        endpoints: ['/api/clients', '/api/calendar', '/api/flow/jobs'],
        expectedResults: ['Clients onboarded', 'Guests scheduled', 'Communication tracked'],
        status: 'pending'
      },
      {
        id: 'podcast-3',
        title: 'Revenue & Sponsorship Tracking',
        description: 'Test sponsorship management, revenue tracking, and payment processing',
        endpoints: ['/api/transactions', '/api/invoices', '/api/reports'],
        expectedResults: ['Sponsorships managed', 'Revenue tracked', 'Payments processed'],
        status: 'pending'
      }
    ]
  },
  // Real Estate & Property Services
  {
    id: 'real-estate-agent',
    name: 'James Brown',
    business: 'Brown Real Estate',
    type: 'Real Estate Agent',
    annualRevenue: '$120,000',
    employees: 1,
    description: 'Real estate agent with property listings and client relationship management',
    icon: <Home className="h-6 w-6" />,
    color: 'bg-cyan-500',
    industry: 'Real Estate',
    testScenarios: [
      {
        id: 'realestate-1',
        title: 'Property Listing Management',
        description: 'Test property listings, photo management, and marketing tracking',
        endpoints: ['/api/projects', '/api/documents', '/api/reports'],
        expectedResults: ['Listings managed', 'Photos organized', 'Marketing tracked'],
        status: 'pending'
      },
      {
        id: 'realestate-2',
        title: 'Client & Lead Management',
        description: 'Test lead tracking, client communication, and appointment scheduling',
        endpoints: ['/api/clients', '/api/calendar', '/api/flow/jobs'],
        expectedResults: ['Leads tracked', 'Communication managed', 'Appointments scheduled'],
        status: 'pending'
      },
      {
        id: 'realestate-3',
        title: 'Transaction & Commission Tracking',
        description: 'Test transaction management, commission calculations, and payment processing',
        endpoints: ['/api/transactions', '/api/invoices', '/api/reports'],
        expectedResults: ['Transactions tracked', 'Commissions calculated', 'Payments processed'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'property-manager',
    name: 'Lisa Anderson',
    business: 'Anderson Property Management',
    type: 'Property Management Company',
    annualRevenue: '$200,000',
    employees: 5,
    description: 'Property management company with tenant management and maintenance tracking',
    icon: <Building2 className="h-6 w-6" />,
    color: 'bg-slate-500',
    industry: 'Real Estate',
    testScenarios: [
      {
        id: 'property-1',
        title: 'Tenant & Lease Management',
        description: 'Test tenant onboarding, lease management, and rent collection',
        endpoints: ['/api/clients', '/api/transactions', '/api/reports'],
        expectedResults: ['Tenants onboarded', 'Leases managed', 'Rent collected'],
        status: 'pending'
      },
      {
        id: 'property-2',
        title: 'Maintenance & Repair Tracking',
        description: 'Test maintenance requests, repair scheduling, and cost tracking',
        endpoints: ['/api/flow/jobs', '/api/calendar', '/api/transactions'],
        expectedResults: ['Requests tracked', 'Repairs scheduled', 'Costs managed'],
        status: 'pending'
      },
      {
        id: 'property-3',
        title: 'Financial Reporting & Owner Communication',
        description: 'Test financial reporting, owner communication, and profit distribution',
        endpoints: ['/api/reports', '/api/clients', '/api/transactions'],
        expectedResults: ['Reports generated', 'Communication tracked', 'Profits distributed'],
        status: 'pending'
      }
    ]
  },
  // Automotive & Service Industries
  {
    id: 'auto-repair-shop',
    name: 'Carlos Rodriguez',
    business: 'Rodriguez Auto Repair',
    type: 'Auto Repair Shop',
    annualRevenue: '$160,000',
    employees: 6,
    description: 'Auto repair shop with service scheduling and parts inventory management',
    icon: <Car className="h-6 w-6" />,
    color: 'bg-amber-500',
    industry: 'Automotive',
    testScenarios: [
      {
        id: 'auto-1',
        title: 'Service Appointment Scheduling',
        description: 'Test service scheduling, technician allocation, and customer communication',
        endpoints: ['/api/calendar', '/api/flow/jobs', '/api/clients'],
        expectedResults: ['Services scheduled', 'Technicians allocated', 'Customers notified'],
        status: 'pending'
      },
      {
        id: 'auto-2',
        title: 'Parts Inventory & Purchasing',
        description: 'Test parts inventory tracking, supplier management, and cost analysis',
        endpoints: ['/api/vendors', '/api/transactions', '/api/reports'],
        expectedResults: ['Inventory tracked', 'Suppliers managed', 'Costs analyzed'],
        status: 'pending'
      },
      {
        id: 'auto-3',
        title: 'Customer Service & Billing',
        description: 'Test customer service tracking, service billing, and payment processing',
        endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
        expectedResults: ['Service tracked', 'Billing automated', 'Payments processed'],
        status: 'pending'
      }
    ]
  },
  {
    id: 'consulting-firm',
    name: 'Dr. Amanda Lee',
    business: 'Lee Strategic Consulting',
    type: 'Management Consulting',
    annualRevenue: '$280,000',
    employees: 4,
    description: 'Management consulting firm with project management and client deliverables',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'bg-rose-500',
    industry: 'Consulting',
    testScenarios: [
      {
        id: 'consulting-1',
        title: 'Project Management & Deliverables',
        description: 'Test project planning, milestone tracking, and deliverable management',
        endpoints: ['/api/projects', '/api/flow/jobs', '/api/reports'],
        expectedResults: ['Projects planned', 'Milestones tracked', 'Deliverables managed'],
        status: 'pending'
      },
      {
        id: 'consulting-2',
        title: 'Client Relationship & Billing',
        description: 'Test client relationship management, hourly billing, and payment tracking',
        endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
        expectedResults: ['Relationships managed', 'Hours billed', 'Payments tracked'],
        status: 'pending'
      },
      {
        id: 'consulting-3',
        title: 'Team Collaboration & Time Tracking',
        description: 'Test team collaboration, time tracking, and resource allocation',
        endpoints: ['/api/flow/time', '/api/flow/jobs', '/api/reports'],
        expectedResults: ['Collaboration tracked', 'Time logged', 'Resources allocated'],
        status: 'pending'
      }
    ]
  }
];

export default function TestCasesPage() {
  const [activePersona, setActivePersona] = useState<string>(testPersonas[0].id);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const runTestScenario = async (personaId: string, scenarioId: string) => {
    setRunningTests(prev => new Set(prev).add(scenarioId));
    
    try {
      // Use our test runner API
      const response = await fetch('/api/test-data/run-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: personaId, scenarioId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          [scenarioId]: {
            timestamp: new Date().toISOString(),
            results: data.results,
            success: data.summary.passed === data.summary.totalTests,
            summary: data.summary
          }
        }));
      } else {
        const errorData = await response.json();
        setTestResults(prev => ({
          ...prev,
          [scenarioId]: {
            timestamp: new Date().toISOString(),
            error: errorData.error || 'Test failed',
            success: false
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [scenarioId]: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        }
      }));
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(scenarioId);
        return newSet;
      });
    }
  };

  const runAllTestsForPersona = async (personaId: string) => {
    const persona = testPersonas.find(p => p.id === personaId);
    if (!persona) return;

    for (const scenario of persona.testScenarios) {
      await runTestScenario(personaId, scenario.id);
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const activePersonaData = testPersonas.find(p => p.id === activePersona);

  // Group personas by industry
  const industryGroups = testPersonas.reduce((groups, persona) => {
    if (!groups[persona.industry]) {
      groups[persona.industry] = [];
    }
    groups[persona.industry].push(persona);
    return groups;
  }, {} as Record<string, TestPersona[]>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Professional Practice Test Cases</h1>
          <p className="text-muted-foreground">
            Comprehensive testing for 30+ professional service scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {testPersonas.length} Practice Types
          </Badge>
          <Badge variant="outline" className="text-sm">
            {testPersonas.reduce((acc, p) => acc + p.testScenarios.length, 0)} Test Scenarios
          </Badge>
        </div>
      </div>

      <Tabs value={activePersona} onValueChange={setActivePersona} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {Object.entries(industryGroups).map(([industry, personas]) => (
            <TabsTrigger key={industry} value={personas[0].id} className="flex items-center gap-2">
              {personas[0].icon}
              <span className="hidden sm:inline">{industry}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {testPersonas.map((persona) => (
          <TabsContent key={persona.id} value={persona.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${persona.color} text-white`}>
                    {persona.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{persona.name}</CardTitle>
                    <CardDescription className="text-lg">{persona.business}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">{persona.annualRevenue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">{persona.employees} employees</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {persona.industry}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2">{persona.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={() => runAllTestsForPersona(persona.id)}
                    disabled={runningTests.size > 0}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Run All Tests
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/test-data/setup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ persona: persona.id })
                        });
                        if (response.ok) {
                          alert(`Test data setup for ${persona.name} completed!`);
                        } else {
                          alert('Failed to setup test data');
                        }
                      } catch (error) {
                        alert('Error setting up test data');
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Setup Test Data
                  </Button>
                </div>

                <div className="space-y-4">
                  {persona.testScenarios.map((scenario) => {
                    const isRunning = runningTests.has(scenario.id);
                    const result = testResults[scenario.id];
                    
                    return (
                      <Card key={scenario.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{scenario.title}</CardTitle>
                              <CardDescription>{scenario.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {isRunning && (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                  <span className="text-sm text-muted-foreground">Running...</span>
                                </div>
                              )}
                              {result && (
                                <Badge variant={result.success ? "default" : "destructive"}>
                                  {result.success ? "Passed" : "Failed"}
                                </Badge>
                              )}
                              <Button
                                size="sm"
                                onClick={() => runTestScenario(persona.id, scenario.id)}
                                disabled={isRunning}
                              >
                                {isRunning ? "Running..." : "Run Test"}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-2">Test Endpoints:</h4>
                              <div className="flex flex-wrap gap-2">
                                {scenario.endpoints.map((endpoint, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {endpoint}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Expected Results:</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {scenario.expectedResults.map((result, index) => (
                                  <li key={index}>{result}</li>
                                ))}
                              </ul>
                            </div>

                            {result && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Test Results:</h4>
                                <div className="space-y-2">
                                  {result.summary && (
                                    <div className="flex items-center gap-4 mb-3 p-2 bg-background rounded">
                                      <div className="text-sm">
                                        <span className="font-medium">Total Tests:</span> {result.summary.totalTests}
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium text-green-600">Passed:</span> {result.summary.passed}
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium text-red-600">Failed:</span> {result.summary.failed}
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium">Avg Response:</span> {result.summary.averageResponseTime?.toFixed(0)}ms
                                      </div>
                                    </div>
                                  )}
                                  {result.results?.map((endpointResult: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          variant={endpointResult.status === 'success' ? 'default' : 'destructive'}
                                          className="text-xs"
                                        >
                                          {endpointResult.status}
                                        </Badge>
                                        <span className="text-sm font-mono">{endpointResult.endpoint}</span>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {endpointResult.responseTime}ms
                                      </div>
                                    </div>
                                  ))}
                                  {result.error && (
                                    <div className="text-sm text-destructive p-2 bg-red-50 rounded">
                                      Error: {result.error}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
          <CardDescription>Overall test results and system health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(testResults).filter(r => r.success).length}
              </div>
              <div className="text-sm text-muted-foreground">Passed Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => !r.success).length}
              </div>
              <div className="text-sm text-muted-foreground">Failed Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {runningTests.size}
              </div>
              <div className="text-sm text-muted-foreground">Running Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {testPersonas.length}
              </div>
              <div className="text-sm text-muted-foreground">Practice Types</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 