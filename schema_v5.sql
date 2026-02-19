-- VERGAMANO OS v5.0 - MIGRATION: Add 5-pillar XP columns
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/[your-project]/sql/new

-- 1. Add individual XP columns per pillar to profile table
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_architect INTEGER DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_spartan INTEGER DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_mercenary INTEGER DEFAULT 0;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS xp_ghost INTEGER DEFAULT 0;
-- xp_nomad already exists

-- 2. Migrate existing xp_work -> xp_architect and xp_body -> xp_spartan
UPDATE public.profile SET xp_architect = xp_work WHERE xp_architect = 0 AND xp_work > 0;
UPDATE public.profile SET xp_spartan = xp_body WHERE xp_spartan = 0 AND xp_body > 0;

-- 3. Update tasks pilar CHECK constraint to match 5 pillars
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_pilar_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_pilar_check
    CHECK (pilar IN ('architect', 'spartan', 'mercenary', 'nomad', 'ghost', 'work', 'body'));

-- 4. Add missing columns to tasks table if not present
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS steps TEXT[] DEFAULT '{}';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS timer_minutes INTEGER DEFAULT 25;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS description TEXT;

-- 5. Ensure content_feed table exists and has realtime
CREATE TABLE IF NOT EXISTS public.content_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT,
    url TEXT,
    source TEXT,
    category TEXT,
    thumbnail_url TEXT,
    how_to_apply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE content_feed;

-- 7. Ensure profile exists for the user (insert if missing)
-- NOTE: Replace the UUID with your actual user ID from Supabase Auth
-- INSERT INTO public.profile (id, hp, credits, xp_work, xp_nomad, xp_body, level, status)
-- VALUES ('3a95d701-18d8-4104-aea2-f9a068c7f413', 100, 0, 0, 0, 0, 1, 'OPERATOR')
-- ON CONFLICT (id) DO NOTHING;
