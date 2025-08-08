import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiTester } from "@/lib/api-test-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get("type") || "all";
    const specificTests = searchParams.get("tests")?.split(",") || [];

    let testResults;

    if (specificTests.length > 0) {
      testResults = await apiTester.runSpecificTests(specificTests);
    } else {
      switch (testType) {
        case "database":
          testResults = await apiTester.runSpecificTests(["database"]);
          break;

        case "core":
          testResults = await apiTester.runSpecificTests([
            "accounts",
            "customers",
            "transactions",
            "invoices",
            "payments",
          ]);
          break;

        case "management":
          testResults = await apiTester.runSpecificTests([
            "clients",
            "vendors",
            "bills",
            "projects",
            "categories",
          ]);
          break;

        case "features":
          testResults = await apiTester.runSpecificTests([
            "calendar",
            "reports",
            "notifications",
            "settings",
          ]);
          break;

        case "advanced":
          testResults = await apiTester.runSpecificTests(["advanced"]);
          break;

        default: // 'all'
          testResults = await apiTester.runAllAPITests();
          break;
      }
    }

    // Group results by endpoint type for better organization
    const groupedResults = {
      database: testResults.results.filter((r) =>
        r.endpoint.includes("/test-db")
      ),
      accounts: testResults.results.filter((r) =>
        r.endpoint.includes("/accounts")
      ),
      customers: testResults.results.filter((r) =>
        r.endpoint.includes("/customers")
      ),
      transactions: testResults.results.filter((r) =>
        r.endpoint.includes("/transactions")
      ),
      invoices: testResults.results.filter((r) =>
        r.endpoint.includes("/invoices")
      ),
      payments: testResults.results.filter((r) =>
        r.endpoint.includes("/payments")
      ),
      categories: testResults.results.filter((r) =>
        r.endpoint.includes("/categories")
      ),
      clients: testResults.results.filter((r) =>
        r.endpoint.includes("/clients")
      ),
      vendors: testResults.results.filter((r) =>
        r.endpoint.includes("/vendors")
      ),
      bills: testResults.results.filter((r) => r.endpoint.includes("/bills")),
      projects: testResults.results.filter((r) =>
        r.endpoint.includes("/projects")
      ),
      calendar: testResults.results.filter((r) =>
        r.endpoint.includes("/calendar")
      ),
      reports: testResults.results.filter((r) =>
        r.endpoint.includes("/reports")
      ),
      notifications: testResults.results.filter((r) =>
        r.endpoint.includes("/notifications")
      ),
      settings: testResults.results.filter((r) =>
        r.endpoint.includes("/settings")
      ),
      advanced: testResults.results.filter(
        (r) =>
          r.endpoint.includes("/blockchain") ||
          r.endpoint.includes("/iot") ||
          r.endpoint.includes("/mobile") ||
          r.endpoint.includes("/flow") ||
          r.endpoint.includes("/taxpro") ||
          r.endpoint.includes("/bank-accounts")
      ),
    };

    // Calculate success rates by category
    const categoryStats = Object.entries(groupedResults).map(
      ([category, results]) => ({
        category,
        total: results.length,
        passed: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        successRate:
          results.length > 0
            ? (
                (results.filter((r) => r.success).length / results.length) *
                100
              ).toFixed(1)
            : "0.0",
      })
    );

    return NextResponse.json({
      success: testResults.summary.failed === 0,
      message: `API tests completed: ${testResults.summary.passed}/${testResults.summary.total} passed`,
      session: session?.user,
      summary: testResults.summary,
      categoryStats,
      groupedResults,
      allResults: testResults.results,
      timestamp: new Date().toISOString(),
      testType,
      specificTests: specificTests.length > 0 ? specificTests : undefined,
    });
  } catch (error) {
    console.error("API test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        session: null,
        summary: { total: 0, passed: 0, failed: 1, totalDuration: 0 },
        categoryStats: [],
        groupedResults: {},
        allResults: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
