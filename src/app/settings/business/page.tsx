'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Settings, 
  Users, 
  Calendar, 
  Brain, 
  Zap,
  Save,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Target,
  Clock,
  FileText
} from 'lucide-react';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';

interface IndustryConfig {
  defaultJobTypes: string[];
  defaultTaskTypes: string[];
  defaultClientTypes: string[];
  defaultCategories: string[];
  aiFocusAreas: string[];
  aiKeywords: string[];
  appointmentTypes: string[];
  defaultDuration: number;
}

interface BusinessSettings {
  id?: string;
  industryType: string;
  industryName?: string;
  industryDescription?: string;
  defaultJobTypes: string[];
  defaultTaskTypes: string[];
  defaultClientTypes: string[];
  defaultCategories: string[];
  aiFocusAreas: string[];
  aiKeywords: string[];
  appointmentTypes: string[];
  defaultDuration?: number;
  autoAssignTasks: boolean;
  autoCreateInvoices: boolean;
  autoSendReminders: boolean;
  customJobFields?: string;
  customClientFields?: string;
  customTaskFields?: string;
  businessHours?: string;
}

const industryOptions = [
  { value: 'E_COMMERCE', label: 'E-commerce', description: 'Online retail and digital sales' },
  { value: 'BRICK_AND_MORTAR', label: 'Brick & Mortar', description: 'Physical retail locations' },
  { value: 'SERVICE_CONTRACTOR', label: 'Service Contractor', description: 'Construction and trade services' },
  { value: 'CREATIVE_FREELANCER', label: 'Creative Freelancer', description: 'Design and creative services' },
  { value: 'RETAIL_STORE', label: 'Retail Store', description: 'General retail operations' },
  { value: 'HEALTHCARE_FAMILY_PHYSICIAN', label: 'Family Physician', description: 'Primary care medical practice' },
  { value: 'HEALTHCARE_DENTAL_PRACTICE', label: 'Dental Practice', description: 'Dental care services' },
  { value: 'HEALTHCARE_PHYSICAL_THERAPY', label: 'Physical Therapy', description: 'Rehabilitation services' },
  { value: 'LEGAL_FAMILY_LAWYER', label: 'Family Lawyer', description: 'Family law practice' },
  { value: 'LEGAL_CRIMINAL_LAWYER', label: 'Criminal Lawyer', description: 'Criminal defense practice' },
  { value: 'LEGAL_CORPORATE_LAWYER', label: 'Corporate Lawyer', description: 'Corporate legal services' },
  { value: 'ACCOUNTING_CPA_FIRM', label: 'CPA Firm', description: 'Certified public accounting' },
  { value: 'ACCOUNTING_BOOKKEEPING_SERVICE', label: 'Bookkeeping Service', description: 'Bookkeeping and accounting services' },
  { value: 'ACCOUNTING_FINANCIAL_ADVISOR', label: 'Financial Advisor', description: 'Financial planning and investment' },
  { value: 'CREATIVE_VIDEO_PRODUCTION', label: 'Video Production', description: 'Video and film production' },
  { value: 'CREATIVE_PODCAST_STUDIO', label: 'Podcast Studio', description: 'Audio and podcast production' },
  { value: 'REAL_ESTATE_AGENT', label: 'Real Estate Agent', description: 'Property sales and leasing' },
  { value: 'REAL_ESTATE_PROPERTY_MANAGEMENT', label: 'Property Management', description: 'Property management services' },
  { value: 'AUTOMOTIVE_AUTO_REPAIR', label: 'Auto Repair', description: 'Automotive repair services' },
  { value: 'CONSULTING_FIRM', label: 'Consulting Firm', description: 'Business consulting services' },
  { value: 'OTHER', label: 'Other', description: 'Custom business type' }
];

export default function BusinessSettingsPage() {
  const { user, loading: authLoading } = useSimpleAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings>({
    industryType: '',
    industryName: '',
    industryDescription: '',
    defaultJobTypes: [],
    defaultTaskTypes: [],
    defaultClientTypes: [],
    defaultCategories: [],
    aiFocusAreas: [],
    aiKeywords: [],
    appointmentTypes: [],
    defaultDuration: 60,
    autoAssignTasks: false,
    autoCreateInvoices: false,
    autoSendReminders: false
  });
  const [industryConfigs, setIndustryConfigs] = useState<Record<string, IndustryConfig>>({});
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  const fetchBusinessSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/business');
      const data = await response.json();
      
      if (data.businessSettings) {
        setSettings(data.businessSettings);
        setSelectedIndustry(data.businessSettings.industryType);
      }
      
      if (data.industryConfigs) {
        setIndustryConfigs(data.industryConfigs);
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryChange = (industryType: string) => {
    setSelectedIndustry(industryType);
    const config = industryConfigs[industryType];
    
    if (config) {
      setSettings(prev => ({
        ...prev,
        industryType,
        defaultJobTypes: config.defaultJobTypes,
        defaultTaskTypes: config.defaultTaskTypes,
        defaultClientTypes: config.defaultClientTypes,
        defaultCategories: config.defaultCategories,
        aiFocusAreas: config.aiFocusAreas,
        aiKeywords: config.aiKeywords,
        appointmentTypes: config.appointmentTypes,
        defaultDuration: config.defaultDuration
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryType: settings.industryType,
          industryName: settings.industryName,
          industryDescription: settings.industryDescription,
          customSettings: {
            defaultJobTypes: settings.defaultJobTypes,
            defaultTaskTypes: settings.defaultTaskTypes,
            defaultClientTypes: settings.defaultClientTypes,
            defaultCategories: settings.defaultCategories,
            aiFocusAreas: settings.aiFocusAreas,
            aiKeywords: settings.aiKeywords,
            appointmentTypes: settings.appointmentTypes,
            defaultDuration: settings.defaultDuration,
            autoAssignTasks: settings.autoAssignTasks,
            autoCreateInvoices: settings.autoCreateInvoices,
            autoSendReminders: settings.autoSendReminders,
            customJobFields: settings.customJobFields,
            customClientFields: settings.customClientFields,
            customTaskFields: settings.customTaskFields,
            businessHours: settings.businessHours
          }
        }),
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderArrayField = (title: string, items: string[], onChange: (items: string[]) => void) => (
    <div className="space-y-2">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-200">
            {item}
          </Badge>
        ))}
      </div>
      <Textarea
        placeholder={`Enter ${title.toLowerCase()} (one per line)`}
        value={items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').filter(item => item.trim()))}
        rows={3}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
          <p className="text-gray-600">Configure industry-specific settings for your practice management</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>

      <Tabs defaultValue="industry" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="industry" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Industry</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI & Automation</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </TabsTrigger>
        </TabsList>

        {/* Industry Configuration */}
        <TabsContent value="industry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Industry Configuration</span>
              </CardTitle>
              <CardDescription>
                Select your business type to customize workflows, categories, and AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry">Business Type</Label>
                  <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industryName">Business Name</Label>
                    <Input
                      id="industryName"
                      value={settings.industryName || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, industryName: e.target.value }))}
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultDuration">Default Appointment Duration (minutes)</Label>
                    <Input
                      id="defaultDuration"
                      type="number"
                      value={settings.defaultDuration || 60}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) || 60 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="industryDescription">Business Description</Label>
                  <Textarea
                    id="industryDescription"
                    value={settings.industryDescription || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, industryDescription: e.target.value }))}
                    placeholder="Describe your business and services"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Configuration */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Workflow Configuration</span>
              </CardTitle>
              <CardDescription>
                Customize job types, task types, client types, and categories for your industry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(
                'Job Types',
                settings.defaultJobTypes,
                (items) => setSettings(prev => ({ ...prev, defaultJobTypes: items }))
              )}
              
              <Separator />
              
              {renderArrayField(
                'Task Types',
                settings.defaultTaskTypes,
                (items) => setSettings(prev => ({ ...prev, defaultTaskTypes: items }))
              )}
              
              <Separator />
              
              {renderArrayField(
                'Client Types',
                settings.defaultClientTypes,
                (items) => setSettings(prev => ({ ...prev, defaultClientTypes: items }))
              )}
              
              <Separator />
              
              {renderArrayField(
                'Categories',
                settings.defaultCategories,
                (items) => setSettings(prev => ({ ...prev, defaultCategories: items }))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI & Automation Configuration */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI & Automation Settings</span>
              </CardTitle>
              <CardDescription>
                Configure AI focus areas, keywords, and automation features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(
                'AI Focus Areas',
                settings.aiFocusAreas,
                (items) => setSettings(prev => ({ ...prev, aiFocusAreas: items }))
              )}
              
              <Separator />
              
              {renderArrayField(
                'AI Keywords',
                settings.aiKeywords,
                (items) => setSettings(prev => ({ ...prev, aiKeywords: items }))
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Automation Features</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoAssignTasks">Auto-assign Tasks</Label>
                      <p className="text-sm text-gray-600">Automatically assign tasks based on workload</p>
                    </div>
                    <Switch
                      id="autoAssignTasks"
                      checked={settings.autoAssignTasks}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoAssignTasks: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoCreateInvoices">Auto-create Invoices</Label>
                      <p className="text-sm text-gray-600">Automatically generate invoices for completed jobs</p>
                    </div>
                    <Switch
                      id="autoCreateInvoices"
                      checked={settings.autoCreateInvoices}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoCreateInvoices: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSendReminders">Auto-send Reminders</Label>
                      <p className="text-sm text-gray-600">Automatically send appointment and task reminders</p>
                    </div>
                    <Switch
                      id="autoSendReminders"
                      checked={settings.autoSendReminders}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSendReminders: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Configuration */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Calendar Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure appointment types and calendar settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(
                'Appointment Types',
                settings.appointmentTypes,
                (items) => setSettings(prev => ({ ...prev, appointmentTypes: items }))
              )}
              
              <Separator />
              
              <div>
                <Label htmlFor="businessHours">Business Hours (JSON)</Label>
                <Textarea
                  id="businessHours"
                  value={settings.businessHours || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, businessHours: e.target.value }))}
                  placeholder='{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}}'
                  rows={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter business hours as JSON format
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Card */}
      {selectedIndustry && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <CheckCircle className="w-5 h-5" />
              <span>Configuration Preview</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Preview of your industry-specific settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Job Types</h4>
                <div className="mt-2 space-y-1">
                  {settings.defaultJobTypes.slice(0, 3).map((type, index) => (
                    <div key={index} className="text-sm text-blue-700">{type}</div>
                  ))}
                  {settings.defaultJobTypes.length > 3 && (
                    <div className="text-sm text-blue-600">+{settings.defaultJobTypes.length - 3} more</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Client Types</h4>
                <div className="mt-2 space-y-1">
                  {settings.defaultClientTypes.slice(0, 3).map((type, index) => (
                    <div key={index} className="text-sm text-blue-700">{type}</div>
                  ))}
                  {settings.defaultClientTypes.length > 3 && (
                    <div className="text-sm text-blue-600">+{settings.defaultClientTypes.length - 3} more</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">AI Focus</h4>
                <div className="mt-2 space-y-1">
                  {settings.aiFocusAreas.slice(0, 2).map((area, index) => (
                    <div key={index} className="text-sm text-blue-700">{area}</div>
                  ))}
                  {settings.aiFocusAreas.length > 2 && (
                    <div className="text-sm text-blue-600">+{settings.aiFocusAreas.length - 2} more</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Appointments</h4>
                <div className="mt-2 space-y-1">
                  {settings.appointmentTypes.slice(0, 2).map((type, index) => (
                    <div key={index} className="text-sm text-blue-700">{type}</div>
                  ))}
                  {settings.appointmentTypes.length > 2 && (
                    <div className="text-sm text-blue-600">+{settings.appointmentTypes.length - 2} more</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 