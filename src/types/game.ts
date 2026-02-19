
// VERGAMANO OS - Game Types V5.0 (REAL SCHEMA)

export type PilarType = 'architect' | 'spartan' | 'mercenary' | 'nomad' | 'ghost';
export type MissionStatus = 'pending' | 'active' | 'auditing' | 'completed' | 'failed';
export type ModuleType = 'arena' | 'map' | 'lsd' | 'market' | 'neural';
export type CityStatus = 'conquered' | 'current' | 'locked';
export type SenderType = 'rafael' | 'moltbot';

export interface Mission {
    id: string;
    user_id?: string;
    title: string;
    description?: string;
    why_matters?: string;
    // DB uses 'power' for the pillar
    power: PilarType;
    pilar?: PilarType; // alias
    xp_base: number;
    xp_bonus?: number;
    xp_reward?: number; // alias for xp_base
    status: MissionStatus;
    evidence_url?: string;
    steps?: string[];
    timer_minutes?: number;
    estimated_minutes?: number;
    retry_count?: number;
    generated_by?: string;
    started_at?: string;
    completed_at?: string;
    created_at?: string;
}

export interface Profile {
    id: string;
    hp: number;
    energy_level?: number;
    streak_days?: number;
    avatar_state?: string;
    // V5 XP columns (already in production DB)
    xp_architect: number;
    xp_spartan: number;
    xp_mercenary: number;
    xp_nomad: number;
    xp_ghost: number;
    // Derived
    credits?: number;
    level?: number;
    last_activity_date?: string;
}

export interface ChatMessage {
    id: string;
    user_id: string;
    content: string;
    sender: SenderType;
    created_at: string;
}

export interface City {
    name: string;
    xp_needed: number;
    status: CityStatus;
    flag?: string;
}

export interface FeedItem {
    id: string;
    title: string;
    url?: string;
    source?: string;
    category?: string;
    thumbnail_url?: string;
    how_to_apply?: string;
    created_at?: string;
}

export interface GameState {
    profile: Profile | null;
    missions: Mission[];
    cities: City[];
    chatMessages: ChatMessage[];
    feedItems: FeedItem[];
    activeModule: ModuleType;
    activePillar: string | null;
    isBunkerMode: boolean;
    isLoading: boolean;
}
