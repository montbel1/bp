import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        contacts: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        engagements: {
          include: {
            teamMembers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            engagements: true,
            documents: true,
            timeEntries: true,
            riskAssessments: true,
            conflictChecks: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
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

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      companyName,
      industry,
      taxId,
      website,
      notes,
      entityType,
      ein,
      revenue,
      employees,
      status,
      engagementStartDate,
      assignedToId,
    } = body;

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        companyName,
        industry,
        taxId,
        website,
        notes,
        entityType,
        ein,
        revenue: revenue ? parseFloat(revenue) : null,
        employees: employees ? parseInt(employees) : null,
        status,
        engagementStartDate: engagementStartDate ? new Date(engagementStartDate) : null,
        assignedToId,
      },
      include: {
        contacts: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if client has active engagements
    const activeEngagements = await prisma.engagement.count({
      where: {
        clientId: params.id,
        status: { in: ["PLANNING", "ACTIVE"] },
      },
    });

    if (activeEngagements > 0) {
      return NextResponse.json(
        { error: "Cannot delete client with active engagements" },
        { status: 400 }
      );
    }

    // Delete client (this will cascade delete related records)
    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 