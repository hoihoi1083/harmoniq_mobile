# 📱 Mobile Development Workflow

## 🚀 Two Modes of Development

### 1️⃣ **LIVE RELOAD MODE** (Recommended for Development) ⚡

**Use this for fast development with instant refresh!**

```bash
# Start development mode
npm run cap:dev
```

**What happens:**

- ✅ Starts Next.js dev server on `localhost:3000`
- ✅ Configures Capacitor to load from localhost
- ✅ Syncs with iOS

**How to use:**

1. Run `npm run cap:dev` in terminal
2. Open Xcode and run the app
3. App loads from `http://localhost:3000`
4. **Make code changes** in your editor
5. **Press `Cmd+R` in simulator** to refresh
6. See changes instantly! NO rebuild needed! ⚡

**Pros:**

- 🚀 Instant changes - just refresh
- 💻 Full Next.js dev features (hot reload, error overlay)
- 🔍 Easy debugging in browser DevTools
- ⏱️ Saves tons of time!

**Cons:**

- Requires dev server running
- Some native features may not work exactly like production

---

### 2️⃣ **STATIC BUILD MODE** (For Production Testing)

**Use this to test production build or when dev server has issues.**

```bash
# Build static files
./build-mobile.sh

# Then run in Xcode
npm run cap:open:ios
```

**What happens:**

- ✅ Builds static HTML/CSS/JS files
- ✅ Copies to iOS app bundle
- ✅ App runs fully offline

**How to use:**

1. Run `./build-mobile.sh`
2. Open Xcode and run the app
3. **For changes:** Rebuild with `./build-mobile.sh` again

**Pros:**

- 📦 Tests production build
- 🚫 No internet required
- ✅ Exactly like production app

**Cons:**

- ⏳ Slow - need to rebuild for every change
- ❌ No hot reload or dev tools

---

## 🔄 Switching Between Modes

### From Live Reload → Production:

```bash
npm run cap:prod
```

### From Production → Live Reload:

```bash
npm run cap:dev
```

---

## 💡 Best Practice Workflow

### During Active Development:

```bash
# 1. Start dev mode ONCE
npm run cap:dev

# 2. Run app in Xcode
# Click Run ▶️

# 3. Code → Save → Cmd+R in simulator
# Repeat step 3 as many times as you want!
```

### Before Deploying or Testing Production:

```bash
# 1. Switch to production mode
npm run cap:prod

# 2. Build static files
./build-mobile.sh

# 3. Test in Xcode
npm run cap:open:ios
```

---

## 🛠️ Troubleshooting

### "Connection Refused" in Live Reload Mode

**Problem:** App can't connect to localhost:3000

**Solutions:**

1. Check dev server is running: `lsof -i :3000`
2. Restart dev mode: `Ctrl+C` then `npm run cap:dev`
3. Check terminal for errors

### Blank Screen in Live Reload Mode

**Problem:** App loads but shows nothing

**Solutions:**

1. Check browser console in Safari Web Inspector
2. Verify dev server is accessible: open `http://localhost:3000` in Safari
3. Check Xcode console for errors

### Changes Not Appearing

**Problem:** Saved changes but no update in simulator

**Solutions:**

1. **Live Reload Mode:** Press `Cmd+R` in simulator
2. **Static Mode:** Rebuild with `./build-mobile.sh`
3. Check you saved the file (⌘+S)

### Dev Server Won't Start

**Problem:** Port 3000 already in use

**Solution:**

```bash
# Kill existing process
kill $(lsof -t -i:3000)

# Start again
npm run cap:dev
```

---

## 📚 Command Reference

| Command                | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run cap:dev`      | Start live reload development mode               |
| `npm run cap:prod`     | Switch back to production mode                   |
| `./build-mobile.sh`    | Build static files for production                |
| `npm run cap:open:ios` | Open Xcode project                               |
| `npx cap sync ios`     | Sync Capacitor config (use after config changes) |
| `npm run dev`          | Start Next.js dev server only                    |

---

## 🎯 When to Use What

| Scenario                | Use This Mode   |
| ----------------------- | --------------- |
| Adding new features     | 🟢 Live Reload  |
| Fixing bugs             | 🟢 Live Reload  |
| Testing styles/UI       | 🟢 Live Reload  |
| Testing performance     | 🔴 Static Build |
| Testing offline mode    | 🔴 Static Build |
| Before App Store submit | 🔴 Static Build |
| Final QA testing        | 🔴 Static Build |

---

## 🎉 Tips for Maximum Productivity

1. **Keep dev server running** - Start it once, use it all day
2. **Use Cmd+R** - Fastest way to see changes
3. **Safari Web Inspector** - Debug like a web app
4. **Xcode Console** - See native errors
5. **Only rebuild** when testing production features

---

## 📱 Current Setup

- **Dev Config:** `capacitor.config.dev.ts` → Points to localhost:3000
- **Prod Config:** `capacitor.config.ts` → Uses static files from `out/`
- **Dev Script:** `dev-mobile.sh` → Manages dev mode
- **Build Script:** `build-mobile.sh` → Builds production files

---

**Happy Coding! 🚀**
