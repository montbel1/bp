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

    // Fetch transaction with account and category details
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        account:accounts(id, name, type),
        category:categories(id, name)
      `
      )
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (error || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedTransaction = {
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      reference: transaction.reference,
      isReconciled: transaction.is_reconciled,
      account: transaction.account,
      category: transaction.category,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    };

    return NextResponse.json(transformedTransaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
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
      date,
      description,
      amount,
      type,
      accountId,
      categoryId,
      reference,
      isReconciled,
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

    // Check if transaction exists and belongs to user
    const { data: existingTransaction, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (checkError || !existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from("transactions")
      .update({
        date,
        description,
        amount,
        type,
        account_id: accountId,
        category_id: categoryId,
        reference,
        is_reconciled: isReconciled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .select(
        `
        *,
        account:accounts(id, name, type),
        category:categories(id, name)
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating transaction:", updateError);
      return NextResponse.json(
        { error: "Failed to update transaction" },
        { status: 500 }
      );
    }

    // Transform the response
    const transformedTransaction = {
      id: updatedTransaction.id,
      date: updatedTransaction.date,
      description: updatedTransaction.description,
      amount: updatedTransaction.amount,
      type: updatedTransaction.type,
      reference: updatedTransaction.reference,
      isReconciled: updatedTransaction.is_reconciled,
      account: updatedTransaction.account,
      category: updatedTransaction.category,
      createdAt: updatedTransaction.created_at,
      updatedAt: updatedTransaction.updated_at,
    };

    return NextResponse.json(transformedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
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

    // Check if transaction exists and belongs to user
    const { data: existingTransaction, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single();

    if (checkError || !existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Delete transaction
    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", params.id)
      .eq("user_id", session.user.id);

    if (deleteError) {
      console.error("Error deleting transaction:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
