import { NativePurchases } from '@capgo/native-purchases';
import { Capacitor } from '@capacitor/core';

export const PRODUCT_IDS = {
  weekly: {
    plus: 'weekly_plus_99',
    pro: 'weekly_pro_199',
    premium: 'weekly_premium_399',
  },
  monthly: {
    plus: 'monthly_plus_299',
    pro: 'monthly_pro_499',
    premium: 'monthly_premium_999',
  },
} as const;

export type PlanType = 'plus' | 'pro' | 'premium';
export type PeriodType = 'weekly' | 'monthly';

export class BillingService {
  private static initialized = false;

  static async initialize() {
    if (!Capacitor.isNativePlatform() || this.initialized) {
      return;
    }

    try {
      // @ts-ignore - Using native-purchases API
      await (NativePurchases as any).configure({
        apiKey: '', // Will be set from Play Console / RevenueCat
        appUserID: undefined, // Will use anonymous ID
        observerMode: false,
      });
      this.initialized = true;
      console.log('Billing initialized successfully');
    } catch (error) {
      console.error('Failed to initialize billing:', error);
      throw error;
    }
  }

  static async getProducts() {
    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    try {
      const productIds = [
        ...Object.values(PRODUCT_IDS.weekly),
        ...Object.values(PRODUCT_IDS.monthly),
      ];

      // @ts-ignore - Using native-purchases API
      const { products } = await (NativePurchases as any).getProducts({
        productIdentifiers: productIds,
      });
      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return null;
    }
  }

  static async purchaseSubscription(
    planType: PlanType,
    periodType: PeriodType
  ): Promise<{ success: boolean; purchaseToken?: string; error?: string }> {
    if (!Capacitor.isNativePlatform()) {
      return { success: false, error: 'Not on native platform' };
    }

    try {
      const productId = PRODUCT_IDS[periodType][planType];
      
      // @ts-ignore - Using native-purchases API
      const { customerInfo } = await (NativePurchases as any).purchaseProduct({
        productIdentifier: productId,
      });

      if (customerInfo) {
        return {
          success: true,
          purchaseToken: productId,
        };
      }

      return { success: false, error: 'Purchase failed' };
    } catch (error: any) {
      console.error('Purchase error:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  static async restorePurchases() {
    if (!Capacitor.isNativePlatform()) {
      return { success: false, error: 'Not on native platform' };
    }

    try {
      // @ts-ignore - Using native-purchases API
      const { customerInfo } = await (NativePurchases as any).restorePurchases();
      return {
        success: true,
        purchases: customerInfo,
      };
    } catch (error: any) {
      console.error('Restore purchases error:', error);
      return {
        success: false,
        error: error.message || 'Restore failed',
      };
    }
  }

  static getProductId(planType: PlanType, periodType: PeriodType): string {
    return PRODUCT_IDS[periodType][planType];
  }
}
