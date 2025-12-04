#!/bin/bash

# Update all API calls to use backend server
# This prepares mobile app for static export

echo "🔧 Updating API calls to point to backend server..."

API_BASE='process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.harmoniqfengshui.com"'

# Find and replace in all source files (excluding backups and node_modules)
find src -type f \( -name "*.jsx" -o -name "*.tsx" -o -name "*.js" -o -name "*.ts" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/backups/*" \
  -not -path "*/.next/*" \
  -exec sed -i '' 's|fetch("/api/|fetch(('"$API_BASE"') + "/api/|g' {} +

echo "✅ Updated all API calls to use NEXT_PUBLIC_API_BASE_URL"
echo "📝 Verifying changes..."

# Count how many were updated
UPDATED=$(grep -r 'NEXT_PUBLIC_API_BASE_URL.*"/api/' src --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | wc -l)
echo "✅ Found $UPDATED API calls now using backend URL"
