
// Flo Escape Avatar - Changes state based on player HP
// Elite (80+ HP) → Operative (50+) → Tired (30+) → Degraded (<30)

interface FloAvatarProps {
    hp: number;
    className?: string;
}

export function FloAvatar({ hp, className = '' }: FloAvatarProps) {
    // Determine state
    const isElite = hp >= 80;
    const isOperative = hp >= 50 && hp < 80;
    const isTired = hp >= 30 && hp < 50;
    // isDegraded = hp < 30

    // Skin tone
    const skinColor = '#8B5E3C';
    const skinDark = '#6B4423';

    // Glasses color changes with state
    const glassesColor = isElite ? '#FFD700' : isOperative ? '#000' : isTired ? '#666' : '#444';
    // Outfit color
    const shirtColor = isElite ? '#FFF' : isOperative ? '#1a1a1a' : isTired ? '#555' : '#333';
    // Hair: afro when degraded
    const showAfro = !isElite && !isOperative && !isTired;
    const hairColor = '#1a0a00';
    // Cigar: only elite
    const showCigar = isElite;
    // Glow: elite
    const showGlow = isElite;

    return (
        <div className={`relative inline-flex flex-col items-center ${className}`}>
            {/* State label */}
            <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mb-1 border-2 border-black
                ${isElite ? 'bg-yellow-400' : isOperative ? 'bg-green-500 text-white' : isTired ? 'bg-orange-400' : 'bg-red-600 text-white'}`}>
                {isElite ? 'FLO ELITE' : isOperative ? 'OPERATIVO' : isTired ? 'CANSADO' : 'DEGRAO'}
            </div>

            {/* Avatar SVG */}
            <svg viewBox="0 0 120 160" width="100%" height="100%"
                style={{ filter: isElite ? 'drop-shadow(0 0 12px rgba(255,215,0,0.6))' : 'none' }}
                xmlns="http://www.w3.org/2000/svg">

                {/* Glow effect for elite */}
                {showGlow && (
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.3" />
                )}

                {/* BODY / SHIRT */}
                <path d="M30 100 Q30 90 60 88 Q90 90 90 100 L95 155 H25 Z"
                    fill={shirtColor} stroke="#000" strokeWidth="3" />

                {/* Collar */}
                <path d="M48 100 L60 112 L72 100" fill="none" stroke="#000" strokeWidth="2" />

                {/* NECK */}
                <rect x="51" y="82" width="18" height="20" rx="4"
                    fill={skinColor} stroke="#000" strokeWidth="2" />

                {/* HEAD */}
                <ellipse cx="60" cy="62" rx="28" ry="30"
                    fill={skinColor} stroke="#000" strokeWidth="3" />

                {/* HAIR / AFRO */}
                {showAfro ? (
                    // Big messy afro for degraded state
                    <>
                        <ellipse cx="60" cy="38" rx="36" ry="26" fill={hairColor} stroke="#000" strokeWidth="2" />
                        <circle cx="30" cy="45" r="12" fill={hairColor} stroke="#000" strokeWidth="2" />
                        <circle cx="90" cy="45" r="12" fill={hairColor} stroke="#000" strokeWidth="2" />
                        <circle cx="45" cy="32" r="10" fill={hairColor} stroke="#000" strokeWidth="2" />
                        <circle cx="75" cy="32" r="10" fill={hairColor} stroke="#000" strokeWidth="2" />
                    </>
                ) : (
                    // Clean taper/fade for better states
                    <ellipse cx="60" cy="40" rx="26" ry="16" fill={hairColor} stroke="#000" strokeWidth="2" />
                )}

                {/* FACE details */}
                {/* Nose */}
                <path d="M57 65 Q60 72 63 65" fill="none" stroke={skinDark} strokeWidth="2" />

                {/* Mouth */}
                {isElite ? (
                    // Smile with confidence
                    <path d="M50 76 Q60 82 70 76" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                ) : isTired || showAfro ? (
                    // Flat or frown
                    <path d="M52 78 Q60 75 68 78" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                ) : (
                    // Neutral
                    <line x1="52" y1="76" x2="68" y2="76" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                )}

                {/* SUNGLASSES */}
                <rect x="40" y="58" width="15" height="10" rx="3"
                    fill={glassesColor} stroke="#000" strokeWidth="2" opacity={showAfro ? '0.5' : '1'} />
                <rect x="65" y="58" width="15" height="10" rx="3"
                    fill={glassesColor} stroke="#000" strokeWidth="2" opacity={showAfro ? '0.5' : '1'} />
                <line x1="55" y1="62" x2="65" y2="62" stroke="#000" strokeWidth="2" />
                {/* Arms of glasses */}
                <line x1="32" y1="62" x2="40" y2="62" stroke="#000" strokeWidth="2" />
                <line x1="80" y1="62" x2="88" y2="62" stroke="#000" strokeWidth="2" />

                {/* EARS */}
                <ellipse cx="32" cy="65" rx="5" ry="7" fill={skinColor} stroke="#000" strokeWidth="2" />
                <ellipse cx="88" cy="65" rx="5" ry="7" fill={skinColor} stroke="#000" strokeWidth="2" />

                {/* CIGAR for elite */}
                {showCigar && (
                    <g>
                        <rect x="69" y="74" width="20" height="4" rx="2"
                            fill="#F5DEB3" stroke="#000" strokeWidth="1.5" />
                        <rect x="86" y="73" width="4" height="6" rx="1"
                            fill="#ff6b35" stroke="#000" strokeWidth="1" />
                        {/* Smoke */}
                        <path d="M90 68 Q93 63 90 58 Q87 53 90 48" fill="none"
                            stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                    </g>
                )}

                {/* ARMS */}
                <path d="M30 100 Q20 115 25 135" fill="none" stroke={shirtColor} strokeWidth="10"
                    strokeLinecap="round" />
                <circle cx="25" cy="138" r="7" fill={skinColor} stroke="#000" strokeWidth="2" />

                <path d="M90 100 Q100 115 95 135" fill="none" stroke={shirtColor} strokeWidth="10"
                    strokeLinecap="round" />
                <circle cx="95" cy="138" r="7" fill={skinColor} stroke="#000" strokeWidth="2" />

                {/* Star for elite */}
                {isElite && (
                    <text x="50" y="120" fontSize="14" textAnchor="middle" fill="#FFD700" stroke="#000" strokeWidth="0.5">★</text>
                )}
            </svg>
        </div>
    );
}
