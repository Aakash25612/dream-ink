-- Create creations table to store generated images
CREATE TABLE public.creations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.creations ENABLE ROW LEVEL SECURITY;

-- Create policies for creations
-- Allow anyone to insert (will be restricted when auth is implemented)
CREATE POLICY "Anyone can insert creations" 
ON public.creations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to view their own creations (will use auth.uid() when auth is implemented)
CREATE POLICY "Users can view all creations" 
ON public.creations 
FOR SELECT 
USING (true);

-- Allow users to delete their own creations
CREATE POLICY "Users can delete their own creations" 
ON public.creations 
FOR DELETE 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_creations_user_id ON public.creations(user_id);
CREATE INDEX idx_creations_created_at ON public.creations(created_at DESC);