# Google Play Billing Integration - Setup Guide

## Overview
Cretera now integrates with Google Play Billing Library for in-app subscriptions on Android.

## Product IDs Configured

### Weekly Plans
- **Plus**: `weekly_plus_99` - ₹99/week
- **Pro**: `weekly_pro_199` - ₹199/week  
- **Premium**: `weekly_premium_399` - ₹399/week

### Monthly Plans
- **Plus**: `monthly_plus_299` - ₹299/month
- **Pro**: `monthly_pro_499` - ₹499/month
- **Premium**: `monthly_premium_999` - ₹999/month

## Implementation Details

### Files Added/Modified:
1. **`src/services/billingService.ts`** - Core billing logic using Capacitor Purchases plugin
2. **`src/hooks/useBilling.ts`** - React hook for billing functionality
3. **`src/pages/Pricing.tsx`** - Updated to use native billing on Android

### How It Works:
- On **Web**: Uses existing Supabase credit allocation
- On **Android**: Uses Google Play Billing, then allocates credits after successful purchase
- All subscriptions auto-renew by default

## Next Steps in Google Play Console

1. **Upload your AAB** to Play Console (Internal Testing or Closed Testing track)

2. **Create In-App Products** in Play Console → Monetize → Products:
   - For each product ID listed above, create a subscription product
   - Set pricing as specified
   - Set billing period (weekly or monthly)
   - Enable auto-renewal

3. **Configure Capacitor Purchases** (if using RevenueCat):
   - Add your RevenueCat API key in `billingService.ts` line 21
   - Or configure directly with Google Play Billing

4. **Build Android App**:
   ```bash
   # After exporting to GitHub and pulling locally:
   npm install
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```

5. **Test Purchases**:
   - Add test accounts in Play Console
   - Use test cards for purchases
   - Verify credit allocation in Supabase

## Dependencies Added:
- `@capgo/capacitor-purchases` - Handles Google Play Billing
- `@capacitor/core` - Capacitor platform detection

## Credit Allocation Flow:
1. User selects plan on Pricing page
2. If on Android: Google Play purchase dialog opens
3. On successful purchase: Credits allocated via `allocate_subscription_credits` RPC
4. User sees confirmation and is redirected to home

## Testing:
- Web purchases work without Google Play Billing
- Android purchases require Google Play Console setup
- Use sandbox/test accounts for testing before production release
