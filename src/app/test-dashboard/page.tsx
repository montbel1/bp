"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Server,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Activity,
  BarChart3,
  Settings,
  Users,
  FileText,
  CreditCard,
  Calendar,
  Bell,
  Zap,
} from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

interface APITestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  totalDuration: number;
}

interface CategoryStat {
  category: string;
  total: number;
  passed: number;
  failed: number;
  successRate: string;
}

export default function TestDashboardPage() {
  const [databaseTests, setDatabaseTests] = useState<any>(null);
  const [apiTests, setApiTests] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("database");

  const runDatabaseTests = async (type: string = "all") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-db?type=${type}`);
      const data = await response.json();
      setDatabaseTests(data);
    } catch (error) {
      console.error("Database test error:", error);
      setDatabaseTests({
        success: false,
        error: "Failed to run database tests",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAPITests = async (type: string = "all") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/test-api?type=${type}`);
      const data = await response.json();
      setApiTests(data);
    } catch (error) {
      console.error("API test error:", error);
      setApiTests({ success: false, error: "Failed to run API tests" });
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    try {
      await Promise.all([runDatabaseTests("all"), runAPITests("all")]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Passed
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  const formatDuration = (duration: number) => {
    return `${duration}ms`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      database: Database,
      accounts: CreditCard,
      customers: Users,
      transactions: Activity,
      invoices: FileText,
      payments: CreditCard,
      categories: BarChart3,
      clients: Users,
      vendors: Users,
      bills: FileText,
      projects: Settings,
      calendar: Calendar,
      reports: BarChart3,
      notifications: Bell,
      settings: Settings,
      advanced: Zap,
    };
    return icons[category] || Activity;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive testing for PostgreSQL and Supabase backend
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => runDatabaseTests("all")}
            disabled={loading}
            variant="outline"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Database
          </Button>
          <Button
            onClick={() => runAPITests("all")}
            disabled={loading}
            variant="outline"
          >
            <Server className="h-4 w-4 mr-2" />
            Test API
          </Button>
          <Button onClick={runAllTests} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Run All Tests
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="database">Database Tests</TabsTrigger>
          <TabsTrigger value="api">API Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-6">
          {databaseTests ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Test Summary
                  </CardTitle>
                  <CardDescription>
                    PostgreSQL and Supabase connection and operation tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {databaseTests.summary && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {databaseTests.summary.total}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Tests
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {databaseTests.summary.passed}
                          </div>
                          <div className="text-sm text-gray-600">Passed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {databaseTests.summary.failed}
                          </div>
                          <div className="text-sm text-gray-600">Failed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatDuration(
                              databaseTests.summary.totalDuration
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Time
                          </div>
                        </div>
                      </div>

                      <Progress
                        value={
                          (databaseTests.summary.passed /
                            databaseTests.summary.total) *
                          100
                        }
                        className="h-2"
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Success Rate:{" "}
                          {(
                            (databaseTests.summary.passed /
                              databaseTests.summary.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                        {getStatusBadge(databaseTests.summary.failed === 0)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {databaseTests.results?.map(
                  (result: TestResult, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(result.success)}
                              <span className="font-medium">
                                {result.message}
                              </span>
                            </div>
                            {result.error && (
                              <p className="text-sm text-red-600 mt-1">
                                {result.error}
                              </p>
                            )}
                            {result.data && (
                              <div className="text-sm text-gray-600 mt-2">
                                <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {result.duration
                              ? formatDuration(result.duration)
                              : "N/A"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  No database test results available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          {apiTests ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    API Test Summary
                  </CardTitle>
                  <CardDescription>
                    Backend API endpoint functionality tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {apiTests.summary && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {apiTests.summary.total}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Tests
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {apiTests.summary.passed}
                          </div>
                          <div className="text-sm text-gray-600">Passed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {apiTests.summary.failed}
                          </div>
                          <div className="text-sm text-gray-600">Failed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatDuration(apiTests.summary.totalDuration)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Time
                          </div>
                        </div>
                      </div>

                      <Progress
                        value={
                          (apiTests.summary.passed / apiTests.summary.total) *
                          100
                        }
                        className="h-2"
                      />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Success Rate:{" "}
                          {(
                            (apiTests.summary.passed / apiTests.summary.total) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                        {getStatusBadge(apiTests.summary.failed === 0)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {apiTests.categoryStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Results by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {apiTests.categoryStats.map((stat: CategoryStat) => {
                        const Icon = getCategoryIcon(stat.category);
                        return (
                          <div
                            key={stat.category}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-4 w-4" />
                              <span className="font-medium capitalize">
                                {stat.category}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Total:</span>
                                <span className="font-medium">
                                  {stat.total}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Passed:</span>
                                <span className="font-medium text-green-600">
                                  {stat.passed}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Failed:</span>
                                <span className="font-medium text-red-600">
                                  {stat.failed}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Success Rate:</span>
                                <span className="font-medium">
                                  {stat.successRate}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-4">
                {apiTests.allResults?.map(
                  (result: APITestResult, index: number) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(result.success)}
                              <span className="font-medium">
                                {result.method} {result.endpoint}
                              </span>
                              {result.statusCode && (
                                <Badge variant="outline">
                                  HTTP {result.statusCode}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {result.message}
                            </p>
                            {result.error && (
                              <p className="text-sm text-red-600">
                                {result.error}
                              </p>
                            )}
                            {result.data && (
                              <div className="text-sm text-gray-600 mt-2">
                                <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                                  {JSON.stringify(result.data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {result.duration
                              ? formatDuration(result.duration)
                              : "N/A"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  No API test results available
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {databaseTests?.error && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Database test error: {databaseTests.error}
          </AlertDescription>
        </Alert>
      )}

      {apiTests?.error && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>API test error: {apiTests.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
