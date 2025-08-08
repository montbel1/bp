import { supabase } from "./supabase";

export interface APITestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

export class APITester {
  private baseUrl: string;
  private results: APITestResult[] = [];

  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APITestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json().catch(() => null);

      return {
        endpoint,
        method: options.method || "GET",
        success: response.ok,
        statusCode: response.status,
        message: response.ok
          ? "Request successful"
          : `Request failed with status ${response.status}`,
        data,
        error: !response.ok
          ? data?.error || `HTTP ${response.status}`
          : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        endpoint,
        method: options.method || "GET",
        success: false,
        message: "Request failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testDatabaseEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // Test database connection
    results.push(await this.makeRequest("/api/test-db"));
    results.push(await this.makeRequest("/api/test-db?type=connection"));
    results.push(await this.makeRequest("/api/test-db?type=tables"));
    results.push(await this.makeRequest("/api/test-db?type=crud"));
    results.push(await this.makeRequest("/api/test-db?type=advanced"));

    return results;
  }

  async testAccountEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET accounts
    results.push(await this.makeRequest("/api/accounts"));

    // POST new account
    const newAccount = {
      name: "Test Account",
      type: "checking",
      balance: 1000.0,
      account_number: "1234567890",
      description: "Test account for API testing",
    };

    results.push(
      await this.makeRequest("/api/accounts", {
        method: "POST",
        body: JSON.stringify(newAccount),
      })
    );

    return results;
  }

  async testCustomerEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET customers
    results.push(await this.makeRequest("/api/customers"));

    // POST new customer
    const newCustomer = {
      name: "Test Customer",
      email: "test@customer.com",
      phone: "555-1234",
      address: "123 Test St",
      city: "Test City",
      state: "TS",
      zip_code: "12345",
    };

    results.push(
      await this.makeRequest("/api/customers", {
        method: "POST",
        body: JSON.stringify(newCustomer),
      })
    );

    return results;
  }

  async testTransactionEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET transactions
    results.push(await this.makeRequest("/api/transactions"));

    // POST new transaction
    const newTransaction = {
      description: "Test Transaction",
      amount: 100.0,
      type: "expense",
      account_id: "test-account-id",
      category_id: "test-category-id",
      date: new Date().toISOString().split("T")[0],
      reference: "TEST-001",
    };

    results.push(
      await this.makeRequest("/api/transactions", {
        method: "POST",
        body: JSON.stringify(newTransaction),
      })
    );

    return results;
  }

  async testInvoiceEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET invoices
    results.push(await this.makeRequest("/api/invoices"));

    // POST new invoice
    const newInvoice = {
      customer_id: "test-customer-id",
      invoice_number: "INV-001",
      date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [
        {
          description: "Test Item",
          quantity: 1,
          unit_price: 100.0,
        },
      ],
      subtotal: 100.0,
      tax_amount: 10.0,
      total_amount: 110.0,
    };

    results.push(
      await this.makeRequest("/api/invoices", {
        method: "POST",
        body: JSON.stringify(newInvoice),
      })
    );

    return results;
  }

  async testPaymentEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET payments
    results.push(await this.makeRequest("/api/payments"));

    // POST new payment
    const newPayment = {
      invoice_id: "test-invoice-id",
      amount: 110.0,
      payment_method: "credit_card",
      payment_date: new Date().toISOString().split("T")[0],
      reference: "PAY-001",
    };

    results.push(
      await this.makeRequest("/api/payments", {
        method: "POST",
        body: JSON.stringify(newPayment),
      })
    );

    return results;
  }

  async testCategoryEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET categories
    results.push(await this.makeRequest("/api/categories"));

    // POST new category
    const newCategory = {
      name: "Test Category",
      type: "expense",
      description: "Test category for API testing",
    };

    results.push(
      await this.makeRequest("/api/categories", {
        method: "POST",
        body: JSON.stringify(newCategory),
      })
    );

    return results;
  }

  async testClientEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET clients
    results.push(await this.makeRequest("/api/clients"));

    // POST new client
    const newClient = {
      name: "Test Client",
      email: "test@client.com",
      phone: "555-5678",
      company_name: "Test Company",
      address: "456 Client Ave",
      city: "Client City",
      state: "CL",
      zip_code: "67890",
    };

    results.push(
      await this.makeRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify(newClient),
      })
    );

    return results;
  }

  async testVendorEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET vendors
    results.push(await this.makeRequest("/api/vendors"));

    // POST new vendor
    const newVendor = {
      name: "Test Vendor",
      email: "test@vendor.com",
      phone: "555-9012",
      address: "789 Vendor Blvd",
      city: "Vendor City",
      state: "VD",
      zip_code: "34567",
    };

    results.push(
      await this.makeRequest("/api/vendors", {
        method: "POST",
        body: JSON.stringify(newVendor),
      })
    );

    return results;
  }

  async testBillEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET bills
    results.push(await this.makeRequest("/api/bills"));

    // POST new bill
    const newBill = {
      vendor_id: "test-vendor-id",
      bill_number: "BILL-001",
      date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      amount: 500.0,
      description: "Test bill for API testing",
    };

    results.push(
      await this.makeRequest("/api/bills", {
        method: "POST",
        body: JSON.stringify(newBill),
      })
    );

    return results;
  }

  async testProjectEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET projects
    results.push(await this.makeRequest("/api/projects"));

    // POST new project
    const newProject = {
      name: "Test Project",
      description: "Test project for API testing",
      client_id: "test-client-id",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      budget: 10000.0,
      status: "active",
    };

    results.push(
      await this.makeRequest("/api/projects", {
        method: "POST",
        body: JSON.stringify(newProject),
      })
    );

    return results;
  }

  async testCalendarEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET calendar events
    results.push(await this.makeRequest("/api/calendar"));

    // POST new calendar event
    const newEvent = {
      title: "Test Event",
      description: "Test calendar event for API testing",
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      event_type: "meeting",
      location: "Test Location",
    };

    results.push(
      await this.makeRequest("/api/calendar", {
        method: "POST",
        body: JSON.stringify(newEvent),
      })
    );

    return results;
  }

  async testReportEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET reports
    results.push(await this.makeRequest("/api/reports"));
    results.push(await this.makeRequest("/api/reports/advanced"));
    results.push(await this.makeRequest("/api/reports/pdf"));

    return results;
  }

  async testNotificationEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET notifications
    results.push(await this.makeRequest("/api/notifications"));

    return results;
  }

  async testSettingsEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // GET settings
    results.push(await this.makeRequest("/api/settings/business"));
    results.push(await this.makeRequest("/api/settings/industry"));

    return results;
  }

  async testAdvancedEndpoints(): Promise<APITestResult[]> {
    const results = [];

    // Test advanced features
    results.push(await this.makeRequest("/api/blockchain/cryptocurrencies"));
    results.push(await this.makeRequest("/api/blockchain/wallets"));
    results.push(await this.makeRequest("/api/iot/devices"));
    results.push(await this.makeRequest("/api/mobile/devices"));
    results.push(await this.makeRequest("/api/flow/jobs"));
    results.push(await this.makeRequest("/api/taxpro"));
    results.push(await this.makeRequest("/api/bank-accounts/import"));

    return results;
  }

  async runAllAPITests(): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      totalDuration: number;
    };
    results: APITestResult[];
  }> {
    this.results = [];

    // Run all test suites
    this.results.push(...(await this.testDatabaseEndpoints()));
    this.results.push(...(await this.testAccountEndpoints()));
    this.results.push(...(await this.testCustomerEndpoints()));
    this.results.push(...(await this.testTransactionEndpoints()));
    this.results.push(...(await this.testInvoiceEndpoints()));
    this.results.push(...(await this.testPaymentEndpoints()));
    this.results.push(...(await this.testCategoryEndpoints()));
    this.results.push(...(await this.testClientEndpoints()));
    this.results.push(...(await this.testVendorEndpoints()));
    this.results.push(...(await this.testBillEndpoints()));
    this.results.push(...(await this.testProjectEndpoints()));
    this.results.push(...(await this.testCalendarEndpoints()));
    this.results.push(...(await this.testReportEndpoints()));
    this.results.push(...(await this.testNotificationEndpoints()));
    this.results.push(...(await this.testSettingsEndpoints()));
    this.results.push(...(await this.testAdvancedEndpoints()));

    const summary = {
      total: this.results.length,
      passed: this.results.filter((r) => r.success).length,
      failed: this.results.filter((r) => !r.success).length,
      totalDuration: this.results.reduce(
        (sum, r) => sum + (r.duration || 0),
        0
      ),
    };

    return { summary, results: this.results };
  }

  async runSpecificTests(testTypes: string[]): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      totalDuration: number;
    };
    results: APITestResult[];
  }> {
    this.results = [];

    for (const testType of testTypes) {
      switch (testType) {
        case "database":
          this.results.push(...(await this.testDatabaseEndpoints()));
          break;
        case "accounts":
          this.results.push(...(await this.testAccountEndpoints()));
          break;
        case "customers":
          this.results.push(...(await this.testCustomerEndpoints()));
          break;
        case "transactions":
          this.results.push(...(await this.testTransactionEndpoints()));
          break;
        case "invoices":
          this.results.push(...(await this.testInvoiceEndpoints()));
          break;
        case "payments":
          this.results.push(...(await this.testPaymentEndpoints()));
          break;
        case "categories":
          this.results.push(...(await this.testCategoryEndpoints()));
          break;
        case "clients":
          this.results.push(...(await this.testClientEndpoints()));
          break;
        case "vendors":
          this.results.push(...(await this.testVendorEndpoints()));
          break;
        case "bills":
          this.results.push(...(await this.testBillEndpoints()));
          break;
        case "projects":
          this.results.push(...(await this.testProjectEndpoints()));
          break;
        case "calendar":
          this.results.push(...(await this.testCalendarEndpoints()));
          break;
        case "reports":
          this.results.push(...(await this.testReportEndpoints()));
          break;
        case "notifications":
          this.results.push(...(await this.testNotificationEndpoints()));
          break;
        case "settings":
          this.results.push(...(await this.testSettingsEndpoints()));
          break;
        case "advanced":
          this.results.push(...(await this.testAdvancedEndpoints()));
          break;
      }
    }

    const summary = {
      total: this.results.length,
      passed: this.results.filter((r) => r.success).length,
      failed: this.results.filter((r) => !r.success).length,
      totalDuration: this.results.reduce(
        (sum, r) => sum + (r.duration || 0),
        0
      ),
    };

    return { summary, results: this.results };
  }
}

export const apiTester = new APITester();
