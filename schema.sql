
-- VERGAMANO OS v3.5 - DATABASE SCHEMA

-- 1. Perfil del Jugador
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    hp INTEGER DEFAULT 100,
    credits INTEGER DEFAULT 0,
    xp_work INTEGER DEFAULT 0,
    xp_nomad INTEGER DEFAULT 0,
    xp_body INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    status TEXT DEFAULT 'OPERATOR',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Sistema de Misiones (Tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    pilar TEXT CHECK (pilar IN ('work', 'nomad', 'body')),
    xp_reward INTEGER DEFAULT 10,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'auditing', 'completed')),
    evidence_url TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Enlace Neural (Chat)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('rafael', 'moltbot')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. LSD Feed (Content)
CREATE TABLE IF NOT EXISTS public.content_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    url TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Realtime para todo
ALTER PUBLICATION supabase_realtime ADD TABLE profile;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
