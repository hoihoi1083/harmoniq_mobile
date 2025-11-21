#!/bin/bash

# Check environment variables and fix issues
echo "🔧 Checking and fixing environment and functionality issues..."

ssh -i ~/.ssh/fengshui.pem ec2-user@54.205.0.111 << 'EOF'
  cd /home/ec2-user/fengshui-layout
  
  echo "🔍 Current environment file content:"
  echo "=== STRIPE CONFIGURATION ==="
  grep -E "(STRIPE|PRICE_ID)" .env | head -10
  echo ""
  echo "=== NEXTAUTH CONFIGURATION ==="
  grep -E "(NEXTAUTH|GOOGLE|APPLE)" .env | head -5
  echo ""
  
  echo "🌐 Testing specific API routes:"
  
  echo "1. Testing payment API with POST:"
  curl -X POST http://localhost:3000/api/payment-couple \
    -H "Content-Type: application/json" \
    -d '{"locale":"zh-TW","specificProblem":"test"}' \
    --connect-timeout 5 2>/dev/null | head -1 || echo "Payment API POST failed"
  
  echo ""
  echo "2. Testing auth API:"
  curl http://localhost:3000/api/auth/status --connect-timeout 5 2>/dev/null | head -1 || echo "Auth API failed"
  
  echo ""
  echo "3. Testing static JS files:"
  find .next/static/chunks -name "*.js" | head -3
  
  echo ""
  echo "4. Checking if static files are copied to standalone:"
  ls -la .next/standalone/_next/static/chunks/ | head -3 2>/dev/null || echo "Static files not in standalone"
  
  echo ""
  echo "🔧 PM2 process environment:"
  pm2 env 0 | grep -E "(STRIPE|NEXTAUTH|NODE_ENV)" || echo "Environment variables not loaded in PM2"
EOF