# Quick Setup Guide

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Run the setup script to create .env.local
npm run setup
```

### 2. Configure Environment Variables
Edit `.env.local` and add your credentials:
- **Google OAuth:** Get from [Google Cloud Console](https://console.cloud.google.com/)
- **Database:** Use local PostgreSQL or Vercel Postgres
- **Resend:** Get API key from [Resend](https://resend.com/)

### 3. Database Setup
```bash
# Configure Supabase
# Update your .env.local with Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db:seed` - Seed database with test data
- `npm run setup` - Initial project setup

## 📁 Key Files

- `src/lib/supabase.ts` - Supabase configuration
- `src/lib/auth.ts` - NextAuth configuration
- `src/app/page.tsx` - Dashboard
- `src/app/auth/signin/page.tsx` - Sign-in page
- `.env.local` - Environment variables

## 🆘 Common Issues

### TypeScript Errors
Run `npm run type-check` to identify issues.

### Database Connection
Make sure your Supabase credentials are correct and the database is accessible.

### Authentication
Ensure Google OAuth credentials are properly configured.

## 📚 Next Steps

1. Add your first account
2. Create transactions
3. Set up categories
4. Add customers
5. Generate invoices

See `README.md` for detailed documentation. 