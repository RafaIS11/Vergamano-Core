import { useState, useEffect } from 'react';
import type { Mission } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { CheckSquare, List, Play, Square, Trophy, Lock } from 'lucide-react';
import { InkSplatterSVG, BasquiatCrown } from './ScribbleElements';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';

// Base64 short mechanical crunch placeholder for Audio Brutalism
const CRUNCH_SOUND = 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

export const TaskCard = ({ mission }: { mission: Mission }) => {
    const { completeMission } = useGame();
    const durationSecs = (mission.timer_minutes || mission.estimated_minutes || 25) * 60;
    const [seconds, setSeconds] = useState(durationSecs);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(mission.status === 'completed');
    const [completing, setCompleting] = useState(false);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [evidenceText, setEvidenceText] = useState('');


    // Audio Brutalism Hook
    const [playCrunch] = useSound(CRUNCH_SOUND, { volume: 0.8 });

    const steps: string[] = mission.steps || [];

    const progress = ((durationSecs - seconds) / durationSecs) * 100;
    const xpAmount = mission.xp_base || (mission as any).xp_reward || 100;
    const power = mission.power || (mission as any).pilar || 'architect';

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds(s => s - 1), 1000);
        } else if (seconds === 0) {
            setIsActive(false);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isActive, seconds]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleComplete = async () => {
        if (isCompleted || completing) return;
        // ANTI-CHEAT: require evidence
        setShowEvidenceModal(true);
    };

    const handleSubmitEvidence = async () => {
        if (!evidenceText.trim()) {
            alert('PROTOCOLO: Demuestra que lo hiciste. Sin prueba = sin XP.');
            return;
        }
        setShowEvidenceModal(false);
        setCompleting(true);
        playCrunch();
        await completeMission(mission.id, xpAmount, power);
        setIsCompleted(true);
        setIsActive(false);
        setCompleting(false);
        setEvidenceText('');
    };


    const POWER_COLORS: Record<string, string> = {
        architect: '#3b82f6',
        spartan: '#ef4444',
        mercenary: '#22c55e',
        nomad: '#f59e0b',
        ghost: '#8b5cf6',
        work: '#3b82f6',
        body: '#ef4444',
    };
    const pillarColor = POWER_COLORS[power] || '#000';

    if (isCompleted) {
        return (
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative border-[6px] border-black p-6 bg-gray-50" style={{ borderStyle: 'dashed' }}
            >
                {/* Framer Motion Liquid Ink Splatter Effect  */}
                <motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 0.4, scale: 2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                >
                    <InkSplatterSVG variant={2} />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 200 60" className="w-full opacity-30">
                        <path d="M10 30 L190 30" stroke="black" strokeWidth="8" strokeLinecap="round" />
                        <path d="M5 25 L195 35" stroke="black" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
                    </svg>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <Trophy size={32} className="text-yellow-500" />
                    <div>
                        <h3 className="font-black text-xl line-through">{mission.title}</h3>
                        <p className="text-sm font-bold text-green-600">+{xpAmount} XP sumados al pilar {power.toUpperCase()} ✅</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative border-[8px] border-black bg-white hover:shadow-[12px_12px_0px_#000] transition-all duration-150">
            {/* Ink splatter decoración */}
            <div className="absolute -top-4 -right-4 w-10 h-10 pointer-events-none">
                <InkSplatterSVG variant={1} />
            </div>

            {/* Header con pilar color */}
            <div className="border-b-[6px] border-black p-4 flex justify-between items-center"
                style={{ backgroundColor: pillarColor }}>
                <div className="flex items-center gap-3">
                    <BasquiatCrown className="w-8 h-5 text-white" />
                    <span className="font-black text-white text-xs uppercase tracking-widest"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        {power.toUpperCase()} // OPERACIÓN
                    </span>
                </div>
                <span className="bg-black text-white px-3 py-1 font-black text-2xl">
                    +{xpAmount} XP
                </span>
            </div>

            <div className="p-6">
                <h3 className="font-black text-3xl uppercase mb-2 leading-none"
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    {mission.title}
                </h3>
                {mission.description && (
                    <p className="text-sm font-bold opacity-60 mb-6 border-l-4 border-black pl-3">
                        {mission.description}
                    </p>
                )}

                {/* PASOS */}
                {steps.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                            <List size={14} /> PROTOCOLO
                        </h4>
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-2 mb-2 text-sm font-bold">
                                <span className="text-red-600 font-black shrink-0">[{i + 1}]</span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* why_matters */}
                {mission.why_matters && (
                    <div className="mb-6 bg-black text-white p-3 text-xs font-bold uppercase">
                        <CheckSquare size={12} className="inline mr-2" />
                        POR QUÉ IMPORTA: {mission.why_matters}
                    </div>
                )}

                {/* TIMER + PROGRESO */}
                <div className="border-t-4 border-black pt-4">
                    {/* Progress bar */}
                    <div className="h-3 border-2 border-black mb-4 relative">
                        <div
                            className="h-full transition-all duration-1000"
                            style={{ width: `${progress}%`, backgroundColor: pillarColor }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Timer */}
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white font-black text-3xl px-4 py-2"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                {formatTime(seconds)}
                            </div>
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`p-3 border-4 border-black font-black text-sm transition-all ${isActive
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white hover:bg-black hover:text-white'
                                    }`}
                            >
                                {isActive ? <Square size={20} /> : <Play size={20} />}
                            </button>
                            <button
                                onClick={() => { setSeconds(durationSecs); setIsActive(false); }}
                                className="px-3 py-2 border-4 border-black text-xs font-black hover:bg-black hover:text-white transition-all"
                            >
                                RESET
                            </button>
                        </div>

                        {/* Completar */}
                        <button
                            onClick={handleComplete}
                            disabled={completing}
                            className={`flex-1 py-4 font-black text-lg uppercase border-4 border-black transition-all
                                ${completing ? 'opacity-50 cursor-wait' : 'bg-black text-white hover:bg-red-600 active:translate-y-1'}`}
                        >
                            {completing ? 'PROCESANDO...' : `✓ MISIÓN COMPLETADA (+${xpAmount} XP)`}
                        </button>
                    </div>
                </div>
            </div>
            {/* ANTI-CHEAT EVIDENCE MODAL */}
            <AnimatePresence>
                {showEvidenceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6"
                        onClick={() => setShowEvidenceModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, rotate: -2 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#f4f1eb] border-8 border-black p-8 max-w-lg w-full"
                            style={{ boxShadow: '12px 12px 0 black' }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Lock size={24} />
                                <h3 className="text-2xl font-black uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                                    PROTOCOLO ANTI-CHEAT
                                </h3>
                            </div>
                            <p className="font-bold text-sm mb-2 opacity-70 uppercase">
                                TAREA: {mission.title}
                            </p>
                            <p className="font-bold text-sm mb-6 border-l-4 border-red-600 pl-3">
                                Moltbot necesita prueba antes de otorgar +{xpAmount} XP.<br />
                                Link, descripción de qué hiciste, commits, foto, lo que sea. Nada = no hay XP.
                            </p>
                            <textarea
                                className="w-full border-4 border-black p-4 font-bold text-sm bg-white mb-6 resize-none focus:outline-none"
                                rows={4}
                                placeholder="¿Qué hiciste exactamente? Link o descripción concreta..."
                                value={evidenceText}
                                onChange={e => setEvidenceText(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitEvidence}
                                    className="flex-1 bg-black text-white py-4 font-black uppercase text-lg border-4 border-black hover:bg-red-600 transition-colors"
                                >
                                    ✓ ENVIAR PRUEBA (+{xpAmount} XP)
                                </button>
                                <button
                                    onClick={() => setShowEvidenceModal(false)}
                                    className="px-6 py-4 border-4 border-black font-black hover:bg-black hover:text-white transition-colors"
                                >
                                    X
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
