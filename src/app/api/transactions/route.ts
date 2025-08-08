import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { query } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // In development, allow access even without session
    if (process.env.NODE_ENV === "development") {
      try {
        // Query the database for transactions
        const result = await query(`
          SELECT 
            t.id,
            t.date,
            t.description,
            t.amount,
            t.type,
            t.reference,
            t.is_reconciled as "isReconciled",
            t.created_at as "createdAt",
            a.id as "accountId",
            a.name as "accountName",
            a.type as "accountType",
            c.id as "categoryId",
            c.name as "categoryName"
          FROM transactions t
          LEFT JOIN accounts a ON t.account_id = a.id
          LEFT JOIN categories c ON t.category_id = c.id
          ORDER BY t.date DESC
        `);

        // Transform the data to match the expected format
        const transactions = result.rows.map(row => ({
          id: row.id,
          date: row.date,
          description: row.description,
          amount: parseFloat(row.amount),
          type: row.type,
          reference: row.reference,
          isReconciled: row.isReconciled,
          account: row.accountId ? {
            id: row.accountId,
            name: row.accountName,
            type: row.accountType,
          } : null,
          category: row.categoryId ? {
            id: row.categoryId,
            name: row.categoryName,
          } : null,
          createdAt: row.createdAt,
        }));

        return NextResponse.json(transactions);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Fallback to mock data if database fails
        return NextResponse.json([
          {
            id: "1",
            date: new Date().toISOString().split("T")[0],
            description: "Office supplies purchase",
            amount: 150.0,
            type: "DEBIT",
            reference: "INV-001",
            isReconciled: false,
            account: {
              id: "account-1",
              name: "Checking Account",
              type: "BANK",
            },
            category: {
              id: "category-1",
              name: "Office Supplies",
            },
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            description: "Consulting fee from Acme Corp",
            amount: 2500.0,
            type: "CREDIT",
            reference: "INV-002",
            isReconciled: true,
            account: {
              id: "account-1",
              name: "Checking Account",
              type: "BANK",
            },
            category: {
              id: "category-2",
              name: "Consulting Revenue",
            },
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const categoryId = searchParams.get("categoryId");
    const type = searchParams.get("type");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const limit = searchParams.get("limit");

    // Build where clause
    const where: {
      userId: string;
      accountId?: string;
      categoryId?: string;
      type?: "DEBIT" | "CREDIT";
      date?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      userId: session.user.id,
    };

    if (accountId) {
      where.accountId = accountId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (type) {
      where.type = type as "DEBIT" | "CREDIT";
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build query for Supabase
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        accounts(id, name, type),
        categories(id, name)
      `
      )
      .eq("user_id", user.id);

    if (accountId) {
      query = query.eq("account_id", accountId);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }

    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    query = query.order("date", { ascending: false });

    const { data: transactions, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      date,
      description,
      amount,
      type,
      accountId,
      categoryId,
      reference,
    } = body;

    // Validate required fields
    if (!date || !description || !amount || !type || !accountId) {
      return NextResponse.json(
        { error: "Date, description, amount, type, and account are required" },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if account exists and belongs to user
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id, name, type, balance")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Check if category exists and belongs to user (if provided)
    if (categoryId) {
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("id", categoryId)
        .eq("user_id", user.id)
        .single();

      if (categoryError || !category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    // Create the transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        date: new Date(date).toISOString().split("T")[0],
        description,
        amount: parseFloat(amount),
        type,
        reference: reference || null,
        account_id: accountId,
        category_id: categoryId || null,
        user_id: user.id,
      })
      .select(
        `
        *,
        accounts(id, name, type),
        categories(id, name)
      `
      )
      .single();

    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 }
      );
    }

    // Update account balance
    const balanceChange = type === "CREDIT" ? amount : -amount;
    const newBalance = parseFloat(account.balance) + balanceChange;

    const { error: balanceError } = await supabase
      .from("accounts")
      .update({ balance: newBalance })
      .eq("id", accountId);

    if (balanceError) {
      console.error("Error updating account balance:", balanceError);
    }

    console.log("Transaction created successfully:", transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
