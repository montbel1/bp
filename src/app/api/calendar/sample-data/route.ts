import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create sample recurring transactions
    const recurringTransactions = await Promise.all([
      prisma.recurringTransaction.create({
        data: {
          description: "Office Rent",
          amount: 2500,
          type: "DEBIT",
          frequency: "MONTHLY",
          startDate: new Date(),
          nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          isActive: true,
          user: {
            connect: { email: session.user.email }
          },
          account: {
            connect: { id: "1" } // Assuming account ID 1 exists
          }
        }
      }),
      prisma.recurringTransaction.create({
        data: {
          description: "Internet Service",
          amount: 89.99,
          type: "DEBIT",
          frequency: "MONTHLY",
          startDate: new Date(),
          nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
          isActive: true,
          user: {
            connect: { email: session.user.email }
          },
          account: {
            connect: { id: "1" }
          }
        }
      })
    ]);

    // Create sample invoices
    const invoices = await Promise.all([
      prisma.invoice.create({
        data: {
          number: "INV-001",
          date: new Date(),
          subtotal: 1500,
          total: 1500,
          status: "SENT",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          user: {
            connect: { email: session.user.email }
          },
          customer: {
            connect: { id: "1" } // Assuming customer ID 1 exists
          }
        }
      }),
      prisma.invoice.create({
        data: {
          number: "INV-002",
          date: new Date(),
          subtotal: 2500,
          total: 2500,
          status: "SENT",
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
          user: {
            connect: { email: session.user.email }
          },
          customer: {
            connect: { id: "1" }
          }
        }
      })
    ]);

    // Create sample jobs
    const jobs = await Promise.all([
      prisma.job.create({
        data: {
          title: "Tax Return Preparation - ABC Corp",
          description: "Complete 2024 tax return for ABC Corporation",
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          user: {
            connect: { email: session.user.email }
          },
          client: {
            connect: { id: "1" }
          }
        }
      }),
      prisma.job.create({
        data: {
          title: "Financial Review - XYZ Inc",
          description: "Quarterly financial review and reporting",
          status: "PLANNING",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          user: {
            connect: { email: session.user.email }
          },
          client: {
            connect: { id: "1" }
          }
        }
      })
    ]);

    // Create sample tasks
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: "Gather Financial Documents",
          description: "Collect all necessary financial documents for tax preparation",
          status: "TODO",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          user: {
            connect: { email: session.user.email }
          },
          job: {
            connect: { id: jobs[0].id }
          }
        }
      }),
      prisma.task.create({
        data: {
          title: "Review Bank Statements",
          description: "Review and reconcile bank statements for the quarter",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          user: {
            connect: { email: session.user.email }
          },
          job: {
            connect: { id: jobs[1].id }
          }
        }
      })
    ]);

    return NextResponse.json({
      message: "Sample data created successfully",
      data: {
        recurringTransactions: recurringTransactions.length,
        invoices: invoices.length,
        jobs: jobs.length,
        tasks: tasks.length
      }
    });

  } catch (error) {
    console.error("Error creating sample data:", error);
    return NextResponse.json(
      { error: "Failed to create sample data" },
      { status: 500 }
    );
  }
} 
