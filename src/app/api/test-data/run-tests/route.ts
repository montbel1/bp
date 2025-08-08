import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error';
  responseTime: number;
  data?: any;
  error?: string;
}

interface TestScenario {
  id: string;
  title: string;
  endpoints: string[];
  expectedResults: string[];
}

const testScenarios: Record<string, TestScenario[]> = {
  // Healthcare Professionals
  'family-physician': [
    {
      id: 'health-1',
      title: 'Patient Scheduling & Appointments',
      endpoints: ['/api/calendar', '/api/clients', '/api/flow/jobs'],
      expectedResults: ['Appointments scheduled', 'Calendar conflicts resolved', 'Patient reminders sent']
    },
    {
      id: 'health-2',
      title: 'Insurance Billing & Claims',
      endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
      expectedResults: ['Claims processed', 'Payments tracked', 'Reimbursements managed']
    },
    {
      id: 'health-3',
      title: 'Medical Records Management',
      endpoints: ['/api/documents', '/api/clients', '/api/settings'],
      expectedResults: ['Records secured', 'Documents stored', 'Compliance maintained']
    }
  ],
  'dental-practice': [
    {
      id: 'dental-1',
      title: 'Treatment Planning & Scheduling',
      endpoints: ['/api/flow/jobs', '/api/calendar', '/api/projects'],
      expectedResults: ['Treatment plans created', 'Appointments scheduled', 'Follow-ups tracked']
    },
    {
      id: 'dental-2',
      title: 'Equipment & Supply Management',
      endpoints: ['/api/transactions', '/api/categories', '/api/calendar'],
      expectedResults: ['Equipment tracked', 'Supplies managed', 'Maintenance scheduled']
    },
    {
      id: 'dental-3',
      title: 'Insurance & Payment Processing',
      endpoints: ['/api/invoices', '/api/payments', '/api/reports'],
      expectedResults: ['Claims processed', 'Payments tracked', 'Billing automated']
    }
  ],
  'physical-therapist': [
    {
      id: 'pt-1',
      title: 'Treatment Session Management',
      endpoints: ['/api/calendar', '/api/flow/jobs', '/api/reports'],
      expectedResults: ['Sessions scheduled', 'Progress tracked', 'Outcomes measured']
    },
    {
      id: 'pt-2',
      title: 'Insurance & Medicare Billing',
      endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
      expectedResults: ['Medicare billed', 'Claims processed', 'Payments tracked']
    },
    {
      id: 'pt-3',
      title: 'Patient Progress Documentation',
      endpoints: ['/api/documents', '/api/clients', '/api/projects'],
      expectedResults: ['Notes documented', 'Plans updated', 'Outcomes recorded']
    }
  ],
  // Legal Professionals
  'family-lawyer': [
    {
      id: 'law-1',
      title: 'Case Management & Court Dates',
      endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
      expectedResults: ['Cases tracked', 'Court dates scheduled', 'Deadlines managed']
    },
    {
      id: 'law-2',
      title: 'Client Billing & Trust Accounts',
      endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
      expectedResults: ['Hours billed', 'Trust accounts managed', 'Payments tracked']
    },
    {
      id: 'law-3',
      title: 'Document Management & Filing',
      endpoints: ['/api/documents', '/api/clients', '/api/projects'],
      expectedResults: ['Documents stored', 'Filings tracked', 'Versions managed']
    }
  ],
  'criminal-lawyer': [
    {
      id: 'criminal-1',
      title: 'Case Tracking & Court Appearances',
      endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
      expectedResults: ['Cases tracked', 'Appearances scheduled', 'Evidence managed']
    },
    {
      id: 'criminal-2',
      title: 'Client Communication & Billing',
      endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
      expectedResults: ['Communication tracked', 'Retainers managed', 'Payments processed']
    },
    {
      id: 'criminal-3',
      title: 'Evidence & Document Management',
      endpoints: ['/api/documents', '/api/projects', '/api/categories'],
      expectedResults: ['Evidence tracked', 'Discovery managed', 'Files organized']
    }
  ],
  'corporate-lawyer': [
    {
      id: 'corporate-1',
      title: 'Contract Management & Review',
      endpoints: ['/api/documents', '/api/projects', '/api/flow/jobs'],
      expectedResults: ['Contracts drafted', 'Reviews tracked', 'Versions controlled']
    },
    {
      id: 'corporate-2',
      title: 'Business Formation & Compliance',
      endpoints: ['/api/projects', '/api/calendar', '/api/reports'],
      expectedResults: ['Formations tracked', 'Compliance monitored', 'Filings managed']
    },
    {
      id: 'corporate-3',
      title: 'Client Relationship Management',
      endpoints: ['/api/clients', '/api/flow/jobs', '/api/reports'],
      expectedResults: ['Clients onboarded', 'Relationships tracked', 'Services delivered']
    }
  ],
  // Accounting & Financial Services
  'cpa-firm': [
    {
      id: 'cpa-1',
      title: 'Tax Preparation & Filing',
      endpoints: ['/api/taxpro/forms', '/api/calendar', '/api/clients'],
      expectedResults: ['Returns prepared', 'Deadlines tracked', 'Clients notified']
    },
    {
      id: 'cpa-2',
      title: 'Audit & Review Services',
      endpoints: ['/api/projects', '/api/flow/jobs', '/api/reports'],
      expectedResults: ['Audits planned', 'Fieldwork scheduled', 'Reports generated']
    },
    {
      id: 'cpa-3',
      title: 'Client Financial Management',
      endpoints: ['/api/transactions', '/api/reports', '/api/clients'],
      expectedResults: ['Books maintained', 'Reports generated', 'Advisory provided']
    }
  ],
  'bookkeeping-service': [
    {
      id: 'bookkeeping-1',
      title: 'Monthly Reconciliation',
      endpoints: ['/api/bank-accounts', '/api/transactions', '/api/reports'],
      expectedResults: ['Accounts reconciled', 'Balances verified', 'Errors detected']
    },
    {
      id: 'bookkeeping-2',
      title: 'Financial Reporting',
      endpoints: ['/api/reports', '/api/reports/advanced', '/api/transactions'],
      expectedResults: ['Statements generated', 'Cash flow analyzed', 'Reports delivered']
    },
    {
      id: 'bookkeeping-3',
      title: 'Client Communication & Billing',
      endpoints: ['/api/clients', '/api/invoices', '/api/calendar'],
      expectedResults: ['Communication tracked', 'Billing automated', 'Services delivered']
    }
  ],
  'financial-advisor': [
    {
      id: 'advisor-1',
      title: 'Client Meeting Management',
      endpoints: ['/api/calendar', '/api/clients', '/api/flow/jobs'],
      expectedResults: ['Meetings scheduled', 'Preparation tracked', 'Follow-ups managed']
    },
    {
      id: 'advisor-2',
      title: 'Investment Portfolio Tracking',
      endpoints: ['/api/reports/advanced', '/api/transactions', '/api/reports'],
      expectedResults: ['Portfolios monitored', 'Performance analyzed', 'Rebalancing tracked']
    },
    {
      id: 'advisor-3',
      title: 'Financial Planning & Goals',
      endpoints: ['/api/projects', '/api/reports', '/api/clients'],
      expectedResults: ['Plans created', 'Goals tracked', 'Progress monitored']
    }
  ],
  // Creative & Media Services
  'video-production': [
    {
      id: 'video-1',
      title: 'Project Management & Scheduling',
      endpoints: ['/api/projects', '/api/calendar', '/api/flow/jobs'],
      expectedResults: ['Projects planned', 'Crew scheduled', 'Equipment allocated']
    },
    {
      id: 'video-2',
      title: 'Client Communication & Billing',
      endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
      expectedResults: ['Communication tracked', 'Milestones billed', 'Payments tracked']
    },
    {
      id: 'video-3',
      title: 'Equipment & Asset Management',
      endpoints: ['/api/transactions', '/api/categories', '/api/calendar'],
      expectedResults: ['Equipment tracked', 'Maintenance scheduled', 'Depreciation calculated']
    }
  ],
  'podcast-studio': [
    {
      id: 'podcast-1',
      title: 'Episode Production & Scheduling',
      endpoints: ['/api/calendar', '/api/projects', '/api/flow/jobs'],
      expectedResults: ['Episodes planned', 'Recording scheduled', 'Content managed']
    },
    {
      id: 'podcast-2',
      title: 'Client & Guest Management',
      endpoints: ['/api/clients', '/api/calendar', '/api/flow/jobs'],
      expectedResults: ['Clients onboarded', 'Guests scheduled', 'Communication tracked']
    },
    {
      id: 'podcast-3',
      title: 'Revenue & Sponsorship Tracking',
      endpoints: ['/api/transactions', '/api/invoices', '/api/reports'],
      expectedResults: ['Sponsorships managed', 'Revenue tracked', 'Payments processed']
    }
  ],
  // Real Estate & Property Services
  'real-estate-agent': [
    {
      id: 'realestate-1',
      title: 'Property Listing Management',
      endpoints: ['/api/projects', '/api/documents', '/api/reports'],
      expectedResults: ['Listings managed', 'Photos organized', 'Marketing tracked']
    },
    {
      id: 'realestate-2',
      title: 'Client & Lead Management',
      endpoints: ['/api/clients', '/api/calendar', '/api/flow/jobs'],
      expectedResults: ['Leads tracked', 'Communication managed', 'Appointments scheduled']
    },
    {
      id: 'realestate-3',
      title: 'Transaction & Commission Tracking',
      endpoints: ['/api/transactions', '/api/invoices', '/api/reports'],
      expectedResults: ['Transactions tracked', 'Commissions calculated', 'Payments processed']
    }
  ],
  'property-manager': [
    {
      id: 'property-1',
      title: 'Tenant & Lease Management',
      endpoints: ['/api/clients', '/api/transactions', '/api/reports'],
      expectedResults: ['Tenants onboarded', 'Leases managed', 'Rent collected']
    },
    {
      id: 'property-2',
      title: 'Maintenance & Repair Tracking',
      endpoints: ['/api/flow/jobs', '/api/calendar', '/api/transactions'],
      expectedResults: ['Requests tracked', 'Repairs scheduled', 'Costs managed']
    },
    {
      id: 'property-3',
      title: 'Financial Reporting & Owner Communication',
      endpoints: ['/api/reports', '/api/clients', '/api/transactions'],
      expectedResults: ['Reports generated', 'Communication tracked', 'Profits distributed']
    }
  ],
  // Automotive & Service Industries
  'auto-repair-shop': [
    {
      id: 'auto-1',
      title: 'Service Appointment Scheduling',
      endpoints: ['/api/calendar', '/api/flow/jobs', '/api/clients'],
      expectedResults: ['Services scheduled', 'Technicians allocated', 'Customers notified']
    },
    {
      id: 'auto-2',
      title: 'Parts Inventory & Purchasing',
      endpoints: ['/api/vendors', '/api/transactions', '/api/reports'],
      expectedResults: ['Inventory tracked', 'Suppliers managed', 'Costs analyzed']
    },
    {
      id: 'auto-3',
      title: 'Customer Service & Billing',
      endpoints: ['/api/invoices', '/api/transactions', '/api/reports'],
      expectedResults: ['Service tracked', 'Billing automated', 'Payments processed']
    }
  ],
  'consulting-firm': [
    {
      id: 'consulting-1',
      title: 'Project Management & Deliverables',
      endpoints: ['/api/projects', '/api/flow/jobs', '/api/reports'],
      expectedResults: ['Projects planned', 'Milestones tracked', 'Deliverables managed']
    },
    {
      id: 'consulting-2',
      title: 'Client Relationship & Billing',
      endpoints: ['/api/clients', '/api/invoices', '/api/transactions'],
      expectedResults: ['Relationships managed', 'Hours billed', 'Payments tracked']
    },
    {
      id: 'consulting-3',
      title: 'Team Collaboration & Time Tracking',
      endpoints: ['/api/flow/time', '/api/flow/jobs', '/api/reports'],
      expectedResults: ['Collaboration tracked', 'Time logged', 'Resources allocated']
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { persona, scenarioId } = await request.json();
    
    if (!persona || !testScenarios[persona]) {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 });
    }

    const scenarios = testScenarios[persona];
    const targetScenario = scenarioId ? scenarios.find((s: TestScenario) => s.id === scenarioId) : scenarios[0];
    
    if (!targetScenario) {
      return NextResponse.json({ error: 'Invalid scenario' }, { status: 400 });
    }

    const results = await runTestScenario(targetScenario);
    
    return NextResponse.json({
      persona,
      scenario: targetScenario,
      results,
      summary: {
        totalTests: results.length,
        passed: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length,
        averageResponseTime: results.reduce((acc, r) => acc + r.responseTime, 0) / results.length
      }
    });
  } catch (error) {
    console.error('Test runner error:', error);
    return NextResponse.json({ error: 'Failed to run tests' }, { status: 500 });
  }
}

async function runTestScenario(scenario: TestScenario): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const endpoint of scenario.endpoints) {
    const startTime = Date.now();
    
    try {
      // Test GET request
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          endpoint,
          method: 'GET',
          status: 'success',
          responseTime,
          data
        });
      } else {
        results.push({
          endpoint,
          method: 'GET',
          status: 'error',
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      results.push({
        endpoint,
        method: 'GET',
        status: 'error',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

// GET endpoint to list available test scenarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get('persona');
    
    if (persona && testScenarios[persona]) {
      return NextResponse.json({
        persona,
        scenarios: testScenarios[persona]
      });
    }
    
    return NextResponse.json({
      availablePersonas: Object.keys(testScenarios),
      scenarios: testScenarios
    });
  } catch (error) {
    console.error('Test scenarios error:', error);
    return NextResponse.json({ error: 'Failed to get test scenarios' }, { status: 500 });
  }
} 
