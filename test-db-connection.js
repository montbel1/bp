const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

async function testDatabaseConnection() {
  console.log("🔍 Testing PostgreSQL Database Connection...");
  console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set");

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not found in .env.local");
    return;
  }

  // Log the raw DATABASE_URL for debugging
  console.log("Raw DATABASE_URL:", process.env.DATABASE_URL);

  // Try to parse the URL manually to check for issues
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log("✅ URL parsed successfully");
    console.log("Host:", url.hostname);
    console.log("Port:", url.port);
    console.log("Database:", url.pathname.substring(1));
    console.log("Username:", url.username);
  } catch (urlError) {
    console.log("❌ URL parsing failed:", urlError.message);
    console.log("This might be due to special characters in the password");

    // Try with URL encoding
    const encodedUrl = process.env.DATABASE_URL.replace(
      /postgresql:\/\/([^:]+):([^@]+)@/,
      (match, username, password) => {
        const encodedPassword = encodeURIComponent(password);
        return `postgresql://${username}:${encodedPassword}@`;
      }
    );

    console.log("Trying with encoded password:", encodedUrl);

    const pool = new Pool({
      connectionString: encodedUrl,
      ssl: false,
    });

    try {
      console.log("📡 Attempting to connect with encoded URL...");
      const client = await pool.connect();

      console.log("✅ Connected successfully!");

      // Test basic query
      const result = await client.query(
        "SELECT NOW() as current_time, version() as pg_version"
      );
      console.log("⏰ Current time:", result.rows[0].current_time);
      console.log(
        "🐘 PostgreSQL version:",
        result.rows[0].pg_version.split(" ")[0]
      );

      // Check if database exists
      const dbResult = await client.query(
        "SELECT current_database() as current_db"
      );
      console.log("🗄️  Current database:", dbResult.rows[0].current_db);

      // List all tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      console.log("📋 Tables in database:");
      if (tablesResult.rows.length === 0) {
        console.log("   (No tables found)");
      } else {
        tablesResult.rows.forEach((row) => {
          console.log(`   - ${row.table_name}`);
        });
      }

      client.release();
      await pool.end();
      return;
    } catch (error) {
      console.log("❌ Connection failed with encoded URL:", error.message);
      await pool.end();
    }
  }

  // Original connection attempt
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log("📡 Attempting to connect...");
    const client = await pool.connect();

    console.log("✅ Connected successfully!");

    // Test basic query
    const result = await client.query(
      "SELECT NOW() as current_time, version() as pg_version"
    );
    console.log("⏰ Current time:", result.rows[0].current_time);
    console.log(
      "🐘 PostgreSQL version:",
      result.rows[0].pg_version.split(" ")[0]
    );

    // Check if database exists
    const dbResult = await client.query(
      "SELECT current_database() as current_db"
    );
    console.log("🗄️  Current database:", dbResult.rows[0].current_db);

    // List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("📋 Tables in database:");
    if (tablesResult.rows.length === 0) {
      console.log("   (No tables found)");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
    }

    client.release();
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("🔧 Error details:", error);
  } finally {
    await pool.end();
  }
}

testDatabaseConnection();
