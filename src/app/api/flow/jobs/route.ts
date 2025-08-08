import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      // Create user if it doesn't exist (for development)
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || 'dev@example.com',
          name: session.user.name || 'Development User',
          role: 'USER',
          subscription: 'BASIC',
          flowAccess: true
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const assignedTo = searchParams.get("assignedTo");

    const where: any = {
      userId: session.user.id
    };

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (assignedTo) {
      where.assignedTo = { contains: assignedTo, mode: 'insensitive' };
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: true,
        tasks: true,
        timeEntries: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      // Create user if it doesn't exist (for development)
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || 'dev@example.com',
          name: session.user.name || 'Development User',
          role: 'USER',
          subscription: 'BASIC',
          flowAccess: true
        }
      });
    }

    const body = await request.json();
    const {
      title,
      description,
      dueDate,
      priority,
      estimatedHours,
      assignedTo,
      tags,
      clientId,
      templateId
    } = body;

    // Create the job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        budgetHours: estimatedHours,
        assignedToId: assignedTo ? user.id : null, // For now, assign to current user
        clientId,
        userId: user.id,
        tags: tags ? JSON.stringify(tags) : null,
        status: "PLANNING",
        progress: 0,
      },
      include: {
        client: true,
        tasks: true,
      }
    });

    // If a template was selected, create default tasks
    if (templateId) {
      const templateTasks = getTemplateTasks(templateId);
      if (templateTasks.length > 0) {
        await Promise.all(
          templateTasks.map((taskTitle, index) =>
            prisma.task.create({
              data: {
                title: taskTitle,
                description: `Task ${index + 1} for ${title}`,
                status: "TODO",
                priority,
                dueDate: new Date(dueDate),
                estimatedHours: estimatedHours / templateTasks.length,
                jobId: job.id,
                userId: user.id,
              }
            })
          )
        );
      }
    }

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}

function getTemplateTasks(templateId: string): string[] {
  const templates: Record<string, string[]> = {
    "tax-preparation": [
      "Gather client documents",
      "Review financial records",
      "Prepare tax forms",
      "Calculate tax liability",
      "Review with client",
      "File tax return"
    ],
    "bookkeeping": [
      "Reconcile bank accounts",
      "Categorize transactions",
      "Prepare financial statements",
      "Review with client"
    ],
    "audit-preparation": [
      "Review financial records",
      "Prepare audit schedules",
      "Gather supporting documentation",
      "Coordinate with auditors",
      "Address audit findings"
    ],
    "consulting": [
      "Analyze business operations",
      "Identify improvement opportunities",
      "Develop recommendations",
      "Present findings to client",
      "Implement changes"
    ]
  };

  return templates[templateId] || [];
} 
