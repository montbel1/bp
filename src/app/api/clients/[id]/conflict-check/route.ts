import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check for existing conflict check
    const existingCheck = await prisma.conflictCheck.findFirst({
      where: {
        clientId: params.id,
        status: { in: ["PENDING", "CLEAR", "CONFLICT"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingCheck) {
      return NextResponse.json({
        message: "Conflict check already exists",
        conflictCheck: existingCheck,
      });
    }

    // Perform conflict check logic
    // This is a simplified version - in a real system, you would:
    // 1. Check against existing clients for name/company matches
    // 2. Check against industry databases
    // 3. Check against regulatory databases
    // 4. Check against internal conflict lists

    const conflictingClients = await prisma.client.findMany({
      where: {
        userId: session.user.id,
        id: { not: params.id },
        OR: [
          { name: { contains: client.name, mode: "insensitive" } },
          { companyName: { contains: client.companyName || "", mode: "insensitive" } },
          { email: client.email ? { equals: client.email } : undefined },
          { taxId: client.taxId ? { equals: client.taxId } : undefined },
        ],
      },
    });

    const hasConflict = conflictingClients.length > 0;
    const status = hasConflict ? "CONFLICT" : "CLEAR";
    const details = hasConflict ? {
      conflictingClients: conflictingClients.map(c => ({
        id: c.id,
        name: c.name,
        companyName: c.companyName,
        reason: "Name/company/email/tax ID match",
      })),
    } : null;

    // Create conflict check record
    const conflictCheck = await prisma.conflictCheck.create({
      data: {
        clientId: params.id,
        status,
        details,
        checkedBy: session.user.id,
      },
    });

    return NextResponse.json({
      message: `Conflict check completed: ${status}`,
      conflictCheck,
      hasConflict,
      conflictingClients: hasConflict ? conflictingClients : [],
    });
  } catch (error) {
    console.error("Error performing conflict check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get latest conflict check
    const conflictCheck = await prisma.conflictCheck.findFirst({
      where: {
        clientId: params.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      conflictCheck,
      hasConflictCheck: !!conflictCheck,
    });
  } catch (error) {
    console.error("Error fetching conflict check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
