# Report.jsx Performance Optimization Plan

## Current Performance Issues

### 1. AI Generation Bottlenecks

- **2-second initial delay** before any AI generation starts
- **Sequential API calls** creating waterfall loading pattern
- **No client-side caching** for AI-generated content
- **Fresh generation** on every page refresh for certain sections

### 2. Sections Always Regenerating

- 綜合調理与人生建議 (Comprehensive Life Advice)
- 五行流通阻礙點 (Element Flow Analysis)

## Optimization Solutions

### Option 1: Add Client-Side Caching

```javascript
// Add to Report.jsx state
const [cachedAnalyses, setCachedAnalyses] = useState({});

// Cache key based on user data
const getCacheKey = (userInfo) => {
  return `${userInfo.birthDateTime}_${userInfo.gender}_${userInfo.sessionId}`;
};

// Check cache before API call
const generateComprehensiveLifeAdvice = async (userInfo, wuxingData) => {
  const cacheKey = getCacheKey(userInfo);
  const cached = localStorage.getItem(`lifeAdvice_${cacheKey}`);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Cache for 1 hour
    if (Date.now() - timestamp < 3600000) {
      return data;
    }
  }

  // Generate new if not cached
  const advice = await fetch("/api/comprehensive-life-advice", {...});

  // Cache the result
  localStorage.setItem(`lifeAdvice_${cacheKey}`, JSON.stringify({
    data: advice,
    timestamp: Date.now()
  }));

  return advice;
};
```

### Option 2: Parallel API Calls

```javascript
// Instead of sequential generation, run in parallel
const generateAllAnalyses = async () => {
	const promises = [
		generateComprehensiveLifeAdvice(userInfo, wuxingData),
		analyzeElementFlow(userInfo),
		// Other API calls...
	];

	const results = await Promise.allSettled(promises);
	// Handle results and set states
};
```

### Option 3: Reduce Initial Delay

```javascript
// Reduce from 2000ms to 500ms or remove entirely
setTimeout(() => {
	generateAllAnalyses();
}, 500); // Much faster initial load
```

### Option 4: Progressive Loading

```javascript
// Load critical content first, then enhance with AI
useEffect(() => {
	// Load essential data immediately
	loadBasicContent();

	// Then load AI enhancements
	setTimeout(() => {
		loadAIEnhancements();
	}, 100);
}, []);
```

## Database Optimization

### Store AI Results in Database

Instead of regenerating every time, save AI analyses:

```javascript
// After successful AI generation
await saveToDatabase({
	sessionId,
	userInfo,
	aiAnalyses: {
		comprehensiveLifeAdvice,
		elementFlowAnalysis,
		// other analyses...
	},
	generatedAt: new Date(),
});
```

## Immediate Quick Fixes

1. **Reduce setTimeout delay**: 2000ms → 500ms
2. **Add loading indicators**: Show what's being generated
3. **Implement client caching**: localStorage for 1-hour cache
4. **Parallel API calls**: Don't wait for sequential completion

## Expected Performance Improvements

- **Initial load**: 2+ seconds faster
- **Refresh behavior**: Consistent caching across all sections
- **User experience**: Progressive content loading instead of all-or-nothing
- **Server load**: Reduced redundant API calls
