#!/usr/bin/env node

const fetch = require("node-fetch");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const startTime = Date.now();

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json().catch(() => null);
      const duration = Date.now() - startTime;

      return {
        endpoint,
        method: options.method || "GET",
        success: response.ok,
        statusCode: response.status,
        message: response.ok
          ? "Request successful"
          : `Request failed with status ${response.status}`,
        data,
        error: !response.ok
          ? data?.error || `HTTP ${response.status}`
          : undefined,
        duration,
      };
    } catch (error) {
      return {
        endpoint,
        method: options.method || "GET",
        success: false,
        message: "Request failed",
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  async runDatabaseTests() {
    console.log("\n🔍 Running Database Tests...");

    const tests = [
      { endpoint: "/api/test-db", name: "All Database Tests" },
      { endpoint: "/api/test-db?type=connection", name: "Connection Tests" },
      { endpoint: "/api/test-db?type=tables", name: "Table Existence Tests" },
      { endpoint: "/api/test-db?type=crud", name: "CRUD Operation Tests" },
      { endpoint: "/api/test-db?type=advanced", name: "Advanced Query Tests" },
    ];

    for (const test of tests) {
      const result = await this.makeRequest(test.endpoint);
      this.results.push(result);

      const status = result.success ? "✅" : "❌";
      console.log(`${status} ${test.name}: ${result.message}`);

      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }

  async runAPITests() {
    console.log("\n🌐 Running API Tests...");

    const testSuites = [
      {
        name: "Core Business Logic",
        endpoints: ["/api/accounts", "/api/customers", "/api/transactions"],
      },
      {
        name: "Financial Operations",
        endpoints: ["/api/invoices", "/api/payments", "/api/bills"],
      },
      {
        name: "Management Systems",
        endpoints: ["/api/clients", "/api/vendors", "/api/projects"],
      },
      {
        name: "Supporting Features",
        endpoints: ["/api/categories", "/api/calendar", "/api/reports"],
      },
      {
        name: "Advanced Features",
        endpoints: [
          "/api/blockchain/cryptocurrencies",
          "/api/iot/devices",
          "/api/flow/jobs",
        ],
      },
    ];

    for (const suite of testSuites) {
      console.log(`\n📋 Testing ${suite.name}...`);

      for (const endpoint of suite.endpoints) {
        const result = await this.makeRequest(endpoint);
        this.results.push(result);

        const status = result.success ? "✅" : "❌";
        console.log(
          `  ${status} ${result.method} ${endpoint}: ${result.message}`
        );

        if (!result.success && result.error) {
          console.log(`     Error: ${result.error}`);
        }
      }
    }
  }

  async runComprehensiveTests() {
    console.log("\n🚀 Running Comprehensive Backend Tests...");
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Start Time: ${new Date().toISOString()}`);

    await this.runDatabaseTests();
    await this.runAPITests();

    this.generateReport();
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.success).length;
    const failed = this.results.filter((r) => !r.success).length;
    const total = this.results.length;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY REPORT");
    console.log("=".repeat(60));

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Total Duration: ${totalDuration}ms`);

    if (failed > 0) {
      console.log("\n❌ FAILED TESTS:");
      this.results
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(`  • ${result.method} ${result.endpoint}`);
          console.log(`    Error: ${result.error}`);
        });
    }

    console.log("\n" + "=".repeat(60));

    // Save detailed results to file
    const fs = require("fs");
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed,
        failed,
        successRate: parseFloat(successRate),
        totalDuration,
      },
      results: this.results,
    };

    const reportFile = `test-results-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    console.log(`📄 Detailed results saved to: ${reportFile}`);

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const testType = args[0] || "all";

async function main() {
  const runner = new TestRunner();

  try {
    switch (testType) {
      case "database":
        await runner.runDatabaseTests();
        break;
      case "api":
        await runner.runAPITests();
        break;
      case "all":
      default:
        await runner.runComprehensiveTests();
        break;
    }
  } catch (error) {
    console.error("Test runner error:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n⚠️  Tests interrupted by user");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = TestRunner;
