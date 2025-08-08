import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; timeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if job exists and user owns it
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { endTime } = body;

    // Calculate hours worked
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: params.timeId },
    });

    if (!timeEntry) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    const endTimeDate = endTime ? new Date(endTime) : new Date();
    const startTimeDate = new Date(timeEntry.startTime);
    const hoursWorked = (endTimeDate.getTime() - startTimeDate.getTime()) / (1000 * 60 * 60);

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: { id: params.timeId },
      data: {
        endTime: endTimeDate,
        duration: hoursWorked,
      },
    });

    return NextResponse.json({ timeEntry: updatedTimeEntry });
  } catch (error) {
    console.error("Error updating time entry:", error);
    return NextResponse.json(
      { error: "Failed to update time entry" },
      { status: 500 }
    );
  }
} 