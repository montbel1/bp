import { prisma } from "./prisma";

export interface TaxFormData {
  formType: string;
  taxYear: number;
  clientId: string;
  data: any;
  notes?: string;
}

export interface TaxDocumentData {
  name: string;
  fileUrl: string;
  fileType: string;
  clientId: string;
  taxFormId?: string;
  description?: string;
}

export class TaxProService {
  /**
   * Create a new tax form
   */
  static async createTaxForm(userEmail: string, formData: TaxFormData) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.taxForm.create({
      data: {
        formType: formData.formType,
        taxYear: formData.taxYear,
        data: formData.data,
        notes: formData.notes,
        status: "DRAFT",
        clientId: formData.clientId,
        userId: user.id,
      },
      include: {
        client: true,
        documents: true,
      },
    });
  }

  /**
   * Upload a tax document
   */
  static async uploadDocument(
    userEmail: string,
    documentData: TaxDocumentData
  ) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.taxDocument.create({
      data: {
        name: documentData.name,
        fileUrl: documentData.fileUrl,
        fileType: documentData.fileType as any,
        description: documentData.description,
        status: "PENDING",
        clientId: documentData.clientId,
        taxFormId: documentData.taxFormId,
        uploadedBy: user.id,
      },
      include: {
        client: true,
        taxForm: true,
      },
    });
  }

  /**
   * Sync financial data from Avanee BookPro for tax preparation
   */
  static async syncBookkeepingData(
    userEmail: string,
    clientId: string,
    taxYear: number
  ) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get financial data from bookkeeping module
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(taxYear, 0, 1),
          lte: new Date(taxYear, 11, 31),
        },
      },
      include: {
        account: true,
        category: true,
      },
      orderBy: { date: "asc" },
    });

    // Get invoices and payments
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(taxYear, 0, 1),
          lte: new Date(taxYear, 11, 31),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(taxYear, 0, 1),
          lte: new Date(taxYear, 11, 31),
        },
      },
      include: {
        customer: true,
        invoice: true,
      },
    });

    // Get bills and vendor payments
    const bills = await prisma.bill.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(taxYear, 0, 1),
          lte: new Date(taxYear, 11, 31),
        },
      },
      include: {
        vendor: true,
        items: true,
      },
    });

    return {
      transactions,
      invoices,
      payments,
      bills,
      summary: {
        totalIncome: invoices.reduce((sum, inv) => sum + inv.total, 0),
        totalExpenses: bills.reduce((sum, bill) => sum + bill.total, 0),
        totalTransactions: transactions.length,
        totalInvoices: invoices.length,
        totalBills: bills.length,
      },
    };
  }

  /**
   * Sync client data from Flow Practice Management
   */
  static async syncPracticeManagementData(userEmail: string, clientId: string) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get client information
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        jobs: {
          include: {
            tasks: true,
            timeEntries: true,
          },
        },
        timeEntries: true,
      },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    // Get related jobs and tasks
    const jobs = await prisma.job.findMany({
      where: {
        clientId: clientId,
        userId: user.id,
      },
      include: {
        tasks: true,
        timeEntries: true,
      },
    });

    return {
      client,
      jobs,
      summary: {
        totalJobs: jobs.length,
        totalTasks: jobs.reduce((sum, job) => sum + job.tasks.length, 0),
        totalHours: jobs.reduce((sum, job) => sum + job.actualHours, 0),
      },
    };
  }

  /**
   * Create calendar events for tax deadlines
   */
  static async createTaxCalendarEvents(userEmail: string, taxFormId: string) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const taxForm = await prisma.taxForm.findUnique({
      where: { id: taxFormId },
      include: { client: true },
    });

    if (!taxForm) {
      throw new Error("Tax form not found");
    }

    // Common tax deadlines for the tax year
    const taxDeadlines = [
      {
        title: `1040 Preparation - ${taxForm.client.name}`,
        description: `Begin preparing ${taxForm.formType} for ${taxForm.taxYear}`,
        startDate: new Date(taxForm.taxYear, 0, 15), // January 15th
        priority: "HIGH" as const,
        type: "ACCOUNTING" as const,
      },
      {
        title: `1040 Review - ${taxForm.client.name}`,
        description: `Review completed ${taxForm.formType} for ${taxForm.taxYear}`,
        startDate: new Date(taxForm.taxYear, 2, 15), // March 15th
        priority: "URGENT" as const,
        type: "ACCOUNTING" as const,
      },
      {
        title: `1040 Filing - ${taxForm.client.name}`,
        description: `File ${taxForm.formType} for ${taxForm.taxYear}`,
        startDate: new Date(taxForm.taxYear, 3, 15), // April 15th
        priority: "URGENT" as const,
        type: "ACCOUNTING" as const,
      },
    ];

    // Create calendar events
    const events = await Promise.all(
      taxDeadlines.map(async (deadline) => {
        return await prisma.calendarEvent.create({
          data: {
            title: deadline.title,
            description: deadline.description,
            startDate: deadline.startDate,
            endDate: new Date(deadline.startDate.getTime() + 60 * 60 * 1000), // 1 hour duration
            status: "SCHEDULED",
            priority: deadline.priority,
            userId: user.id,
            createdBy: user.id,
            taxFormId: taxFormId,
          },
        });
      })
    );

    return events;
  }

  /**
   * Get tax statistics for dashboard
   */
  static async getTaxStats(userEmail: string) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const [
      totalForms,
      pendingForms,
      completedForms,
      overdueForms,
      totalDocuments,
      pendingDocuments,
      recentForms,
      recentDocuments,
    ] = await Promise.all([
      prisma.taxForm.count({ where: { userId: user.id } }),
      prisma.taxForm.count({
        where: {
          userId: user.id,
          status: { in: ["DRAFT", "IN_REVIEW"] },
        },
      }),
      prisma.taxForm.count({
        where: {
          userId: user.id,
          status: { in: ["FINALIZED", "SUBMITTED"] },
        },
      }),
      prisma.taxForm.count({
        where: {
          userId: user.id,
          status: { not: "FINALIZED" },
        },
      }),
      prisma.taxDocument.count({ where: { client: { userId: user.id } } }),
      prisma.taxDocument.count({
        where: {
          client: { userId: user.id },
          status: "PENDING",
        },
      }),
      prisma.taxForm.findMany({
        where: { userId: user.id },
        include: { client: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.taxDocument.findMany({
        where: { client: { userId: user.id } },
        include: { client: true, taxForm: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      stats: {
        totalForms,
        pendingForms,
        completedForms,
        overdueForms,
        totalDocuments,
        pendingDocuments,
      },
      recentForms,
      recentDocuments,
    };
  }
}
