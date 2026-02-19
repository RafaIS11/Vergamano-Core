
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, ModuleType, Profile, ChatMessage, Mission, City, FeedItem } from '../types/game';

const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

interface GameContextType extends GameState {
    setActiveModule: (module: ModuleType) => void;
    setActivePillar: (pillar: string | null) => void;
    setBunkerMode: (active: boolean) => void;
    completeMission: (missionId: string, xpReward: number, pilar: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    buyReward: (rewardId: string, cost: number, rewardName: string) => Promise<void>;
    completeBriefing: () => void;
    refreshMissions: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Mapa de pilar -> columna XP en Supabase
const PILAR_XP_COLUMN: Record<string, string> = {
    architect: 'xp_architect',
    spartan: 'xp_spartan',
    mercenary: 'xp_mercenary',
    nomad: 'xp_nomad',
    ghost: 'xp_ghost',
    work: 'xp_architect',
    body: 'xp_spartan',
};

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

    const fetchProfile = useCallback(async () => {
        const { data } = await supabase.from('profile').select('*').eq('id', USER_ID).single();
        if (data) setProfile(data as Profile);
    }, []);

    const fetchMissions = useCallback(async () => {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', USER_ID)
            .neq('status', 'completed')
            .order('created_at', { ascending: false });
        if (data && data.length > 0) {
            setMissions(data as Mission[]);
        }
        // Si no hay tareas en DB, mostrar vacío (Moltbot llenará)
    }, []);

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            await fetchProfile();
            await fetchMissions();

            // Mapa de conquista (10 ciudades)
            setCities([
                { name: 'MADRID', xp_needed: 0, status: 'current', flag: '🇪🇸' },
                { name: 'BERLIN', xp_needed: 1000, status: 'locked', flag: '🇩🇪' },
                { name: 'TOKIO', xp_needed: 2500, status: 'locked', flag: '🇯🇵' },
                { name: 'NUEVA YORK', xp_needed: 5000, status: 'locked', flag: '🇺🇸' },
                { name: 'LONDRES', xp_needed: 7500, status: 'locked', flag: '🇬🇧' },
                { name: 'PARIS', xp_needed: 10000, status: 'locked', flag: '🇫🇷' },
                { name: 'DUBAI', xp_needed: 15000, status: 'locked', flag: '🇦🇪' },
                { name: 'SINGAPUR', xp_needed: 20000, status: 'locked', flag: '🇸🇬' },
                { name: 'CIUDAD DE MÉXICO', xp_needed: 25000, status: 'locked', flag: '🇲🇽' },
                { name: 'SEOUL', xp_needed: 30000, status: 'locked', flag: '🇰🇷' },
            ]);

            // LSD Feed desde Supabase
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

    // Suscripciones Realtime
    useEffect(() => {
        fetchInitialData();

        // Chat en tiempo real (respuestas de Moltbot)
        const chatChannel = supabase
            .channel('realtime_chat')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const newMsg = payload.new as ChatMessage;
                if (newMsg.sender === 'moltbot') {
                    setChatMessages(prev => {
                        // Evitar duplicados
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            })
            .subscribe();

        // Tareas en tiempo real (Moltbot puede añadir tareas)
        const tasksChannel = supabase
            .channel('realtime_tasks')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const newTask = payload.new as Mission;
                setMissions(prev => {
                    if (prev.find(m => m.id === newTask.id)) return prev;
                    return [newTask, ...prev];
                });
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${USER_ID}`
            }, (payload) => {
                const updated = payload.new as Mission;
                setMissions(prev => prev.map(m => m.id === updated.id ? updated : m));
            })
            .subscribe();

        // Perfil en tiempo real (XP/HP actualizados desde VPS)
        const profileChannel = supabase
            .channel('realtime_profile')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profile',
                filter: `id=eq.${USER_ID}`
            }, (payload) => {
                setProfile(payload.new as Profile);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(chatChannel);
            supabase.removeChannel(tasksChannel);
            supabase.removeChannel(profileChannel);
        };
    }, [fetchInitialData]);

    // COMPLETAR MISIÓN: escribe XP real en Supabase
    const completeMission = async (missionId: string, xpReward: number, pilar: string) => {
        // 1. Marcar tarea como completada en DB
        const { error: taskError } = await supabase
            .from('tasks')
            .update({ status: 'completed' })
            .eq('id', missionId);

        if (taskError) {
            console.error('Error completando tarea:', taskError);
            return;
        }

        // 2. Actualizar UI local inmediatamente
        setMissions(prev => prev.filter(m => m.id !== missionId));

        // 3. Sumar XP al pilar correcto en Supabase
        const xpColumn = PILAR_XP_COLUMN[pilar] || 'xp_architect';
        const currentXP = (profile as any)?.[xpColumn] || 0;
        const newXP = currentXP + xpReward;

        const { error: profileError } = await supabase
            .from('profile')
            .update({
                [xpColumn]: newXP,
                credits: (profile?.credits || 0) + Math.floor(xpReward / 5),
            })
            .eq('id', USER_ID);

        if (profileError) {
            console.error('Error actualizando XP:', profileError);
        } else {
            // Actualizar estado local también
            if (profile) {
                setProfile({
                    ...profile,
                    [xpColumn]: newXP,
                    credits: (profile.credits || 0) + Math.floor(xpReward / 5),
                });
            }
        }

        // 4. Calcular nivel nuevo (cada 1000 XP = 1 nivel)
        const totalXP = (profile?.xp_architect || 0) + (profile?.xp_spartan || 0) +
            (profile?.xp_mercenary || 0) + (profile?.xp_nomad || 0) + (profile?.xp_ghost || 0) + xpReward;
        const newLevel = Math.floor(totalXP / 1000) + 1;
        if (newLevel > (profile?.level || 1)) {
            await supabase.from('profile').update({ level: newLevel }).eq('id', USER_ID);
        }
    };

    // ENVIAR MENSAJE: guarda en Supabase, Moltbot responde via Realtime
    const sendMessage = async (message: string) => {
        const tempId = Date.now().toString();
        const newMessage: ChatMessage = {
            id: tempId,
            user_id: USER_ID,
            content: message,
            sender: 'rafael',
            created_at: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, newMessage]);

        await supabase.from('chat_messages').insert([{
            user_id: USER_ID,
            content: message,
            sender: 'rafael'
        }]);
    };

    // COMPRAR EN MERCADO: descuenta créditos
    const buyReward = async (_rewardId: string, cost: number, rewardName: string) => {
        if (!profile) return;
        if (profile.credits < cost) {
            alert(`No tienes suficientes créditos. Necesitas ${cost} CR, tienes ${profile.credits} CR.`);
            return;
        }
        const newCredits = profile.credits - cost;
        const { error } = await supabase
            .from('profile')
            .update({ credits: newCredits })
            .eq('id', USER_ID);

        if (!error) {
            setProfile({ ...profile, credits: newCredits });
            alert(`✅ ${rewardName} adquirido. Te quedan ${newCredits} CR.`);
        }
    };

    const refreshMissions = fetchMissions;

    const contextValue: GameContextType = {
        profile, missions, cities, chatMessages, feedItems,
        activeModule, activePillar, isBunkerMode, isLoading,
        setActiveModule, setActivePillar, setBunkerMode,
        completeMission, sendMessage, buyReward,
        completeBriefing: () => { },
        refreshMissions,
    };

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
