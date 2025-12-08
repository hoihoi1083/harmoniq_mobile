# 📸 Screenshot Capture Guide for Google Play

## 🎯 Requirements Overview

### Technical Specs:
- **Minimum:** 2 screenshots (required)
- **Recommended:** 8 screenshots (better conversion)
- **Resolution:** 1080 x 1920 px (minimum)
- **Aspect Ratio:** 9:16 (portrait) or 16:9 (landscape)
- **Format:** PNG or JPG
- **File Size:** Under 8MB each

---

## 📱 Screenshots Needed (Priority Order)

### 🔥 High Priority (Must Have - 4 screenshots)

#### 1. Home Screen / Main Dashboard ⭐ MOST IMPORTANT
**Purpose:** First impression - shows overall app interface

**What to show:**
- Bottom navigation bar visible
- Top section with user greeting (if logged in)
- Main feature cards clearly visible:
  - 風水測算 (Feng Shui Analysis)
  - 命理測算 (Fortune Calculation)
  - 流年運程 (Fortune Forecast)
  - 情侶合盤 (Couple Analysis)
  - 智能聊天室 (AI Chat)

**Path:** `/zh-TW/home`

**Tips:**
- Make sure you're logged in so it looks personalized
- Clean interface (no error messages)
- All icons/images loaded properly

---

#### 2. BaZi Input Page ⭐ CORE FEATURE
**Purpose:** Shows users can input birth info for fortune telling

**What to show:**
- Name input field (enter a sample name like "王小明")
- Gender toggle buttons (男/女)
- Calendar type toggle (公曆/農曆)
- Date picker showing (example: 1990/01/15)
- Time picker showing (example: 14:30)
- Location input (example: "台北")
- "開始測算" (Start Analysis) button clearly visible

**Path:** `/zh-TW/bazi-input`

**Tips:**
- Fill in sample data (don't leave empty)
- Use realistic Chinese name
- Shows paid report options at bottom

---

#### 3. Fortune Report / Analysis Result ⭐ SHOWS VALUE
**Purpose:** Demonstrates what users get after paying

**What to show:**
- Detailed BaZi chart or report
- Chinese fortune analysis text
- Visual elements (charts, diagrams)
- Professional layout
- Any feng shui recommendations

**Path:** After completing BaZi analysis (paid feature)

**Options if you can't generate paid report:**
- Screenshot from staging/test environment
- Use test account with sample data
- Show demo report if available

**Alternative:** Show any analysis result page (feng shui layout, fortune forecast)

---

#### 4. Home Layout Design Tool ⭐ UNIQUE FEATURE
**Purpose:** Shows feng shui home analysis capability

**What to show:**
- Room layout or floor plan interface
- Feng shui analysis elements
- Interactive design tools
- Color coding or feng shui zones
- Recommendations or suggestions visible

**Path:** Feng shui design feature (exact path unknown, check app)

**Tips:**
- Show a completed or partially completed layout
- Make sure it's clear this is feng shui analysis
- Include Chinese text explaining features

---

### 🟡 Medium Priority (Nice to Have - 4 more screenshots)

#### 5. AI Chat Interface
**Purpose:** Shows chatbot consultation feature

**What to show:**
- Chat conversation with AI
- Sample questions and answers about feng shui/fortune
- Chinese conversation
- Clean chat bubble design
- Input field at bottom

**Path:** `/zh-TW/chat` or chat feature

**Sample conversation:**
```
User: 我想问一下家里的风水布局
AI: 好的，请问您想咨询哪个房间的风水布局呢？
```

---

#### 6. Pricing / Premium Features Page
**Purpose:** Shows transparent pricing (builds trust)

**What to show:**
- Free vs Premium comparison
- Pricing cards (¥299/年)
- Feature list for each tier
- Purchase buttons
- Money-back guarantee mention

**Path:** Check for pricing or membership page

---

#### 7. Fortune Forecast / Flow Year Analysis
**Purpose:** Shows annual fortune prediction feature

**What to show:**
- Calendar or timeline view
- Fortune predictions by month/period
- Lucky/unlucky days
- Recommendations
- Visual charts or graphs

**Path:** Fortune or 流年運程 feature

---

#### 8. Couple Compatibility Analysis
**Purpose:** Shows relationship matching feature

**What to show:**
- Two person input fields
- Compatibility score or result
- Analysis breakdown
- Heart-related visuals
- Recommendations for couples

**Path:** 情侶合盤 feature

---

## 🛠️ How to Capture Screenshots

### Option 1: Using Android Device (Recommended)

#### Method A: Physical Device via Android Studio
```bash
# 1. Connect your Android phone to computer
# 2. Enable USB debugging on phone
# 3. Run app on device:
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp
npx cap open android

# 4. Wait for Android Studio to open
# 5. Run app on connected device
# 6. Take screenshots:
#    - In Android Studio: View → Tool Windows → Logcat
#    - Click camera icon in device toolbar
#    - OR use phone's screenshot function (Power + Volume Down)
```

#### Method B: Using Android Studio Emulator
```bash
# 1. Open Android Studio
npx cap open android

# 2. Create/start emulator:
#    - Tools → Device Manager
#    - Choose Pixel 4 or similar (1080x1920 resolution)
#    - Click Play button

# 3. Run app on emulator
# 4. Take screenshots:
#    - Click camera icon in emulator sidebar
#    - Screenshots saved to: ~/Desktop by default
```

#### Method C: Direct from Phone
```bash
# 1. Build and install APK on your phone
# 2. Navigate to each screen
# 3. Take screenshot (usually Power + Volume Down)
# 4. Transfer to computer:
#    - USB cable → File transfer
#    - AirDrop (if iPhone)
#    - Google Photos upload
#    - Email to yourself
```

---

### Option 2: Using iOS Simulator (Alternative)

```bash
# 1. Open iOS app
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp
npx cap open ios

# 2. Run simulator (Xcode opens)
# 3. Choose device: iPhone 15 Pro (or similar)
# 4. Run app (Command + R)
# 5. Take screenshots:
#    - Cmd + S (saves to Desktop)
#    - Or Device → Screenshot
```

---

## 📐 Screenshot Editing & Optimization

### After Capturing:

#### 1. Crop to Proper Aspect Ratio
```bash
# Install ImageMagick (if not installed)
brew install imagemagick

# Resize to 1080x1920 (standard)
cd ~/Desktop
magick input.png -resize 1080x1920^ -gravity center -extent 1080x1920 output.png
```

#### 2. Or Use Preview (macOS):
1. Open screenshot in Preview
2. Tools → Adjust Size
3. Set Width: 1080 pixels
4. Maintain aspect ratio
5. Save

#### 3. Or Use Online Tool:
- Go to: https://www.iloveimg.com/resize-image
- Upload screenshot
- Set dimensions: 1080 x 1920 px
- Download

---

### Optional Enhancements:

#### Add Device Frame (More Professional):
1. Go to: https://mockuphone.com/
2. Select "Android" → Choose Pixel device
3. Upload your screenshot
4. Download with device frame
5. **Note:** This increases file size, only if under 8MB

#### Add Subtle Captions (Optional):
Use Canva or Figma to add text overlay:
- "輸入生辰八字" on BaZi input screen
- "查看詳細報告" on report screen
- Keep text minimal, don't cover UI

---

## 📋 Screenshot Checklist

### Before Capturing:

**App State:**
- [ ] Logged in (shows personalized content)
- [ ] Good internet connection (all images load)
- [ ] No error messages visible
- [ ] No personal real user data (use test data)
- [ ] All features loaded completely

**Device Setup:**
- [ ] Phone charged (no low battery indicator)
- [ ] Full signal bars (looks professional)
- [ ] Time showing (usually top-left)
- [ ] Clean notification bar (no notifications)
- [ ] Brightness at 100%

**Content:**
- [ ] Chinese language (zh-TW preferred)
- [ ] Sample data filled in forms
- [ ] Realistic examples (not "test test" or "asdf")

---

### After Capturing:

**Technical Quality:**
- [ ] Resolution: 1080x1920px minimum
- [ ] Clear, not blurry
- [ ] Good lighting/contrast
- [ ] No simulator borders (crop if needed)
- [ ] File size under 8MB each
- [ ] Format: PNG or JPG

**Content Quality:**
- [ ] No personal information visible
- [ ] No test/debug data showing
- [ ] UI elements clearly visible
- [ ] Text readable at small size
- [ ] Colors accurate

**Compliance:**
- [ ] Shows actual app (not mockup)
- [ ] No copyrighted images
- [ ] Represents current app version
- [ ] No misleading information

---

## 📂 File Naming Convention

Save screenshots with clear names:

```
1_home_screen.png
2_bazi_input.png
3_fortune_report.png
4_layout_design.png
5_chat_interface.png
6_pricing.png
7_forecast.png
8_couple_analysis.png
```

Create folder:
```bash
mkdir ~/Desktop/google_play_screenshots
cd ~/Desktop/google_play_screenshots
```

---

## 🎨 Screenshot Examples (What Good Looks Like)

### ✅ Good Screenshot:
- Clear UI with all elements visible
- Chinese text readable
- Shows app in action (form filled, content loaded)
- Professional appearance
- Focused on one feature per screen
- No distractions

### ❌ Bad Screenshot:
- Blank/empty screens
- Loading spinners visible
- Error messages showing
- Personal user data visible
- Blurry or pixelated
- Simulator debug info visible
- Wrong language (if app is Chinese, show Chinese)

---

## 🚀 Quick Start (30 Minutes)

### Fastest Method:

1. **Connect Android Phone:**
   ```bash
   # Build app
   npm run build:mobile
   npx cap sync android
   
   # Open in Android Studio
   npx cap open android
   ```

2. **Run on Device:**
   - Click Run (green play button)
   - Wait for app to load on phone

3. **Take 4 Essential Screenshots:**
   - Home screen (press Power + Volume Down)
   - BaZi input (fill form first, then screenshot)
   - Navigate to any report/result (screenshot)
   - Navigate to layout design (screenshot)

4. **Transfer to Computer:**
   ```bash
   # Via ADB
   adb pull /sdcard/Pictures/Screenshots/ ~/Desktop/google_play_screenshots/
   ```

5. **Done!** Use these 4 screenshots in:
   - Feature graphic (3 of them)
   - Google Play screenshots section (all 4)

---

## 🆘 Troubleshooting

### Issue: App crashes when taking screenshot
**Solution:** Take screenshot from outside simulator (Cmd+Shift+4 on Mac)

### Issue: Screenshots too large (over 8MB)
**Solution:** 
```bash
# Compress with ImageMagick
magick input.png -quality 85 output.png
```

### Issue: Can't run app on device
**Solution:** Check USB debugging enabled on Android phone (Settings → Developer Options)

### Issue: Simulator not available
**Solution:** Use physical device or ask teammate to take screenshots

---

## 📊 Priority Matrix

| Screenshot | Priority | Difficulty | Time | For Feature Graphic? |
|-----------|----------|-----------|------|---------------------|
| Home Screen | HIGH | Easy | 2 min | ✅ Yes (use in graphic) |
| BaZi Input | HIGH | Easy | 5 min | ✅ Yes (use in graphic) |
| Fortune Report | HIGH | Medium | 10 min | ✅ Yes (use in graphic) |
| Layout Design | HIGH | Medium | 10 min | Optional |
| Chat Interface | MEDIUM | Easy | 5 min | No |
| Pricing | MEDIUM | Easy | 2 min | No |
| Forecast | LOW | Easy | 5 min | No |
| Couple Analysis | LOW | Medium | 5 min | No |

**Recommendation:** Start with top 4 HIGH priority screenshots.

---

## 📱 Example Screenshot Sequence

### Step-by-Step Capture:

```bash
# 1. Open app
npx cap run android

# 2. Wait for app to load → HOME SCREEN
# Take screenshot 1: "1_home_screen.png"

# 3. Tap "命理測算" → Navigate to BaZi input
# Fill in sample data:
#    - Name: 王小明
#    - Gender: 男
#    - Date: 1990/5/15
#    - Time: 14:30
#    - Location: 台北
# Take screenshot 2: "2_bazi_input.png"

# 4. (If you have test account with report access)
# Submit form → View report
# Take screenshot 3: "3_fortune_report.png"

# 5. Back to home → Navigate to layout design
# Take screenshot 4: "4_layout_design.png"

# 6. Back to home → Navigate to chat
# Send sample question about feng shui
# Take screenshot 5: "5_chat.png"

# 7. Navigate to pricing/membership
# Take screenshot 6: "6_pricing.png"

# 8. Done! Transfer to computer
```

---

## ✅ Final Checklist Before Upload

### Review Each Screenshot:

- [ ] **Screenshot 1 (Home):** Shows main navigation clearly
- [ ] **Screenshot 2 (BaZi):** Form filled with sample data
- [ ] **Screenshot 3 (Report):** Shows valuable content/analysis
- [ ] **Screenshot 4 (Layout):** Demonstrates feng shui feature
- [ ] All screenshots: 1080x1920px or higher
- [ ] All screenshots: Under 8MB each
- [ ] All screenshots: PNG or JPG format
- [ ] Saved in organized folder
- [ ] Named clearly (numbered)
- [ ] No personal data visible
- [ ] App looks professional in all screens

---

## 🎯 Next Steps

After capturing screenshots:

1. ✅ Select best 3 screenshots for feature graphic
2. ✅ Upload all screenshots to Google Play Console
3. ✅ Use CANVA_FEATURE_GRAPHIC_GUIDE.md to create graphic
4. ✅ Submit updated app for review

**Estimated total time:** 30-60 minutes for all screenshots

---

**Document Created:** 2025-12-07  
**Status:** Ready to use  
**Tool required:** Android device or emulator  
**Next document:** CANVA_FEATURE_GRAPHIC_GUIDE.md
