import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      // Return mock data for development
      return NextResponse.json([
        {
          id: "1",
          number: "INV-001",
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
          status: "DRAFT",
          subtotal: 1000,
          tax: 100,
          total: 1100,
          notes: "Sample invoice for testing",
          customer: {
            id: "test-customer",
            name: "Test Customer",
            email: "test@example.com",
          },
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
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

    const where: any = { userId: user.id };

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // In development, allow access even without session
    if (process.env.NODE_ENV !== "development" && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in database
    let user = await prisma.user.findUnique({
      where: { id: session!.user.id },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session!.user.id,
          email: session!.user.email || "dev@example.com",
          name: session!.user.name || "Development User",
          role: "USER",
          subscription: "BASIC",
          flowAccess: true,
        },
      });
    }

    const body = await request.json();
    const { customerId, date, dueDate, items, notes, tax } = body;

    // Validation
    if (!customerId) {
      return NextResponse.json(
        { error: "Customer is required" },
        { status: 400 }
      );
    }

    if (!date || !dueDate) {
      return NextResponse.json(
        { error: "Invoice date and due date are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.description || item.quantity <= 0 || item.unitPrice <= 0) {
        return NextResponse.json(
          {
            error: "All items must have description, quantity, and unit price",
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    );
    const total = subtotal + (tax || 0);

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const invoiceNumber = lastInvoice
      ? `INV-${String(parseInt(lastInvoice.number.split("-")[1]) + 1).padStart(6, "0")}`
      : "INV-000001";

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        date: new Date(date),
        dueDate: new Date(dueDate),
        subtotal,
        tax: tax || 0,
        total,
        notes: notes || null,
        status: "DRAFT",
        userId: user.id,
        customerId,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
