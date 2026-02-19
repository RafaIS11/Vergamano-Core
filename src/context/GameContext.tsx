
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, ModuleType, Profile, ChatMessage, Mission, City, FeedItem } from '../types/game';

const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

interface GameContextType extends GameState {
    setActiveModule: (module: ModuleType) => void;
    setActivePillar: (pillar: string | null) => void;
    setBunkerMode: (active: boolean) => void;
    completeMission: (missionId: string, proofUrl: string) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    buyReward: (rewardId: string, cost: number) => Promise<void>;
    completeBriefing: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

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

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Perfil
            const { data: profileData } = await supabase
                .from('profile')
                .select('*')
                .eq('id', USER_ID)
                .single();
            if (profileData) setProfile(profileData as Profile);

            // Misiones
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', USER_ID)
                .order('created_at', { ascending: false });
            if (tasksData) setMissions(tasksData as Mission[]);

            // Mensajes
            const { data: msgData } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', USER_ID)
                .order('created_at', { ascending: true });
            if (msgData) setChatMessages(msgData as ChatMessage[]);

            // MOCK Cities
            setCities([
                { name: 'MADRID', xp_needed: 0, status: 'current', flag: '🇪🇸', coordinates: { x: 10, y: 10 } },
                { name: 'BERLIN', xp_needed: 1000, status: 'locked', flag: '🇩🇪', coordinates: { x: 30, y: 50 } },
                { name: 'TOKYO', xp_needed: 2500, status: 'locked', flag: '🇯🇵', coordinates: { x: 60, y: 20 } },
                { name: 'NYC', xp_needed: 5000, status: 'locked', flag: '🇺🇸', coordinates: { x: 80, y: 70 } },
            ]);

            // MOCK Feed
            setFeedItems([
                {
                    id: '1', title: 'EL CÓDIGO DE LA SOMBRA', category: 'intel', created_at: new Date().toISOString(),
                    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
                    how_to_apply: 'Escanea tus alrededores. El orden nace del caos estructurado.',
                    source: 'DEEP_WEB_01'
                },
                {
                    id: '2', title: 'FILTRACIÓN: PROYECTO SPARTA', category: 'leaks', created_at: new Date().toISOString(),
                    thumbnail_url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=400',
                    how_to_apply: 'Tu cuerpo es tu única propiedad real. Entrénalo como si tu vida dependiera de ello.',
                    source: 'ANONYMOUS'
                }
            ]);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();

        const profileSub = supabase.channel('profile_realtime').on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'profile', filter: `id=eq.${USER_ID}` },
            (payload) => setProfile(payload.new as Profile)
        ).subscribe();

        const tasksSub = supabase.channel('tasks_realtime').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${USER_ID}` },
            (payload) => {
                if (payload.eventType === 'UPDATE') {
                    setMissions(prev => prev.map(m => m.id === payload.new.id ? payload.new as Mission : m));
                } else if (payload.eventType === 'INSERT') {
                    setMissions(prev => [payload.new as Mission, ...prev]);
                }
            }
        ).subscribe();

        const chatSub = supabase.channel('chat_realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    const newMessage = payload.new as ChatMessage;
                    if (newMessage.user_id === USER_ID) {
                        setChatMessages(prev => {
                            if (prev.some(m => m.id === newMessage.id)) return prev;
                            return [...prev, newMessage];
                        });
                    }
                }
            )
            .subscribe();

        const pollingInterval = setInterval(async () => {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', USER_ID)
                .order('created_at', { ascending: true });

            if (data) {
                setChatMessages(prev => {
                    if (data.length > prev.length) return data as ChatMessage[];
                    return prev;
                });
            }
        }, 5000);

        return () => {
            supabase.removeChannel(profileSub);
            supabase.removeChannel(tasksSub);
            supabase.removeChannel(chatSub);
            clearInterval(pollingInterval);
        };
    }, [fetchInitialData]);

    const completeMission = async (missionId: string, proofUrl: string) => {
        const { error } = await supabase
            .from('tasks')
            .update({ status: 'auditing', evidence_url: proofUrl })
            .eq('id', missionId);

        if (error) console.error("Error en auditoría:", error);
    };

    const sendMessage = async (message: string) => {
        const newMessage: ChatMessage = {
            id: Math.random().toString(),
            user_id: USER_ID,
            content: message,
            sender: 'rafael',
            created_at: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, newMessage]);

        const { error } = await supabase.from('chat_messages').insert([{
            user_id: USER_ID,
            content: message,
            sender: 'rafael'
        }]);

        if (error) console.error("Error enviando mensaje:", error);
    };

    const contextValue: GameContextType = {
        profile,
        missions,
        cities,
        chatMessages,
        feedItems,
        activeModule,
        activePillar,
        isBunkerMode,
        isLoading,
        setActiveModule,
        setActivePillar,
        setBunkerMode,
        completeMission,
        buyReward: async (rewardId: string, cost: number) => {
            console.log(`Comprando recompensa: ${rewardId} por ${cost} CR`);
        },
        sendMessage,
        completeBriefing: () => { }
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
