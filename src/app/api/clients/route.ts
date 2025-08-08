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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = { userId: session.user.id };

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get clients with pagination
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          contacts: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              engagements: true,
              documents: true,
              timeEntries: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
      status = "ACTIVE",
      engagementStartDate,
      contacts,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    // Check for duplicate client
    const existingClient = await prisma.client.findFirst({
      where: {
        userId: session.user.id,
        OR: [
          { name: name },
          { email: email || "" },
          { companyName: companyName || "" },
        ],
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "Client already exists" },
        { status: 409 }
      );
    }

    // Create client with contacts
    const client = await prisma.client.create({
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
        userId: session.user.id,
        contacts: {
          create: contacts?.map((contact: any) => ({
            name: contact.name,
            title: contact.title,
            email: contact.email,
            phone: contact.phone,
            isPrimary: contact.isPrimary || false,
          })) || [],
        },
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

    // Generate unique client ID (CLI-YYYY-XXX format)
    const year = new Date().getFullYear();
    const clientCount = await prisma.client.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });
    
    const clientId = `CLI-${year}-${String(clientCount).padStart(3, "0")}`;

    return NextResponse.json({
      message: "Client created successfully",
      client: {
        ...client,
        clientId,
      },
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
