import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // In development, allow access even without session
    if (process.env.NODE_ENV !== "development" && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      number,
      description,
      isActive,
      openingBalance,
      openingBalanceDate,
    } = body;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Creating account with data:", {
      name,
      type,
      number,
      description,
      isActive,
      userId: session.user.id,
    });

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    // Check if account number already exists (if provided)
    if (number) {
      const existingAccount = await prisma.chartAccount.findUnique({
        where: { number },
      });
      if (existingAccount) {
        return NextResponse.json(
          { error: "Account number already exists" },
          { status: 400 }
        );
      }
    }

    // Create the account
    const account = await prisma.chartAccount.create({
      data: {
        name,
        type,
        number: number || null,
        description: description || null,
        isActive: isActive ?? true,
        userId: session!.user.id,
      },
    });

    // Handle opening balance if provided
    if (openingBalance && parseFloat(openingBalance) !== 0) {
      try {
        // Get or create Opening Balance Equity account
        let openingBalanceEquity = await prisma.chartAccount.findFirst({
          where: {
            name: "Opening Balance Equity",
            userId: session!.user.id,
          },
        });

        if (!openingBalanceEquity) {
          openingBalanceEquity = await prisma.chartAccount.create({
            data: {
              name: "Opening Balance Equity",
              type: "EQUITY",
              number: "3000",
              description: "System account for opening balance transactions",
              isActive: true,
              userId: session!.user.id,
            },
          });
        }

        // Create opening balance transaction
        const openingBalanceAmount = parseFloat(openingBalance);
        const transactionDate = openingBalanceDate
          ? new Date(openingBalanceDate)
          : new Date();

        // Create the transaction (this would need a Transaction model)
        // For now, we'll update the account balance directly
        await prisma.chartAccount.update({
          where: { id: account.id },
          data: {
            balance: openingBalanceAmount,
          },
        });

        console.log(
          `Opening balance of ${openingBalanceAmount} set for account ${account.name}`
        );
      } catch (error) {
        console.error("Error setting opening balance:", error);
        // Don't fail the account creation if opening balance fails
      }
    }

    console.log("Account created successfully:", account);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      try {
        // Query the database for accounts
        const result = await query(`
          SELECT 
            id,
            name,
            type,
            number,
            description,
            balance,
            is_active as "isActive",
            user_id as "userId"
          FROM accounts
          ORDER BY type, number, name
        `);

        return NextResponse.json(result.rows);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fallback to mock data if database fails
        return NextResponse.json([
          {
            id: "account-1",
            name: "Checking Account",
            type: "BANK",
            number: "1001",
            description: "Primary business checking account",
            balance: 50000.0,
            isActive: true,
            userId: "dev-user-id",
          },
          {
            id: "account-2",
            name: "Credit Card",
            type: "CREDIT",
            number: "2001",
            description: "Business credit card",
            balance: -2500.0,
            isActive: true,
            userId: "dev-user-id",
          },
        ]);
      }
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");

    // Build where clause
    const where: {
      userId: string;
      type?: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
      isActive?: boolean;
    } = {
      userId: session.user.id,
    };

    if (type) {
      where.type = type as
        | "ASSET"
        | "LIABILITY"
        | "EQUITY"
        | "REVENUE"
        | "EXPENSE";
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // Fetch accounts
    const accounts = await prisma.chartAccount.findMany({
      where,
      orderBy: [{ type: "asc" }, { number: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
