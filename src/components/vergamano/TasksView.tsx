import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { TaskCard } from './TaskCard';

const PILLARS = [
    { id: null,        label: 'TODAS',      color: '#000' },
    { id: 'architect', label: 'ARQUITECTO', color: '#3b82f6' },
    { id: 'spartan',   label: 'ESPARTANO',  color: '#ef4444' },
    { id: 'mercenary', label: 'MERCENARIO', color: '#22c55e' },
    { id: 'nomad',     label: 'NÓMADA',     color: '#f59e0b' },
    { id: 'ghost',     label: 'FANTASMA',   color: '#8b5cf6' },
];

const TasksView: React.FC = () => {
    const { missions, activePillar, setActivePillar } = useGame();
    const [filter, setFilter] = useState<string | null>(activePillar);

    // Sync filter when navigating from ArenaView pillar click
    useEffect(() => {
        setFilter(activePillar);
    }, [activePillar]);

    const filtered = filter
        ? missions.filter(m =>
            m.power?.toLowerCase() === filter ||
            m.pilar?.toLowerCase() === filter
          )
        : missions;

    const active = filtered.filter(m => m.status !== 'completed' && m.status !== 'failed');
    const completed = filtered.filter(m => m.status === 'completed');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b-[6px] border-black pb-4">
                <h2 className="font-black text-4xl uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                    TASKS_BOARD
                </h2>
                <p className="font-black text-xs opacity-40 uppercase tracking-widest mt-1">
                    {active.length} ACTIVAS // {completed.length} COMPLETADAS
                </p>
            </div>

            {/* Pillar filter tabs */}
            <div className="flex flex-wrap gap-2">
                {PILLARS.map(p => {
                    const isActive = filter === p.id;
                    const count = p.id
                        ? missions.filter(m => (m.power === p.id || m.pilar === p.id) && m.status !== 'completed').length
                        : missions.filter(m => m.status !== 'completed').length;
                    return (
                        <button
                            key={String(p.id)}
                            onClick={() => { setFilter(p.id); setActivePillar(p.id); }}
                            className="font-black text-xs uppercase tracking-wider border-[3px] border-black px-3 py-2 transition-all flex items-center gap-2"
                            style={{
                                backgroundColor: isActive ? p.color : '#fff',
                                color: isActive ? '#fff' : '#000',
                                boxShadow: isActive ? '3px 3px 0 black' : 'none',
                                fontFamily: "'Space Mono', monospace",
                            }}
                        >
                            {p.label}
                            {count > 0 && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 border border-current rounded-sm">
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tasks list */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={filter ?? 'all'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="space-y-6"
                >
                    {active.length === 0 ? (
                        <div className="border-[4px] border-dashed border-gray-200 p-20 text-center">
                            <p className="font-black text-2xl opacity-20 uppercase">SIN MISIONES ACTIVAS</p>
                            <p className="font-black text-xs opacity-20 mt-2 uppercase">
                                Completa tareas para que el agente genere nuevas
                            </p>
                        </div>
                    ) : (
                        active.map((mission, i) => (
                            <motion.div
                                key={mission.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <TaskCard mission={mission} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TasksView;
