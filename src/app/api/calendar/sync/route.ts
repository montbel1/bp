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

    const body = await request.json();
    const { calendarType, accessToken, calendarId, syncDirection = "BIDIRECTIONAL" } = body;

    // Create or update external calendar connection
    const externalCalendar = await prisma.externalCalendar.upsert({
      where: {
        id: `${session.user.email}-${calendarType}-${calendarId}`,
      },
      update: {
        accessToken,
        lastSyncAt: new Date(),
        syncDirection,
      },
      create: {
        id: `${session.user.email}-${calendarType}-${calendarId}`,
        name: `${calendarType} Calendar`,
        type: calendarType,
        accessToken,
        calendarId,
        syncDirection,
      },
    });

    // Here you would implement the actual sync logic
    // For now, we'll return a success response
    return NextResponse.json({
      message: "Calendar sync initiated",
      externalCalendar,
    });
  } catch (error) {
    console.error("Error syncing calendar:", error);
    return NextResponse.json(
      { error: "Failed to sync calendar" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const externalCalendars = await prisma.externalCalendar.findMany({
      where: {
        id: {
          startsWith: session.user.email,
        },
        isActive: true,
      },
    });

    return NextResponse.json(externalCalendars);
  } catch (error) {
    console.error("Error fetching external calendars:", error);
    return NextResponse.json(
      { error: "Failed to fetch external calendars" },
      { status: 500 }
    );
  }
} 
