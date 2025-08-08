import { supabase } from "./supabase";
import { getPostgreSQLPool } from "./db";

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  duration?: number;
}

export class DatabaseTester {
  private results: TestResult[] = [];

  async testSupabaseConnection(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count")
        .limit(1);

      if (error) {
        return {
          success: false,
          message: "Supabase connection failed",
          error: error.message,
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: "Supabase connection successful",
        data: { rowCount: data?.length || 0 },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: "Supabase connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testPostgreSQLConnection(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const pool = getPostgreSQLPool();
      const client = await pool.connect();

      const result = await client.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      client.release();

      return {
        success: true,
        message: "PostgreSQL connection successful",
        data: {
          currentTime: result.rows[0].current_time,
          version: result.rows[0].pg_version,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: "PostgreSQL connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testTableExists(tableName: string): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `Table ${tableName} does not exist or is not accessible`,
          error: error.message,
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: `Table ${tableName} exists and is accessible`,
        data: { rowCount: data?.length || 0 },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to test table ${tableName}`,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testCRUDOperations(
    tableName: string,
    testData: any
  ): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // CREATE
      const { data: createdData, error: createError } = await supabase
        .from(tableName)
        .insert(testData)
        .select();

      if (createError) {
        return {
          success: false,
          message: `CREATE operation failed for ${tableName}`,
          error: createError.message,
          duration: Date.now() - startTime,
        };
      }

      const createdRecord = createdData?.[0];
      if (!createdRecord) {
        return {
          success: false,
          message: `No record created in ${tableName}`,
          duration: Date.now() - startTime,
        };
      }

      // READ
      const { data: readData, error: readError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", createdRecord.id)
        .single();

      if (readError) {
        return {
          success: false,
          message: `READ operation failed for ${tableName}`,
          error: readError.message,
          duration: Date.now() - startTime,
        };
      }

      // UPDATE
      const updateData = { ...testData, updated_at: new Date().toISOString() };
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", createdRecord.id)
        .select();

      if (updateError) {
        return {
          success: false,
          message: `UPDATE operation failed for ${tableName}`,
          error: updateError.message,
          duration: Date.now() - startTime,
        };
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("id", createdRecord.id);

      if (deleteError) {
        return {
          success: false,
          message: `DELETE operation failed for ${tableName}`,
          error: deleteError.message,
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: `CRUD operations successful for ${tableName}`,
        data: {
          created: createdRecord,
          read: readData,
          updated: updatedData?.[0],
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: `CRUD operations failed for ${tableName}`,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testRelationships(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // Test user -> accounts relationship
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          accounts (
            id,
            name,
            type
          )
        `
        )
        .limit(1);

      if (usersError) {
        return {
          success: false,
          message: "Relationship test failed - users query",
          error: usersError.message,
          duration: Date.now() - startTime,
        };
      }

      // Test customer -> invoices relationship
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select(
          `
          id,
          name,
          invoices (
            id,
            invoice_number,
            total_amount
          )
        `
        )
        .limit(1);

      if (customersError) {
        return {
          success: false,
          message: "Relationship test failed - customers query",
          error: customersError.message,
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: "Relationship tests successful",
        data: {
          usersWithAccounts: users?.length || 0,
          customersWithInvoices: customers?.length || 0,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: "Relationship tests failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async testComplexQueries(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // Test aggregation query
      const { data: accountStats, error: accountError } = await supabase
        .from("accounts")
        .select("type, balance")
        .order("balance", { ascending: false });

      if (accountError) {
        return {
          success: false,
          message: "Complex query test failed - accounts aggregation",
          error: accountError.message,
          duration: Date.now() - startTime,
        };
      }

      // Test filtered query with joins
      const { data: recentTransactions, error: transactionError } =
        await supabase
          .from("transactions")
          .select(
            `
          id,
          description,
          amount,
          type,
          accounts!inner(name),
          categories(name)
        `
          )
          .order("created_at", { ascending: false })
          .limit(5);

      if (transactionError) {
        return {
          success: false,
          message: "Complex query test failed - transactions with joins",
          error: transactionError.message,
          duration: Date.now() - startTime,
        };
      }

      return {
        success: true,
        message: "Complex queries successful",
        data: {
          accountCount: accountStats?.length || 0,
          recentTransactionCount: recentTransactions?.length || 0,
        },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        message: "Complex queries failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async runAllTests(): Promise<{
    summary: {
      total: number;
      passed: number;
      failed: number;
      totalDuration: number;
    };
    results: TestResult[];
  }> {
    this.results = [];

    // Connection tests
    this.results.push(await this.testSupabaseConnection());
    this.results.push(await this.testPostgreSQLConnection());

    // Table existence tests
    const tables = [
      "users",
      "accounts",
      "customers",
      "invoices",
      "transactions",
      "categories",
    ];
    for (const table of tables) {
      this.results.push(await this.testTableExists(table));
    }

    // CRUD tests for key tables
    const testData = {
      users: {
        name: "Test User",
        email: "test@example.com",
        company_name: "Test Company",
      },
      customers: {
        name: "Test Customer",
        email: "customer@test.com",
        phone: "555-1234",
      },
      categories: {
        name: "Test Category",
        type: "expense",
      },
    };

    for (const [table, data] of Object.entries(testData)) {
      this.results.push(await this.testCRUDOperations(table, data));
    }

    // Advanced tests
    this.results.push(await this.testRelationships());
    this.results.push(await this.testComplexQueries());

    const summary = {
      total: this.results.length,
      passed: this.results.filter((r) => r.success).length,
      failed: this.results.filter((r) => !r.success).length,
      totalDuration: this.results.reduce(
        (sum, r) => sum + (r.duration || 0),
        0
      ),
    };

    return { summary, results: this.results };
  }
}

export const databaseTester = new DatabaseTester();
