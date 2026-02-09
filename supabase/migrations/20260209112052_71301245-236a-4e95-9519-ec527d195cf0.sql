DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.profiles;

CREATE POLICY "Anyone can lookup referral codes"
  ON public.profiles
  FOR SELECT
  USING (true);