-- Update allocate_subscription_credits function with new limits
CREATE OR REPLACE FUNCTION public.allocate_subscription_credits(p_user_id uuid, p_plan_type text, p_period_type text, p_end_date timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_total_credits integer;
  v_daily_limit integer;
BEGIN
  -- Determine credits and daily limit based on plan and period
  IF p_period_type = 'monthly' THEN
    CASE p_plan_type
      WHEN 'plus' THEN
        v_total_credits := 60;
        v_daily_limit := 2;
      WHEN 'pro' THEN
        v_total_credits := 120;
        v_daily_limit := 4;
      WHEN 'premium' THEN
        v_total_credits := 300;
        v_daily_limit := 10;
    END CASE;
  ELSIF p_period_type = 'weekly' THEN
    CASE p_plan_type
      WHEN 'plus' THEN
        v_total_credits := 21;
        v_daily_limit := 3;
      WHEN 'pro' THEN
        v_total_credits := 49;
        v_daily_limit := 7;
      WHEN 'premium' THEN
        v_total_credits := 119;
        v_daily_limit := 17;
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
$function$;