"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Send,
  FileText,
  DollarSign,
  Calendar,
  Building,
} from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface Bill {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: "DRAFT" | "RECEIVED" | "PAID" | "OVERDUE" | "CANCELLED";
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  vendor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch("/api/bills");
      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      setError("Failed to load bills");
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bill: Bill) => {
    setBillToDelete(bill);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;

    try {
      const response = await fetch(`/api/bills/${billToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bill");
      }

      setBills(bills.filter((b) => b.id !== billToDelete.id));
      setDeleteDialogOpen(false);
      setBillToDelete(null);
    } catch (error) {
      setError("Failed to delete bill");
      console.error("Error deleting bill:", error);
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.vendor?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "RECEIVED":
        return "secondary";
      case "DRAFT":
        return "outline";
      case "OVERDUE":
        return "destructive";
      case "CANCELLED":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading bills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
            <p className="text-gray-600">
              Manage your vendor bills and expenses
            </p>
          </div>
          <Link href="/bills/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Bill
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bills.length}</div>
              <p className="text-xs text-muted-foreground">
                {bills.filter((b) => b.status === "DRAFT").length} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Outstanding
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  bills
                    .filter((b) => ["RECEIVED", "OVERDUE"].includes(b.status))
                    .reduce((sum, b) => sum + b.total, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  bills.filter((b) =>
                    ["RECEIVED", "OVERDUE"].includes(b.status)
                  ).length
                }{" "}
                unpaid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  bills
                    .filter((b) => b.status === "PAID")
                    .reduce((sum, b) => sum + b.total, 0)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {bills.filter((b) => b.status === "PAID").length} paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {bills.filter((b) => b.status === "OVERDUE").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(
                  bills
                    .filter((b) => b.status === "OVERDUE")
                    .reduce((sum, b) => sum + b.total, 0)
                )}{" "}
                overdue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search bills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="RECEIVED">Received</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bill List</CardTitle>
            <CardDescription>
              {filteredBills.length} of {bills.length} bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBills.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.number}</div>
                          <div className="text-sm text-gray-500">
                            {bill.notes
                              ? `${bill.notes.substring(0, 30)}...`
                              : "No notes"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {bill.vendor?.name || "Unknown Vendor"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bill.vendor?.email || "No email"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(bill.date)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(bill.dueDate) < new Date() &&
                            bill.status !== "PAID"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {formatDate(bill.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">
                          {formatCurrency(bill.total)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/bills/${bill.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/bills/${bill.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {bill.status === "DRAFT" && (
                            <Button variant="outline" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {bill.status === "DRAFT" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(bill)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bills found
                </h3>
                <p className="text-gray-500 mb-6">
                  {bills.length === 0
                    ? "Get started by creating your first bill."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {bills.length === 0 && (
                  <Link href="/bills/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Bill
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Bill"
        description="Are you sure you want to delete this bill? This action cannot be undone."
        itemName={billToDelete?.number}
      />
    </div>
  );
}
