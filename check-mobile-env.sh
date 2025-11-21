#!/bin/bash

# HarmoniqFengShui Mobile App - Environment Check Script
# This script checks if your development environment is ready for mobile app development

echo "🔍 Checking Mobile Development Environment..."
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        VERSION=$($1 $2 2>&1 | head -1)
        echo -e "${GREEN}✅ $1 installed:${NC} $VERSION"
        return 0
    else
        echo -e "${RED}❌ $1 not found${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $2${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $2${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "📋 Checking Required Software..."
echo "================================"
echo ""

# Check Node.js
if check_command "node" "--version"; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ $NODE_VERSION -lt 18 ]; then
        echo -e "${YELLOW}⚠️  Node.js version is $NODE_VERSION. Version 18+ recommended.${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Check npm
check_command "npm" "--version"

# Check pnpm (optional)
if command -v pnpm &> /dev/null; then
    check_command "pnpm" "--version"
fi

echo ""
echo "📱 Checking iOS Development Tools (macOS only)..."
echo "=================================================="
echo ""

# Check if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Check Xcode
    if check_command "xcodebuild" "-version"; then
        XCODE_VERSION=$(xcodebuild -version | head -1)
        echo "   $XCODE_VERSION"
    fi
    
    # Check xcode-select
    if check_command "xcode-select" "-p"; then
        XCODE_PATH=$(xcode-select -p)
        echo "   Path: $XCODE_PATH"
    fi
    
    # Check CocoaPods
    check_command "pod" "--version"
    
    # Check for iOS simulators
    if command -v xcrun &> /dev/null; then
        SIMULATOR_COUNT=$(xcrun simctl list devices available | grep -c "iPhone")
        if [ $SIMULATOR_COUNT -gt 0 ]; then
            echo -e "${GREEN}✅ iOS Simulators available: $SIMULATOR_COUNT${NC}"
        else
            echo -e "${YELLOW}⚠️  No iOS simulators found${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Not running on macOS - iOS development not available${NC}"
    echo "   You can still develop for Android on Linux/Windows"
fi

echo ""
echo "🤖 Checking Android Development Tools..."
echo "========================================="
echo ""

# Check Java
if check_command "java" "-version"; then
    JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
    echo "   Java version: $JAVA_VERSION"
fi

# Check for ANDROID_HOME
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✅ ANDROID_HOME set:${NC} $ANDROID_HOME"
else
    echo -e "${YELLOW}⚠️  ANDROID_HOME not set${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for Android Studio
if [ -d "/Applications/Android Studio.app" ] || [ -d "$HOME/android-studio" ] || [ -d "/opt/android-studio" ]; then
    echo -e "${GREEN}✅ Android Studio found${NC}"
else
    echo -e "${YELLOW}⚠️  Android Studio not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📦 Checking Project Dependencies..."
echo "===================================="
echo ""

# Check if node_modules exists
check_dir "node_modules" "node_modules directory exists"

# Check if Capacitor is installed
if [ -f "node_modules/.bin/cap" ]; then
    CAP_VERSION=$(npx cap --version 2>&1)
    echo -e "${GREEN}✅ Capacitor installed:${NC} $CAP_VERSION"
else
    echo -e "${RED}❌ Capacitor not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check important files
echo ""
check_file "capacitor.config.ts" "capacitor.config.ts exists"
check_file "package.json" "package.json exists"
check_file ".env.local" ".env.local exists"

# Check if platforms are added
echo ""
check_dir "ios" "iOS platform added (ios/ directory)"
check_dir "android" "Android platform added (android/ directory)"

echo ""
echo "🔐 Checking Environment Variables..."
echo "====================================="
echo ""

# Source .env.local if it exists
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    
    # Check required variables
    [ -n "$GOOGLE_CLIENT_ID" ] && echo -e "${GREEN}✅ GOOGLE_CLIENT_ID set${NC}" || echo -e "${YELLOW}⚠️  GOOGLE_CLIENT_ID not set${NC}"
    [ -n "$NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID" ] && echo -e "${GREEN}✅ NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID set${NC}" || echo -e "${YELLOW}⚠️  NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID not set${NC}"
    [ -n "$APPLE_ID" ] && echo -e "${GREEN}✅ APPLE_ID set${NC}" || echo -e "${YELLOW}⚠️  APPLE_ID not set${NC}"
    [ -n "$NEXTAUTH_SECRET" ] && echo -e "${GREEN}✅ NEXTAUTH_SECRET set${NC}" || echo -e "${YELLOW}⚠️  NEXTAUTH_SECRET not set${NC}"
    [ -n "$MONGODB_URI" ] && echo -e "${GREEN}✅ MONGODB_URI set${NC}" || echo -e "${YELLOW}⚠️  MONGODB_URI not set${NC}"
else
    echo -e "${YELLOW}⚠️  .env.local file not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📊 Summary"
echo "=========="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Your environment is fully set up for mobile development!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run build:mobile"
    echo "2. Run: npm run cap:open:ios (or cap:open:android)"
    echo "3. Click Play ▶️  in Xcode/Android Studio"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Environment is set up with $WARNINGS warnings${NC}"
    echo ""
    echo "You can proceed, but some features may not work."
    echo "Check the warnings above for details."
    echo ""
else
    echo -e "${RED}❌ Found $ERRORS critical issues and $WARNINGS warnings${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    echo ""
    echo "Installation guides:"
    echo "- Node.js: https://nodejs.org/"
    echo "- Xcode: App Store (macOS)"
    echo "- CocoaPods: sudo gem install cocoapods"
    echo "- Android Studio: https://developer.android.com/studio"
    echo ""
fi

echo "📚 For detailed setup instructions, see:"
echo "   - QUICK_START.md"
echo "   - MOBILE_DEVELOPMENT_GUIDE.md"
echo ""

exit 0
