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
          name: "ABC Supplies",
          email: "contact@abcsupplies.com",
          phone: "+1-555-0100",
          address: "100 Business Ave",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "US",
          status: "ACTIVE",
          totalBilled: 8000,
          totalPaid: 6000,
          balance: 2000,
          lastTransactionDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "XYZ Services",
          email: "info@xyzservices.com",
          phone: "+1-555-0200",
          address: "200 Service Blvd",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "US",
          status: "ACTIVE",
          totalBilled: 5000,
          totalPaid: 5000,
          balance: 0,
          lastTransactionDate: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "DEF Equipment",
          email: "sales@defequipment.com",
          phone: "+1-555-0300",
          address: "300 Industrial Dr",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "US",
          status: "INACTIVE",
          totalBilled: 3000,
          totalPaid: 3000,
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
      userId: session.user.id,
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

    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        bills: {
          select: {
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Calculate financial metrics for each vendor
    const vendorsWithMetrics = vendors.map((vendor) => {
      const totalBilled = vendor.bills.reduce(
        (sum, bill) => sum + bill.total,
        0
      );
      const totalPaid = vendor.bills
        .filter((bill) => bill.status === "PAID")
        .reduce((sum, bill) => sum + bill.total, 0);
      const balance = totalBilled - totalPaid;
      const lastTransactionDate =
        vendor.bills.length > 0
          ? vendor.bills.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0].createdAt
          : null;

      return {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipCode: vendor.zipCode,
        country: vendor.country,
        status: vendor.isActive ? "ACTIVE" : "INACTIVE",
        totalBilled,
        totalPaid,
        balance,
        lastTransactionDate,
        createdAt: vendor.createdAt,
      };
    });

    return NextResponse.json(vendorsWithMetrics);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
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

      // Return mock created vendor
      const mockVendor = {
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

      return NextResponse.json(mockVendor, { status: 201 });
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
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if vendor with same name already exists
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        userId: session.user.id,
        name: name.trim(),
      },
    });

    if (existingVendor) {
      return NextResponse.json(
        { error: "A vendor with this name already exists" },
        { status: 400 }
      );
    }

    // Create vendor
    const vendor = await prisma.vendor.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        email: email?.toLowerCase().trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null,
        country: country?.trim() || "US",
        isActive: status !== "INACTIVE",
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { error: "Failed to create vendor" },
      { status: 500 }
    );
  }
}
