# 🔬 Google Analytics Testing Guide

## 📋 Quick Test Instructions

### Method 1: Test Page (Recommended)

1. **Open the test page**: http://localhost:3001/zh-TW/ga-test
2. **Click "Run All Tests"** to execute comprehensive testing
3. **Check Google Analytics**: Go to analytics.google.com → Real-time → Overview
4. **Monitor events**: You should see test events appearing in real-time

### Method 2: Console Testing

1. **Open browser console** (F12 → Console tab)
2. **Run test script**:
    ```javascript
    // Copy and paste this in console:
    fetch("/ga-test-console.js")
    	.then((r) => r.text())
    	.then(eval);
    ```
3. **Check results**: Look for test output in console and GA real-time reports

## 🎯 What Should You See in Google Analytics?

### Real-time Reports (Within 1-2 minutes)

```
📊 Events appearing:
- page_view (enhanced with custom data)
- button_click (from test buttons)
- feng_shui_analysis_test
- couple_analysis_test
- purchase (ecommerce test)
- user_engagement_test
- language_switch_test
- custom_test (with dimensions)
```

### Event Reports (Within 24 hours)

```
📈 In Reports → Engagement → Events:
- All test events with detailed parameters
- Custom dimensions (user_type, device_type, etc.)
- Ecommerce data (transaction_id, revenue, items)
- User behavior metrics (scroll_depth, time_on_page)
```

## 🔍 Troubleshooting

### ❌ No Events Appearing?

1. **Check GA Loading**:

    - Open browser console
    - Look for "✅ Google Analytics loaded successfully" message
    - Verify tracking ID shows: G-FSF2H5X9S4

2. **Verify Environment Variable**:

    - Check `.env` file has: `NEXT_PUBLIC_GA_ID=G-FSF2H5X9S4`
    - Restart development server: `npm run dev`

3. **Browser Issues**:
    - Disable ad blockers
    - Try incognito/private mode
    - Clear browser cache

### ⚠️ Events Delayed?

- **Real-time events**: 1-2 minutes delay is normal
- **Standard reports**: Up to 24 hours for full data
- **Custom events**: May take 24-48 hours to appear in all reports

## 📊 Complete Tracking Verification Checklist

### ✅ Basic Tracking

- [ ] Page views tracked with correct page names
- [ ] Button clicks captured automatically
- [ ] Form interactions monitored
- [ ] Language switching detected
- [ ] Geographic data collected

### ✅ Feng Shui Specific

- [ ] Birthday modal interactions
- [ ] Analysis requests (individual/couple)
- [ ] Chat message events
- [ ] Daily limit tracking
- [ ] Report generation events

### ✅ E-commerce Tracking

- [ ] Purchase events with revenue
- [ ] Product performance data
- [ ] Payment flow interactions
- [ ] Conversion funnel tracking

### ✅ User Behavior

- [ ] Scroll depth milestones (25%, 50%, 75%, 90%)
- [ ] Time on page tracking (30s, 60s, 120s, 300s)
- [ ] Mouse/keyboard activity
- [ ] Error tracking and monitoring

### ✅ Acquisition Data

- [ ] Traffic sources (direct, referral, search)
- [ ] UTM campaign parameters
- [ ] Device categories (mobile/desktop/tablet)
- [ ] Browser and OS information
- [ ] Geographic distribution

## 📈 Key Reports to Monitor

### 1. **Real-time Overview**

```
Path: Reports → Real-time → Overview
What to check:
- Active users right now
- Page views happening live
- Events firing in real-time
- Geographic distribution
```

### 2. **Engagement Events**

```
Path: Reports → Engagement → Events
What to check:
- Custom event names and counts
- Event parameters and values
- User engagement metrics
- Conversion tracking
```

### 3. **Audience Demographics**

```
Path: Reports → Demographics → Overview
What to check:
- User locations (countries/cities)
- Language preferences
- Device categories
- Age and gender (if available)
```

### 4. **Acquisition Reports**

```
Path: Reports → Acquisition → User acquisition
What to check:
- Traffic source performance
- Campaign effectiveness
- Channel attribution
- First-time vs returning users
```

### 5. **Ecommerce Overview**

```
Path: Reports → Monetization → Ecommerce purchases
What to check:
- Revenue tracking
- Product performance
- Purchase behavior
- Transaction details
```

## 🎯 Test Scenarios

### Scenario 1: New User Journey

1. Visit homepage → Should track page_view
2. Start chat → Should track chat_message_added
3. Open birthday modal → Should track birthday_modal_opened
4. Submit form → Should track birthday_form_submitted
5. Generate analysis → Should track analysis_result_displayed
6. Make purchase → Should track purchase event

### Scenario 2: Language Preference

1. Start on zh-TW version
2. Switch to zh-CN → Should track language_switched
3. Navigate pages → Should track both language versions
4. Complete analysis → Should attribute to correct language

### Scenario 3: Mobile vs Desktop

1. Test on mobile device → Should detect mobile user agent
2. Test on desktop → Should detect desktop resolution
3. Compare behavior → Should show device-specific patterns

## 🚨 Common Issues & Solutions

### Issue: "GA not loaded" error

**Solution**:

- Restart dev server after adding environment variable
- Check `.env` file is in root directory
- Verify `NEXT_PUBLIC_GA_ID` (not `GA_ID`)

### Issue: Events not appearing in real-time

**Solution**:

- Wait 1-2 minutes for processing
- Check if ad blocker is enabled
- Verify correct GA property selected

### Issue: Custom events missing parameters

**Solution**:

- Check event object structure in console
- Verify parameter names don't exceed GA limits
- Ensure parameters have valid values

## 💡 Pro Tips

1. **Use Real-time Debug View**: Enable in GA for detailed event inspection
2. **Set up Custom Dashboards**: Create feng shui specific reports
3. **Configure Conversion Goals**: Track business-critical events
4. **Monitor Performance**: Track page load times and user experience
5. **Regular Testing**: Run tests after any major code changes

## 📞 Support

If tracking isn't working:

1. Check browser console for errors
2. Verify all test checklist items above
3. Compare with working examples in test page
4. Test in different browsers and devices

---

**Last Updated**: December 2024
**GA Version**: Google Analytics 4 (GA4)
**Test Coverage**: ✅ Complete
