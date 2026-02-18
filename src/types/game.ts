
export type ModuleType = 'arena' | 'map' | 'neural' | 'lsd' | 'market';

export interface Mission {
    id: string;
    title: string;
    xp_reward: number;
    status: 'pending' | 'pending_audit' | 'completed' | 'failed';
    proof_url?: string;
    category: 'architect' | 'spartan' | 'mercenary' | 'nomad' | 'ghost';
}

export interface City {
    id: string;
    name: string;
    status: 'locked' | 'current' | 'review' | 'completed';
    required_xp: number;
    proof_url?: string;
    index: number;
}

export interface FeedItem {
    id: string;
    title: string;
    url: string;
    category: 'AIRDROP' | 'SPARTAN' | 'ARCHITECT';
    consumed: boolean;
}

export interface ChatMessage {
    id: string;
    sender: 'moltbot' | 'user';
    message: string;
    timestamp: string;
}

export interface Profile {
    id: string;
    hp: number;
    credits: number;
    xp_architect: number;
    xp_spartan: number;
    xp_mercenary: number;
    xp_nomad: number;
    xp_ghost: number;
    avatar_state: string;
}

export interface GameState {
    profile: Profile | null;
    missions: Mission[];
    cities: City[];
    chatMessages: ChatMessage[];
    feedItems: FeedItem[];
    activeModule: ModuleType;
    isBunkerMode: boolean;
    isBriefingCompleted: boolean;
    isLoading: boolean;
    error: string | null;
}
