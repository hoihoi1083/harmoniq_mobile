#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting mobile development mode...${NC}"

# Check if Next.js dev server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Dev server already running on port 3000${NC}"
else
    echo -e "${BLUE}📦 Starting Next.js dev server...${NC}"
    npm run dev &
    DEV_PID=$!
    
    # Wait for dev server to be ready
    echo -e "${BLUE}⏳ Waiting for dev server to start...${NC}"
    for i in {1..15}; do
        if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✅ Dev server is ready!${NC}"
            break
        fi
        sleep 1
        echo -n "."
    done
    echo ""
fi

# Switch to dev config
echo -e "${BLUE}🔧 Switching to development config...${NC}"
cp capacitor.config.ts capacitor.config.prod.ts.backup
cp capacitor.config.dev.ts capacitor.config.ts

# Sync with iOS
echo -e "${BLUE}📱 Syncing with Capacitor...${NC}"
npx cap sync ios

echo ""
echo -e "${GREEN}✅ Development mode ready!${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📱 LIVE RELOAD DEVELOPMENT WORKFLOW${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}1.${NC} Open Xcode and ${GREEN}run the app${NC}"
echo -e "${BLUE}2.${NC} App will load from ${YELLOW}http://localhost:3000${NC}"
echo -e "${BLUE}3.${NC} ${GREEN}Edit your code and save${NC}"
echo -e "${BLUE}4.${NC} In simulator: ${YELLOW}Cmd+R to refresh${NC} ⚡"
echo -e "${BLUE}5.${NC} See changes instantly - NO rebuild needed!"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}💡 Tips:${NC}"
echo -e "   • ${GREEN}Hot reload:${NC} Save file → Cmd+R in simulator"
echo -e "   • ${GREEN}View logs:${NC} Check Xcode console and terminal"
echo -e "   • ${GREEN}Stop dev mode:${NC} Press Ctrl+C here"
echo -e "   • ${GREEN}Back to prod:${NC} Run ${YELLOW}npm run cap:prod${NC}"
echo ""
echo -e "${RED}⚠️  Remember:${NC} Run ${YELLOW}npm run cap:prod${NC} before production builds!"
echo ""
echo -e "${GREEN}🔗 Dev server running at: http://localhost:3000${NC}"
echo ""
