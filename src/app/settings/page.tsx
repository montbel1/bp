'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  CreditCard, 
  Shield, 
  Users, 
  Zap, 
  CheckCircle,
  Crown,
  Star,
  Building2,
  Brain,
  Stethoscope,
  Scale,
  Calculator,
  Home,
  Palette,
  Code
} from 'lucide-react';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';
import { useSearchParams } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading: authLoading } = useSimpleAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('Avanee Books Pro');
  const [savingCompany, setSavingCompany] = useState(false);
  
  // Development bypass
  const isDevelopment = process.env.NODE_ENV === "development";
  
  const [subscription, setSubscription] = useState({
    type: 'BASIC',
    flowAccess: false,
  });

  useEffect(() => {
    if (user) {
      setSubscription({
        type: user.subscription || 'BASIC',
        flowAccess: isDevelopment ? true : (user.flowAccess || false),
      });
      
      // Load company name from session if available
      if (user.companyName) {
        setCompanyName(user.companyName);
      }
    }
  }, [user, isDevelopment]);

  const handleCompanyNameSave = async () => {
    setSavingCompany(true);
    try {
      // Save to database via API
      const response = await fetch('/api/settings/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update session with new company name
        // This part of the logic needs to be adapted to the new auth system
        // For now, we'll just update the state
        setCompanyName(data.companyName);
      }
    } catch (error) {
      console.error('Error saving company name:', error);
    } finally {
      setSavingCompany(false);
    }
  };

  const handleUpgrade = async (module: string) => {
    setLoading(true);
    try {
      // Simulate API call to upgrade subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update session
      // This part of the logic needs to be adapted to the new auth system
      // For now, we'll just update the state
      setSubscription(prev => ({
        ...prev,
        type: 'PROFESSIONAL',
        flowAccess: module === 'flow' ? true : prev.flowAccess,
      }));

      // Redirect to the module if upgrading from upgrade prompt
      if (searchParams.get('upgrade') === 'flow') {
        window.location.href = '/flow';
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionFeatures = (type: string) => {
    switch (type) {
      case 'BASIC':
        return [
          'Basic accounting features',
          'Up to 100 transactions/month',
          'Basic reporting',
          'Email support',
        ];
      case 'PROFESSIONAL':
        return [
          'All Basic features',
          'Unlimited transactions',
          'Advanced reporting',
          'Practice Management (Flow)',
          'Team collaboration',
          'Priority support',
        ];
      case 'ENTERPRISE':
        return [
          'All Professional features',
          'Custom integrations',
          'Dedicated support',
          'Custom branding',
          'Advanced analytics',
          'API access',
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
          {isDevelopment && (
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Development Mode
              </Badge>
              <span className="text-sm text-orange-600">Full access enabled for testing</span>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Subscription & Billing</span>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">
                  {subscription.type === 'BASIC' ? 'Basic Plan' : 
                   subscription.type === 'PROFESSIONAL' ? 'Professional Plan' : 'Enterprise Plan'}
                </h3>
                <Badge variant={subscription.type === 'BASIC' ? 'secondary' : 'default'}>
                  {subscription.type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {subscription.type === 'BASIC' ? '$9/month' : 
                 subscription.type === 'PROFESSIONAL' ? '$29/month' : 'Custom pricing'}
              </p>
            </div>
            {subscription.type === 'BASIC' && (
              <Button onClick={() => handleUpgrade('professional')} disabled={loading}>
                {loading ? 'Upgrading...' : 'Upgrade'}
              </Button>
            )}
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium mb-3">Current Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getSubscriptionFeatures(subscription.type).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Industry Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your practice for your specific industry with tailored workflows and processes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Industry-Specific Setup</h4>
                <p className="text-sm text-gray-600">
                  Configure workflows, tasks, and billing models for your industry
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/settings/industry'}
              >
                Configure
              </Button>
            </div>
          </div>

          {/* Industry Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 border rounded-lg text-center">
              <Stethoscope className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <span className="text-xs font-medium">Healthcare</span>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Scale className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <span className="text-xs font-medium">Legal</span>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Calculator className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <span className="text-xs font-medium">Financial</span>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <Home className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <span className="text-xs font-medium">Real Estate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Module Access</span>
          </CardTitle>
          <CardDescription>
            Enable or disable additional modules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Practice Management */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Practice Management (Flow)</h4>
                <p className="text-sm text-gray-600">
                  Advanced practice management with job tracking, team collaboration, and workflow automation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {subscription.flowAccess ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              ) : (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">PRO</Badge>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpgrade('flow')}
                    disabled={loading}
                  >
                    {loading ? 'Upgrading...' : 'Enable'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* AI Features */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">AI-Powered Features</h4>
                <p className="text-sm text-gray-600">
                  Intelligent transaction categorization and financial insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Team Collaboration</h4>
                <p className="text-sm text-gray-600">
                  Multi-user access and team management features
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {subscription.type !== 'BASIC' ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              ) : (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">PRO</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleUpgrade('professional')}
                    disabled={loading}
                  >
                    Upgrade
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Account Settings</span>
          </CardTitle>
          <CardDescription>
            Manage your account preferences and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <p className="text-sm text-gray-600">This will appear in the navigation title</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-48"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCompanyNameSave}
                disabled={savingCompany}
              >
                {savingCompany ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <Switch id="two-factor" />
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {searchParams.get('upgrade') === 'flow' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Crown className="w-5 h-5" />
              <span>Upgrade to Access Practice Management</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              The Practice Management module requires a Professional subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Job Tracking</h4>
                  <p className="text-sm text-gray-600">Track client jobs and projects</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Team Collaboration</h4>
                  <p className="text-sm text-gray-600">Work together efficiently</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium">Workflow Automation</h4>
                  <p className="text-sm text-gray-600">Automate repetitive tasks</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleUpgrade('flow')}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Upgrading...' : 'Upgrade to Professional - $29/month'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 