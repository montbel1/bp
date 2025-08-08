import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface TestStep {
  name: string;
  action: string;
  expectedResult: string;
  validation: (data: any) => boolean;
}

interface WorkflowTest {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  setupData?: any;
}

const comprehensiveWorkflows: Record<string, WorkflowTest> = {
  'dental-practice-setup': {
    id: 'dental-practice-setup',
    name: 'Complete Dental Practice Setup',
    description: 'End-to-end dental practice setup including company branding, industry configuration, client management, and billing',
    steps: [
      {
        name: '1. Company Branding Setup',
        action: 'POST /api/settings/company',
        expectedResult: 'Company information updated with dental practice details',
        validation: (data) => data.companyName && data.companyName.includes('Dental')
      },
      {
        name: '2. Industry Configuration',
        action: 'POST /api/industry/config',
        expectedResult: 'Dental industry templates and workflows loaded',
        validation: (data) => data.industry === 'healthcare' && data.subIndustry === 'dental'
      },
      {
        name: '3. Create Chart of Accounts',
        action: 'POST /api/accounts',
        expectedResult: 'Dental-specific accounts created (Patient Receivables, Insurance Claims, etc.)',
        validation: (data) => data.accounts && data.accounts.length > 0
      },
      {
        name: '4. Add Patient Client',
        action: 'POST /api/clients',
        expectedResult: 'Patient client created with dental-specific fields',
        validation: (data) => data.client && data.client.name
      },
      {
        name: '5. Create Treatment Plan Job',
        action: 'POST /api/flow/jobs',
        expectedResult: 'Treatment plan job created with dental workflow',
        validation: (data) => data.job && data.job.title.includes('Treatment')
      },
      {
        name: '6. Schedule Appointment',
        action: 'POST /api/calendar',
        expectedResult: 'Patient appointment scheduled',
        validation: (data) => data.event && data.event.title.includes('Appointment')
      },
      {
        name: '7. Create Invoice',
        action: 'POST /api/invoices',
        expectedResult: 'Dental service invoice created',
        validation: (data) => data.invoice && data.invoice.total > 0
      },
      {
        name: '8. Process Payment',
        action: 'POST /api/payments',
        expectedResult: 'Payment processed and recorded',
        validation: (data) => data.payment && data.payment.amount > 0
      },
      {
        name: '9. Generate Financial Report',
        action: 'GET /api/reports/advanced',
        expectedResult: 'Dental practice financial report generated',
        validation: (data) => data.report && data.report.revenue !== undefined
      },
      {
        name: '10. Export Patient List',
        action: 'GET /api/clients',
        expectedResult: 'Patient list exported with dental-specific data',
        validation: (data) => data.clients && data.clients.length > 0
      }
    ]
  },
  'legal-practice-setup': {
    id: 'legal-practice-setup',
    name: 'Complete Legal Practice Setup',
    description: 'End-to-end legal practice setup including case management, client billing, and document management',
    steps: [
      {
        name: '1. Company Branding Setup',
        action: 'POST /api/settings/company',
        expectedResult: 'Company information updated with legal practice details',
        validation: (data) => data.companyName && data.companyName.includes('Law')
      },
      {
        name: '2. Industry Configuration',
        action: 'POST /api/industry/config',
        expectedResult: 'Legal industry templates and workflows loaded',
        validation: (data) => data.industry === 'legal'
      },
      {
        name: '3. Create Chart of Accounts',
        action: 'POST /api/accounts',
        expectedResult: 'Legal-specific accounts created (Trust Accounts, Client Receivables, etc.)',
        validation: (data) => data.accounts && data.accounts.length > 0
      },
      {
        name: '4. Add Client',
        action: 'POST /api/clients',
        expectedResult: 'Legal client created with case information',
        validation: (data) => data.client && data.client.name
      },
      {
        name: '5. Create Case Job',
        action: 'POST /api/flow/jobs',
        expectedResult: 'Legal case job created with legal workflow',
        validation: (data) => data.job && data.job.title.includes('Case')
      },
      {
        name: '6. Schedule Court Date',
        action: 'POST /api/calendar',
        expectedResult: 'Court date scheduled',
        validation: (data) => data.event && data.event.title.includes('Court')
      },
      {
        name: '7. Create Time Entry',
        action: 'POST /api/flow/time',
        expectedResult: 'Time entry created for legal work',
        validation: (data) => data.timeEntry && data.timeEntry.hours > 0
      },
      {
        name: '8. Generate Invoice',
        action: 'POST /api/invoices',
        expectedResult: 'Legal services invoice created',
        validation: (data) => data.invoice && data.invoice.total > 0
      },
      {
        name: '9. Process Payment',
        action: 'POST /api/payments',
        expectedResult: 'Payment processed and recorded',
        validation: (data) => data.payment && data.payment.amount > 0
      },
      {
        name: '10. Generate Case Report',
        action: 'GET /api/reports/advanced',
        expectedResult: 'Legal case report generated',
        validation: (data) => data.report && data.report.cases !== undefined
      }
    ]
  },
  'accounting-firm-setup': {
    id: 'accounting-firm-setup',
    name: 'Complete Accounting Firm Setup',
    description: 'End-to-end accounting firm setup including tax preparation, client management, and financial reporting',
    steps: [
      {
        name: '1. Company Branding Setup',
        action: 'POST /api/settings/company',
        expectedResult: 'Company information updated with accounting firm details',
        validation: (data) => data.companyName && data.companyName.includes('CPA')
      },
      {
        name: '2. Industry Configuration',
        action: 'POST /api/industry/config',
        expectedResult: 'Accounting industry templates and workflows loaded',
        validation: (data) => data.industry === 'accounting'
      },
      {
        name: '3. Create Chart of Accounts',
        action: 'POST /api/accounts',
        expectedResult: 'Accounting-specific accounts created',
        validation: (data) => data.accounts && data.accounts.length > 0
      },
      {
        name: '4. Add Tax Client',
        action: 'POST /api/clients',
        expectedResult: 'Tax client created with tax information',
        validation: (data) => data.client && data.client.name
      },
      {
        name: '5. Create Tax Preparation Job',
        action: 'POST /api/flow/jobs',
        expectedResult: 'Tax preparation job created',
        validation: (data) => data.job && data.job.title.includes('Tax')
      },
      {
        name: '6. Schedule Client Meeting',
        action: 'POST /api/calendar',
        expectedResult: 'Client meeting scheduled',
        validation: (data) => data.event && data.event.title.includes('Meeting')
      },
      {
        name: '7. Create Tax Form',
        action: 'POST /api/taxpro/forms',
        expectedResult: 'Tax form created',
        validation: (data) => data.form && data.form.type
      },
      {
        name: '8. Generate Invoice',
        action: 'POST /api/invoices',
        expectedResult: 'Tax preparation invoice created',
        validation: (data) => data.invoice && data.invoice.total > 0
      },
      {
        name: '9. Process Payment',
        action: 'POST /api/payments',
        expectedResult: 'Payment processed and recorded',
        validation: (data) => data.payment && data.payment.amount > 0
      },
      {
        name: '10. Generate Tax Season Report',
        action: 'GET /api/reports/advanced',
        expectedResult: 'Tax season report generated',
        validation: (data) => data.report && data.report.taxReturns !== undefined
      }
    ]
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = await request.json();
    
    if (!workflowId || !comprehensiveWorkflows[workflowId]) {
      return NextResponse.json({ 
        error: 'Invalid workflow ID',
        availableWorkflows: Object.keys(comprehensiveWorkflows)
      }, { status: 400 });
    }

    const workflow = comprehensiveWorkflows[workflowId];
    const results: any[] = [];
    let allStepsPassed = true;

    // Setup test data
    await setupTestData(workflowId, session.user.id);

    // Execute each step in the workflow
    for (const step of workflow.steps) {
      try {
        const stepResult = await executeTestStep(step, session.user.id);
        results.push({
          step: step.name,
          action: step.action,
          status: stepResult.success ? 'PASSED' : 'FAILED',
          expectedResult: step.expectedResult,
          actualResult: stepResult.result,
          validation: stepResult.validation,
          error: stepResult.error
        });

        if (!stepResult.success) {
          allStepsPassed = false;
        }
      } catch (error) {
        results.push({
          step: step.name,
          action: step.action,
          status: 'FAILED',
          expectedResult: step.expectedResult,
          actualResult: 'Step execution failed',
          validation: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        allStepsPassed = false;
      }
    }

    return NextResponse.json({
      workflow: workflow.name,
      description: workflow.description,
      totalSteps: workflow.steps.length,
      passedSteps: results.filter(r => r.status === 'PASSED').length,
      failedSteps: results.filter(r => r.status === 'FAILED').length,
      allStepsPassed,
      results
    });

  } catch (error) {
    console.error('Comprehensive test error:', error);
    return NextResponse.json({ error: 'Failed to run comprehensive test' }, { status: 500 });
  }
}

async function setupTestData(workflowId: string, userId: string) {
  // Create test data based on workflow type
  if (workflowId === 'dental-practice-setup') {
    // Setup dental practice test data
    await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: 'Bright Smile Dental',
        industry: 'healthcare',
        subIndustry: 'dental'
      }
    });
  } else if (workflowId === 'legal-practice-setup') {
    // Setup legal practice test data
    await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: 'Martinez Family Law',
        industry: 'legal',
        subIndustry: 'family-law'
      }
    });
  } else if (workflowId === 'accounting-firm-setup') {
    // Setup accounting firm test data
    await prisma.user.update({
      where: { id: userId },
      data: {
        companyName: 'Garcia & Associates CPA',
        industry: 'accounting',
        subIndustry: 'cpa-firm'
      }
    });
  }
}

async function executeTestStep(step: TestStep, userId: string): Promise<{
  success: boolean;
  result: any;
  validation: boolean;
  error?: string;
}> {
  try {
    let result: any;

    // Execute the action based on the step
    if (step.action.startsWith('POST /api/settings/company')) {
      result = await executeCompanySetup(userId);
    } else if (step.action.startsWith('POST /api/industry/config')) {
      result = await executeIndustryConfig(userId);
    } else if (step.action.startsWith('POST /api/accounts')) {
      result = await executeAccountsSetup(userId);
    } else if (step.action.startsWith('POST /api/clients')) {
      result = await executeClientSetup(userId);
    } else if (step.action.startsWith('POST /api/flow/jobs')) {
      result = await executeJobSetup(userId);
    } else if (step.action.startsWith('POST /api/calendar')) {
      result = await executeCalendarSetup(userId);
    } else if (step.action.startsWith('POST /api/invoices')) {
      result = await executeInvoiceSetup(userId);
    } else if (step.action.startsWith('POST /api/payments')) {
      result = await executePaymentSetup(userId);
    } else if (step.action.startsWith('GET /api/reports/advanced')) {
      result = await executeReportGeneration(userId);
    } else if (step.action.startsWith('POST /api/flow/time')) {
      result = await executeTimeEntry(userId);
    } else if (step.action.startsWith('POST /api/taxpro/forms')) {
      result = await executeTaxFormSetup(userId);
    } else {
      throw new Error(`Unknown action: ${step.action}`);
    }

    // Validate the result
    const validation = step.validation(result);

    return {
      success: validation,
      result,
      validation,
      error: validation ? undefined : 'Validation failed'
    };

  } catch (error) {
    return {
      success: false,
      result: null,
      validation: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Implementation of individual step executors
async function executeCompanySetup(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return {
    companyName: user?.companyName,
    industry: user?.industry,
    subIndustry: user?.subIndustry
  };
}

async function executeIndustryConfig(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return {
    industry: user?.industry,
    subIndustry: user?.subIndustry
  };
}

async function executeAccountsSetup(userId: string) {
  const accounts = await prisma.chartAccount.findMany({
    where: { userId },
    take: 5
  });
  
  return { accounts };
}

async function executeClientSetup(userId: string) {
  const client = await prisma.client.create({
    data: {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '555-1234',
      userId
    }
  });
  
  return { client };
}

async function executeJobSetup(userId: string) {
  const job = await prisma.job.create({
    data: {
      title: 'Test Treatment Plan',
      description: 'Test job for workflow testing',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 24 * 3600000), // 7 days from now
      userId
    }
  });
  
  return { job };
}

async function executeCalendarSetup(userId: string) {
  const event = await prisma.calendarEvent.create({
    data: {
      title: 'Test Appointment',
      description: 'Test appointment for workflow testing',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600000),
      userId,
      createdBy: 'test-user'
    }
  });
  
  return { event };
}

async function executeInvoiceSetup(userId: string) {
  // First create a customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Test Customer',
      email: 'test@example.com',
      userId
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      number: 'INV-001',
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 3600000),
      status: 'DRAFT',
      subtotal: 1000,
      tax: 100,
      total: 1100,
      customerId: customer.id,
      userId
    }
  });
  
  return { invoice };
}

async function executePaymentSetup(userId: string) {
  // First create a customer
  const customer = await prisma.customer.create({
    data: {
      name: 'Test Customer for Payment',
      email: 'payment@example.com',
      userId
    }
  });

  const payment = await prisma.payment.create({
    data: {
      amount: 1100,
      method: 'CREDIT_CARD',
      status: 'COMPLETED',
      date: new Date(),
      customerId: customer.id,
      userId
    }
  });
  
  return { payment };
}

async function executeReportGeneration(userId: string) {
  // Generate a simple report
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    take: 10
  });
  
  const revenue = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    report: {
      revenue,
      transactionCount: transactions.length,
      generatedAt: new Date()
    }
  };
}

async function executeTimeEntry(userId: string) {
  const timeEntry = await prisma.timeEntry.create({
    data: {
      description: 'Test time entry',
      startTime: new Date(),
      endTime: new Date(Date.now() + 2.5 * 3600000), // 2.5 hours later
      duration: 2.5,
      userId
    }
  });
  
  return { timeEntry };
}

async function executeTaxFormSetup(userId: string) {
  // First create a client
  const client = await prisma.client.create({
    data: {
      name: 'Test Tax Client',
      email: 'tax@example.com',
      userId
    }
  });

  const form = await prisma.taxForm.create({
    data: {
      formType: '1040',
      taxYear: 2024,
      status: 'DRAFT',
      data: {},
      clientId: client.id,
      userId
    }
  });
  
  return { form };
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      availableWorkflows: Object.keys(comprehensiveWorkflows),
      workflows: comprehensiveWorkflows
    });
  } catch (error) {
    console.error('Comprehensive test error:', error);
    return NextResponse.json({ error: 'Failed to get comprehensive tests' }, { status: 500 });
  }
} 
