"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Building,
  Tag,
  CreditCard,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  reference: string | null;
  isReconciled: boolean;
  account?: {
    id: string;
    name: string;
    type: string;
  };
  category?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    transactionId: string | null;
    transactionDescription: string;
  }>({
    isOpen: false,
    transactionId: null,
    transactionDescription: "",
  });

  const transactionId = params.id as string;

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transactions/${transactionId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Transaction not found");
        } else {
          setError("Failed to load transaction");
        }
        return;
      }

      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.transactionId) return;

    try {
      const response = await fetch(
        `/api/transactions/${deleteDialog.transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        router.push("/transactions");
      } else {
        setError("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction");
    } finally {
      closeDeleteDialog();
    }
  };

  const openDeleteDialog = () => {
    if (!transaction) return;

    setDeleteDialog({
      isOpen: true,
      transactionId: transaction.id,
      transactionDescription: transaction.description,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      transactionId: null,
      transactionDescription: "",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transaction...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-5 w-5" />
              <span>Transaction not found</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <p className="text-gray-600">View transaction information</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/transactions/${transaction.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={openDeleteDialog}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Transaction Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {transaction.description}
                </CardTitle>
                <CardDescription>
                  Transaction ID: {transaction.id}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    transaction.type === "CREDIT" ? "default" : "secondary"
                  }
                >
                  {transaction.type}
                </Badge>
                {transaction.isReconciled && (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Reconciled
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p
                    className={`text-xl font-bold ${transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "CREDIT" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(transaction.date)}</p>
                </div>
              </div>

              {/* Account */}
              {transaction.account && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account</p>
                    <p className="font-medium">{transaction.account.name}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.account.type}
                    </p>
                  </div>
                </div>
              )}

              {/* Category */}
              {transaction.category && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Tag className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{transaction.category.name}</p>
                  </div>
                </div>
              )}

              {/* Reference */}
              {transaction.reference && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reference</p>
                    <p className="font-medium">{transaction.reference}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(transaction.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete the transaction "${deleteDialog.transactionDescription}"? This action cannot be undone.`}
      />
    </div>
  );
}
