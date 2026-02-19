
export type ModuleType = 'arena' | 'map' | 'neural' | 'lsd' | 'market';

export interface Mission {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    pilar: 'work' | 'nomad' | 'body' | 'architect' | 'spartan' | 'mercenary' | 'ghost';
    xp_reward: number;
    status: 'pending' | 'active' | 'auditing' | 'completed';
    evidence_url?: string;
    started_at?: string;
    created_at: string;
    subtasks?: { label: string; completed: boolean }[];
    steps?: string[];
    resources?: { label: string; url: string }[];
    timer_minutes?: number;
    icon?: string;
}

export interface City {
    name: string;
    xp_needed: number;
    status: 'locked' | 'unlocked' | 'current';
    flag?: string;
    coordinates?: { x: number; y: number };
}

export interface ChatMessage {
    id: string;
    user_id: string;
    content: string;
    sender: 'rafael' | 'moltbot';
    created_at: string;
}

export interface Profile {
    id: string;
    username?: string;
    hp: number;
    credits: number;
    xp_work: number;
    xp_nomad: number;
    xp_body: number;
    xp_architect?: number;
    xp_spartan?: number;
    xp_mercenary?: number;
    xp_ghost?: number;
    level: number;
    status: string;
    streak_days?: number;
}

export interface FeedItem {
    id: string;
    title: string;
    category?: string;
    url?: string;
    thumbnail_url?: string;
    how_to_apply?: string;
    source?: string;
    created_at: string;
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
