# Environment Variables Reference

## 📋 Required Variables

### Database
```env
DATABASE_URL="postgresql://username:password@localhost:5432/avanee_business_suite"
```

### NextAuth.js
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
```

### Google OAuth
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Email (Resend)
```env
RESEND_API_KEY="your-resend-api-key"
```

## 🔧 Production Variables (Vercel)

When deploying to Vercel, you'll also need:

```env
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""
```

## 📝 How to Get Each Value

### 1. DATABASE_URL
- **Local:** `postgresql://username:password@localhost:5432/avanee_business_suite`
- **Vercel Postgres:** Get from Vercel dashboard
- **Other:** Your PostgreSQL connection string

### 2. NEXTAUTH_SECRET
- Generate a random string: `openssl rand -base64 32`
- Or use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
- Follow the [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)

### 4. RESEND_API_KEY
- Sign up at [resend.com](https://resend.com)
- Get API key from dashboard

### 5. Vercel Postgres Variables
- Create Postgres database in Vercel
- Copy connection strings from Vercel dashboard

## 🚀 Quick Setup Commands

```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test database connection
npx prisma db push

# Test environment variables
npm run type-check
```

## ⚠️ Security Notes

- Never commit `.env.local` to git
- Use different values for development and production
- Rotate secrets regularly
- Use strong, unique secrets 