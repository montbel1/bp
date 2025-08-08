import { Pool } from "pg";
import fs from "fs";
//import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function setupDatabase() {
  console.log("🔧 Setting up PostgreSQL Database...");

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not found in .env.local");
    return;
  }

  // Handle URL encoding for special characters in password
  let connectionString = process.env.DATABASE_URL;
  if (connectionString.includes("#")) {
    connectionString = connectionString.replace(
      /postgresql:\/\/([^:]+):([^@]+)@/,
      (match, username, password) => {
        const encodedPassword = encodeURIComponent(password);
        return `postgresql://${username}:${encodedPassword}@`;
      }
    );
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: false,
  });

  try {
    console.log("📡 Connecting to database...");
    const client = await pool.connect();
    console.log("✅ Connected successfully!");

    // Read and execute schema
    console.log("📋 Creating database schema...");
    const schemaPath = "./supabase-setup.sql";
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    // Split SQL into individual statements and execute them
    // Handle PostgreSQL function definitions properly
    const statements = [];
    let currentStatement = "";
    let inFunction = false;
    let delimiterCount = 0;
    let inDelimiter = false;

    const lines = schemaSQL.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith("--")) {
        continue;
      }

      currentStatement += line + "\n";

      // Check if we're in a function definition
      if (
        trimmedLine.includes("CREATE OR REPLACE FUNCTION") ||
        trimmedLine.includes("CREATE FUNCTION")
      ) {
        inFunction = true;
        delimiterCount = 0;
        inDelimiter = false;
      }

      // Handle PostgreSQL function delimiters ($$)
      if (inFunction) {
        if (trimmedLine.includes("$$")) {
          delimiterCount++;
          if (delimiterCount === 1) {
            inDelimiter = true;
          } else if (delimiterCount === 2) {
            inDelimiter = false;
            inFunction = false;
            statements.push(currentStatement.trim());
            currentStatement = "";
          }
        }
      } else {
        // Regular statements end with semicolon
        if (trimmedLine.endsWith(";")) {
          statements.push(currentStatement.trim());
          currentStatement = "";
        }
      }
    }

    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(
            `✅ Statement ${i + 1}/${statements.length} executed successfully`
          );
        } catch (error) {
          console.log(
            `⚠️  Statement ${i + 1}/${statements.length} failed:`,
            error.message
          );
          // Continue with other statements unless it's a critical error
          if (
            error.message.includes("already exists") ||
            error.message.includes("duplicate key")
          ) {
            console.log(`   (This is expected for existing objects)`);
          } else {
            throw error;
          }
        }
      }
    }

    // Create sample data
    console.log("📊 Creating sample data...");
    await createSampleData(client);
    console.log("✅ Sample data created successfully!");

    // Verify setup
    console.log("🔍 Verifying database setup...");
    await verifySetup(client);

    client.release();
    console.log("🎉 Database setup completed successfully!");
  } catch (error) {
    console.log("❌ Database setup failed:", error.message);
    console.log("🔧 Error details:", error);
  } finally {
    await pool.end();
  }
}

async function createSampleData(client) {
  // Check if test user already exists
  const existingUser = await client.query(
    `SELECT id FROM users WHERE email = $1`,
    ["test@example.com"]
  );

  let userId;
  if (existingUser.rows.length > 0) {
    userId = existingUser.rows[0].id;
    console.log(`✅ Test user already exists with ID: ${userId}`);
  } else {
    // Create a test user
    const userResult = await client.query(
      `
      INSERT INTO users (email, name, company_name, subscription)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      ["test@example.com", "Test User", "Test Company", "PREMIUM"]
    );
    userId = userResult.rows[0].id;
    console.log(`✅ Created test user with ID: ${userId}`);
  }

  // Check if sample data already exists for this user
  const existingData = await client.query(
    `SELECT COUNT(*) as count FROM accounts WHERE user_id = $1`,
    [userId]
  );

  if (existingData.rows[0].count > 0) {
    console.log(`✅ Sample data already exists for user: ${userId}`);
    return;
  }

  console.log(`📊 Creating sample data for user: ${userId}`);

  // Create accounts
  await client.query(
    `
    INSERT INTO accounts (name, type, number, balance, user_id)
    VALUES 
      ('Checking Account', 'BANK', '1001', 50000.00, $1),
      ('Savings Account', 'BANK', '1002', 100000.00, $1),
      ('Credit Card', 'CREDIT', '2001', -2500.00, $1),
      ('Cash', 'CASH', '3001', 5000.00, $1)
  `,
    [userId]
  );

  // Create categories
  await client.query(
    `
    INSERT INTO categories (name, type, description, user_id)
    VALUES 
      ('Office Supplies', 'EXPENSE', 'Office and administrative expenses', $1),
      ('Travel', 'EXPENSE', 'Business travel expenses', $1),
      ('Software', 'EXPENSE', 'Software and technology expenses', $1),
      ('Consulting Revenue', 'INCOME', 'Consulting and professional services', $1),
      ('Product Sales', 'INCOME', 'Product and merchandise sales', $1)
  `,
    [userId]
  );

  // Create customers
  await client.query(
    `
    INSERT INTO customers (name, email, phone, status, user_id)
    VALUES 
      ('Acme Corporation', 'contact@acme.com', '555-0101', 'ACTIVE', $1),
      ('TechStart Inc', 'info@techstart.com', '555-0102', 'ACTIVE', $1),
      ('Global Solutions', 'hello@globalsolutions.com', '555-0103', 'ACTIVE', $1)
  `,
    [userId]
  );

  // Create vendors
  await client.query(
    `
    INSERT INTO vendors (name, email, phone, status, user_id)
    VALUES 
      ('Office Depot', 'orders@officedepot.com', '555-0201', 'ACTIVE', $1),
      ('Dell Technologies', 'sales@dell.com', '555-0202', 'ACTIVE', $1),
      ('Adobe Systems', 'billing@adobe.com', '555-0203', 'ACTIVE', $1)
  `,
    [userId]
  );

  // Create transactions
  await client.query(
    `
    INSERT INTO transactions (date, description, amount, type, account_id, category_id, user_id)
    VALUES 
      (CURRENT_DATE - INTERVAL '30 days', 'Office supplies purchase', 150.00, 'EXPENSE', 
       (SELECT id FROM accounts WHERE name = 'Checking Account' AND user_id = $1 LIMIT 1),
       (SELECT id FROM categories WHERE name = 'Office Supplies' AND user_id = $1 LIMIT 1), $1),
      (CURRENT_DATE - INTERVAL '15 days', 'Consulting fee from Acme Corp', 2500.00, 'INCOME',
       (SELECT id FROM accounts WHERE name = 'Checking Account' AND user_id = $1 LIMIT 1),
       (SELECT id FROM categories WHERE name = 'Consulting Revenue' AND user_id = $1 LIMIT 1), $1),
      (CURRENT_DATE - INTERVAL '7 days', 'Adobe Creative Suite subscription', 52.99, 'EXPENSE',
       (SELECT id FROM accounts WHERE name = 'Credit Card' AND user_id = $1 LIMIT 1),
       (SELECT id FROM categories WHERE name = 'Software' AND user_id = $1 LIMIT 1), $1)
  `,
    [userId]
  );

  // Create invoices
  await client.query(
    `
    INSERT INTO invoices (number, date, due_date, status, subtotal, tax, total, customer_id, user_id)
    VALUES 
      ('INV-001', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'SENT', 2500.00, 0.00, 2500.00,
       (SELECT id FROM customers WHERE name = 'Acme Corporation' AND user_id = $1 LIMIT 1), $1),
      ('INV-002', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'DRAFT', 1500.00, 0.00, 1500.00,
       (SELECT id FROM customers WHERE name = 'TechStart Inc' AND user_id = $1 LIMIT 1), $1)
  `,
    [userId]
  );

  // Create bills
  await client.query(
    `
    INSERT INTO bills (number, date, due_date, status, subtotal, tax, total, vendor_id, user_id)
    VALUES 
      ('BILL-001', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'PENDING', 150.00, 0.00, 150.00,
       (SELECT id FROM vendors WHERE name = 'Office Depot' AND user_id = $1 LIMIT 1), $1),
      ('BILL-002', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days', 'DRAFT', 52.99, 0.00, 52.99,
       (SELECT id FROM vendors WHERE name = 'Adobe Systems' AND user_id = $1 LIMIT 1), $1)
  `,
    [userId]
  );

  // Create clients (for practice management)
  await client.query(
    `
    INSERT INTO clients (name, email, phone, company_name, industry, status, assigned_to, user_id)
    VALUES 
      ('John Smith', 'john.smith@email.com', '555-0301', 'Smith Consulting', 'Technology', 'ACTIVE', 'Test User', $1),
      ('Sarah Johnson', 'sarah.johnson@email.com', '555-0302', 'Johnson Enterprises', 'Healthcare', 'ACTIVE', 'Test User', $1),
      ('Mike Wilson', 'mike.wilson@email.com', '555-0303', 'Wilson & Associates', 'Legal', 'PROSPECT', 'Test User', $1)
  `,
    [userId]
  );

  // Create jobs
  await client.query(
    `
    INSERT INTO jobs (title, description, status, priority, start_date, due_date, budget, client_id, assigned_to, user_id)
    VALUES 
      ('Tax Preparation 2024', 'Annual tax return preparation for 2024', 'ACTIVE', 'HIGH', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '60 days', 2500.00,
       (SELECT id FROM clients WHERE name = 'John Smith' AND user_id = $1 LIMIT 1), 'Test User', $1),
      ('Financial Audit', 'Quarterly financial audit and review', 'ACTIVE', 'MEDIUM', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days', 5000.00,
       (SELECT id FROM clients WHERE name = 'Sarah Johnson' AND user_id = $1 LIMIT 1), 'Test User', $1)
  `,
    [userId]
  );

  // Create calendar events
  await client.query(
    `
    INSERT INTO calendar_events (title, description, start, "end", location, type, user_id)
    VALUES 
      ('Client Meeting - John Smith', 'Tax preparation consultation', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '10 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '11 hours', 'Conference Room A', 'MEETING', $1),
      ('Deadline - Tax Returns', 'Deadline for filing tax returns', CURRENT_DATE + INTERVAL '30 days' + INTERVAL '17 hours', CURRENT_DATE + INTERVAL '30 days' + INTERVAL '17 hours', 'Office', 'DEADLINE', $1)
  `,
    [userId]
  );

  console.log(`✅ Created sample data for user: ${userId}`);
}

async function verifySetup(client) {
  // Check tables
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log(`📋 Found ${tablesResult.rows.length} tables:`);
  tablesResult.rows.forEach((row) => {
    console.log(`   - ${row.table_name}`);
  });

  // Check data counts
  const counts = await client.query(`
    SELECT 
      (SELECT COUNT(*) FROM users) as users_count,
      (SELECT COUNT(*) FROM accounts) as accounts_count,
      (SELECT COUNT(*) FROM categories) as categories_count,
      (SELECT COUNT(*) FROM transactions) as transactions_count,
      (SELECT COUNT(*) FROM customers) as customers_count,
      (SELECT COUNT(*) FROM vendors) as vendors_count,
      (SELECT COUNT(*) FROM invoices) as invoices_count,
      (SELECT COUNT(*) FROM bills) as bills_count,
      (SELECT COUNT(*) FROM clients) as clients_count,
      (SELECT COUNT(*) FROM jobs) as jobs_count,
      (SELECT COUNT(*) FROM calendar_events) as events_count
  `);

  const countsData = counts.rows[0];
  console.log("📊 Sample data counts:");
  console.log(`   - Users: ${countsData.users_count}`);
  console.log(`   - Accounts: ${countsData.accounts_count}`);
  console.log(`   - Categories: ${countsData.categories_count}`);
  console.log(`   - Transactions: ${countsData.transactions_count}`);
  console.log(`   - Customers: ${countsData.customers_count}`);
  console.log(`   - Vendors: ${countsData.vendors_count}`);
  console.log(`   - Invoices: ${countsData.invoices_count}`);
  console.log(`   - Bills: ${countsData.bills_count}`);
  console.log(`   - Clients: ${countsData.clients_count}`);
  console.log(`   - Jobs: ${countsData.jobs_count}`);
  console.log(`   - Calendar Events: ${countsData.events_count}`);
}

setupDatabase().catch(console.error);
