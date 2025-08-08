# Google OAuth Setup Guide

## 🔐 Step-by-Step Instructions

### Step 1: Access Google Cloud Console
1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create or Select Project
1. Click on the project dropdown at the top
2. Click "New Project" or select an existing project
3. Name it "Avanee Business Management Suite" or similar
4. Click "Create"

### Step 3: Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" or "Google Identity and Access Management (IAM) API"
4. Click "Enable"

### Step 4: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name:** Avanee Business Management Suite
   - **User support email:** Your email address
   - **Developer contact information:** Your email address
4. Click "Save and Continue"
5. Skip optional sections and click "Save and Continue"

### Step 5: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure the OAuth client:
   - **Application type:** Web application
   - **Name:** Avanee Business Management Suite Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/callback/google
     ```
4. Click "Create"

### Step 6: Copy Your Credentials
After creation, you'll see:
- **Client ID** (copy this)
- **Client Secret** (copy this)

### Step 7: Update Environment Variables
1. Open `.env.local` in your project
2. Replace the empty values with your credentials:

```env
# OAuth Providers
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

### Step 8: Test the Setup
1. Run the development server:
   ```bash
   npm run dev
   ```
2. Visit [http://localhost:3000](http://localhost:3000)
3. Click "Sign in with Google"
4. You should be redirected to Google's consent screen

## 🔧 For Production Deployment

When you deploy to Vercel, you'll need to add these additional URIs to your Google OAuth client:

### Authorized JavaScript origins:
```
https://your-app-name.vercel.app
```

### Authorized redirect URIs:
```
https://your-app-name.vercel.app/api/auth/callback/google
```

## 🆘 Troubleshooting

### Common Issues:
1. **"Error: redirect_uri_mismatch"**
   - Make sure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or typos

2. **"Error: invalid_client"**
   - Verify your Client ID and Client Secret are correct
   - Make sure you copied the entire values

3. **"Error: access_denied"**
   - Check that the Google+ API is enabled
   - Verify your OAuth consent screen is configured

### Need Help?
- Check the [NextAuth.js documentation](https://next-auth.js.org/configuration/providers/google)
- Review the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)

## 📝 Security Notes

- Never commit your `.env.local` file to version control
- Keep your Client Secret secure
- Use environment variables in production
- Regularly rotate your credentials 