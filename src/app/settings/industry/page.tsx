'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Stethoscope, 
  Scale, 
  Calculator, 
  Home, 
  Users, 
  Palette, 
  Code,
  Settings,
  Workflow,
  FileText,
  CreditCard,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Zap,
  Shield
} from 'lucide-react';
import React from 'react';

interface Industry {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  compliance: string[];
}

interface IndustryConfig {
  industryId: string;
  settings: any;
  workflows: string[];
  templates: string[];
  billingModel: any;
  compliance: any;
  terminology: any;
}

const industries: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    code: 'healthcare',
    description: 'Medical offices, dental practices, veterinary clinics',
    icon: 'Stethoscope',
    color: '#10B981',
    features: ['Patient Management', 'Appointment Scheduling', 'Insurance Billing', 'HIPAA Compliance'],
    compliance: ['HIPAA', 'HITECH', 'State Medical Regulations']
  },
  {
    id: 'legal',
    name: 'Legal',
    code: 'legal',
    description: 'Law firms, solo practitioners, legal consultants',
    icon: 'Scale',
    color: '#3B82F6',
    features: ['Case Management', 'Court Scheduling', 'Document Automation', 'Client Billing'],
    compliance: ['Attorney Ethics Rules', 'Client Confidentiality', 'Court Filing Requirements']
  },
  {
    id: 'financial',
    name: 'Financial Services',
    code: 'financial',
    description: 'Accounting firms, financial advisors, tax preparers',
    icon: 'Calculator',
    color: '#F59E0B',
    features: ['Tax Season Workflows', 'Client Portfolio Management', 'Regulatory Compliance', 'Financial Reporting'],
    compliance: ['IRS Regulations', 'SEC Requirements', 'State Tax Laws', 'Financial Privacy']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    code: 'real-estate',
    description: 'Real estate agents, property managers, brokers',
    icon: 'Home',
    color: '#8B5CF6',
    features: ['Property Management', 'Showing Scheduling', 'Commission Tracking', 'Transaction Management'],
    compliance: ['Real Estate Licensing', 'Fair Housing Laws', 'Property Disclosure Requirements']
  },
  {
    id: 'consulting',
    name: 'Consulting & Professional Services',
    code: 'consulting',
    description: 'Management consultants, IT consultants, marketing agencies',
    icon: 'Users',
    color: '#EF4444',
    features: ['Project Management', 'Time Tracking', 'Client Collaboration', 'Resource Planning'],
    compliance: ['Professional Licensing', 'Client Confidentiality', 'Industry Standards']
  },
  {
    id: 'creative',
    name: 'Creative & Media',
    code: 'creative',
    description: 'Design agencies, marketing firms, content creators',
    icon: 'Palette',
    color: '#EC4899',
    features: ['Creative Asset Management', 'Project Billing', 'Client Approval Workflows', 'Portfolio Management'],
    compliance: ['Copyright Protection', 'Client IP Rights', 'Creative Licensing']
  },
  {
    id: 'technology',
    name: 'Technology & Startups',
    code: 'technology',
    description: 'Software companies, tech startups, IT services',
    icon: 'Code',
    color: '#06B6D4',
    features: ['Agile Project Management', 'Development Time Tracking', 'Client Management', 'Technical Documentation'],
    compliance: ['Data Privacy', 'Software Licensing', 'Technical Standards']
  }
];

const industryWorkflows = {
  healthcare: [
    { name: 'Patient Intake', description: 'New patient registration and initial assessment' },
    { name: 'Appointment Scheduling', description: 'Schedule and manage patient appointments' },
    { name: 'Treatment Planning', description: 'Create and track treatment plans' },
    { name: 'Insurance Billing', description: 'Process insurance claims and payments' },
    { name: 'Follow-up Care', description: 'Schedule and track follow-up appointments' }
  ],
  legal: [
    { name: 'Case Intake', description: 'Initial client consultation and case assessment' },
    { name: 'Document Preparation', description: 'Create and manage legal documents' },
    { name: 'Court Scheduling', description: 'Schedule court appearances and deadlines' },
    { name: 'Client Billing', description: 'Time tracking and client billing' },
    { name: 'Case Resolution', description: 'Track case progress and outcomes' }
  ],
  financial: [
    { name: 'Tax Preparation', description: 'Complete tax return preparation workflow' },
    { name: 'Financial Planning', description: 'Client financial planning and analysis' },
    { name: 'Audit Support', description: 'Support for financial audits' },
    { name: 'Compliance Reporting', description: 'Regulatory compliance and reporting' },
    { name: 'Client Portfolio Management', description: 'Manage client investment portfolios' }
  ],
  'real-estate': [
    { name: 'Property Listing', description: 'Create and manage property listings' },
    { name: 'Showing Management', description: 'Schedule and track property showings' },
    { name: 'Transaction Processing', description: 'Handle real estate transactions' },
    { name: 'Commission Tracking', description: 'Track and calculate commissions' },
    { name: 'Client Management', description: 'Manage buyer and seller relationships' }
  ],
  consulting: [
    { name: 'Project Initiation', description: 'Start new consulting projects' },
    { name: 'Client Discovery', description: 'Understand client needs and requirements' },
    { name: 'Solution Development', description: 'Develop and present solutions' },
    { name: 'Implementation', description: 'Execute consulting recommendations' },
    { name: 'Project Closure', description: 'Complete projects and document outcomes' }
  ],
  creative: [
    { name: 'Creative Brief', description: 'Develop creative project briefs' },
    { name: 'Design Process', description: 'Manage design and creative work' },
    { name: 'Client Review', description: 'Client feedback and approval process' },
    { name: 'Asset Delivery', description: 'Deliver final creative assets' },
    { name: 'Project Billing', description: 'Bill for creative services' }
  ],
  technology: [
    { name: 'Requirements Gathering', description: 'Collect and document requirements' },
    { name: 'Development Sprint', description: 'Agile development sprints' },
    { name: 'Testing & QA', description: 'Quality assurance and testing' },
    { name: 'Deployment', description: 'Software deployment and release' },
    { name: 'Maintenance', description: 'Ongoing maintenance and support' }
  ]
};

const industryTasks = {
  healthcare: [
    { name: 'Patient Registration', category: 'Administrative', estimatedHours: 0.5, isBillable: false },
    { name: 'Medical History Review', category: 'Clinical', estimatedHours: 1.0, isBillable: true },
    { name: 'Treatment Planning', category: 'Clinical', estimatedHours: 2.0, isBillable: true },
    { name: 'Insurance Verification', category: 'Administrative', estimatedHours: 0.5, isBillable: false },
    { name: 'Follow-up Appointment', category: 'Clinical', estimatedHours: 0.5, isBillable: true }
  ],
  legal: [
    { name: 'Client Consultation', category: 'Client Relations', estimatedHours: 1.0, isBillable: true },
    { name: 'Document Review', category: 'Legal Work', estimatedHours: 2.0, isBillable: true },
    { name: 'Court Filing', category: 'Administrative', estimatedHours: 0.5, isBillable: true },
    { name: 'Legal Research', category: 'Legal Work', estimatedHours: 3.0, isBillable: true },
    { name: 'Client Communication', category: 'Client Relations', estimatedHours: 0.5, isBillable: true }
  ],
  financial: [
    { name: 'Tax Return Preparation', category: 'Tax Work', estimatedHours: 4.0, isBillable: true },
    { name: 'Financial Analysis', category: 'Analysis', estimatedHours: 2.0, isBillable: true },
    { name: 'Client Meeting', category: 'Client Relations', estimatedHours: 1.0, isBillable: true },
    { name: 'Compliance Review', category: 'Compliance', estimatedHours: 1.5, isBillable: true },
    { name: 'Document Preparation', category: 'Administrative', estimatedHours: 1.0, isBillable: true }
  ],
  'real-estate': [
    { name: 'Property Showing', category: 'Sales', estimatedHours: 1.0, isBillable: false },
    { name: 'Client Consultation', category: 'Client Relations', estimatedHours: 1.0, isBillable: false },
    { name: 'Document Preparation', category: 'Administrative', estimatedHours: 2.0, isBillable: true },
    { name: 'Market Analysis', category: 'Research', estimatedHours: 3.0, isBillable: true },
    { name: 'Transaction Coordination', category: 'Sales', estimatedHours: 4.0, isBillable: true }
  ],
  consulting: [
    { name: 'Project Planning', category: 'Planning', estimatedHours: 4.0, isBillable: true },
    { name: 'Client Discovery', category: 'Analysis', estimatedHours: 8.0, isBillable: true },
    { name: 'Solution Development', category: 'Development', estimatedHours: 16.0, isBillable: true },
    { name: 'Presentation Preparation', category: 'Communication', estimatedHours: 4.0, isBillable: true },
    { name: 'Implementation Support', category: 'Support', estimatedHours: 8.0, isBillable: true }
  ],
  creative: [
    { name: 'Creative Brief Development', category: 'Planning', estimatedHours: 2.0, isBillable: true },
    { name: 'Design Concept Development', category: 'Creative', estimatedHours: 8.0, isBillable: true },
    { name: 'Client Review Meeting', category: 'Communication', estimatedHours: 1.0, isBillable: true },
    { name: 'Design Revisions', category: 'Creative', estimatedHours: 4.0, isBillable: true },
    { name: 'Final Asset Preparation', category: 'Production', estimatedHours: 2.0, isBillable: true }
  ],
  technology: [
    { name: 'Requirements Analysis', category: 'Planning', estimatedHours: 8.0, isBillable: true },
    { name: 'System Design', category: 'Development', estimatedHours: 16.0, isBillable: true },
    { name: 'Coding', category: 'Development', estimatedHours: 40.0, isBillable: true },
    { name: 'Testing', category: 'Quality Assurance', estimatedHours: 8.0, isBillable: true },
    { name: 'Deployment', category: 'Operations', estimatedHours: 4.0, isBillable: true }
  ]
};

const industryDeliverables = {
  healthcare: [
    { name: 'Patient Records', type: 'DOCUMENT', description: 'Comprehensive patient medical records' },
    { name: 'Treatment Plans', type: 'DOCUMENT', description: 'Detailed treatment plans and protocols' },
    { name: 'Insurance Claims', type: 'DOCUMENT', description: 'Insurance claim forms and documentation' },
    { name: 'Medical Certificates', type: 'CERTIFICATE', description: 'Medical certificates and reports' },
    { name: 'Billing Statements', type: 'INVOICE', description: 'Patient billing statements' }
  ],
  legal: [
    { name: 'Legal Documents', type: 'DOCUMENT', description: 'Contracts, agreements, and legal filings' },
    { name: 'Case Briefs', type: 'DOCUMENT', description: 'Legal case briefs and summaries' },
    { name: 'Client Contracts', type: 'CONTRACT', description: 'Client engagement agreements' },
    { name: 'Court Filings', type: 'DOCUMENT', description: 'Court documents and filings' },
    { name: 'Legal Opinions', type: 'DOCUMENT', description: 'Legal opinions and advice' }
  ],
  financial: [
    { name: 'Tax Returns', type: 'DOCUMENT', description: 'Completed tax return forms' },
    { name: 'Financial Reports', type: 'REPORT', description: 'Financial analysis and reports' },
    { name: 'Audit Reports', type: 'REPORT', description: 'Audit findings and recommendations' },
    { name: 'Investment Portfolios', type: 'REPORT', description: 'Investment portfolio analysis' },
    { name: 'Compliance Reports', type: 'REPORT', description: 'Regulatory compliance reports' }
  ],
  'real-estate': [
    { name: 'Property Listings', type: 'DOCUMENT', description: 'Property listing descriptions and photos' },
    { name: 'Purchase Agreements', type: 'CONTRACT', description: 'Real estate purchase contracts' },
    { name: 'Market Analysis', type: 'REPORT', description: 'Property market analysis reports' },
    { name: 'Closing Documents', type: 'DOCUMENT', description: 'Real estate closing documentation' },
    { name: 'Commission Statements', type: 'REPORT', description: 'Commission calculation statements' }
  ],
  consulting: [
    { name: 'Project Proposals', type: 'PROPOSAL', description: 'Consulting project proposals' },
    { name: 'Analysis Reports', type: 'REPORT', description: 'Business analysis and recommendations' },
    { name: 'Implementation Plans', type: 'DOCUMENT', description: 'Project implementation plans' },
    { name: 'Progress Reports', type: 'REPORT', description: 'Project progress and status reports' },
    { name: 'Final Deliverables', type: 'DOCUMENT', description: 'Final project deliverables' }
  ],
  creative: [
    { name: 'Design Concepts', type: 'DOCUMENT', description: 'Creative design concepts and mockups' },
    { name: 'Brand Guidelines', type: 'DOCUMENT', description: 'Brand identity and style guides' },
    { name: 'Marketing Materials', type: 'DOCUMENT', description: 'Marketing collateral and materials' },
    { name: 'Digital Assets', type: 'DOCUMENT', description: 'Digital design files and assets' },
    { name: 'Creative Presentations', type: 'PRESENTATION', description: 'Creative work presentations' }
  ],
  technology: [
    { name: 'Technical Specifications', type: 'DOCUMENT', description: 'System and software specifications' },
    { name: 'User Documentation', type: 'DOCUMENT', description: 'User manuals and guides' },
    { name: 'Code Deliverables', type: 'DOCUMENT', description: 'Software code and applications' },
    { name: 'Test Reports', type: 'REPORT', description: 'Testing and quality assurance reports' },
    { name: 'Deployment Guides', type: 'DOCUMENT', description: 'System deployment documentation' }
  ]
};

const industryBillingModels = {
  healthcare: [
    { name: 'Fee-for-Service', type: 'FIXED', description: 'Fixed fees for specific services' },
    { name: 'Insurance Billing', type: 'PERCENTAGE', description: 'Percentage-based insurance billing' },
    { name: 'Retainer Model', type: 'RETAINER', description: 'Monthly retainer for ongoing care' }
  ],
  legal: [
    { name: 'Hourly Billing', type: 'HOURLY', description: 'Time-based hourly billing' },
    { name: 'Fixed Fee', type: 'FIXED', description: 'Fixed fees for specific legal services' },
    { name: 'Contingency', type: 'CONTINGENCY', description: 'Contingency-based fee arrangements' },
    { name: 'Retainer', type: 'RETAINER', description: 'Monthly retainer for ongoing legal services' }
  ],
  financial: [
    { name: 'Hourly Billing', type: 'HOURLY', description: 'Time-based hourly billing for services' },
    { name: 'Fixed Fee', type: 'FIXED', description: 'Fixed fees for tax preparation and consulting' },
    { name: 'Percentage of Assets', type: 'PERCENTAGE', description: 'Percentage-based asset management fees' },
    { name: 'Value-Based', type: 'VALUE_BASED', description: 'Value-based pricing for complex projects' }
  ],
  'real-estate': [
    { name: 'Commission-Based', type: 'PERCENTAGE', description: 'Percentage-based commission on sales' },
    { name: 'Fixed Fee', type: 'FIXED', description: 'Fixed fees for specific services' },
    { name: 'Hourly Consulting', type: 'HOURLY', description: 'Hourly rates for consulting services' }
  ],
  consulting: [
    { name: 'Hourly Billing', type: 'HOURLY', description: 'Time-based hourly billing' },
    { name: 'Project-Based', type: 'FIXED', description: 'Fixed project fees' },
    { name: 'Value-Based', type: 'VALUE_BASED', description: 'Value-based pricing for outcomes' },
    { name: 'Retainer', type: 'RETAINER', description: 'Monthly retainer for ongoing services' }
  ],
  creative: [
    { name: 'Project-Based', type: 'FIXED', description: 'Fixed fees for creative projects' },
    { name: 'Hourly Billing', type: 'HOURLY', description: 'Time-based hourly billing' },
    { name: 'Value-Based', type: 'VALUE_BASED', description: 'Value-based pricing for creative work' },
    { name: 'Subscription', type: 'SUBSCRIPTION', description: 'Monthly subscription for ongoing services' }
  ],
  technology: [
    { name: 'Hourly Billing', type: 'HOURLY', description: 'Time-based hourly billing for development' },
    { name: 'Project-Based', type: 'FIXED', description: 'Fixed project fees' },
    { name: 'Subscription', type: 'SUBSCRIPTION', description: 'Monthly subscription for ongoing support' },
    { name: 'Usage-Based', type: 'USAGE_BASED', description: 'Usage-based pricing for services' }
  ]
};

export default function IndustrySettingsPage() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('accounting');
  const [industryConfig, setIndustryConfig] = useState<IndustryConfig | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load user's current industry configuration
    if (user) {
      loadIndustryConfig();
    }
  }, [user]);

  const loadIndustryConfig = async () => {
    try {
      const response = await fetch('/api/industry/config');
      const data = await response.json();
      
      if (data.config) {
        setIndustryConfig(data.config);
        setSelectedIndustry(data.config.industry.code);
      }
    } catch (error) {
      console.error('Error loading industry config:', error);
    }
  };

  const handleIndustrySelect = async (industryCode: string) => {
    setLoading(true);
    try {
      setSelectedIndustry(industryCode);
      setIndustryConfig({
        industryId: industryCode,
        settings: {},
        workflows: [],
        templates: [],
        billingModel: {},
        compliance: {},
        terminology: {}
      });
    } catch (error) {
      console.error('Error selecting industry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedIndustryData || !industryConfig) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/industry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryId: selectedIndustryData.id,
          settings: industryConfig.settings,
          workflows: industryConfig.workflows,
          templates: industryConfig.templates,
          billingModel: industryConfig.billingModel,
          compliance: industryConfig.compliance,
          terminology: industryConfig.terminology
        })
      });

      if (response.ok) {
        // Reload the configuration
        await loadIndustryConfig();
      } else {
        console.error('Error saving configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIndustryIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Stethoscope,
      Scale,
      Calculator,
      Home,
      Users,
      Palette,
      Code
    };
    return iconMap[iconName] || Building2;
  };

  const selectedIndustryData = industries.find(i => i.code === selectedIndustry);
  const workflows = selectedIndustryData ? industryWorkflows[selectedIndustryData.code as keyof typeof industryWorkflows] || [] : [];
  const tasks = selectedIndustryData ? industryTasks[selectedIndustryData.code as keyof typeof industryTasks] || [] : [];
  const deliverables = selectedIndustryData ? industryDeliverables[selectedIndustryData.code as keyof typeof industryDeliverables] || [] : [];
  const billingModels = selectedIndustryData ? industryBillingModels[selectedIndustryData.code as keyof typeof industryBillingModels] || [] : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Industry Configuration</h1>
          <p className="text-gray-600">Configure your practice for your specific industry</p>
        </div>
      </div>

      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Select Your Industry</span>
          </CardTitle>
          <CardDescription>
            Choose your business type to configure industry-specific workflows, tasks, and billing models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => {
              const IconComponent = getIndustryIcon(industry.icon);
              return (
                <Card
                  key={industry.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedIndustry === industry.code ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleIndustrySelect(industry.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${industry.color}20`, color: industry.color }}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{industry.name}</h3>
                        <p className="text-sm text-gray-600">{industry.description}</p>
                      </div>
                      {selectedIndustry === industry.code && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Industry Configuration */}
      {selectedIndustryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${selectedIndustryData.color}20`, color: selectedIndustryData.color }}
              >
                {React.createElement(getIndustryIcon(selectedIndustryData.icon), { className: "w-5 h-5" })}
              </div>
              <span>{selectedIndustryData.name} Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure industry-specific workflows, tasks, deliverables, and billing models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <div className="space-y-2">
                      {selectedIndustryData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Compliance</h4>
                    <div className="space-y-2">
                      {selectedIndustryData.compliance.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="workflows" className="space-y-4">
                <div className="space-y-4">
                  {workflows.map((workflow, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{workflow.name}</h4>
                            <p className="text-sm text-gray-600">{workflow.description}</p>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{task.name}</h4>
                            <p className="text-sm text-gray-600">{task.category} • {task.estimatedHours}h</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={task.isBillable ? "default" : "secondary"}>
                              {task.isBillable ? "Billable" : "Non-billable"}
                            </Badge>
                            <Switch />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="deliverables" className="space-y-4">
                <div className="space-y-4">
                  {deliverables.map((deliverable, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{deliverable.name}</h4>
                            <p className="text-sm text-gray-600">{deliverable.description}</p>
                            <Badge variant="outline" className="mt-1">{deliverable.type}</Badge>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="billing" className="space-y-4">
                <div className="space-y-4">
                  {billingModels.map((model, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{model.name}</h4>
                            <p className="text-sm text-gray-600">{model.description}</p>
                            <Badge variant="outline" className="mt-1">{model.type}</Badge>
                          </div>
                          <Switch />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* AI Configuration */}
      {selectedIndustryData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Industry Optimization</span>
            </CardTitle>
            <CardDescription>
              Let AI help you optimize your workflows and processes for your industry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Smart Workflow Suggestions</h4>
                <p className="text-sm text-gray-600 mb-3">
                  AI will analyze your business patterns and suggest optimized workflows
                </p>
                <Button size="sm" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Enable AI Suggestions
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Automated Task Categorization</h4>
                <p className="text-sm text-gray-600 mb-3">
                  AI will automatically categorize your tasks and time entries
                </p>
                <Button size="sm" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Enable Auto-Categorization
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Configuration */}
      {selectedIndustryData && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Save Configuration</h3>
                <p className="text-sm text-gray-600">
                  Save your industry configuration to apply it across your practice
                </p>
              </div>
              <Button size="lg" disabled={loading} onClick={handleSaveConfiguration}>
                {loading ? 'Saving...' : 'Save Configuration'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 