# Quick Supabase Setup - 5 Minutes

## 1. Create Supabase Project (2 minutes)
1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign in with GitHub/Google
4. Click "New Project"
5. Fill in:
   - **Name**: `accounting-app`
   - **Database Password**: `YourStrongPassword123!`
   - **Region**: Choose closest to you
6. Click "Create new project"

## 2. Get Your Credentials (1 minute)
1. Wait for project to be ready (green checkmark)
2. Go to Settings → API
3. Copy:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Update Environment (1 minute)
Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Run Database Schema (1 minute)
1. Go to SQL Editor in Supabase dashboard
2. Copy ALL content from `supabase-setup.sql`
3. Paste and click "Run"

## 5. Test Application
1. Restart your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Test the workflows!

## Quick Test Commands
```bash
# Test if app is running
curl http://localhost:3000

# Test if Supabase is connected
curl http://localhost:3000/api/transactions
```

**Expected Results:**
- ✅ Application loads without errors
- ✅ No more "Module not found" errors
- ✅ Real data from Supabase (not mock data)
- ✅ All workflows functional for all personas 