'use client';

import { FlowProvider } from '@/components/providers/flow-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  CheckSquare, 
  Users, 
  Clock, 
  Settings, 
  BarChart3,
  Workflow,
  Calendar,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSimpleAuth } from '@/components/providers/simple-auth-provider';

interface FlowLayoutProps {
  children: React.ReactNode;
}

export default function FlowLayout({ children }: FlowLayoutProps) {
  const pathname = usePathname();
  const { user } = useSimpleAuth();
  
  // Development bypass - allow access in development mode
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasAccess = isDevelopment || user?.flowAccess;

  const navigation = [
    {
      name: 'Dashboard',
      href: '/flow',
      icon: BarChart3,
      current: pathname === '/flow',
    },
    {
      name: 'Jobs',
      href: '/flow/jobs',
      icon: Briefcase,
      current: pathname.startsWith('/flow/jobs'),
    },
    {
      name: 'Tasks',
      href: '/flow/tasks',
      icon: CheckSquare,
      current: pathname.startsWith('/flow/tasks'),
    },
    {
      name: 'Clients',
      href: '/flow/clients',
      icon: Users,
      current: pathname.startsWith('/flow/clients'),
    },
    {
      name: 'Time Tracking',
      href: '/flow/time-tracking',
      icon: Clock,
      current: pathname.startsWith('/flow/time-tracking'),
    },
    {
      name: 'Teams',
      href: '/flow/teams',
      icon: Users,
      current: pathname.startsWith('/flow/teams'),
    },
    {
      name: 'Workflows',
      href: '/flow/workflows',
      icon: Workflow,
      current: pathname.startsWith('/flow/workflows'),
    },
    {
      name: 'Calendar',
      href: '/flow/calendar',
      icon: Calendar,
      current: pathname.startsWith('/flow/calendar'),
    },
  ];

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Practice Management Access Required</h1>
          <p className="text-gray-600 mb-4">
            You need to upgrade your subscription to access the Practice Management module.
          </p>
          <Link href="/settings?upgrade=flow">
            <Button>Upgrade Subscription</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <FlowProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Practice Management</h2>
                <p className="text-sm text-gray-500">Professional Module</p>
              </div>
              <Badge variant="secondary">PRO</Badge>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  New Job
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </div>

            {/* Settings */}
            <div className="p-4 border-t">
              <Link
                href="/flow/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Practice Management'}
                </h1>
                {pathname === '/flow' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Live
                  </Badge>
                )}
                {isDevelopment && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    Dev Mode
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Today
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Add
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </FlowProvider>
  );
} 