-- Drop the incorrect RLS policy that allows viewing all creations
DROP POLICY IF EXISTS "Users can view all creations" ON creations;

-- Create a proper RLS policy to only show user's own creations
CREATE POLICY "Users can view own creations"
ON creations
FOR SELECT
USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_creations_created_at ON creations(created_at DESC);