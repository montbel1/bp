"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSimpleAuth } from "@/components/providers/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Home, 
  DollarSign, 
  Receipt, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  ChevronDown,
  FolderOpen,
  Repeat,
  Upload,
  Building2,
  CreditCard,
  Brain,
  Bell,
  Zap,
  Smartphone,
  Bitcoin,
  Wifi,
  Calendar,
  FileCheck,
  Workflow,
  Briefcase,
  User,
  Building,
  RefreshCw,
  TrendingUp,
  Calculator,
  Shield,
  MessageSquare,
  Star
} from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview of your business"
  },
  {
    name: "Practice Management",
    href: "/flow",
    icon: Building2,
    description: "Professional practice management module",
    badge: "PRO"
  },
  {
    name: "Enhanced Client Management",
    href: "/flow/clients",
    icon: Users,
    description: "Comprehensive client management with practice features",
    badge: "PRO"
  },
  {
    name: "Risk Assessment Tool",
    href: "/flow/clients/risk-assessment",
    icon: Shield,
    description: "Comprehensive risk evaluation for financial professionals",
    badge: "PRO"
  },
  {
    name: "Quality Control Workflow",
    href: "/flow/clients/quality-control",
    icon: FileCheck,
    description: "Manage review processes and ensure quality standards",
    badge: "PRO"
  },
  {
    name: "Document Management System",
    href: "/flow/documents",
    icon: FileText,
    description: "Secure document storage with encryption and audit trails",
    badge: "PRO"
  },
  {
    name: "Team Management & Capacity",
    href: "/flow/team",
    icon: Users,
    description: "Resource management and performance tracking",
    badge: "PRO"
  },
  {
    name: "Secure Client Messaging",
    href: "/flow/communication",
    icon: MessageSquare,
    description: "Real-time messaging between clients and team members",
    badge: "PRO"
  },
  {
    name: "Client Portal System",
    href: "/flow/communication/client-portal",
    icon: Building,
    description: "Secure client portal with document access",
    badge: "PRO"
  },
  {
    name: "Automated Notifications",
    href: "/flow/communication/notifications",
    icon: Bell,
    description: "Email, SMS, and portal notification system",
    badge: "PRO"
  },
  {
    name: "Meeting Scheduling",
    href: "/flow/calendar",
    icon: Calendar,
    description: "Schedule and manage client meetings",
    badge: "PRO"
  },
  {
    name: "Calendar Integration",
    href: "/flow/calendar/integration",
    icon: RefreshCw,
    description: "Sync with external calendars and manage availability",
    badge: "PRO"
  },
  {
    name: "Meeting Notes & Follow-up",
    href: "/flow/calendar/notes",
    icon: FileText,
    description: "Capture notes and track follow-up tasks",
    badge: "PRO"
  },
  {
    name: "Client Feedback & Satisfaction",
    href: "/flow/feedback",
    icon: Star,
    description: "Track client satisfaction and collect feedback",
    badge: "PRO"
  },
  {
    name: "Billing & Time Tracking",
    href: "/flow/billing",
    icon: DollarSign,
    description: "Track billable time and manage billing",
    badge: "PRO"
  },
  {
    name: "Workflow Automation",
    href: "/flow/workflow",
    icon: Workflow,
    description: "Manage workflows and compliance",
    badge: "PRO"
  },
  {
    name: "Reports & Analytics",
    href: "/flow/reports",
    icon: BarChart3,
    description: "Practice performance insights",
    badge: "PRO"
  },
  {
    name: "Test Workflows",
    href: "/test-workflows",
    icon: Workflow,
    description: "End-to-end workflow testing for financial professionals",
    badge: "TEST"
  },
  {
    name: "TaxPro",
    href: "/taxpro",
    icon: FileCheck,
    description: "Professional tax preparation and filing",
    badge: "PRO"
  },

  {
    name: "Accounts",
    href: "/accounts",
    icon: DollarSign,
    description: "Chart of accounts"
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
    description: "Record and manage transactions"
  },
  {
    name: "Categories",
    href: "/categories",
    icon: FileText,
    description: "Manage transaction categories"
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    description: "Manage client relationships"
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    description: "Manage customer information"
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: FileText,
    description: "Create and manage invoices"
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
    description: "Track payments and receivables"
  },
  {
    name: "Test Suite",
    href: "/test-cases",
    icon: FileCheck,
    description: "Comprehensive test suite for all modules",
    badge: "TEST"
  },
  {
    name: "Comprehensive Testing",
    href: "/comprehensive-testing",
    icon: Zap,
    description: "End-to-end workflow testing",
    badge: "E2E"
  },
  {
    name: "Test Dashboard",
    href: "/test-dashboard",
    icon: BarChart3,
    description: "Comprehensive test results",
    badge: "TEST"
  },
  {
    name: "Vendors",
    href: "/vendors",
    icon: Users,
    description: "Manage vendor relationships"
  },
  {
    name: "Bills",
    href: "/bills",
    icon: FileText,
    description: "Manage vendor bills"
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
    description: "Project management and tracking"
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Financial reports and analytics"
  },
  {
    name: "Advanced Reports",
    href: "/reports/advanced",
    icon: BarChart3,
    description: "Advanced financial analytics"
  },
  {
    name: "Bank Reconciliation",
    href: "/bank-reconciliation",
    icon: Building2,
    description: "Reconcile bank transactions"
  },
  {
    name: "Documents",
    href: "/documents",
    icon: Upload,
    description: "Manage business documents"
  },
  {
    name: "Recurring",
    href: "/recurring",
    icon: Repeat,
    description: "Automated recurring items"
  },
  {
    name: "Stripe Integration",
    href: "/integrations/stripe",
    icon: CreditCard,
    description: "Payment processing integration"
  },
  {
    name: "AI Categorization",
    href: "/ai/transaction-categorization",
    icon: Brain,
    description: "AI-powered transaction categorization"
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "Real-time notifications system"
  },
  {
    name: "Mobile App",
    href: "/mobile",
    icon: Smartphone,
    description: "Native mobile application"
  },
  {
    name: "Blockchain",
    href: "/blockchain",
    icon: Bitcoin,
    description: "Cryptocurrency and smart contracts"
  },
  {
    name: "IoT Devices",
    href: "/iot",
    icon: Wifi,
    description: "Connected devices and sensors"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and system settings"
  }
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const { user } = useSimpleAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyType: 'bookkeeping'
  });

  useEffect(() => {
    if (user) {
      setCompanyInfo({
        companyName: user.companyName || 'Avanee Books Pro',
        companyType: user.companyType || 'bookkeeping'
      });
    }
  }, [user]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const getAppTitle = () => {
    if (user?.companyName) {
      return user.companyName
    }
    return companyInfo.companyName || 'Avanee Books Pro'
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          {isMobileMenuOpen ? (
            <>
              <X className="h-4 w-4" />
              Close
            </>
          ) : (
            <>
              <Menu className="h-4 w-4" />
              Menu
            </>
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{getAppTitle()}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className={`hidden lg:block ${className}`}>
        <Card className="w-64 h-full">
          <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{getAppTitle()}</h2>
              <p className="text-sm text-gray-500">Business Management</p>
            </div>
            
            {/* Practice Management */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Practice Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/flow" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Workflow className="h-4 w-4" />
                  Flow (Practice Management)
                </Link>
                <Link href="/flow/calendar" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Calendar className="h-4 w-4" />
                  Enhanced Calendar System
                </Link>
                <Link href="/flow/jobs" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Briefcase className="h-4 w-4" />
                  Jobs & Projects
                </Link>
                <Link href="/flow/clients" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Users className="h-4 w-4" />
                  Enhanced Client Management
                </Link>
                <Link href="/flow/clients/risk-assessment" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Shield className="h-4 w-4" />
                  Risk Assessment Tool
                </Link>
                <Link href="/flow/clients/quality-control" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <FileCheck className="h-4 w-4" />
                  Quality Control Workflow
                </Link>
                <Link href="/flow/documents" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <FileText className="h-4 w-4" />
                  Enhanced Document Management
                </Link>
                <Link href="/flow/team" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Users className="h-4 w-4" />
                  Team Management & Capacity
                </Link>
              </CardContent>
            </Card>

            {/* Bookkeeping */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Bookkeeping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/transactions" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Receipt className="h-4 w-4" />
                  Transactions
                </Link>
                <Link href="/invoices" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <FileText className="h-4 w-4" />
                  Invoices
                </Link>
                <Link href="/customers" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <User className="h-4 w-4" />
                  Customers
                </Link>
                <Link href="/vendors" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Building className="h-4 w-4" />
                  Vendors
                </Link>
                <Link href="/bills" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <CreditCard className="h-4 w-4" />
                  Bills
                </Link>
                <Link href="/payments" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <DollarSign className="h-4 w-4" />
                  Payments
                </Link>
                <Link href="/bank-reconciliation" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <RefreshCw className="h-4 w-4" />
                  Bank Reconciliation
                </Link>
              </CardContent>
            </Card>

            {/* Reports & Analytics */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/reports" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <BarChart3 className="h-4 w-4" />
                  Financial Reports
                </Link>
                <Link href="/reports/advanced" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <TrendingUp className="h-4 w-4" />
                  Advanced Analytics
                </Link>
                <Link href="/advanced-features" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Brain className="h-4 w-4" />
                  Advanced Features
                </Link>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Settings className="h-4 w-4" />
                  General Settings
                </Link>
                <Link href="/settings/currencies" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <DollarSign className="h-4 w-4" />
                  Currencies
                </Link>
                <Link href="/settings/taxes" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Calculator className="h-4 w-4" />
                  Tax Settings
                </Link>
                <Link href="/settings/industry" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
                  <Building2 className="h-4 w-4" />
                  Industry Configuration
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/transactions/new">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Receipt className="h-4 w-4 mr-2" />
                    New Transaction
                  </Button>
                </Link>
                <Link href="/accounts/new">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    New Account
                  </Button>
                </Link>
                <Link href="/invoices/new">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </nav>
    </>
  )
} 