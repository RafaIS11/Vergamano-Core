import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/game';

// TODO: Replace with real auth when Supabase Auth is implemented
const USER_ID = '3a95d701-18d8-4104-aea2-f9a068c7f413';

function computeLevel(p: Profile): number {
    const total =
        (p.xp_architect || 0) +
        (p.xp_spartan || 0) +
        (p.xp_mercenary || 0) +
        (p.xp_nomad || 0) +
        (p.xp_ghost || 0);
    return Math.max(1, Math.floor(total / 500) + 1);
}

function computeCredits(p: Profile): number {
    const total =
        (p.xp_architect || 0) +
        (p.xp_spartan || 0) +
        (p.xp_mercenary || 0) +
        (p.xp_nomad || 0) +
        (p.xp_ghost || 0);
    return Math.floor(total / 10);
}

function enrichProfile(p: Profile): Profile {
    return {
        ...p,
        level: computeLevel(p),
        credits: computeCredits(p),
    };
}

interface UseProfileReturn {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('profile')
                .select('*')
                .eq('id', USER_ID)
                .single();

            if (fetchError) throw fetchError;
            if (data) setProfile(enrichProfile(data as Profile));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar perfil';
            setError(message);
            console.error('[useProfile] fetchProfile error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();

        // Realtime subscription — reacts to HP/XP changes without page reload
        const channel = supabase
            .channel('profile_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profile',
                    filter: `id=eq.${USER_ID}`,
                },
                (payload) => {
                    setProfile(enrichProfile(payload.new as Profile));
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[useProfile] Realtime channel profile_changes active');
                }
            });

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchProfile]);

    return { profile, isLoading, error, refetch: fetchProfile };
}
