import { motion, AnimatePresence } from 'framer-motion';

interface FloAvatarProps {
    hp: number;
    className?: string;
}

// 5 HP states with matching generated artwork
const AVATAR_LEVELS = [
    {
        minHp: 0,
        maxHp: 20,
        img: '/avatars/avatar_lvl1.png',
        label: 'FLO DEGRAO',
        sublabel: 'NIVEL: MCDONALDS',
        bg: '#ef4444',
        textColor: '#fff',
        filter: 'grayscale(60%) contrast(1.4)',
        glow: 'drop-shadow(0 0 16px rgba(239,68,68,0.7))',
    },
    {
        minHp: 21,
        maxHp: 40,
        img: '/avatars/avatar_lvl2.png',
        label: 'FLO HUSTLIN',
        sublabel: 'NIVEL: CALLE',
        bg: '#f97316',
        textColor: '#fff',
        filter: 'grayscale(20%) contrast(1.1)',
        glow: 'drop-shadow(0 0 8px rgba(249,115,22,0.4))',
    },
    {
        minHp: 41,
        maxHp: 60,
        img: '/avatars/avatar_lvl3.png',
        label: 'FLO OPERATIVO',
        sublabel: 'NIVEL: STREET KING',
        bg: '#1a1a1a',
        textColor: '#fff',
        filter: 'none',
        glow: 'drop-shadow(0 0 8px rgba(250,204,21,0.3))',
    },
    {
        minHp: 61,
        maxHp: 85,
        img: '/avatars/avatar_lvl4.png',
        label: 'FLO BLAZER',
        sublabel: 'NIVEL: ARQUITECTO',
        bg: '#1d4ed8',
        textColor: '#fff',
        filter: 'none',
        glow: 'drop-shadow(0 0 14px rgba(250,204,21,0.5))',
    },
    {
        minHp: 86,
        maxHp: 100,
        img: '/avatars/avatar_lvl5.png',
        label: 'FLO ELITE',
        sublabel: 'NIVEL: SOBERANO',
        bg: '#FFD700',
        textColor: '#000',
        filter: 'none',
        glow: 'drop-shadow(0 0 20px rgba(255,215,0,0.8))',
    },
];

export const FloAvatar = ({ hp, className = '' }: FloAvatarProps) => {
    const level = AVATAR_LEVELS.find(l => hp >= l.minHp && hp <= l.maxHp) || AVATAR_LEVELS[4];

    const isVoid = hp <= 20;
    const isElite = hp >= 86;

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Status Badge */}
            <motion.div
                animate={isVoid ? { rotate: [-2, 2, -1, 3, 0] } : { rotate: 0 }}
                transition={{ repeat: Infinity, duration: 0.25, repeatType: 'mirror' }}
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1 mb-2 border-2 border-black"
                style={{ backgroundColor: level.bg, color: level.textColor, fontFamily: "'Space Mono', monospace" }}
            >
                {level.label}
            </motion.div>

            {/* Avatar Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden border-4 border-black" style={{ background: '#f4f1eb' }}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={level.img}
                        src={level.img}
                        alt={level.label}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-contain object-bottom"
                        style={{
                            filter: `${level.glow} ${level.filter}`,
                        }}
                    />
                </AnimatePresence>

                {/* Void overlay when HP critical */}
                {isVoid && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        style={{
                            background: 'repeating-linear-gradient(0deg, rgba(239,68,68,0.08) 0px, transparent 2px, transparent 4px)',
                        }}
                    />
                )}

                {/* Elite gold shimmer */}
                {isElite && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0, 0.15, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, transparent 70%)' }}
                    />
                )}

                {/* HP bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
                    <motion.div
                        className="h-full"
                        animate={{ width: `${hp}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                            backgroundColor: hp > 60 ? '#22c55e' : hp > 30 ? '#f59e0b' : '#ef4444',
                        }}
                    />
                </div>
            </div>

            {/* Sub-label */}
            <div className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-60"
                style={{ fontFamily: "'Space Mono', monospace" }}>
                {level.sublabel} // HP:{hp}%
            </div>
        </div>
    );
};
