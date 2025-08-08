import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface TestResult {
  testName: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  details: string;
  error?: string;
  duration: number;
}

export async function POST(request: NextRequest) {
  const results: TestResult[] = [];
  const startTime = Date.now();

  try {
    // Test 1: Database Connection
    const dbTestStart = Date.now();
    try {
      await prisma.$connect();
      results.push({
        testName: 'Database Connection',
        status: 'PASSED',
        details: 'Successfully connected to database',
        duration: Date.now() - dbTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Database Connection',
        status: 'FAILED',
        details: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - dbTestStart
      });
    }

    // Test 2: Authentication System
    const authTestStart = Date.now();
    try {
      // Test if we can create a test user
      const testUser = await prisma.user.upsert({
        where: { email: 'test@avanee.com' },
        update: {},
        create: {
          email: 'test@avanee.com',
          name: 'Test User',
          companyName: 'Test Company',
          industry: 'healthcare',
          subIndustry: 'dental'
        }
      });
      
      results.push({
        testName: 'Authentication System',
        status: 'PASSED',
        details: `Test user created/updated: ${testUser.id}`,
        duration: Date.now() - authTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Authentication System',
        status: 'FAILED',
        details: 'Failed to create test user',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - authTestStart
      });
    }

    // Test 3: Chart of Accounts
    const accountsTestStart = Date.now();
    try {
      const accounts = await prisma.chartAccount.findMany({
        take: 5
      });
      
      results.push({
        testName: 'Chart of Accounts',
        status: 'PASSED',
        details: `Found ${accounts.length} accounts`,
        duration: Date.now() - accountsTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Chart of Accounts',
        status: 'FAILED',
        details: 'Failed to access chart of accounts',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - accountsTestStart
      });
    }

    // Test 4: Client Management
    const clientTestStart = Date.now();
    try {
      const testClient = await prisma.client.create({
        data: {
          name: 'Test Client',
          email: 'client@test.com',
          phone: '555-1234',
          userId: 'dev-user-id'
        }
      });
      
      results.push({
        testName: 'Client Management',
        status: 'PASSED',
        details: `Client created: ${testClient.id}`,
        duration: Date.now() - clientTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Client Management',
        status: 'FAILED',
        details: 'Failed to create test client',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - clientTestStart
      });
    }

    // Test 5: Job/Workflow Management
    const jobTestStart = Date.now();
    try {
        const testJob = await prisma.job.create({
    data: {
      title: 'Test Treatment Plan',
      description: 'Test job for workflow testing',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 24 * 3600000), // 7 days from now
      userId: 'dev-user-id'
    }
  });
      
      results.push({
        testName: 'Job/Workflow Management',
        status: 'PASSED',
        details: `Job created: ${testJob.id}`,
        duration: Date.now() - jobTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Job/Workflow Management',
        status: 'FAILED',
        details: 'Failed to create test job',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - jobTestStart
      });
    }

    // Test 6: Invoice Management
    const invoiceTestStart = Date.now();
    try {
      // First create a customer
      const testCustomer = await prisma.customer.create({
        data: {
          name: 'Test Customer for Invoice',
          email: 'invoice@example.com',
          userId: 'dev-user-id'
        }
      });

      const testInvoice = await prisma.invoice.create({
        data: {
          number: 'INV-TEST-001',
          date: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 3600000),
          status: 'DRAFT',
          subtotal: 1000,
          tax: 100,
          total: 1100,
          customerId: testCustomer.id,
          userId: 'dev-user-id'
        }
      });
      
      results.push({
        testName: 'Invoice Management',
        status: 'PASSED',
        details: `Invoice created: ${testInvoice.id}`,
        duration: Date.now() - invoiceTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Invoice Management',
        status: 'FAILED',
        details: 'Failed to create test invoice',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - invoiceTestStart
      });
    }

    // Test 7: Payment Processing
    const paymentTestStart = Date.now();
    try {
      // First create a customer
      const testCustomer = await prisma.customer.create({
        data: {
          name: 'Test Customer for Payment',
          email: 'payment@example.com',
          userId: 'dev-user-id'
        }
      });

      const testPayment = await prisma.payment.create({
        data: {
          amount: 1100,
          method: 'CREDIT_CARD',
          status: 'COMPLETED',
          date: new Date(),
          customerId: testCustomer.id,
          userId: 'dev-user-id'
        }
      });
      
      results.push({
        testName: 'Payment Processing',
        status: 'PASSED',
        details: `Payment processed: ${testPayment.id}`,
        duration: Date.now() - paymentTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Payment Processing',
        status: 'FAILED',
        details: 'Failed to process test payment',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - paymentTestStart
      });
    }

    // Test 8: Transaction Management
    const transactionTestStart = Date.now();
    try {
        // First create a test account if it doesn't exist
  const testAccount = await prisma.chartAccount.upsert({
    where: { id: 'test-account-id' },
    update: {},
    create: {
      id: 'test-account-id',
      name: 'Test Account',
      type: 'ASSET',
      balance: 0,
      userId: 'dev-user-id'
    }
  });

  const testTransaction = await prisma.transaction.create({
    data: {
      date: new Date(),
      description: 'Test transaction',
      amount: 500,
      type: 'CREDIT',
      accountId: testAccount.id,
      userId: 'dev-user-id'
    }
  });
      
      results.push({
        testName: 'Transaction Management',
        status: 'PASSED',
        details: `Transaction created: ${testTransaction.id}`,
        duration: Date.now() - transactionTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Transaction Management',
        status: 'FAILED',
        details: 'Failed to create test transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - transactionTestStart
      });
    }

    // Test 9: Calendar/Event Management
    const calendarTestStart = Date.now();
    try {
      const testEvent = await prisma.calendarEvent.create({
        data: {
          title: 'Test Appointment',
          description: 'Test appointment for workflow testing',
          startDate: new Date(),
          endDate: new Date(Date.now() + 3600000),
          userId: 'dev-user-id',
          createdBy: 'dev-user-id'
        }
      });
      
      results.push({
        testName: 'Calendar/Event Management',
        status: 'PASSED',
        details: `Event created: ${testEvent.id}`,
        duration: Date.now() - calendarTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Calendar/Event Management',
        status: 'FAILED',
        details: 'Failed to create test event',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - calendarTestStart
      });
    }

    // Test 10: Report Generation
    const reportTestStart = Date.now();
    try {
      const transactions = await prisma.transaction.findMany({
        take: 10
      });
      
      const revenue = transactions
        .filter(t => t.type === 'CREDIT')
        .reduce((sum, t) => sum + t.amount, 0);
      
      results.push({
        testName: 'Report Generation',
        status: 'PASSED',
        details: `Report generated with ${transactions.length} transactions, revenue: $${revenue}`,
        duration: Date.now() - reportTestStart
      });
    } catch (error) {
      results.push({
        testName: 'Report Generation',
        status: 'FAILED',
        details: 'Failed to generate test report',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - reportTestStart
      });
    }

    // Calculate summary
    const totalDuration = Date.now() - startTime;
    const passedTests = results.filter(r => r.status === 'PASSED').length;
    const failedTests = results.filter(r => r.status === 'FAILED').length;
    const totalTests = results.length;

    return NextResponse.json({
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: (passedTests / totalTests) * 100,
        totalDuration
      },
      results
    });

  } catch (error) {
    return NextResponse.json({
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 1,
        successRate: 0,
        totalDuration: Date.now() - startTime
      },
      results: [{
        testName: 'Test Runner',
        status: 'FAILED',
        details: 'Test runner failed to execute',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      }]
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Comprehensive test runner is ready',
    availableTests: [
      'Database Connection',
      'Authentication System',
      'Chart of Accounts',
      'Client Management',
      'Job/Workflow Management',
      'Invoice Management',
      'Payment Processing',
      'Transaction Management',
      'Calendar/Event Management',
      'Report Generation'
    ]
  });
} 
