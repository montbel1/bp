#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating environment variables for Supabase development...');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update environment variables for Supabase
  envContent = envContent.replace(
    /DATABASE_URL="postgresql:\/\/username:password@localhost:5432\/avanee_business_suite"/,
    'NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"'
  );
  
  // Add Supabase anon key if not present
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    envContent += '\nNEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"';
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated environment variables for Supabase development');
  console.log('📝 NEXT_PUBLIC_SUPABASE_URL is now set to: your_supabase_url');
  console.log('📝 NEXT_PUBLIC_SUPABASE_ANON_KEY is now set to: your_supabase_anon_key');
} else {
  console.log('❌ .env.local file not found');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Configure your Supabase project');
console.log('2. Update your environment variables with actual Supabase credentials');
console.log('3. Run: npm run dev');
console.log('\n💡 This will connect to your Supabase PostgreSQL database'); 