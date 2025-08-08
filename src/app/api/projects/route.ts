import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      // Return mock data for development
      return NextResponse.json([
        {
          id: "1",
          name: "Website Redesign",
          description: "Complete redesign of company website",
          status: "IN_PROGRESS",
          startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
          budget: 25000,
          manager: "John Smith",
          teamSize: 5,
          progress: 45,
          customerId: "1",
          customer: {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
          },
          userId: "dev-user-id",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Mobile App Development",
          description: "iOS and Android app for client",
          status: "COMPLETED",
          startDate: new Date(Date.now() - 86400000 * 90).toISOString(),
          endDate: new Date(Date.now() - 86400000 * 10).toISOString(),
          budget: 50000,
          manager: "Jane Johnson",
          teamSize: 8,
          progress: 100,
          customerId: "2",
          customer: {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
          userId: "dev-user-id",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Database Migration",
          description: "Migrate legacy system to new database",
          status: "PLANNING",
          startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          endDate: new Date(Date.now() + 86400000 * 45).toISOString(),
          budget: 15000,
          manager: "Bob Wilson",
          teamSize: 3,
          progress: 0,
          customerId: "3",
          customer: {
            id: "3",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
          },
          userId: "dev-user-id",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      const body = await request.json();
      const {
        name,
        description,
        status,
        startDate,
        endDate,
        budget,
        manager,
        teamSize,
        customerId,
      } = body;

      if (!name) {
        return NextResponse.json(
          { error: "Project name is required" },
          { status: 400 }
        );
      }

      // Return mock created project
      const mockProject = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description?.trim() || "",
        status: status || "PLANNING",
        startDate: startDate
          ? new Date(startDate).toISOString()
          : new Date().toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        budget: parseFloat(budget) || 0,
        manager: manager?.trim() || "",
        teamSize: parseInt(teamSize) || 1,
        progress: 0,
        customerId: customerId || null,
        customer: customerId
          ? {
              id: customerId,
              name: "Test Customer",
              email: "test@example.com",
            }
          : null,
        userId: "dev-user-id",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(mockProject, { status: 201 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      budget,
      manager,
      teamSize,
      customerId,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || "",
        status: status || "PLANNING",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        budget: budget || 0,
        manager: manager || "",
        teamSize: teamSize || 1,
        progress: 0,
        customerId: customerId || null,
        userId: user.id,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
