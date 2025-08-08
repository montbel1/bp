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

    const body = await request.json();
    const { riskLevel, factors, notes } = body;

    // Validate required fields
    if (!riskLevel || !["LOW", "MEDIUM", "HIGH"].includes(riskLevel)) {
      return NextResponse.json(
        { error: "Valid risk level (LOW, MEDIUM, HIGH) is required" },
        { status: 400 }
      );
    }

    if (!factors || !Array.isArray(factors)) {
      return NextResponse.json(
        { error: "Risk factors array is required" },
        { status: 400 }
      );
    }

    // Create risk assessment
    const riskAssessment = await prisma.riskAssessment.create({
      data: {
        clientId: params.id,
        riskLevel,
        factors,
        notes,
        assessedBy: session.user.id,
      },
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
      message: "Risk assessment created successfully",
      riskAssessment,
    });
  } catch (error) {
    console.error("Error creating risk assessment:", error);
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

    // Get latest risk assessment
    const riskAssessment = await prisma.riskAssessment.findFirst({
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
      riskAssessment,
      hasRiskAssessment: !!riskAssessment,
    });
  } catch (error) {
    console.error("Error fetching risk assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const { riskLevel, factors, notes } = body;

    // Get latest risk assessment
    const existingAssessment = await prisma.riskAssessment.findFirst({
      where: {
        clientId: params.id,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: "No risk assessment found to update" },
        { status: 404 }
      );
    }

    // Update risk assessment
    const updatedAssessment = await prisma.riskAssessment.update({
      where: { id: existingAssessment.id },
      data: {
        riskLevel,
        factors,
        notes,
        assessedBy: session.user.id,
        assessedAt: new Date(),
      },
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
      message: "Risk assessment updated successfully",
      riskAssessment: updatedAssessment,
    });
  } catch (error) {
    console.error("Error updating risk assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
