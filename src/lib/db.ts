import { Pool } from "pg";
import { supabase } from "./supabase";

let pool: Pool | null = null;

export function getPostgreSQLPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export const db = {
  supabase,
  async query(text: string, params?: any[]) {
    const pool = getPostgreSQLPool();
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  },
  async testConnection() {
    try {
      const result = await this.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      return {
        success: true,
        data: {
          currentTime: result.rows[0].current_time,
          version: result.rows[0].pg_version,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

export default db;
