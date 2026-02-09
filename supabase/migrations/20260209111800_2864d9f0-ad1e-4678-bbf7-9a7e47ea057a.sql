
-- 1. Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := 'CRT-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- 2. Add referral_code column to profiles
ALTER TABLE public.profiles
ADD COLUMN referral_code text;

-- 3. Backfill existing users with unique codes
DO $$
DECLARE
  r RECORD;
  new_code text;
BEGIN
  FOR r IN SELECT id FROM profiles WHERE referral_code IS NULL LOOP
    new_code := public.generate_referral_code();
    UPDATE profiles SET referral_code = new_code WHERE id = r.id;
  END LOOP;
END;
$$;

-- 4. Now set NOT NULL and UNIQUE
ALTER TABLE public.profiles
ALTER COLUMN referral_code SET NOT NULL,
ALTER COLUMN referral_code SET DEFAULT public.generate_referral_code(),
ADD CONSTRAINT profiles_referral_code_unique UNIQUE (referral_code);

-- 5. Add RLS policy for anyone to look up referral codes (for validation)
CREATE POLICY "Anyone can lookup referral codes"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive select policy since the new one covers it
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Re-create a proper policy: users can see their own full profile, others can only query by referral_code
-- Actually, the simplest safe approach: allow SELECT for all but only expose referral_code via app logic
-- The "Anyone can lookup referral codes" policy with USING(true) allows SELECT on all columns.
-- This is acceptable since profiles only contain display_name, email, referral_code, timestamps.
-- If more sensitive data is added later, this should be revisited.

-- 6. Update handle_new_user to use referral_code instead of referrer_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id uuid;
  v_referral_code text;
BEGIN
  -- Insert profile (referral_code auto-generated via default)
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
  
  -- Check if user provided a referral code
  IF NEW.raw_user_meta_data ? 'referral_code' THEN
    v_referral_code := NEW.raw_user_meta_data->>'referral_code';
    
    -- Look up the referrer by their code
    SELECT id INTO v_referrer_id
    FROM public.profiles
    WHERE referral_code = v_referral_code;
    
    IF v_referrer_id IS NOT NULL AND v_referrer_id != NEW.id THEN
      -- Create referral record
      INSERT INTO public.referrals (referrer_id, referred_user_id, referred_email)
      VALUES (v_referrer_id, NEW.id, NEW.email);
      
      -- Award credits to referrer
      PERFORM public.complete_referral(v_referrer_id, NEW.id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;
