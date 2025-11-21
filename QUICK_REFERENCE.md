# FengShui Layout - Quick Reference

## 🚀 One-Command Deployment

```bash
./complete-deployment.sh
```

This single command will:

- Upload your code to the server
- Build the application on the server
- Configure all assets (images, JS, CSS)
- Start the application with PM2
- Verify everything is working

## 🔍 Health Check

```bash
./health-check.sh
```

Check if your deployment is working correctly.

## 📋 Manual Commands

### Deploy Existing Script

```bash
./deploy-with-images.sh
```

### Check Server Status

```bash
ssh fs "pm2 status"
```

### View Logs

```bash
ssh fs "pm2 logs"
```

### Restart Application

```bash
ssh fs "pm2 restart all"
```

## 🆘 Troubleshooting

### If website shows 502 error:

```bash
ssh fs
cd /home/ec2-user/fengshui-layout
pm2 restart all
pm2 logs
```

### If JavaScript/CSS not loading:

```bash
ssh fs
cd /home/ec2-user/fengshui-layout
cp -r .next/static .next/standalone/.next/
pm2 restart all
```

### If images not loading:

```bash
ssh fs
cd /home/ec2-user/fengshui-layout
cp -r public .next/standalone/
pm2 restart all
```

## 📁 Important Files

- `DEPLOYMENT_GUIDE.md` - Complete deployment documentation
- `complete-deployment.sh` - Full automated deployment
- `health-check.sh` - Verify deployment status
- `ecosystem.config.js` - PM2 configuration
- `.env.production` - Production environment variables

## 🌐 Live Website

https://www.harmoniqfengshui.com
