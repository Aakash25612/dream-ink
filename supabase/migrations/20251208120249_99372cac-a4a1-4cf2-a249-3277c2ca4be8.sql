-- Add indexes to optimize common queries

-- Index for user_credits lookups by user_id (most common query)
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- Index for profiles by user id
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Index for creations by user_id (for My Creations page)
CREATE INDEX IF NOT EXISTS idx_creations_user_id ON public.creations(user_id);

-- Index for referrals queries
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_completed_at ON public.referrals(completed_at) WHERE credits_awarded = true;

-- Index for subscription expiration checks
CREATE INDEX IF NOT EXISTS idx_user_credits_subscription_end ON public.user_credits(subscription_end_date) WHERE subscription_credits > 0;