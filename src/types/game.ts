
export type ModuleType = 'arena' | 'map' | 'neural' | 'lsd' | 'market';

export interface Mission {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    pilar: 'work' | 'nomad' | 'body';
    xp_reward: number;
    status: 'pending' | 'active' | 'auditing' | 'completed';
    evidence_url?: string;
    started_at?: string;
    created_at: string;
}

export interface City {
    name: string;
    xp_needed: number;
    status: string;
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
    hp: number;
    credits: number;
    xp_work: number;
    xp_nomad: number;
    xp_body: number;
    level: number;
    status: string;
}

export interface GameState {
    profile: Profile | null;
    missions: Mission[];
    cities: City[];
    chatMessages: ChatMessage[];
    feedItems: any[];
    activeModule: ModuleType;
    isBunkerMode: boolean;
    isLoading: boolean;
}
