#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Avanee Business Management Suite Setup');
console.log('========================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping environment setup.');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/avanee_business_suite"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"

# OAuth Providers (add your own keys)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Resend (Email)
RESEND_API_KEY=""

# Vercel Postgres (for production)
POSTGRES_URL=""
NEXT_PUBLIC_SUPABASE_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created successfully!');
}

console.log('\n📋 Next Steps:');
console.log('1. Update .env.local with your actual credentials');
console.log('2. Set up Google OAuth credentials');
console.log('3. Run: npm run db:generate');
console.log('4. Run: npm run db:migrate');
console.log('5. Run: npm run dev');
console.log('\n📚 For detailed instructions, see README.md');

function generateSecret() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
} 