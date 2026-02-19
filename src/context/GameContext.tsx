
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
    const [feedItems] = useState<FeedItem[]>([]);
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

            // Misiones reales por pilar (Muestra de ejemplo corregida)
            const mockMissions: Mission[] = [
                {
                    id: 'm1', user_id: USER_ID, title: 'LEVANTAR_ESTRUCTURA_RED', pilar: 'architect', xp_reward: 150, status: 'pending', created_at: new Date().toISOString(),
                    description: 'Diseña el blueprint de tu nodo central. Sin planos no hay imperio.',
                    subtasks: [
                        { label: 'Definir arquitectura de carpetas', completed: false },
                        { label: 'Configurar variables de entorno', completed: false }
                    ],
                    steps: [
                        'Abre el IDE y crea la estructura base.',
                        'Valida los endpoints principales.',
                        'Sube el primer commit de control.'
                    ],
                    resources: [{ label: 'Guía de Estructura', url: 'https://react.dev' }],
                    timer_minutes: 25
                },
                {
                    id: 'm2', user_id: USER_ID, title: 'FORJA_DEL_GUERRERO', pilar: 'spartan', xp_reward: 200, status: 'pending', created_at: new Date().toISOString(),
                    description: 'Tu cuerpo es tu primer servidor. Ponlo a prueba.',
                    subtasks: [
                        { label: 'Completar 50 flexiones', completed: false },
                        { label: '15 minutos de cardio hit', completed: false }
                    ],
                    steps: [
                        'Calentamiento articular 5 min.',
                        'Ejecución técnica sin descanso.',
                        'Estiramiento y reporte de fatiga.'
                    ],
                    timer_minutes: 20
                },
                {
                    id: 'm3', user_id: USER_ID, title: 'OPERACIÓN_EXTRACCIÓN', pilar: 'mercenary', xp_reward: 300, status: 'pending', created_at: new Date().toISOString(),
                    description: 'Extrae valor del mercado. Generación de leads.',
                    subtasks: [
                        { label: 'Contactar 5 clientes potenciales', completed: false },
                        { label: 'Cerrar reporte de ingresos diarios', completed: false }
                    ],
                    steps: [
                        'Identifica los prospectos de hoy.',
                        'Envía propuesta personalizada.',
                        'Registra interacción en el CRM.'
                    ],
                    timer_minutes: 45
                },
                {
                    id: 'm4', user_id: USER_ID, title: 'RASTRO_NÓMADA', pilar: 'nomad', xp_reward: 100, status: 'pending', created_at: new Date().toISOString(),
                    description: 'Explora nuevos territorios digitales o físicos.',
                    steps: [
                        'Muévete a una nueva ubicación para trabajar.',
                        'Documenta el entorno.',
                        'Moltbot auditará tu ubicación.'
                    ],
                    timer_minutes: 60
                },
                {
                    id: 'm5', user_id: USER_ID, title: 'SILENCIO_DE_FANTASMA', pilar: 'ghost', xp_reward: 250, status: 'pending', created_at: new Date().toISOString(),
                    description: 'Operaciones en la sombra. Mejora de privacidad.',
                    steps: [
                        'Limpia metadatos de tus últimas subidas.',
                        'Encripta archivos sensibles.',
                        'Desaparece del radar 30 min.'
                    ],
                    timer_minutes: 30
                }
            ];
            setMissions(mockMissions);

            // Mapa Completo (10 países)
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

            // Mensajes (Chat)
            const { data: msgData } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', USER_ID)
                .order('created_at', { ascending: true });
            if (msgData) setChatMessages(msgData as ChatMessage[]);

        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
        // Suscripciones Realtime omitidas por brevedad, asumimos funcionamiento local para test.
    }, [fetchInitialData]);

    const sendMessage = async (message: string) => {
        const newMessage: ChatMessage = {
            id: Math.random().toString(),
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

    const completeMission = async (missionId: string) => {
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                const updated = { ...m, status: 'completed' as const };
                // Sumar XP al perfil (Simulación local)
                if (profile) setProfile({ ...profile, xp_work: profile.xp_work + (m.xp_reward || 0) });
                return updated;
            }
            return m;
        }));
    };

    const contextValue: GameContextType = {
        profile, missions, cities, chatMessages, feedItems, activeModule, activePillar, isBunkerMode, isLoading,
        setActiveModule, setActivePillar, setBunkerMode, completeMission, sendMessage,
        buyReward: async () => { }, completeBriefing: () => { }
    };

    return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};
