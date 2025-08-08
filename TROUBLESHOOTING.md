# Authentication Troubleshooting Guide

## 🔍 Current Issue: Sign-in Loop

You're experiencing a sign-in loop where after selecting your Google account, you're redirected back to the sign-in page.

## 🛠️ Step-by-Step Troubleshooting

### 1. Check Google Console Redirect URIs

**Most Common Issue:** The redirect URI in Google Console doesn't match exactly.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. Check the "Authorized redirect URIs" section

**Make sure you have EXACTLY:**
```
http://localhost:3000/api/auth/callback/google
```

**Common mistakes:**
- Missing `http://` (using just `localhost:3000`)
- Wrong port number
- Extra trailing slash
- Wrong path (`/auth/callback/google` instead of `/api/auth/callback/google`)

### 2. Check Environment Variables

Verify your `.env` file has the correct values:

```env
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 3. Check Browser Console

1. Open browser developer tools (F12)
2. Go to Console tab
3. Try signing in
4. Look for any error messages

### 4. Check Network Tab

1. Open browser developer tools (F12)
2. Go to Network tab
3. Try signing in
4. Look for failed requests to Google or your API

### 5. Test with Debug Mode

The updated sign-in page now includes debug information. Look for:
- Status: Should show "authenticated" after successful sign-in
- Session: Should show "Yes" after successful sign-in
- Any error messages in the red box

## 🔧 Quick Fixes to Try

### Fix 1: Clear Browser Data
1. Clear cookies and cache for localhost:3000
2. Try signing in again

### Fix 2: Check Google OAuth Consent Screen
1. Go to Google Console → "OAuth consent screen"
2. Make sure your app is configured correctly
3. Add your email as a test user if needed

### Fix 3: Verify Database Connection
```bash
# Supabase Studio can be accessed via your Supabase dashboard
```
Check if the database is accessible and tables exist.

### Fix 4: Restart Development Server
```bash
npm run dev
```

## 🚨 Common Error Messages

### "Error: redirect_uri_mismatch"
- **Solution:** Fix the redirect URI in Google Console

### "Error: invalid_client"
- **Solution:** Check your Client ID and Client Secret

### "Error: access_denied"
- **Solution:** Check OAuth consent screen configuration

### "Error: invalid_grant"
- **Solution:** Clear browser cookies and try again

## 📞 Need More Help?

1. Check the browser console for specific error messages
2. Look at the debug information on the sign-in page
3. Verify all environment variables are correct
4. Make sure the database is properly set up

## 🔄 Next Steps

Once authentication is working:
1. You should be redirected to the dashboard
2. Your user will be created in the database
3. You can start building the accounting features 