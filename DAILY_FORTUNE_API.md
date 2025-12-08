# Daily Fortune API Documentation

## Overview
This API calculates daily fortune (運程) based on user's BaZi (八字) and the selected date.

## Endpoint
```
POST /api/daily-fortune
```

## Request Body
```json
{
  "birthday": "1990-01-15T00:00:00.000Z",  // User's birth date (ISO format)
  "selectedDate": "2025-12-05T00:00:00.000Z",  // Date to calculate fortune for
  "birthTime": "14:30"  // Optional: Birth time in HH:mm format (24-hour)
}
```

## Response
```json
{
  "success": true,
  "data": {
    "date": "2025-12-05",
    "fortune": "中吉",  // One of: 大凶, 中凶, 凶, 吉, 中吉, 大吉
    "score": 75,  // Fortune score 0-100
    "description": "今日運勢中上，適合處理重要事務...",
    "colors": {
      "background": "#B8D87A",
      "text": "#FFFFFF"
    },
    "recommendations": [
      "財運：適合投資理財",
      "感情：桃花運佳",
      "健康：注意休息"
    ]
  }
}
```

## Fortune Levels
| Level | Chinese | Score Range | Color |
|-------|---------|-------------|-------|
| 大吉 | Great Fortune | 90-100 | #6BA547 |
| 中吉 | Good Fortune | 75-89 | #B8D87A |
| 吉 | Fortune | 60-74 | #D4E79E |
| 凶 | Misfortune | 40-59 | #F5A623 |
| 中凶 | Bad Fortune | 20-39 | #E85D3A |
| 大凶 | Disaster | 0-19 | #C62828 |

## Calculation Method
The API uses authentic Chinese BaZi (八字) calculation:
1. **Heavenly Stems (天干)** and **Earthly Branches (地支)** from birthday
2. **Five Elements (五行)** interaction with selected date
3. **Yearly Pillar (年柱)**, **Monthly Pillar (月柱)**, **Daily Pillar (日柱)**
4. **Clashing (沖)**, **Combining (合)**, **Harming (害)** relationships
5. **Day Master (日主)** strength and balance

## Integration Steps

### 1. Backend (Production Server)
Create this file on your production server:
```
/api/daily-fortune.js  (or .ts if using TypeScript)
```

### 2. Frontend Integration
Already implemented in `fortune-calculate/page.tsx`:
```typescript
const response = await fetch(`${API_BASE}/api/daily-fortune`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    birthday: userBirthday.toISOString(),
    selectedDate: date.toISOString()
  })
});
```

### 3. Environment Variables
Set in production:
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.com
```

## Local Testing
For local development, the app falls back to client-side calculation if API fails.

## Migration Checklist
- [ ] Deploy API endpoint to production server
- [ ] Test API with sample requests
- [ ] Verify CORS settings allow mobile app domain
- [ ] Update API_BASE_URL in production environment
- [ ] Monitor API logs for errors
- [ ] Set up caching if needed (Redis recommended)

## Notes
- API responses are cached in localStorage for 24 hours
- Fallback to client-side calculation if API unavailable
- Consider rate limiting: 100 requests per user per day
