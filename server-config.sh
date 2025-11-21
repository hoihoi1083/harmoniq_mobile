#!/bin/bash
# Production server configuration
echo "✅ Server environment configured for production deployment"

# Node.js memory optimization
export NODE_OPTIONS="--max-old-space-size=2048"
export UV_THREADPOOL_SIZE=16

# Server configuration
export HOST=0.0.0.0
export PORT=3000

# Environment
export NODE_ENV=production

echo "🚀 Node.js memory limit: 2GB"
echo "⚡ UV thread pool: $UV_THREADPOOL_SIZE threads"
echo "🌐 Server binding: $HOST:$PORT"
echo "📝 Note: API timeouts are configured per route (12s production, 20s development)"