#!/bin/bash

# Script to update all API calls to use base URL
echo "🔧 Updating API calls in mobile app..."

# Define the API base pattern
API_BASE_DEF="const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';"

# Find all files with relative API calls (excluding api.backup)
FILES=$(find src -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.ts" -o -name "*.js" \) ! -path "*/api.backup*" ! -path "*/node_modules/*" -exec grep -l 'fetch.*['"'"'"`]/api/' {} \;)

echo "Found files to update:"
echo "$FILES"
echo ""

# For each file, show the API calls that need updating
for file in $FILES; do
    echo "📄 $file:"
    grep -n 'fetch.*['"'"'"`]/api/' "$file" | head -5
    echo ""
done

echo "✅ Scan complete. Please review the files above."
