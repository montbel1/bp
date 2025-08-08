"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  Download,
  Send,
  Printer,
  Eye,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items: InvoiceItem[];
  createdAt: string;
}

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      setError("Failed to load invoice");
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!invoice) return;
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send invoice");
      }

      toast.success("Invoice sent successfully!");
      fetchInvoice(); // Refresh the invoice data
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send invoice"
      );
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice!.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRecordPayment = async () => {
    if (!invoice) return;
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          customerId: invoice.customer.id,
          amount: invoice.total,
          method: "CREDIT_CARD",
          reference: `Payment for ${invoice.number}`,
          notes: "Payment recorded manually",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to record payment");
      }

      toast.success("Payment recorded successfully!");
      // Refresh the invoice data
      fetchInvoice();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to record payment"
      );
    }
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "secondary";
      case "SENT":
        return "default";
      case "PAID":
        return "default";
      case "OVERDUE":
        return "destructive";
      case "CANCELLED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading invoice...</span>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <Link href="/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/invoices">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Invoice {invoice.number}
              </h1>
              <p className="text-gray-600">View invoice details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(invoice.status)}>
              {invoice.status}
            </Badge>
            <Link href={`/invoices/${invoice.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="print:shadow-none">
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    INVOICE
                  </h2>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Invoice Number:</strong> {invoice.number}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(invoice.date)}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Status:</strong>
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(invoice.status)}
                      className="mt-1"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bill To / From */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {invoice.customer?.name || "Unknown Customer"}
                    </p>
                    {invoice.customer?.email && <p>{invoice.customer.email}</p>}
                    {invoice.customer?.phone && <p>{invoice.customer.phone}</p>}
                    {invoice.customer?.address && (
                      <div>
                        <p>{invoice.customer.address}</p>
                        <p>
                          {invoice.customer.city &&
                            `${invoice.customer.city}, `}
                          {invoice.customer.state &&
                            `${invoice.customer.state} `}
                          {invoice.customer.zipCode}
                        </p>
                        {invoice.customer.country && (
                          <p>{invoice.customer.country}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Your Company Name</p>
                    <p>your-email@company.com</p>
                    <p>123 Business Street</p>
                    <p>City, State 12345</p>
                    <p>United States</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Unit Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3 px-4 text-gray-900">
                          {item.description}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      {formatCurrency(invoice.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-gray-200 font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
                  <p className="text-gray-600 text-sm">{invoice.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-8 border-t border-gray-200 print:hidden">
                {invoice.status !== "PAID" && (
                  <Button onClick={handleSendInvoice}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                )}
                {invoice.status === "SENT" && (
                  <Button
                    onClick={handleRecordPayment}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
                <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
