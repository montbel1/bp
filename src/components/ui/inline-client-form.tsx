"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, X, User, Building } from "lucide-react";
import { toast } from "sonner";

interface InlineClientFormProps {
  onClientCreated: (client: any) => void;
  onCancel: () => void;
  type?: "client" | "customer";
  className?: string;
}

export function InlineClientForm({
  onClientCreated,
  onCancel,
  type = "client",
  className = "",
}: InlineClientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const endpoint = type === "client" ? "/api/clients" : "/api/customers";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create ${type}`);
      }

      const newClient = await response.json();
      onClientCreated(newClient);
      toast.success(
        `${type === "client" ? "Client" : "Customer"} created successfully!`
      );
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Add New {type === "client" ? "Client" : "Customer"}
            </CardTitle>
            <CardDescription>
              Create a new {type} for this{" "}
              {type === "client" ? "tax form" : "transaction"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={`${type === "client" ? "Client" : "Customer"} name`}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="Company name"
              />
            </div>
            {type === "client" && (
              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="Tax ID"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={(e) => handleSubmit(e)}
              disabled={creating || !formData.name}
              className="flex items-center gap-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create {type === "client" ? "Client" : "Customer"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InlineClientSelector({
  clients,
  selectedClient,
  onClientSelect,
  onShowForm,
  showForm,
  onClientCreated,
  onCancel,
  type = "client",
}: {
  clients: any[];
  selectedClient: string;
  onClientSelect: (clientId: string) => void;
  onShowForm: () => void;
  showForm: boolean;
  onClientCreated: (client: any) => void;
  onCancel: () => void;
  type?: "client" | "customer";
}) {
  return (
    <div className="space-y-4">
      {!showForm && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="client">
              Select {type === "client" ? "Client" : "Customer"}
            </Label>
            <Badge variant="outline" className="text-xs">
              {clients.length} available
            </Badge>
          </div>

          <select
            value={selectedClient}
            onChange={(e) => onClientSelect(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="">
              Choose a {type === "client" ? "client" : "customer"}...
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.companyName && `(${client.companyName})`}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 px-2">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onShowForm}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New {type === "client" ? "Client" : "Customer"}
          </Button>
        </div>
      )}

      {showForm && (
        <InlineClientForm
          onClientCreated={onClientCreated}
          onCancel={onCancel}
          type={type}
        />
      )}
    </div>
  );
}
