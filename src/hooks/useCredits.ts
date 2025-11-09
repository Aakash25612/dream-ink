import { useState, useEffect } from "react";
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
}

export const useCredits = () => {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const { toast } = useToast();

  const fetchCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setCredits(data);
        
        // Check if we need to refresh daily credits
        const today = new Date().toISOString().split('T')[0];
        const lastCreditDate = data.daily_free_credits_date;
        
        if (lastCreditDate !== today) {
          // Check if user is within first 7 days
          const { data: profile } = await supabase
            .from('profiles')
            .select('signup_date')
            .eq('id', user.id)
            .single();

          if (profile) {
            const signupDate = new Date(profile.signup_date);
            const daysSinceSignup = Math.floor(
              (new Date().getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceSignup < 7) {
              // Add 1 daily credit
              const { error: updateError } = await supabase
                .from('user_credits')
                .update({
                  daily_free_credits: 1,
                  daily_free_credits_date: today
                })
                .eq('user_id', user.id);

              if (!updateError) {
                // Refresh credits
                await fetchCredits();
              }
            }
          }
        }

        // Calculate total available credits
        const total = 
          data.free_signup_credits + 
          data.daily_free_credits + 
          data.referral_credits + 
          data.subscription_credits;
        
        setTotalCredits(total);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      if (!credits) return false;

      // Check if user has any credits
      if (totalCredits <= 0) {
        toast({
          title: "You've hit your creative limit.",
          description: "Upgrade to create without limits.",
          variant: "destructive"
        });
        return false;
      }

      // Deduct credits in priority order: signup -> daily -> referral -> subscription
      let updateData: Partial<UserCredits> = {};

      if (credits.free_signup_credits > 0) {
        updateData.free_signup_credits = credits.free_signup_credits - 1;
      } else if (credits.daily_free_credits > 0) {
        updateData.daily_free_credits = credits.daily_free_credits - 1;
      } else if (credits.referral_credits > 0) {
        updateData.referral_credits = credits.referral_credits - 1;
      } else if (credits.subscription_credits > 0) {
        updateData.subscription_credits = credits.subscription_credits - 1;
      }

      const { error } = await supabase
        .from('user_credits')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh credits
      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    credits,
    totalCredits,
    loading,
    fetchCredits,
    useCredit
  };
};
