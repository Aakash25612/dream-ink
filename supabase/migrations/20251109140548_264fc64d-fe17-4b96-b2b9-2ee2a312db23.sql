-- Add new columns to user_credits table for subscription credit system
ALTER TABLE public.user_credits
ADD COLUMN IF NOT EXISTS subscription_period_type text CHECK (subscription_period_type IN ('weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS total_subscription_credits integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS used_credits_today integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_usage_date date;

-- Function to allocate subscription credits based on plan
CREATE OR REPLACE FUNCTION public.allocate_subscription_credits(
  p_user_id uuid,
  p_plan_type text,
  p_period_type text,
  p_end_date timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_credits integer;
  v_daily_limit integer;
BEGIN
  -- Determine credits and daily limit based on plan and period
  IF p_period_type = 'monthly' THEN
    CASE p_plan_type
      WHEN 'plus' THEN
        v_total_credits := 210;
        v_daily_limit := 7;
      WHEN 'pro' THEN
        v_total_credits := 420;
        v_daily_limit := 14;
      WHEN 'premium' THEN
        v_total_credits := 1020;
        v_daily_limit := 34;
    END CASE;
  ELSIF p_period_type = 'weekly' THEN
    CASE p_plan_type
      WHEN 'plus' THEN
        v_total_credits := 63;
        v_daily_limit := 9;
      WHEN 'pro' THEN
        v_total_credits := 133;
        v_daily_limit := 19;
      WHEN 'premium' THEN
        v_total_credits := 329;
        v_daily_limit := 47;
    END CASE;
  END IF;

  -- Update user credits
  UPDATE public.user_credits
  SET 
    subscription_type = p_plan_type,
    subscription_period_type = p_period_type,
    subscription_credits = v_total_credits,
    total_subscription_credits = v_total_credits,
    subscription_start_date = now(),
    subscription_end_date = p_end_date,
    daily_limit = v_daily_limit,
    used_credits_today = 0,
    last_usage_date = CURRENT_DATE
  WHERE user_id = p_user_id;
END;
$$;

-- Function to reset daily usage counter
CREATE OR REPLACE FUNCTION public.reset_daily_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_credits
  SET used_credits_today = 0
  WHERE last_usage_date < CURRENT_DATE
    AND subscription_end_date > now();
END;
$$;

-- Function to expire subscription credits
CREATE OR REPLACE FUNCTION public.expire_subscription_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_credits
  SET 
    subscription_credits = 0,
    total_subscription_credits = 0,
    subscription_type = NULL,
    subscription_period_type = NULL,
    subscription_start_date = NULL,
    subscription_end_date = NULL,
    daily_limit = 0,
    used_credits_today = 0
  WHERE subscription_end_date <= now()
    AND subscription_credits > 0;
END;
$$;

-- Function to award referral credits (2 per referral)
CREATE OR REPLACE FUNCTION public.complete_referral(
  p_referrer_id uuid,
  p_referred_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Award 2 credits to referrer
  UPDATE public.user_credits
  SET referral_credits = referral_credits + 2
  WHERE user_id = p_referrer_id;

  -- Mark referral as completed
  UPDATE public.referrals
  SET 
    status = 'completed',
    referred_user_id = p_referred_user_id,
    completed_at = now(),
    credits_awarded = true
  WHERE referrer_id = p_referrer_id
    AND referred_user_id = p_referred_user_id
    AND status = 'pending';
END;
$$;