"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  PenTool,
  Bell,
  User,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface TaxForm {
  id: string;
  formType: string;
  taxYear: number;
  status: "DRAFT" | "IN_REVIEW" | "PENDING_SIGNATURE" | "SIGNED" | "FINALIZED" | "SUBMITTED" | "REJECTED";
  dueDate: Date;
  progress: number;
  preparerName: string;
}

interface TaxDocument {
  id: string;
  name: string;
  fileType: string;
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED" | "SIGNED";
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

interface ClientTask {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  dueDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export default function TaxProPortalPage() {
  const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
    const sampleTaxForms: TaxForm[] = [
      {
        id: "1",
        formType: "1040",
        taxYear: 2024,
        status: "PENDING_SIGNATURE",
        dueDate: new Date(2024, 3, 15),
        progress: 90,
        preparerName: "Sarah Johnson, CPA",
      },
      {
        id: "2",
        formType: "Schedule C",
        taxYear: 2024,
        status: "IN_REVIEW",
        dueDate: new Date(2024, 3, 15),
        progress: 75,
        preparerName: "Sarah Johnson, CPA",
      },
    ];

    const sampleDocuments: TaxDocument[] = [
      {
        id: "1",
        name: "W-2 Form 2024",
        fileType: "PDF",
        status: "APPROVED",
        uploadedAt: new Date(2024, 1, 15),
        uploadedBy: "John Smith",
        description: "W-2 form from employer",
      },
      {
        id: "2",
        name: "1099-INT Statement",
        fileType: "PDF",
        status: "PENDING",
        uploadedAt: new Date(2024, 1, 20),
        uploadedBy: "John Smith",
        description: "Interest income statement",
      },
      {
        id: "3",
        name: "Business Expense Receipts",
        fileType: "IMAGE",
        status: "REVIEWED",
        uploadedAt: new Date(2024, 1, 18),
        uploadedBy: "John Smith",
        description: "Receipts for business expenses",
      },
    ];

    const sampleTasks: ClientTask[] = [
      {
        id: "1",
        title: "Review 1040 Tax Return",
        description: "Please review your completed 1040 tax return and sign if everything looks correct.",
        status: "PENDING",
        dueDate: new Date(2024, 2, 20),
        priority: "HIGH",
      },
      {
        id: "2",
        title: "Upload Missing Documents",
        description: "Please upload any missing tax documents for 2024.",
        status: "PENDING",
        dueDate: new Date(2024, 2, 10),
        priority: "URGENT",
      },
      {
        id: "3",
        title: "Sign Tax Authorization",
        description: "Please sign the tax preparation authorization form.",
        status: "COMPLETED",
        dueDate: new Date(2024, 1, 15),
        priority: "MEDIUM",
      },
    ];

    setTaxForms(sampleTaxForms);
    setDocuments(sampleDocuments);
    setTasks(sampleTasks);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-500";
      case "IN_REVIEW": return "bg-yellow-500";
      case "PENDING_SIGNATURE": return "bg-orange-500";
      case "SIGNED": return "bg-blue-500";
      case "FINALIZED": return "bg-green-500";
      case "SUBMITTED": return "bg-purple-500";
      case "REJECTED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "COMPLETED": return "bg-green-500";
      case "OVERDUE": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW": return "bg-green-500";
      case "MEDIUM": return "bg-blue-500";
      case "HIGH": return "bg-orange-500";
      case "URGENT": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      toast.success("Document uploaded successfully!");
      setIsUploading(false);
    }, 2000);
  };

  const handleSignDocument = (documentId: string) => {
    toast.success("Document signing functionality coming soon!");
  };

  const handleViewDocument = (documentId: string) => {
    toast.success("Document viewer coming soon!");
  };

  const handleDownloadDocument = (documentId: string) => {
    toast.success("Document download started!");
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: "COMPLETED" as const } : task
    ));
    toast.success("Task completed!");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TaxPro Client Portal</h1>
          <p className="text-gray-600">Welcome back, John Smith</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              Total documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxForms.length}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Until Deadline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              April 15, 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="forms">Tax Forms</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Due: {task.dueDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.status === "PENDING" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.description} • Uploaded: {doc.uploadedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <Badge variant="outline">{doc.fileType}</Badge>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {doc.status === "PENDING" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSignDocument(doc.id)}
                          >
                            <PenTool className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Tax Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">
                          {form.formType} - {form.taxYear}
                        </div>
                        <div className="text-sm text-gray-500">
                          Prepared by: {form.preparerName} • Due: {form.dueDate.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Progress: {form.progress}% Complete
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(form.status)}>
                        {form.status.replace("_", " ")}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {form.status === "PENDING_SIGNATURE" && (
                        <Button size="sm">
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-semibold text-gray-900">
                        Upload your tax documents
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF, Word, Excel, or images up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Common Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• W-2 Forms</li>
                        <li>• 1099 Statements</li>
                        <li>• Business Expense Receipts</li>
                        <li>• Mortgage Interest Statements</li>
                        <li>• Charitable Donation Receipts</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Document Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Pending Review:</span>
                          <Badge variant="outline">{documents.filter(d => d.status === "PENDING").length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Approved:</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {documents.filter(d => d.status === "APPROVED").length}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Signed:</span>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {documents.filter(d => d.status === "SIGNED").length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 