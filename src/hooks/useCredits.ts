import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserCredits {
  free_signup_credits: number;
  daily_free_credits: number;
  daily_free_credits_date: string | null;
  referral_credits: number;
  subscription_credits: number;
  subscription_type: string | null;
  subscription_end_date: string | null;
  daily_limit: number;
  subscription_period_type: string | null;
  total_subscription_credits: number;
  used_credits_today: number;
  last_usage_date: string | null;
}

interface CombinedUserData {
  credits: UserCredits | null;
  signupDate: string | null;
}

// Cache key for credits
const CREDITS_QUERY_KEY = ["user-credits"];

// Fetch credits with combined queries - reduces DB calls from 4+ to 1-2
const fetchCreditsData = async (): Promise<{ credits: UserCredits | null; totalCredits: number }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { credits: null, totalCredits: 0 };

  // Single combined query: fetch credits + profile in parallel
  const [creditsResult, profileResult] = await Promise.all([
    supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('signup_date')
      .eq('id', user.id)
      .maybeSingle()
  ]);

  if (creditsResult.error) throw creditsResult.error;
  
  let credits = creditsResult.data;
  if (!credits) return { credits: null, totalCredits: 0 };

  const today = new Date().toISOString().split('T')[0];
  const profile = profileResult.data;
  
  // Check subscription expiration - only call RPC if actually expired
  if (credits.subscription_end_date && new Date(credits.subscription_end_date) <= new Date() && credits.subscription_credits > 0) {
    await supabase.rpc('expire_subscription_credits');
    // Refetch just credits after expiration
    const { data: refreshedCredits } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (refreshedCredits) credits = refreshedCredits;
  }

  // Check if we need to refresh daily credits (within first 7 days)
  const lastCreditDate = credits.daily_free_credits_date;
  if (lastCreditDate !== today && profile?.signup_date) {
    const signupDate = new Date(profile.signup_date);
    const daysSinceSignup = Math.floor(
      (new Date().getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceSignup < 7) {
      await supabase
        .from('user_credits')
        .update({
          daily_free_credits: 1,
          daily_free_credits_date: today
        })
        .eq('user_id', user.id);
      
      // Update local state instead of refetching
      credits = {
        ...credits,
        daily_free_credits: 1,
        daily_free_credits_date: today
      };
    }
  }

  // Calculate total
  const total = 
    (credits.free_signup_credits || 0) + 
    (credits.daily_free_credits || 0) + 
    (credits.referral_credits || 0) + 
    (credits.subscription_end_date && new Date(credits.subscription_end_date) > new Date() 
      ? (credits.subscription_credits || 0) 
      : 0);

  return { credits, totalCredits: total };
};

export const useCredits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Use React Query with staleTime to prevent unnecessary refetches
  const { data, isLoading, refetch } = useQuery({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: fetchCreditsData,
    staleTime: 30000, // 30 seconds - data considered fresh
    gcTime: 300000, // 5 minutes - keep in cache
    refetchOnWindowFocus: false, // Prevent refetch on tab focus
    retry: 1,
  });

  const credits = data?.credits ?? null;
  const totalCredits = data?.totalCredits ?? 0;

  // Mutation for using credits - optimistic update
  const useCreditsMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !credits) throw new Error('No user or credits');

      // Check if subscription has expired
      if (credits.subscription_end_date && new Date(credits.subscription_end_date) <= new Date()) {
        await supabase.rpc('expire_subscription_credits');
        throw new Error('subscription_expired');
      }

      // Check if user has any credits
      if (totalCredits <= 0) {
        throw new Error('no_credits');
      }

      // Check daily limit for subscription users
      const today = new Date().toISOString().split('T')[0];
      if (credits.subscription_credits > 0 && 
          credits.subscription_end_date && 
          new Date(credits.subscription_end_date) > new Date()) {
        
        const lastUsage = credits.last_usage_date;
        let usedToday = credits.used_credits_today || 0;
        
        // Reset if new day
        if (lastUsage !== today) {
          usedToday = 0;
        }

        if (usedToday >= credits.daily_limit) {
          throw new Error('daily_limit');
        }
      }

      // Determine which credit type to deduct
      let updateData: Record<string, any> = {};

      if (credits.free_signup_credits > 0) {
        updateData.free_signup_credits = credits.free_signup_credits - 1;
      } else if (credits.daily_free_credits > 0) {
        updateData.daily_free_credits = credits.daily_free_credits - 1;
      } else if (credits.referral_credits > 0) {
        updateData.referral_credits = credits.referral_credits - 1;
      } else if (credits.subscription_credits > 0) {
        updateData.subscription_credits = credits.subscription_credits - 1;
        updateData.used_credits_today = (credits.used_credits_today || 0) + 1;
        updateData.last_usage_date = today;
      }

      const { error } = await supabase
        .from('user_credits')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;
      return updateData;
    },
    onSuccess: (updateData) => {
      // Optimistic update - update cache directly instead of refetching
      queryClient.setQueryData(CREDITS_QUERY_KEY, (old: any) => {
        if (!old?.credits) return old;
        const newCredits = { ...old.credits, ...updateData };
        const newTotal = 
          (newCredits.free_signup_credits || 0) + 
          (newCredits.daily_free_credits || 0) + 
          (newCredits.referral_credits || 0) + 
          (newCredits.subscription_end_date && new Date(newCredits.subscription_end_date) > new Date() 
            ? (newCredits.subscription_credits || 0) 
            : 0);
        return { credits: newCredits, totalCredits: newTotal };
      });
    },
    onError: (error: Error) => {
      if (error.message === 'subscription_expired') {
        queryClient.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
      }
    }
  });

  const useCredit = async (): Promise<boolean> => {
    try {
      await useCreditsMutation.mutateAsync();
      return true;
    } catch (error: any) {
      if (error.message === 'no_credits') {
        toast({
          title: "You've hit your creative limit.",
          description: "Upgrade to create without limits.",
          variant: "destructive"
        });
      } else if (error.message === 'daily_limit') {
        toast({
          title: "Daily limit reached.",
          description: "Your daily credits will refresh tomorrow.",
          variant: "destructive"
        });
      } else if (error.message === 'subscription_expired') {
        // Silently handle - will refetch
      } else {
        console.error('Error using credit:', error);
      }
      return false;
    }
  };

  const fetchCredits = () => {
    refetch();
  };

  return {
    credits,
    totalCredits,
    loading: isLoading,
    fetchCredits,
    useCredit
  };
};
