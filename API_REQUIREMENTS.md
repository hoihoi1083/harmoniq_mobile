# Mobile App API Requirements Check

## Critical APIs the Mobile App NEEDS:

### ✅ Authentication (Mobile-specific)
- [CHECK] `/api/auth/google/mobile` - Used in login page
- [CHECK] `/api/auth/apple/ios` - Used in login page  
- [CHECK] `/api/auth/session` - Session check
- [MISSING] `/api/auth/signout` - Logout

### ✅ Chatbot
- [CHECK] `/api/smart-chat2` - Main chatbot endpoint
- [CHECK] `/api/transfer-conversations` - Transfer chats

### ✅ Payment
- [CHECK] `/api/payment-couple` - Couple analysis payment
- [CHECK] `/api/checkoutSessions/payment3` - Checkout
- [CHECK] `/api/checkoutSessions/payment4` - Checkout
- [CHECK] `/api/verify-payment` - Payment verification

### ⚠️ Analysis APIs (Used in Reports)
- [?] `/api/ai-analysis`
- [?] `/api/wuxing-analysis`
- [?] `/api/element-flow-analysis`
- [?] `/api/life-stage-analysis`
- [?] `/api/interpersonal-advice`
- [?] `/api/comprehensive-advice`
- [?] `/api/bazhai-analysis`
- [?] `/api/couple-season-analysis`
- [?] `/api/couple-annual-analysis`
- [?] `/api/health-fortune-analysis`
- [?] `/api/career-fortune-analysis`
- [?] `/api/wealth-fortune-analysis`
- [?] `/api/relationship-fortune-analysis`

### ⚠️ Misc
- [?] `/api/send-promo` - Promo code
- [?] `/api/countdown-end` - Countdown timer
- [?] `/api/couple-analysis-reports` - Couple reports
- [?] `/api/couple-content` - Couple content

---

## NEXT STEP: Verify FengShuiLayout Has These

I need to check the FengShuiLayout backend to confirm:
1. Which of these APIs are already migrated
2. Which ones are missing
3. If missing, copy them from FengShuiLayout-mobileapp

**Do you want me to:**
1. Check FengShuiLayout backend for these APIs?
2. List what's missing?
3. Create migration plan?
