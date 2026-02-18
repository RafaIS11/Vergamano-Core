
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GameState, ModuleType, Profile, ChatMessage } from '../types/game';

const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

interface GameContextType extends GameState {
    setActiveModule: (module: ModuleType) => void;
    setBunkerMode: (active: boolean) => void;
    completeMission: (missionId: string, proofUrl: string) => Promise<void>;
    buyReward: (rewardId: string, cost: number) => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    completeBriefing: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>({
        profile: null,
        missions: [],
        cities: [],
        chatMessages: [],
        feedItems: [],
        activeModule: 'arena',
        isBunkerMode: false,
        isBriefingCompleted: false,
        isLoading: true,
        error: null,
    });

    // Sounds (to be added)
    // const [playClick] = useSound('/sounds/click.mp3');
    // const [playSuccess] = useSound('/sounds/success.mp3');

    const fetchData = useCallback(async () => {
        try {
            setState(s => ({ ...s, isLoading: true }));

            const { data: profile } = await supabase
                .from('profile')
                .select('*')
                .eq('id', USER_ID)
                .single();

            const { data: missions } = await supabase
                .from('tasks')
                .select('*')
                .eq('status', 'pending');

            const { data: chatMessages } = await supabase
                .from('chat_messages')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(50);

            const { data: feedItems } = await supabase
                .from('content_feed')
                .select('*')
                .eq('consumed', false);

            setState(s => ({
                ...s,
                profile,
                missions: missions || [],
                chatMessages: chatMessages?.reverse() || [],
                feedItems: feedItems || [],
                isLoading: false,
            }));
        } catch (error: any) {
            setState(s => ({ ...s, error: error.message, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Realtime Subscriptions
        const profileSubscription = supabase
            .channel('profile-changes')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profile', filter: `id=eq.${USER_ID}` },
                (payload) => {
                    setState(s => ({ ...s, profile: payload.new as Profile }));
                }
            )
            .subscribe();

        const tasksSubscription = supabase
            .channel('tasks-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                () => fetchData() // Simplest for now
            )
            .subscribe();

        const chatSubscription = supabase
            .channel('chat-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    setState(s => ({ ...s, chatMessages: [...s.chatMessages, payload.new as ChatMessage] }));
                }
            )
            .subscribe();

        return () => {
            profileSubscription.unsubscribe();
            tasksSubscription.unsubscribe();
            chatSubscription.unsubscribe();
        };
    }, [fetchData]);

    const setActiveModule = (module: ModuleType) => {
        if (state.isBunkerMode) return; // Locked in Bunker Mode
        setState(s => ({ ...s, activeModule: module }));
    };

    const setBunkerMode = (active: boolean) => {
        setState(s => ({ ...s, isBunkerMode: active }));
    };

    const completeMission = async (missionId: string, proofUrl: string) => {
        await supabase
            .from('tasks')
            .update({ status: 'pending_audit', proof_url: proofUrl })
            .eq('id', missionId);
    };

    const buyReward = async (rewardId: string, cost: number) => {
        if (!state.profile || state.profile.credits < cost) return;

        const newCredits = state.profile.credits - cost;
        await supabase
            .from('profile')
            .update({ credits: newCredits })
            .eq('id', USER_ID);

        // Log the purchase
        await supabase.from('daily_logs').insert({
            type: 'purchase',
            content: `Bought reward ${rewardId}`,
            user_id: USER_ID
        });
    };

    const sendMessage = async (message: string) => {
        await supabase.from('chat_messages').insert({
            sender: 'user',
            message,
            user_id: USER_ID
        });
    };

    const completeBriefing = () => {
        setState(s => ({ ...s, isBriefingCompleted: true }));
    };

    return (
        <GameContext.Provider value={{
            ...state,
            setActiveModule,
            setBunkerMode,
            completeMission,
            buyReward,
            sendMessage,
            completeBriefing
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
