#!/bin/bash

# Complete fix for 502 Bad Gateway
echo "🔧 Complete fix for 502 Bad Gateway..."

# Upload fixed next.config.ts
echo "📤 Uploading fixed configuration..."
scp -i ~/.ssh/fengshui.pem next.config.ts ec2-user@54.205.0.111:/home/ec2-user/fengshui-layout/

# SSH and completely rebuild
ssh -i ~/.ssh/fengshui.pem ec2-user@54.205.0.111 << 'EOF'
  cd /home/ec2-user/fengshui-layout
  
  echo "🛑 Stopping PM2 completely..."
  pm2 kill
  
  echo "🗑️ Complete cleanup..."
  rm -rf .next
  rm -rf node_modules
  rm -rf .turbo
  rm -rf out
  
  echo "📦 Fresh install..."
  npm install
  
  echo "🔨 Building with fixed config..."
  npm run build
  
  echo "✅ Checking build output..."
  ls -la .next/
  ls -la .next/standalone/ 2>/dev/null || echo "No standalone build"
  
  echo "🚀 Starting with direct server approach..."
  # Try direct approach first
  if [ -f .next/standalone/server.js ]; then
    echo "Using standalone server..."
    pm2 start .next/standalone/server.js --name "fengshui-app" -i 1 --env-file .env
  else
    echo "Using npm start..."
    pm2 start npm --name "fengshui-app" -- start --env-file .env
  fi
  
  pm2 save
  
  echo "⏳ Waiting for startup..."
  sleep 10
  
  echo "📊 Final status:"
  pm2 status
  
  echo "🔍 Testing connectivity:"
  curl -I http://localhost:3000 || echo "Still starting up..."
  
  echo "📋 Recent logs:"
  pm2 logs --lines 15 --nostream
EOF

echo ""
echo "✅ Complete rebuild finished!"
echo "🌐 Test your site: https://www.harmoniqfengshui.com"
echo "🔧 Direct IP: http://54.205.0.111:3000"