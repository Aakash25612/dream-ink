-- Update the handle_new_user function to track referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_referrer_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Insert initial credits (5 free signup credits)
  INSERT INTO public.user_credits (
    user_id,
    free_signup_credits,
    daily_free_credits,
    daily_free_credits_date
  )
  VALUES (
    NEW.id,
    5,
    1,
    CURRENT_DATE
  );
  
  -- Check if user was referred (from app metadata)
  IF NEW.raw_app_meta_data ? 'referrer_id' THEN
    v_referrer_id := (NEW.raw_app_meta_data->>'referrer_id')::uuid;
    
    -- Create referral record
    INSERT INTO public.referrals (referrer_id, referred_user_id, referred_email)
    VALUES (v_referrer_id, NEW.id, NEW.email);
    
    -- Award credits to referrer
    PERFORM public.complete_referral(v_referrer_id, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;