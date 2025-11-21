#!/bin/bash

# Mobile build script for Capacitor
# This script temporarily disables API routes and dynamic pages that can't be statically exported

set -e

echo "🚀 Starting mobile build process..."

# 1. Disable API routes (not needed for mobile app connecting to backend)
echo "📦 Disabling API routes..."
if [ -d "src/app/api" ]; then
  mv src/app/api src/app/_api_disabled
fi

# 2. Disable dynamic payment pages
echo "📦 Disabling dynamic routes..."
if [ -d "src/app/[locale]/payment/[serviceId]" ]; then
  mv "src/app/[locale]/payment/[serviceId]" "src/app/[locale]/payment/_serviceId_disabled"
fi

# Disable customer pages that use headers
if [ -d "src/app/[locale]/customer" ]; then
  mv "src/app/[locale]/customer" "src/app/[locale]/_customer_disabled"
fi

if [ -d "src/app/[locale]/home" ]; then
  mv "src/app/[locale]/home" "src/app/[locale]/_home_disabled"
fi

# Disable pages with server-side searchParams
if [ -d "src/app/[locale]/success" ]; then
  mv "src/app/[locale]/success" "src/app/[locale]/_success_disabled"
fi

if [ -d "src/app/[locale]/auth" ]; then
  mv "src/app/[locale]/auth" "src/app/[locale]/_auth_disabled"
fi

if [ -d "src/app/[locale]/report" ]; then
  mv "src/app/[locale]/report" "src/app/[locale]/_report_disabled"
fi

if [ -d "src/app/[locale]/four-fortune-analysis" ]; then
  mv "src/app/[locale]/four-fortune-analysis" "src/app/[locale]/_four-fortune-analysis_disabled"
fi

# Disable client pages with useSearchParams (need Suspense wrapping for static export)
if [ -d "src/app/[locale]/bazhai-report" ]; then
  mv "src/app/[locale]/bazhai-report" "src/app/[locale]/_bazhai-report_disabled"
fi

if [ -d "src/app/[locale]/birthday-entry" ]; then
  mv "src/app/[locale]/birthday-entry" "src/app/[locale]/_birthday-entry_disabled"
fi

if [ -d "src/app/[locale]/couple-entry" ]; then
  mv "src/app/[locale]/couple-entry" "src/app/[locale]/_couple-entry_disabled"
fi

if [ -d "src/app/[locale]/couple-report" ]; then
  mv "src/app/[locale]/couple-report" "src/app/[locale]/_couple-report_disabled"
fi

if [ -d "src/app/[locale]/demo" ]; then
  mv "src/app/[locale]/demo" "src/app/[locale]/_demo_disabled"
fi

if [ -d "src/app/[locale]/feng-shui-report" ]; then
  mv "src/app/[locale]/feng-shui-report" "src/app/[locale]/_feng-shui-report_disabled"
fi

if [ -d "src/app/[locale]/fortune-entry" ]; then
  mv "src/app/[locale]/fortune-entry" "src/app/[locale]/_fortune-entry_disabled"
fi

# Disable pages that use searchParams
if [ -d "src/app/saved-couple-report" ]; then
  mv "src/app/saved-couple-report" "src/app/_saved-couple-report_disabled"
fi

if [ -d "src/app/test-historical" ]; then
  mv "src/app/test-historical" "src/app/_test-historical_disabled"
fi

if [ -d "src/app/test-save" ]; then
  mv "src/app/test-save" "src/app/_test-save_disabled"
fi

# 3. Build Next.js with static export
echo "🔨 Building Next.js app..."
CAPACITOR_BUILD=true npm run build

# 4. Create index.html redirect for Capacitor
echo "📄 Creating index.html redirect..."
cat > out/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=/zh-TW/">
  <script>
    // Redirect to default locale
    window.location.href = '/zh-TW/';
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
EOF

# 5. Sync with Capacitor
echo "📱 Syncing with Capacitor..."
npx cap sync

# 6. Restore API routes and dynamic pages
echo "♻️  Restoring disabled routes..."
if [ -d "src/app/_api_disabled" ]; then
  mv src/app/_api_disabled src/app/api
fi

if [ -d "src/app/[locale]/payment/_serviceId_disabled" ]; then
  mv "src/app/[locale]/payment/_serviceId_disabled" "src/app/[locale]/payment/[serviceId]"
fi

if [ -d "src/app/[locale]/_customer_disabled" ]; then
  mv "src/app/[locale]/_customer_disabled" "src/app/[locale]/customer"
fi

if [ -d "src/app/[locale]/_home_disabled" ]; then
  mv "src/app/[locale]/_home_disabled" "src/app/[locale]/home"
fi

if [ -d "src/app/[locale]/_success_disabled" ]; then
  mv "src/app/[locale]/_success_disabled" "src/app/[locale]/success"
fi

if [ -d "src/app/[locale]/_auth_disabled" ]; then
  mv "src/app/[locale]/_auth_disabled" "src/app/[locale]/auth"
fi

if [ -d "src/app/[locale]/_report_disabled" ]; then
  mv "src/app/[locale]/_report_disabled" "src/app/[locale]/report"
fi

if [ -d "src/app/[locale]/_four-fortune-analysis_disabled" ]; then
  mv "src/app/[locale]/_four-fortune-analysis_disabled" "src/app/[locale]/four-fortune-analysis"
fi

if [ -d "src/app/[locale]/_bazhai-report_disabled" ]; then
  mv "src/app/[locale]/_bazhai-report_disabled" "src/app/[locale]/bazhai-report"
fi

if [ -d "src/app/[locale]/_birthday-entry_disabled" ]; then
  mv "src/app/[locale]/_birthday-entry_disabled" "src/app/[locale]/birthday-entry"
fi

if [ -d "src/app/[locale]/_couple-entry_disabled" ]; then
  mv "src/app/[locale]/_couple-entry_disabled" "src/app/[locale]/couple-entry"
fi

if [ -d "src/app/[locale]/_couple-report_disabled" ]; then
  mv "src/app/[locale]/_couple-report_disabled" "src/app/[locale]/couple-report"
fi

if [ -d "src/app/[locale]/_demo_disabled" ]; then
  mv "src/app/[locale]/_demo_disabled" "src/app/[locale]/demo"
fi

if [ -d "src/app/[locale]/_feng-shui-report_disabled" ]; then
  mv "src/app/[locale]/_feng-shui-report_disabled" "src/app/[locale]/feng-shui-report"
fi

if [ -d "src/app/[locale]/_fortune-entry_disabled" ]; then
  mv "src/app/[locale]/_fortune-entry_disabled" "src/app/[locale]/fortune-entry"
fi

if [ -d "src/app/_saved-couple-report_disabled" ]; then
  mv "src/app/_saved-couple-report_disabled" "src/app/saved-couple-report"
fi

if [ -d "src/app/_test-historical_disabled" ]; then
  mv "src/app/_test-historical_disabled" "src/app/test-historical"
fi

if [ -d "src/app/_test-save_disabled" ]; then
  mv "src/app/_test-save_disabled" "src/app/test-save"
fi

echo "✅ Mobile build complete!"
echo ""
echo "Next steps:"
echo "  • npm run cap:open:ios     - Open in Xcode"
echo "  • npm run cap:open:android - Open in Android Studio"
