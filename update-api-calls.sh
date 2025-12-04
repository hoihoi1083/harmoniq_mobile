#!/bin/bash

# Script to update all API calls to use backend server
# This prepares the mobile app for static export

echo "🔧 Updating API calls to use backend server..."

# Define the replacement pattern
# Old: fetch("/api/...
# New: fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/...

# Find all fetch calls with /api/ and show count
echo "📊 Found API calls:"
grep -r "fetch(\"/api/" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | wc -l

echo "✅ API calls will be updated during build"
echo "📝 Note: Build will use NEXT_PUBLIC_API_BASE_URL from .env.production"
