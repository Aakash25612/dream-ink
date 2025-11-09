import { useEffect, useState } from 'react';
import { BillingService, PlanType, PeriodType } from '@/services/billingService';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export const useBilling = () => {
  const [isNative, setIsNative] = useState(false);
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);

      if (native) {
        try {
          await BillingService.initialize();
          const availableProducts = await BillingService.getProducts();
          if (availableProducts) {
            setProducts(availableProducts);
          }
        } catch (error) {
          console.error('Billing initialization error:', error);
        }
      }
    };

    initialize();
  }, []);

  const purchaseSubscription = async (
    planType: PlanType,
    periodType: PeriodType,
    onSuccess: (purchaseToken: string) => void
  ) => {
    if (!isNative) {
      // Web flow - use existing logic
      return true;
    }

    setLoading(true);
    try {
      const result = await BillingService.purchaseSubscription(planType, periodType);

      if (result.success && result.purchaseToken) {
        toast({
          title: "Purchase Successful",
          description: "Your subscription has been activated!",
        });
        onSuccess(result.purchaseToken);
        return true;
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Unable to complete purchase",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Purchase Error",
        description: error.message || "An error occurred during purchase",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    if (!isNative) {
      return null;
    }

    setLoading(true);
    try {
      const result = await BillingService.restorePurchases();
      
      if (result.success) {
        toast({
          title: "Purchases Restored",
          description: "Your subscriptions have been restored!",
        });
        return result.purchases;
      } else {
        toast({
          title: "Restore Failed",
          description: result.error || "No purchases to restore",
          variant: "destructive",
        });
        return null;
      }
    } catch (error: any) {
      toast({
        title: "Restore Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    isNative,
    products,
    loading,
    purchaseSubscription,
    restorePurchases,
  };
};
