import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      // Return mock data for development
      return NextResponse.json([
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1-555-0123",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "US",
          status: "ACTIVE",
          totalInvoiced: 5000,
          totalPaid: 3500,
          balance: 1500,
          lastTransactionDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1-555-0456",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "US",
          status: "ACTIVE",
          totalInvoiced: 3000,
          totalPaid: 3000,
          balance: 0,
          lastTransactionDate: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          phone: "+1-555-0789",
          address: "789 Pine Rd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "US",
          status: "INACTIVE",
          totalInvoiced: 2000,
          totalPaid: 2000,
          balance: 0,
          lastTransactionDate: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      // Create user if it doesn't exist (for development)
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || "dev@example.com",
          name: session.user.name || "Development User",
          role: "USER",
          subscription: "BASIC",
          flowAccess: true,
        },
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build where clause
    const where: {
      userId: string;
      isActive?: boolean;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        phone?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      userId: user.id,
    };

    if (status && status !== "all") {
      where.isActive = status === "ACTIVE";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        invoices: {
          select: {
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Calculate financial metrics for each customer
    const customersWithMetrics = customers.map((customer) => {
      const totalInvoiced = customer.invoices.reduce(
        (sum, invoice) => sum + invoice.total,
        0
      );
      const totalPaid = customer.invoices
        .filter((invoice) => invoice.status === "PAID")
        .reduce((sum, invoice) => sum + invoice.total, 0);
      const balance = totalInvoiced - totalPaid;
      const lastTransactionDate =
        customer.invoices.length > 0
          ? customer.invoices.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0].createdAt
          : null;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        country: customer.country,
        status: customer.isActive ? "ACTIVE" : "INACTIVE",
        totalInvoiced,
        totalPaid,
        balance,
        lastTransactionDate,
        createdAt: customer.createdAt,
      };
    });

    return NextResponse.json(customersWithMetrics);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
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
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        status,
      } = body;

      // Validation
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      // Return mock created customer
      const mockCustomer = {
        id: Date.now().toString(),
        userId: "dev-user-id",
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null,
        country: country?.trim() || "US",
        isActive: status !== "INACTIVE",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(mockCustomer, { status: 201 });
    }

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
      status,
    } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      // Create user if it doesn't exist (for development)
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email || "dev@example.com",
          name: session.user.name || "Development User",
          role: "USER",
          subscription: "BASIC",
          flowAccess: true,
        },
      });
    }

    // Check if customer with same email already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        userId: user.id,
        email: email.toLowerCase(),
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "A customer with this email already exists" },
        { status: 400 }
      );
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null,
        country: country?.trim() || "US",
        isActive: status !== "INACTIVE",
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
