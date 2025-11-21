# Complete Deployment Guide for FengShui Layout

## Overview

This guide provides a complete process to deploy your Next.js application to AWS EC2 server with PM2 process management.

## Prerequisites

### 1. Server Setup

- AWS EC2 instance running Amazon Linux 2023
- Node.js 18+ installed
- PM2 installed globally
- SSH key pair configured
- Domain name pointed to server (www.harmoniqfengshui.com)

### 2. Local Setup

- SSH alias configured in `~/.ssh/config`:

```
Host fs
    HostName 54.205.0.111
    User ec2-user
    IdentityFile ~/.ssh/fengshui.pem
```

### 3. Required Files

- `.env.production` with production environment variables
- `ecosystem.config.js` for PM2 configuration
- `package.json` with build scripts

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

Use the `deploy-with-images.sh` script for one-command deployment:

```bash
chmod +x deploy-with-images.sh
./deploy-with-images.sh
```

### Method 2: Manual Step-by-Step Deployment

#### Step 1: Upload Source Code

```bash
# Upload all source files (excluding build artifacts)
rsync -avz -e "ssh -i ~/.ssh/fengshui.pem" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '*.log' \
  ./ ec2-user@54.205.0.111:/home/ec2-user/fengshui-layout/
```

#### Step 2: Server-Side Build Process

```bash
# Connect to server
ssh fs

# Navigate to project directory
cd /home/ec2-user/fengshui-layout

# Stop existing PM2 processes
pm2 stop all || true

# Install dependencies
npm install

# Build the application
npm run build

# Copy public assets to standalone build
cp -r public .next/standalone/

# Copy environment file
cp .env.production .next/standalone/.env

# Copy static assets (CRITICAL for JS/CSS)
cp -r .next/static .next/standalone/.next/

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

#### Step 3: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Test local connection
curl -I http://localhost:3000

# Test public website
curl -I https://www.harmoniqfengshui.com
```

## Configuration Files

### ecosystem.config.js

```javascript
module.exports = {
	apps: [
		{
			name: "fengshui-app",
			script: ".next/standalone/server.js",
			cwd: "/home/ec2-user/fengshui-layout",
			instances: 1,
			exec_mode: "fork",
			watch: false,
			max_memory_restart: "1G",
			error_file: "./logs/err.log",
			out_file: "./logs/out.log",
			log_file: "./logs/combined.log",
			time: true,
			env: {
				NODE_ENV: "production",
				PORT: "3000",
				HOSTNAME: "0.0.0.0",
				LANG: "zh_CN.UTF-8",
				LC_ALL: "zh_CN.UTF-8",
			},
		},
	],
};
```

### .env.production (Example)

```env
NODE_ENV=production
NEXTAUTH_URL=https://www.harmoniqfengshui.com
NEXTAUTH_SECRET=your-secret-here
MONGODB_URI=your-mongodb-connection-string
STRIPE_SECRET_KEY=your-stripe-secret-key
OPENAI_API_KEY=your-openai-api-key
```

## Troubleshooting

### Common Issues and Solutions

#### 1. 502 Bad Gateway Error

**Cause**: Application not running or not listening on correct port
**Solution**:

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Restart if needed
pm2 restart all
```

#### 2. No JavaScript/CSS Loading

**Cause**: Static assets not copied to standalone build
**Solution**:

```bash
# Copy static assets
cp -r .next/static .next/standalone/.next/
pm2 restart all
```

#### 3. Images Not Loading

**Cause**: Public directory not copied to standalone build
**Solution**:

```bash
# Copy public directory
cp -r public .next/standalone/
pm2 restart all
```

#### 4. Module Not Found Errors

**Cause**: Missing dependencies or incorrect build
**Solution**:

```bash
# Clean install and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Diagnostic Commands

```bash
# Check application logs
pm2 logs fengshui-app --lines 50

# Check system resources
free -h
df -h

# Check port usage
netstat -tlnp | grep :3000

# Test local connection
curl -I http://localhost:3000

# Check build directory structure
ls -la .next/standalone/
```

## Monitoring and Maintenance

### PM2 Management

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart fengshui-app

# Stop application
pm2 stop fengshui-app

# Delete application
pm2 delete fengshui-app

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

### Log Management

```bash
# View error logs
tail -f /home/ec2-user/fengshui-layout/logs/err.log

# View output logs
tail -f /home/ec2-user/fengshui-layout/logs/out.log

# Clear PM2 logs
pm2 flush
```

## Performance Optimization

### 1. Build Optimization

- Enable standalone output in `next.config.js`
- Minimize bundle size
- Optimize images

### 2. Server Optimization

- Configure PM2 memory limits
- Set up log rotation
- Monitor resource usage

### 3. CDN and Caching

- Use CloudFront for static assets
- Configure proper cache headers
- Optimize image delivery

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files
- Use secure secrets
- Rotate keys regularly

### 2. Server Security

- Keep packages updated
- Configure firewall rules
- Use HTTPS only

### 3. Application Security

- Validate all inputs
- Implement rate limiting
- Use secure headers

## Rollback Procedure

If deployment fails:

```bash
# 1. Stop current deployment
pm2 stop all

# 2. Restore from backup (if available)
# Or redeploy previous version

# 3. Check logs for issues
pm2 logs

# 4. Fix issues and redeploy
```

## Health Checks

Create automated health checks:

```bash
# Basic health check script
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" https://www.harmoniqfengshui.com)
if [ $response -eq 200 ]; then
    echo "✅ Site is healthy"
else
    echo "❌ Site is down (HTTP $response)"
    # Add alerting logic here
fi
```

## Best Practices

1. **Always test locally first**
2. **Use staging environment for testing**
3. **Backup before major deployments**
4. **Monitor logs during deployment**
5. **Have rollback plan ready**
6. **Document any custom configurations**
7. **Keep deployment scripts updated**

## Support and Resources

- Next.js Documentation: https://nextjs.org/docs
- PM2 Documentation: https://pm2.keymetrics.io/docs/
- AWS EC2 Documentation: https://docs.aws.amazon.com/ec2/

---

For issues or questions, refer to the troubleshooting section or check the application logs.
