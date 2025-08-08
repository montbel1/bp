# Development Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **ENOENT/EPERM Errors (File Permission Issues)**

**Symptoms:**
- `ENOENT: no such file or directory, open '.next/prerender-manifest.json'`
- `EPERM: operation not permitted, open '.next/trace'`
- Server crashes on startup

**Quick Fix:**
```bash
# Option 1: Use the cleanup script (Recommended)
npm run dev:clean

# Option 2: Manual cleanup
npm run clean
npm run dev

# Option 3: PowerShell cleanup
powershell -ExecutionPolicy Bypass -File scripts/cleanup.ps1
```

**Prevention:**
- Always stop the dev server with `Ctrl+C` before restarting
- Use `npm run dev:clean` instead of `npm run dev` when experiencing issues
- Avoid force-closing the terminal while the server is running

### **Authentication Errors**

**Symptoms:**
- `Cannot read properties of undefined (reading 'findUnique')`
- OAuth callback errors
- Session not persisting

**Quick Fix:**
```bash
# Clear NextAuth cache
npm run clean
npm run dev
```

### **Database Issues**

**Symptoms:**
- Prisma errors
- Schema conflicts
- Migration issues

**Quick Fix:**
```bash
# Reset database and regenerate client
npx prisma db push --force-reset
npx prisma generate
npm run dev
```

## 🛠️ Development Workflow

### **Recommended Development Commands:**

1. **Normal Development:**
   ```bash
   npm run dev
   ```

2. **When Experiencing Issues:**
   ```bash
   npm run dev:clean
   ```

3. **Complete Reset:**
   ```bash
   npm run clean
   npm run dev
   ```

### **Before Committing Code:**
```bash
npm run lint
npm run build
```

## 🔧 Advanced Troubleshooting

### **If Cleanup Script Fails:**

1. **Manual Process Kill:**
   ```powershell
   taskkill /f /im node.exe
   ```

2. **Manual Cache Cleanup:**
   ```powershell
   Remove-Item -Recurse -Force .next
   Remove-Item -Recurse -Force node_modules\.prisma
   ```

3. **Regenerate Everything:**
   ```bash
   npm install
   npx prisma generate
   npm run dev
   ```

### **Port Conflicts:**

If port 3000 is in use:
```bash
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <process_id> /F
```

## 📋 Development Checklist

- [ ] Server starts without errors
- [ ] Authentication works
- [ ] Database connections are stable
- [ ] Hot reload works properly
- [ ] No TypeScript errors
- [ ] No linting errors

## 🆘 Still Having Issues?

1. **Check the logs** in the terminal for specific error messages
2. **Restart your IDE** (VS Code, Cursor, etc.)
3. **Restart your computer** if file locks persist
4. **Check Windows Defender** isn't blocking file operations
5. **Run as Administrator** if permission issues persist

## 📞 Getting Help

If you're still experiencing issues:

1. **Check this troubleshooting guide**
2. **Look at the error logs** in the terminal
3. **Try the cleanup script** (`npm run dev:clean`)
4. **Document the exact error** and steps to reproduce

---

**Remember:** The cleanup script (`npm run dev:clean`) is your friend! Use it whenever you encounter file permission or cache issues. 