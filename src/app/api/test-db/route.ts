import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getPostgreSQLPool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get("type") || "all";

    let testResults = {
      summary: { total: 0, passed: 0, failed: 0, totalDuration: 0 },
      results: [],
    };

    const startTime = Date.now();

    // Test Supabase connection
    try {
      const { data, error } = await supabase
        .from("users")
        .select("count")
        .limit(1);
      const duration = Date.now() - startTime;

      testResults.results.push({
        success: !error,
        message: error
          ? "Supabase connection failed"
          : "Supabase connection successful",
        data: { rowCount: data?.length || 0 },
        error: error?.message,
        duration,
      });
    } catch (error) {
      testResults.results.push({
        success: false,
        message: "Supabase connection test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      });
    }

    // Test PostgreSQL connection
    try {
      const pool = getPostgreSQLPool();
      const client = await pool.connect();
      const result = await client.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      client.release();

      const duration = Date.now() - startTime;
      testResults.results.push({
        success: true,
        message: "PostgreSQL connection successful",
        data: {
          currentTime: result.rows[0].current_time,
          version: result.rows[0].pg_version,
        },
        duration,
      });
    } catch (error) {
      testResults.results.push({
        success: false,
        message: "PostgreSQL connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      });
    }

    // Calculate summary
    testResults.summary = {
      total: testResults.results.length,
      passed: testResults.results.filter((r) => r.success).length,
      failed: testResults.results.filter((r) => !r.success).length,
      totalDuration: testResults.results.reduce(
        (sum, r) => sum + (r.duration || 0),
        0
      ),
    };

    return NextResponse.json({
      success: testResults.summary.failed === 0,
      message: `Database tests completed: ${testResults.summary.passed}/${testResults.summary.total} passed`,
      session: session?.user,
      summary: testResults.summary,
      results: testResults.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        session: null,
        summary: { total: 0, passed: 0, failed: 1, totalDuration: 0 },
        results: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
