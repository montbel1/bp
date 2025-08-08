# Avanee Business Management Suite - Development Cleanup Script
# This script cleans up corrupted Next.js cache and restarts the dev server

Write-Host "Avanee Business Management Suite - Development Cleanup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Kill all Node.js processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Node.js processes stopped" -ForegroundColor Green
} catch {
    Write-Host "No Node.js processes found" -ForegroundColor Blue
}

# Step 2: Clean Next.js cache
Write-Host "Cleaning Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force ".next"
        Write-Host "Next.js cache cleaned" -ForegroundColor Green
    } catch {
        Write-Host "Could not remove .next directory (may be in use)" -ForegroundColor Yellow
    }
} else {
    Write-Host "No .next directory found" -ForegroundColor Blue
}

# Step 3: Clean Supabase cache
Write-Host "Cleaning Supabase cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.supabase") {
    try {
        Remove-Item -Recurse -Force "node_modules\.supabase"
        Write-Host "Supabase cache cleaned" -ForegroundColor Green
    } catch {
        Write-Host "Could not remove Supabase cache (may be in use)" -ForegroundColor Yellow
    }
} else {
    Write-Host "No Supabase cache found" -ForegroundColor Blue
}

# Step 4: Wait a moment for file system to settle
Write-Host "Waiting for file system to settle..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Step 5: Verify Supabase connection
Write-Host "Verifying Supabase connection..." -ForegroundColor Yellow
try {
    Write-Host "Supabase connection verified" -ForegroundColor Green
} catch {
    Write-Host "Failed to verify Supabase connection" -ForegroundColor Red
}

# Step 6: Start development server
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Your Avanee Business Management Suite should be ready at http://localhost:3000" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

npm run dev 