import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { FloAvatar } from './FloAvatar';

const PILLAR_META: Record<string, { label: string; color: string; emoji: string }> = {
    architect: { label: 'ARQUITECTO', color: '#3b82f6', emoji: '🏗️' },
    spartan:   { label: 'ESPARTANO',  color: '#ef4444', emoji: '⚔️' },
    mercenary: { label: 'MERCENARIO', color: '#22c55e', emoji: '💰' },
    nomad:     { label: 'NÓMADA',     color: '#f59e0b', emoji: '🌍' },
    ghost:     { label: 'FANTASMA',   color: '#8b5cf6', emoji: '👻' },
};

const ArenaView: React.FC = () => {
    const { profile, missions, setActiveModule, setActivePillar } = useGame();

    if (!profile) return (
        <div className="p-20 text-4xl font-black animate-pulse" style={{ fontFamily: "'Space Mono', monospace" }}>
            CARGANDO_BIO_STATUS...
        </div>
    );

    const totalXP = (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
        (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0);

    const activeMissions = missions.filter(m => m.status !== 'completed' && m.status !== 'failed');
    const pillars = ['architect', 'spartan', 'mercenary', 'nomad', 'ghost'] as const;

    return (
        <div className="space-y-8">

            {/* ── HERO: Avatar + stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Avatar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-3 border-[5px] border-black bg-white flex flex-col items-center justify-center p-6 gap-4"
                    style={{ boxShadow: '6px 6px 0 black' }}
                >
                    <FloAvatar hp={profile.hp} totalXP={totalXP} className="w-full max-w-[180px]" />
                    <div className="text-center w-full">
                        <p className="font-black text-xs uppercase tracking-widest opacity-40 mb-1">OPERATIVO</p>
                        <h2 className="font-black text-xl uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>RAFAEL_IBARRA</h2>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                            <div className="border-[3px] border-black p-2">
                                <p className="text-[9px] font-black opacity-40 uppercase">HP</p>
                                <p className="font-black text-lg" style={{ color: profile.hp > 60 ? '#22c55e' : profile.hp > 30 ? '#f59e0b' : '#ef4444' }}>
                                    {profile.hp}%
                                </p>
                            </div>
                            <div className="border-[3px] border-black p-2">
                                <p className="text-[9px] font-black opacity-40 uppercase">LVL</p>
                                <p className="font-black text-lg">{profile.level ?? 1}</p>
                            </div>
                            <div className="border-[3px] border-black p-2 col-span-2">
                                <p className="text-[9px] font-black opacity-40 uppercase">XP TOTAL</p>
                                <p className="font-black text-xl">{totalXP.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Pillar XP Grid */}
                <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {pillars.map((p, i) => {
                        const meta = PILLAR_META[p];
                        const xp = (profile as any)[`xp_${p}`] || 0;
                        const xpInLevel = xp % 500;
                        const taskCount = activeMissions.filter(m => m.power === p || m.pilar === p).length;
                        return (
                            <motion.button
                                key={p}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -3, boxShadow: '8px 8px 0 black' }}
                                whileTap={{ y: 0 }}
                                onClick={() => { setActivePillar(p); setActiveModule('tasks'); }}
                                className="border-[4px] border-black bg-white p-4 text-left flex flex-col gap-2 cursor-pointer"
                                style={{ boxShadow: '4px 4px 0 black' }}
                            >
                                <span className="text-2xl">{meta.emoji}</span>
                                <p className="font-black text-xs uppercase tracking-wider">{meta.label}</p>
                                <p className="font-black text-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                                    {xp.toLocaleString()} <span className="text-xs opacity-40">XP</span>
                                </p>
                                {/* XP bar */}
                                <div className="h-2 border-2 border-black w-full">
                                    <div className="h-full transition-all duration-700"
                                        style={{ width: `${Math.min(100, xpInLevel / 5)}%`, backgroundColor: meta.color }} />
                                </div>
                                {taskCount > 0 && (
                                    <span className="text-[10px] font-black px-2 py-0.5 border-[2px] border-black w-fit"
                                        style={{ backgroundColor: meta.color, color: 'white' }}>
                                        {taskCount} TASK{taskCount > 1 ? 'S' : ''}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ── MISIONES ACTIVAS (preview 3) ── */}
            <div>
                <div className="flex justify-between items-end border-b-[5px] border-black pb-3 mb-4">
                    <h3 className="font-black text-2xl uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                        MISIONES_ACTIVAS
                    </h3>
                    <button
                        onClick={() => setActiveModule('tasks')}
                        className="font-black text-xs uppercase tracking-widest border-[3px] border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                    >
                        VER TODAS →
                    </button>
                </div>

                {activeMissions.length === 0 ? (
                    <div className="border-[4px] border-dashed border-gray-200 p-16 text-center">
                        <p className="font-black text-xl opacity-20 uppercase">SIN MISIONES ACTIVAS</p>
                        <p className="font-black text-xs opacity-20 mt-2 uppercase">El agente generará nuevas cuando avances</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeMissions.slice(0, 3).map((m, i) => {
                            const meta = PILLAR_META[m.power || m.pilar || 'architect'];
                            return (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="border-[4px] border-black bg-white p-4"
                                    style={{ boxShadow: '4px 4px 0 black' }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black px-2 py-0.5 border-[2px] border-black"
                                            style={{ backgroundColor: meta?.color, color: 'white' }}>
                                            {meta?.label}
                                        </span>
                                        <span className="font-black text-sm">+{m.xp_base || m.xp_reward} XP</span>
                                    </div>
                                    <p className="font-black text-sm uppercase leading-tight mt-2"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {m.title}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArenaView;
