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
          number: "BILL-001",
          vendorId: "1",
          vendor: {
            id: "1",
            name: "ABC Supplies",
            email: "contact@abcsupplies.com",
          },
          amount: 1500,
          tax: 150,
          total: 1650,
          status: "RECEIVED",
          dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
          receivedDate: new Date().toISOString(),
          notes: "Monthly supplies invoice",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          number: "BILL-002",
          vendorId: "2",
          vendor: {
            id: "2",
            name: "XYZ Services",
            email: "info@xyzservices.com",
          },
          amount: 2000,
          tax: 200,
          total: 2200,
          status: "PAID",
          dueDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          receivedDate: new Date(Date.now() - 86400000 * 14).toISOString(),
          paidDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          notes: "Consulting services",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          number: "BILL-003",
          vendorId: "3",
          vendor: {
            id: "3",
            name: "DEF Equipment",
            email: "sales@defequipment.com",
          },
          amount: 3000,
          tax: 300,
          total: 3300,
          status: "OVERDUE",
          dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          receivedDate: new Date(Date.now() - 86400000 * 20).toISOString(),
          notes: "Equipment purchase",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const vendorId = searchParams.get("vendorId");

    // Build where clause
    const where: {
      userId: string;
      status?: "DRAFT" | "RECEIVED" | "PAID" | "OVERDUE" | "CANCELLED";
      vendorId?: string;
      OR?: Array<{
        number?: { contains: string; mode: "insensitive" };
        vendor?: {
          name?: { contains: string; mode: "insensitive" };
          email?: { contains: string; mode: "insensitive" };
        };
      }>;
    } = {
      userId: session.user.id,
    };

    if (status && status !== "all") {
      where.status = status as
        | "DRAFT"
        | "RECEIVED"
        | "PAID"
        | "OVERDUE"
        | "CANCELLED";
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { vendor: { name: { contains: search, mode: "insensitive" } } },
        { vendor: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const bills = await prisma.bill.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update overdue status for bills past due date
    const updatedBills = await Promise.all(
      bills.map(async (bill) => {
        if (bill.status === "RECEIVED" && new Date(bill.dueDate) < new Date()) {
          const updatedBill = await prisma.bill.update({
            where: { id: bill.id },
            data: { status: "OVERDUE" },
            include: {
              vendor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          });
          return updatedBill;
        }
        return bill;
      })
    );

    return NextResponse.json(updatedBills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
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
        vendorId,
        number,
        amount,
        tax,
        total,
        dueDate,
        receivedDate,
        notes,
      } = body;

      // Validation
      if (!vendorId || !number || !amount || !total) {
        return NextResponse.json(
          { error: "Vendor, number, amount, and total are required" },
          { status: 400 }
        );
      }

      // Return mock created bill
      const mockBill = {
        id: Date.now().toString(),
        userId: "dev-user-id",
        vendorId,
        number: number.trim(),
        amount: parseFloat(amount),
        tax: parseFloat(tax) || 0,
        total: parseFloat(total),
        status: "DRAFT",
        dueDate: dueDate || new Date(Date.now() + 86400000 * 30).toISOString(),
        receivedDate: receivedDate || new Date().toISOString(),
        notes: notes?.trim() || null,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(mockBill, { status: 201 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vendorId, date, dueDate, items, notes, tax } = body;

    // Validation
    if (!vendorId || !date || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Vendor, dates, and at least one item are required" },
        { status: 400 }
      );
    }

    // Check if vendor exists and belongs to user
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: vendorId,
        userId: session.user.id,
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Generate bill number
    const lastBill = await prisma.bill.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const billNumber = lastBill
      ? `BILL-${String(parseInt(lastBill.number.split("-")[1]) + 1).padStart(4, "0")}`
      : "BILL-0001";

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = tax || 0;
    const total = subtotal + taxAmount;

    // Create bill with items
    const bill = await prisma.bill.create({
      data: {
        userId: session.user.id,
        vendorId,
        number: billNumber,
        date: new Date(date),
        dueDate: new Date(dueDate),
        status: "DRAFT",
        subtotal,
        tax: taxAmount,
        total,
        notes: notes?.trim() || null,
        items: {
          create: items.map(
            (item: {
              description: string;
              quantity: number;
              unitPrice: number;
            }) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })
          ),
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}
