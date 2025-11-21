# Mobile Backend Deployment Setup

## Architecture

```
EC2 Server (fs)
├── Web App (Port 3000)          ← Your existing web project (UNTOUCHED)
│   PM2: "web-app"
│   Path: /home/ec2-user/web-project/
│   URL: https://www.harmoniqfengshui.com
│
└── Mobile Backend (Port 3001)   ← This project (NEW)
    PM2: "fengshui-mobile-api"
    Path: /home/ec2-user/fengshui-mobile-backend/
    URL: https://mobile-api.harmoniqfengshui.com (or subdomain)
```

## Step 1: Server Setup

SSH to your EC2 server and create the directory:

```bash
ssh fs
mkdir -p /home/ec2-user/fengshui-mobile-backend
```

## Step 2: Deploy Mobile Backend

From your local machine:

```bash
./complete-deployment.sh
```

This will:

- Upload code to `/home/ec2-user/fengshui-mobile-backend`
- Start PM2 process "fengshui-mobile-api" on port 3001
- NOT touch your web app

## Step 3: Configure Nginx (Choose One Option)

### Option A: Subdomain (Recommended)

Create mobile API subdomain: `mobile-api.harmoniqfengshui.com`

```nginx
# /etc/nginx/sites-available/mobile-api
server {
    listen 80;
    server_name mobile-api.harmoniqfengshui.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/mobile-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d mobile-api.harmoniqfengshui.com
```

### Option B: URL Path Routing

Keep same domain, route by path: `https://www.harmoniqfengshui.com/mobile-api/*`

```nginx
# Add to existing nginx config
location /mobile-api/ {
    rewrite ^/mobile-api/(.*) /$1 break;
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Step 4: Update Mobile App Config

After choosing your nginx setup:

### If using subdomain:

```typescript
// capacitor.config.prod.ts
server: {
    url: "https://mobile-api.harmoniqfengshui.com",
    cleartext: false,
}
```

### If using path routing:

```typescript
// capacitor.config.prod.ts
server: {
    url: "https://www.harmoniqfengshui.com/mobile-api",
    cleartext: false,
}
```

## Step 5: Verify Both Apps Running

```bash
ssh fs

# Check both PM2 processes
pm2 list

# Should show:
# - web-app (port 3000) ← Your web project
# - fengshui-mobile-api (port 3001) ← Mobile backend
```

## Step 6: Test

```bash
# Test web app (should still work)
curl https://www.harmoniqfengshui.com

# Test mobile API
curl https://mobile-api.harmoniqfengshui.com
# or
curl https://www.harmoniqfengshui.com/mobile-api
```

## Deployment Workflow

```bash
# Deploy mobile backend only (web app untouched)
./complete-deployment.sh

# Web app continues running normally ✅
# Mobile API updates independently ✅
```

## Environment Variables

Make sure your mobile backend `.env` has:

```bash
# Mobile-specific settings
PORT=3001
MONGODB_URI=your_mongodb_connection
STRIPE_SECRET_KEY=your_stripe_key
DEEPSEEK_API_KEY=your_deepseek_key

# Same database as web (shared users/payments)
# Different port (independent deployment)
```

## Benefits

✅ Web app never goes down during mobile deployments
✅ Mobile API can be updated independently
✅ Both share same database (same users, payments)
✅ Mobile app gets all backend features
✅ Web and mobile evolve separately
