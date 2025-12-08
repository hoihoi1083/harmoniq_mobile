#!/bin/bash
# Quick rebuild and sync to iOS script

echo "🧹 Cleaning build directories..."
rm -rf .next out

echo "🏗️  Building Next.js app..."
npm run build

echo "📋 Copying locale index..."
cat out/zh-TW/index.html > out/index.html

echo "📱 Syncing to iOS..."
npx cap copy ios

echo "✅ Done! Now:"
echo "   1. Stop the app in Xcode (Cmd + .)"
echo "   2. Clean build folder (Shift + Cmd + K)"
echo "   3. Build and run (Cmd + R)"
echo ""
echo "Or just close and reopen the app to reload!"
