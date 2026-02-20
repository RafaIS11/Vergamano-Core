
import { motion } from 'framer-motion';

// Flo Escape Avatar v4.0 - Generative Sketch Engine
// The avatar physically degrades, strokes become unstable, and glitch filters activate as HP drops.

interface FloAvatarProps {
    hp: number;
    className?: string;
}

export function FloAvatar({ hp, className = '' }: FloAvatarProps) {
    // Determine dynamic states
    const isElite = hp >= 80;
    const isDegraded = hp < 30;

    // Intensity of corruption inversely proportional to HP
    const corruption = Math.max(0, 100 - hp) / 100; // 0 (healthy) -> 1 (glitched out)
    const strokeWarp = 2 + (corruption * 4); // Stroke becomes thicker/messier as HP drops
    const glitchIntensity = isDegraded ? corruption * 20 : 0;

    // Colors
    const skinColor = '#8B5E3C';
    const skinDark = '#6B4423';
    const glassesColor = isElite ? '#FFD700' : '#111';
    const shirtColor = isElite ? '#FFF' : '#222';
    const hairColor = '#1a0a00';

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            {/* V4 Brutalist Label */}
            <motion.div
                animate={{ rotate: isDegraded ? [-2, 2, -1, 3, 0] : 0 }}
                transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mb-1 border-2 border-black
                ${isElite ? 'bg-yellow-400 text-black' : isDegraded ? 'bg-red-600 text-white' : 'bg-black text-white'}`}
                style={{ fontFamily: "'Space Mono', monospace" }}
            >
                {isElite ? 'FLO ELITE' : isDegraded ? 'FLO DEGRAO' : 'FLO OPERATIVO'}
            </motion.div>

            {/* Generative SVG Canvas */}
            <svg viewBox="0 0 120 160" width="100%" height="100%"
                style={{
                    filter: isElite ? 'drop-shadow(0 0 12px rgba(255,215,0,0.6))'
                        : isDegraded ? `url(#avatar-glitch)` : 'none'
                }}
                xmlns="http://www.w3.org/2000/svg">

                {/* Generative Glitch Filter (Only active when degraded) */}
                {isDegraded && (
                    <filter id="avatar-glitch">
                        <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={glitchIntensity} />
                    </filter>
                )}

                {/* BODY / SHIRT */}
                <motion.path
                    d="M30 100 Q30 90 60 88 Q90 90 90 100 L95 155 H25 Z"
                    fill={shirtColor}
                    stroke="#000"
                    strokeWidth={strokeWarp}
                    strokeLinejoin="round"
                    animate={isDegraded ? { d: ["M28 102 Q35 85 60 87 Q85 85 92 102 L98 155 H22 Z", "M30 100 Q30 90 60 88 Q90 90 90 100 L95 155 H25 Z"] } : {}}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                />

                {/* Collar */}
                <motion.path
                    d="M48 100 L60 112 L72 100"
                    fill="none"
                    stroke="#000"
                    strokeWidth={strokeWarp * 0.8}
                />

                {/* NECK */}
                <rect x="51" y="82" width="18" height="20" rx="4"
                    fill={skinColor} stroke="#000" strokeWidth={strokeWarp * 0.8} />

                {/* HEAD */}
                <motion.ellipse
                    cx="60" cy="62" rx="28" ry="30"
                    fill={skinColor}
                    stroke="#000"
                    strokeWidth={strokeWarp}
                />

                {/* HAIR: Reverts to messy afro dynamically in the void */}
                {isDegraded ? (
                    <motion.g animate={{ x: [-1, 1, -1], y: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 0.1 }}>
                        <ellipse cx="60" cy="38" rx="36" ry="26" fill={hairColor} stroke="#000" strokeWidth={strokeWarp} />
                        <circle cx="30" cy="45" r="14" fill={hairColor} stroke="#000" strokeWidth={strokeWarp} />
                        <circle cx="90" cy="45" r="14" fill={hairColor} stroke="#000" strokeWidth={strokeWarp} />
                    </motion.g>
                ) : (
                    <ellipse cx="60" cy="40" rx="26" ry="16" fill={hairColor} stroke="#000" strokeWidth={strokeWarp} />
                )}

                {/* NOSE */}
                <path d="M57 65 Q60 72 63 65" fill="none" stroke={skinDark} strokeWidth={strokeWarp * 0.8} />

                {/* MOUTH - Driven by HP */}
                <motion.path
                    d={isElite ? "M50 76 Q60 82 70 76" : isDegraded ? "M52 78 Q60 72 68 78" : "M52 76 L68 76"}
                    fill="none"
                    stroke="#000"
                    strokeWidth={strokeWarp * 0.8}
                    strokeLinecap="round"
                />

                {/* SUNGLASSES - Scribble effect */}
                <motion.g stroke="#000" strokeWidth={strokeWarp} opacity={isDegraded ? 0.4 : 1}>
                    <rect x="40" y="58" width="15" height="10" rx="2" fill={glassesColor} />
                    <rect x="65" y="58" width="15" height="10" rx="2" fill={glassesColor} />
                    <line x1="55" y1="62" x2="65" y2="62" />
                    <line x1="32" y1="62" x2="40" y2="62" />
                    <line x1="80" y1="62" x2="88" y2="62" />
                </motion.g>

                {/* EARS */}
                <ellipse cx="32" cy="65" rx="5" ry="7" fill={skinColor} stroke="#000" strokeWidth={strokeWarp * 0.8} />
                <ellipse cx="88" cy="65" rx="5" ry="7" fill={skinColor} stroke="#000" strokeWidth={strokeWarp * 0.8} />

                {/* CIGAR - Elite Only */}
                {isElite && (
                    <g>
                        <rect x="69" y="74" width="20" height="4" rx="2"
                            fill="#F5DEB3" stroke="#000" strokeWidth={strokeWarp * 0.5} />
                        <rect x="86" y="73" width="4" height="6" rx="1"
                            fill="#ff6b35" stroke="#000" strokeWidth={strokeWarp * 0.3} />
                        <motion.path
                            d="M90 68 Q93 63 90 58 Q87 53 90 48"
                            fill="none"
                            stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </g>
                )}

                {/* ARMS */}
                <path d="M30 100 Q20 115 25 135" fill="none" stroke={shirtColor} strokeWidth={10 + strokeWarp} strokeLinecap="round" />
                <path d="M90 100 Q100 115 95 135" fill="none" stroke={shirtColor} strokeWidth={10 + strokeWarp} strokeLinecap="round" />

            </svg>
        </div>
    );
}
