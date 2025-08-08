# Authentication Guide

## 🔐 How Authentication Works

### **Session Persistence**
- **JWT tokens** are stored in browser cookies/localStorage
- **Sessions persist** across browser restarts
- **Automatic login** when you return to the app
- **Secure by default** with proper token expiration

### **Expected Behavior**
1. **First visit** → Redirected to sign-in page
2. **After successful login** → Redirected to dashboard
3. **Close browser and reopen** → Still logged in (dashboard)
4. **Click "Sign Out"** → Logged out, redirected to sign-in page

## 🧪 Testing Authentication

### **Test Sign-Out Flow**
1. **Click the "Sign Out" button** in the top-right corner
2. **You should be redirected** to the sign-in page
3. **Try signing in again** to verify the flow works

### **Test Session Persistence**
1. **Sign in successfully**
2. **Close the browser completely**
3. **Reopen browser and go to** `http://localhost:3000`
4. **You should see the dashboard** (still logged in)

### **Test Session Expiration**
1. **Wait for session to expire** (default: 30 days)
2. **Or clear browser cookies** manually
3. **Visit the app** → Should redirect to sign-in

## 📊 Session Information

The dashboard now shows a **Session Information** card that displays:
- **Status:** "authenticated" or "unauthenticated"
- **User ID:** Your unique identifier
- **Email:** Your Google account email
- **Strategy:** "JWT" (JSON Web Token)

## 🔧 Authentication Configuration

### **Current Setup:**
- **Provider:** Google OAuth
- **Strategy:** JWT (JSON Web Tokens)
- **Session Storage:** Browser cookies
- **No Database Required** for sessions

### **Benefits of JWT Strategy:**
- ✅ **Faster authentication** (no database queries)
- ✅ **Works offline** (tokens stored locally)
- ✅ **Scalable** (no session storage needed)
- ✅ **Stateless** (server doesn't store session data)

## 🚨 Important Notes

### **Security:**
- **JWT tokens are signed** and cannot be tampered with
- **Tokens expire automatically** (configurable)
- **HTTPS required** in production for security

### **Development vs Production:**
- **Development:** Tokens stored in localStorage
- **Production:** Tokens stored in secure HTTP-only cookies

## 🔄 Next Steps

Once you're comfortable with the authentication flow:

1. **Remove the Session Info card** from the dashboard
2. **Start building accounting features**
3. **Add user-specific data** (accounts, transactions, etc.)
4. **Implement proper authorization** for different user roles

## 🆘 Troubleshooting

### **If you can't sign out:**
- Clear browser cookies manually
- Check browser console for errors
- Restart the development server

### **If session doesn't persist:**
- Check if cookies are enabled
- Verify browser privacy settings
- Check for browser extensions blocking cookies 