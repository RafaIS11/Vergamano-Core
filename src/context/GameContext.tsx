
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, ModuleType, Profile, ChatMessage, Mission, City, FeedItem } from '../types/game';

// TODO: Link this to real auth when auth is implemented
const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

interface GameContextType extends GameState {
    setActiveModule: (module: ModuleType) => void;
    setActivePillar: (pillar: string | null) => void;
    setBunkerMode: (active: boolean) => void;
    completeMission: (missionId: string, xpBase: number, power: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    buyReward: (_rewardId: string, cost: number, rewardName: string) => Promise<void>;
    completeBriefing: () => void;
    refreshMissions: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Map pilar -> XP column in profile table (production schema)
const POWER_XP_COLUMN: Record<string, keyof Profile> = {
    architect: 'xp_architect',
    spartan: 'xp_spartan',
    mercenary: 'xp_mercenary',
    nomad: 'xp_nomad',
    ghost: 'xp_ghost',
};

// Compute level from total XP (1000 XP per level)
function computeLevel(profile: Profile): number {
    const total = (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
        (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0);
    return Math.max(1, Math.floor(total / 1000) + 1);
}

// Compute credits from total XP (1 credit per 5 XP)
function computeCredits(profile: Profile): number {
    const total = (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
        (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0);
    return Math.floor(total / 5);
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [activeModule, setActiveModule] = useState<ModuleType>('arena');
    const [activePillar, setActivePillar] = useState<string | null>(null);
    const [isBunkerMode, setBunkerMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const enrichProfile = (p: Profile): Profile => ({
        ...p,
        level: computeLevel(p),
        credits: computeCredits(p),
    });

    const fetchProfile = useCallback(async () => {
        const { data } = await supabase.from('profile').select('*').eq('id', USER_ID).single();
        if (data) setProfile(enrichProfile(data as Profile));
    }, []);

    const fetchMissions = useCallback(async () => {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', USER_ID)
            .not('status', 'eq', 'completed')
            .not('status', 'eq', 'failed')
            .order('created_at', { ascending: false });
        if (data && data.length > 0) {
            setMissions(data as Mission[]);
        }
    }, []);

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchProfile();
            await fetchMissions();

            // 10-country conquest route
            setCities([
                { name: 'CARACAS', xp_needed: 0, status: 'current', flag: '🇻🇪' },
                { name: 'MADRID', xp_needed: 1000, status: 'locked', flag: '🇪🇸' },
                { name: 'BRUSELAS', xp_needed: 2500, status: 'locked', flag: '🇧🇪' },
                { name: 'COPENHAGUE', xp_needed: 5000, status: 'locked', flag: '🇩🇰' },
                { name: 'BERLÍN', xp_needed: 8000, status: 'locked', flag: '🇩🇪' },
                { name: 'SAN FRANCISCO', xp_needed: 12000, status: 'locked', flag: '🇺🇸' },
                { name: 'BALI', xp_needed: 17000, status: 'locked', flag: '🇮🇩' },
                { name: 'OSLO', xp_needed: 23000, status: 'locked', flag: '🇳🇴' },
                { name: 'LONDRES', xp_needed: 30000, status: 'locked', flag: '🇬🇧' },
                { name: 'NUEVA YORK', xp_needed: 40000, status: 'locked', flag: '🇺🇸' },
            ]);

            // LSD Feed
            const { data: feedData } = await supabase
                .from('content_feed')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
            if (feedData) setFeedItems(feedData as FeedItem[]);

            // Chat messages
            const { data: msgData } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', USER_ID)
                .order('created_at', { ascending: true })
                .limit(50);
            if (msgData) setChatMessages(msgData as ChatMessage[]);

        } catch (error) {
            console.error('Error cargando VergaMano OS:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchProfile, fetchMissions]);

    useEffect(() => {
        fetchInitialData();

        // Realtime: chat (respuestas de Moltbot)
        const chatChannel = supabase
            .channel('realtime_chat')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'chat_messages',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const newMsg = payload.new as ChatMessage;
                if (newMsg.sender === 'moltbot') {
                    setChatMessages(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
                }
            })
            .subscribe();

        // Realtime: tasks (Moltbot puede añadir tareas)
        const tasksChannel = supabase
            .channel('realtime_tasks')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'tasks',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const newTask = payload.new as Mission;
                setMissions(prev => prev.find(m => m.id === newTask.id) ? prev : [newTask, ...prev]);
            })
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public', table: 'tasks',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const updated = payload.new as Mission;
                if (updated.status === 'completed' || updated.status === 'failed') {
                    setMissions(prev => prev.filter(m => m.id !== updated.id));
                } else {
                    setMissions(prev => prev.map(m => m.id === updated.id ? updated : m));
                }
            })
            .subscribe();

        // Realtime: profile (XP se actualiza en tiempo real)
        const profileChannel = supabase
            .channel('realtime_profile')
            .on('postgres_changes', {
                event: 'UPDATE', schema: 'public', table: 'profile',
                filter: `id=eq.${USER_ID}`
            }, (payload) => {
                setProfile(enrichProfile(payload.new as Profile));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(chatChannel);
            supabase.removeChannel(tasksChannel);
            supabase.removeChannel(profileChannel);
        };
    }, [fetchInitialData]);

    // COMPLETAR MISIÓN: Optimistic UI Updates (Zero Latency)
    const completeMission = async (missionId: string, xpBase: number, power: string) => {
        // --- V4.0 OPTIMISTIC UPDATE ---

        // 1. Guardar estado previo para posible rollback
        const previousMissions = [...missions];
        const previousProfile = profile ? { ...profile } : null;

        // 2. Modificar el estado local INMEDIATAMENTE
        setMissions(prev => prev.filter(m => m.id !== missionId));

        const xpCol = POWER_XP_COLUMN[power] || 'xp_architect';
        const currentXP = (profile as any)?.[xpCol] || 0;
        const newXP = currentXP + xpBase;

        if (profile) {
            setProfile(enrichProfile({ ...profile, [xpCol]: newXP }));
        }

        // --- BACKGROUND DB UPDATE ---
        try {
            // Actualizar Tarea
            const { error: taskError } = await supabase.from('tasks').update({
                status: 'completed',
                completed_at: new Date().toISOString()
            }).eq('id', missionId);

            if (taskError) throw taskError;

            // Actualizar Perfil
            const { error: profileError } = await supabase
                .from('profile')
                .update({ [xpCol]: newXP })
                .eq('id', USER_ID);

            if (profileError) throw profileError;

        } catch (err) {
            console.error("V4.0: Error en Optimistic Update (Rollback)", err);
            // ROLLBACK
            setMissions(previousMissions);
            if (previousProfile) {
                setProfile(enrichProfile(previousProfile));
            }
            // Emitir evento para el toast
            alert('Fallo al sincronizar V4.0. Rollback ejecutado.');
        }
    };

    // ENVIAR MENSAJE: Optimistic UI Updates
    const sendMessage = async (message: string) => {
        // --- V4.0 OPTIMISTIC UPDATE ---
        const previousMessages = [...chatMessages];

        const newMsg: ChatMessage = {
            id: Date.now().toString(), // ID temporal
            user_id: USER_ID,
            content: message,
            sender: 'rafael',
            created_at: new Date().toISOString()
        };

        // Renderizar inmediatamente
        setChatMessages(prev => [...prev, newMsg]);

        // --- BACKGROUND DB UPDATE ---
        try {
            const { error } = await supabase.from('chat_messages').insert([{
                user_id: USER_ID,
                content: message,
                sender: 'rafael'
            }]);
            if (error) throw error;
        } catch (err) {
            console.error("V4.0: Error enviando mensaje (Rollback)", err);
            setChatMessages(previousMessages);
        }
    };

    // COMPRAR: Optimistic UI Updates
    const buyReward = async (_rewardId: string, cost: number, rewardName: string) => {
        if (!profile) return;

        const currentCredits = computeCredits(profile);
        if (currentCredits < cost) {
            alert(`SISTEMA BLOQUEADO. Faltan créditos. Tienes ${currentCredits} CR. Mueve el culo.`);
            return;
        }

        // --- V4.0 OPTIMISTIC UPDATE ---
        const previousProfile = { ...profile };
        const costInXp = cost * 5; // El ratio es 1 CR = 5 XP. Lo restamos del sobrante.

        // En V3.5 el costo se restaba del Pilar que más XP tiene o proporcionalmente.
        // Para simplificar y mantener la velocidad 4.0, se lo descontamos al Ghost (Fund).
        const currentGhostXP = profile.xp_ghost || 0;
        const newGhostXP = currentGhostXP - costInXp;

        setProfile(enrichProfile({ ...profile, xp_ghost: newGhostXP }));

        // Feedback inmediato (podemos cambiar el alert por el sonido crudo después)
        console.log(`[V4.0] Optimistic Buy: ${rewardName}. Re-syncing DB...`);

        // --- BACKGROUND DB UPDATE ---
        try {
            const { error } = await supabase
                .from('profile')
                .update({ xp_ghost: newGhostXP })
                .eq('id', USER_ID);

            if (error) throw error;
        } catch (err) {
            console.error("V4.0: Error comprando reward (Rollback)", err);
            setProfile(enrichProfile(previousProfile));
            alert('Sincronización fallida. Rollback de créditos.');
        }
    };

    const contextValue: GameContextType = {
        profile, missions, cities, chatMessages, feedItems,
        activeModule, activePillar, isBunkerMode, isLoading,
        setActiveModule, setActivePillar, setBunkerMode,
        completeMission, sendMessage, buyReward,
        completeBriefing: () => { },
        refreshMissions: fetchMissions,
    };

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
