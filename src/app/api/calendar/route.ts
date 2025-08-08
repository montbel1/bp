import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = {
      createdBy: session.user.email,
    };

    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        account: true,
        customer: true,
        job: true,
        task: true,
        reminders: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      allDay = false,
      location,
      status = "SCHEDULED",
      priority = "MEDIUM",
      recurrence,
      recurrenceRule,
      accountId,
      customerId,
      jobId,
      taskId,
      reminders = [],
    } = body;

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay,
        location,
        status,
        priority,
        recurrence,
        recurrenceRule,
        accountId,
        customerId,
        jobId,
        taskId,
        userId: session.user.id,
        createdBy: session.user.email,
        reminders: {
          create: reminders.map((reminder: any) => ({
            type: reminder.type,
            minutesBefore: reminder.minutesBefore,
          })),
        },
      },
      include: {
        account: true,
        customer: true,
        job: true,
        task: true,
        reminders: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
} 
