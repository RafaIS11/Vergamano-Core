import { motion, AnimatePresence } from 'framer-motion';

interface FloAvatarProps {
    hp: number;
    totalXP: number; // XP-based progression = correct logic
    className?: string;
    compact?: boolean;
}

// AVATAR LEVELS BASED ON XP — LOGIC: you earn the look you deserve
// 0 means nothing = McDonald's, you work up to ELITE
const AVATAR_LEVELS = [
    {
        minXP: 0,
        maxXP: 499,
        img: '/avatars/avatar_lvl1.png',
        label: 'FLO DEGRAO',
        sublabel: 'NIVEL: McDONALDS',
        accent: '#ef4444',
        textColor: '#fff',
        filter: 'grayscale(40%) contrast(1.2)',
        description: 'DESPERTANDO // SIN HISTORIAL'
    },
    {
        minXP: 500,
        maxXP: 1999,
        img: '/avatars/avatar_lvl2.png',
        label: 'FLO HUSTLIN',
        sublabel: 'NIVEL: CALLE',
        accent: '#f97316',
        textColor: '#fff',
        filter: 'none',
        description: 'CALENTANDO // CONSTRUYENDO BASE'
    },
    {
        minXP: 2000,
        maxXP: 4999,
        img: '/avatars/avatar_lvl3.png',
        label: 'FLO STREET KING',
        sublabel: 'NIVEL: OPERATIVO',
        accent: '#1a1a1a',
        textColor: '#fff',
        filter: 'none',
        description: 'ACTIVO // MOMENTUM GANADO'
    },
    {
        minXP: 5000,
        maxXP: 14999,
        img: '/avatars/avatar_lvl4.png',
        label: 'FLO ARQUITECTO',
        sublabel: 'NIVEL: BLAZER',
        accent: '#1d4ed8',
        textColor: '#fff',
        filter: 'none',
        description: 'PROFESIONAL // SISTEMA ACTIVO'
    },
    {
        minXP: 15000,
        maxXP: Infinity,
        img: '/avatars/avatar_lvl5.png',
        label: 'FLO SOBERANO',
        sublabel: 'NIVEL: ELITE',
        accent: '#FFD700',
        textColor: '#000',
        filter: 'none',
        description: 'SOBERANO // PROTOCOLO COMPLETO'
    },
];

export const FloAvatar = ({ hp, totalXP, className = '', compact = false }: FloAvatarProps) => {
    const level = AVATAR_LEVELS.find(l => totalXP >= l.minXP && totalXP <= l.maxXP) || AVATAR_LEVELS[0];
    const levelIndex = AVATAR_LEVELS.indexOf(level);
    const nextLevel = AVATAR_LEVELS[levelIndex + 1];

    // Progress to next unlock
    const progressToNext = nextLevel
        ? Math.min(100, ((totalXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100)
        : 100;

    const isVoid = hp <= 20;

    if (compact) {
        return (
            <div className="relative">
                <img src={level.img} alt={level.label} className="w-16 h-20 object-contain object-bottom" style={{ filter: level.filter }} />
                <div className="absolute -top-2 -right-1 text-[8px] font-black px-1 py-0.5 border border-black" style={{ backgroundColor: level.accent, color: level.textColor }}>
                    LVL{levelIndex + 1}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Level badge */}
            <motion.div
                key={level.label}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 mb-2 border-2 border-black text-center"
                style={{ backgroundColor: level.accent, color: level.textColor, fontFamily: "'Space Mono', monospace" }}
            >
                {level.label}
            </motion.div>

            {/* Avatar image */}
            <div
                className="relative border-4 border-black overflow-hidden"
                style={{ background: '#f4f1eb', aspectRatio: '3/4' }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={level.img}
                        src={level.img}
                        alt={level.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-contain object-bottom"
                        style={{ filter: level.filter }}
                    />
                </AnimatePresence>

                {/* Void corruption when HP critical */}
                {isVoid && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none mix-blend-multiply"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ background: 'repeating-linear-gradient(0deg, rgba(239,68,68,0.1) 0px, transparent 3px, transparent 6px)' }}
                    />
                )}

                {/* HP bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30">
                    <motion.div
                        animate={{ width: `${hp}%` }}
                        transition={{ duration: 0.7 }}
                        className="h-full"
                        style={{ backgroundColor: hp > 60 ? '#22c55e' : hp > 30 ? '#f59e0b' : '#ef4444' }}
                    />
                </div>
            </div>

            {/* XP Progress to next avatar */}
            <div className="mt-2">
                <div className="flex justify-between text-[8px] font-black opacity-50 mb-1 uppercase">
                    <span>{level.sublabel}</span>
                    {nextLevel && <span>→ {nextLevel.label}</span>}
                </div>
                <div className="h-1.5 border border-black/40 bg-black/5">
                    <motion.div
                        animate={{ width: `${progressToNext}%` }}
                        transition={{ duration: 1 }}
                        className="h-full"
                        style={{ backgroundColor: level.accent }}
                    />
                </div>
                <div className="text-[8px] font-black opacity-40 mt-0.5 uppercase">{totalXP.toLocaleString()} XP</div>
            </div>

            {/* HP status */}
            <div className="text-[8px] font-black uppercase mt-1 opacity-50" style={{ fontFamily: "'Space Mono', monospace" }}>
                HP: {hp}% // {level.description}
            </div>
        </div>
    );
};
