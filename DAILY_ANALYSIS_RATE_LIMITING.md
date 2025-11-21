# Daily Analysis Rate Limiting Implementation

## 📋 Overview

Implemented a comprehensive rate limiting system to limit users to **10 initial analyses per day** in the chatbox. This applies to all initial fortune analyses (individual and couple) that users receive after inputting their birthday.

## 🎯 What Gets Limited

The system limits the **initial analysis** generated in the chatbox when users:

- Submit birthday through modal form
- Input topic + birthday combination (e.g., "我想了解感情運勢，生日1990-5-15")
- Input birthday after selecting a topic
- Request couple analysis with both birthdays

## 🚫 Rate Limiting Details

- **Daily Limit**: 10 analyses per user
- **Tracking**: By userEmail (primary) or userId (fallback)
- **Reset Time**: Daily at 00:00 Hong Kong time (automatic)
- **Analysis Types**: Both individual and couple analyses count toward limit
- **Error Handling**: Fail-safe - allows analysis if database error occurs

## 🔧 Technical Implementation

### Files Created/Modified:

1. **`src/models/DailyAnalysisLimit.js`** - MongoDB model for tracking daily counts
2. **`src/lib/dailyAnalysisRateLimit.js`** - Utility class with rate limiting logic
3. **`src/app/api/smart-chat2/route.js`** - Integrated at 4 key analysis generation points

### Database Schema:

```javascript
{
  userEmail: String,
  userId: String,
  date: String, // YYYY-MM-DD format
  analysisCount: Number,
  analyses: [{
    sessionId: String,
    analysisType: "individual" | "couple",
    topic: String,
    timestamp: Date,
    originalMessage: String
  }]
}
```

### Integration Points:

1. **Birthday form submission** (line ~2720) - Modal form with birthday + gender
2. **Topic+Birthday detection** (line ~3180) - AI-detected topic + birthday combinations
3. **Birthday input processing** (line ~3540) - Separate birthday input after topic selection
4. **Couple analysis generation** (line ~3020) - Dual birthday input for couple analysis

## 💬 User Experience

### When Limit Not Reached:

- Normal analysis generation
- Warning message when ≤2 analyses remaining:
    > ⚠️ 提醒：您今天還剩 2 次免費分析機會。

### When Limit Exceeded:

```
🚫 今日分析次數已達上限

您今天已經使用了 10/10 次免費分析服務。

為了確保服務品質，我們設定每日分析上限為 10 次。

🕐 **明日重置時間：** 香港時間 00:00

💡 **建議：**
• 明天再來獲取更多免費分析
• 或考慮升級到付費版本以獲得無限制分析

感謝您的理解與支持！
```

## ⚙️ Configuration

### Environment Variable:

```env
# Optional: Override default limit of 10
DAILY_ANALYSIS_LIMIT=10
```

### Rate Limiting Methods:

```javascript
// Check if user can analyze
await DailyAnalysisRateLimit.checkUserLimit(userEmail, userId);

// Record a new analysis
await DailyAnalysisRateLimit.recordAnalysis(
	userEmail,
	userId,
	sessionId,
	analysisType,
	topic,
	originalMessage
);

// Get user's daily stats
await DailyAnalysisRateLimit.getUserStats(userEmail, userId);

// Generate limit exceeded message
DailyAnalysisRateLimit.generateLimitExceededMessage(currentCount, limit);

// Generate warning message
DailyAnalysisRateLimit.generateWarningMessage(remaining);
```

## 🔍 What's NOT Limited

- Follow-up questions or clarifications
- Report selection responses (選擇 1, 2, 3)
- General chat messages
- Paid report purchases (those have separate payment flows)

## 📊 Monitoring & Analytics

Each analysis record includes:

- User identification (email/userId)
- Session ID for tracking
- Analysis type (individual/couple)
- Topic (感情, 財運, 工作, etc.)
- Timestamp
- Original user message

## 🎉 Testing

The system is now active and will:

1. ✅ Track all initial analysis requests
2. ✅ Block users after 10 analyses per day
3. ✅ Show appropriate warning and limit messages
4. ✅ Reset automatically at midnight
5. ✅ Handle errors gracefully (fail-safe)

## 🛠️ Admin Utilities

- `rate-limit-summary.js` - Implementation overview
- `admin-rate-limit.js` - Admin utility examples
- `test-rate-limit.js` - Test script (requires proper environment setup)

---

## 🔒 Privacy & Debug Protection

### Debug Information Filtering

- Rate limit details are hidden from frontend debug logs
- User counts and limits not exposed in console output
- Clean API responses without sensitive data
- Internal tracking remains fully functional

### Frontend Log Filtering

```javascript
// Rate limit info automatically hidden in debug logs
console.log("🔍 API 回應 (Rate Limit Info Hidden):", cleanedDataForLogging);
// Output: { rateLimited: "[HIDDEN]", currentCount: "[HIDDEN]", limit: "[HIDDEN]" }
```

---

**Status**: ✅ **Implementation Complete & Active**

The daily analysis rate limiting is now fully implemented and integrated into the chatbox. Users will be limited to 10 free initial analyses per day, with friendly messages guiding them when limits are approached or exceeded. **Rate limit information is properly hidden from debug displays while maintaining full system functionality.**
