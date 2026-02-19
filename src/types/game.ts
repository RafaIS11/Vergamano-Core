
// VERGAMANO OS - Game Types V5.0
// 5 Pillars: architect, spartan, mercenary, nomad, ghost

export type PilarType = 'architect' | 'spartan' | 'mercenary' | 'nomad' | 'ghost' | 'work' | 'body';
export type MissionStatus = 'pending' | 'active' | 'auditing' | 'completed';
export type ModuleType = 'arena' | 'map' | 'lsd' | 'market' | 'neural';
export type CityStatus = 'conquered' | 'current' | 'locked';
export type SenderType = 'rafael' | 'moltbot';

export interface Subtask {
    label: string;
    completed: boolean;
}

export interface Resource {
    label: string;
    url: string;
}

export interface Mission {
    id: string;
    user_id?: string;
    title: string;
    description?: string;
    pilar: PilarType;
    xp_reward: number;
    status: MissionStatus;
    evidence_url?: string;
    steps?: string[];
    subtasks?: Subtask[];
    resources?: Resource[];
    timer_minutes?: number;
    started_at?: string;
    created_at?: string;
}

export interface Profile {
    id: string;
    hp: number;
    credits: number;
    // Legacy XP columns (still in DB)
    xp_work: number;
    xp_nomad: number;
    xp_body: number;
    // V5 XP columns (5 pillars)
    xp_architect: number;
    xp_spartan: number;
    xp_mercenary: number;
    xp_ghost: number;
    level: number;
    status?: string;
    avatar_url?: string;
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
