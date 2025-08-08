# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up/Login
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `accounting-app`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
6. Click "Create new project"

## Step 2: Get Project Credentials

1. Go to Project Settings > API
2. Copy the following:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon public key (starts with `eyJ...`)

## Step 3: Update Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run" to execute the schema

## Step 5: Set up Row Level Security (RLS)

After running the schema, enable RLS on all tables:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for all other tables (user_id based)
CREATE POLICY "Users can manage own data" ON accounts
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON categories
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON transactions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON customers
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON vendors
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON invoices
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON bills
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON payments
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON projects
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON documents
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON notifications
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON clients
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON jobs
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON tasks
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON calendar_events
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON recurring_transactions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON recurring_invoices
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON recurring_bills
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON workflow_rules
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON ai_suggestions
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own data" ON audit_logs
    FOR ALL USING (auth.uid()::text = user_id::text);
```

## Step 6: Test the Setup

1. Restart your development server
2. Navigate to http://localhost:3000
3. The application should now work with real Supabase data

## Troubleshooting

- If you get authentication errors, make sure your environment variables are correct
- If you get RLS errors, make sure the policies are created correctly
- If tables don't exist, make sure the SQL schema was executed successfully 