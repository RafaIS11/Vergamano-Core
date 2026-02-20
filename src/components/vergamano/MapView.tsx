import React from 'react';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';

// THE CANONICAL 10-CITY CONQUEST PATH - DO NOT CHANGE
const CITIES = [
    { name: 'CARACAS', flag: '🇻🇪', xp_needed: 0, color: '#22c55e', country: 'Venezuela' },
    { name: 'MADRID', flag: '🇪🇸', xp_needed: 1000, color: '#ef4444', country: 'España' },
    { name: 'BRUSELAS', flag: '🇧🇪', xp_needed: 2500, color: '#f59e0b', country: 'Bélgica' },
    { name: 'COPENHAGUE', flag: '🇩🇰', xp_needed: 5000, color: '#3b82f6', country: 'Dinamarca' },
    { name: 'BERLÍN', flag: '🇩🇪', xp_needed: 8000, color: '#1a1a1a', country: 'Alemania' },
    { name: 'SAN FRANCISCO', flag: '🇺🇸', xp_needed: 12000, color: '#8b5cf6', country: 'USA' },
    { name: 'BALI', flag: '🇮🇩', xp_needed: 17000, color: '#14b8a6', country: 'Indonesia' },
    { name: 'OSLO', flag: '🇳🇴', xp_needed: 23000, color: '#0ea5e9', country: 'Noruega' },
    { name: 'LONDRES', flag: '🇬🇧', xp_needed: 30000, color: '#6366f1', country: 'UK' },
    { name: 'NUEVA YORK', flag: '🇺🇸', xp_needed: 40000, color: '#FFD700', country: 'USA' },
];

const MapView: React.FC = () => {
    const { profile } = useGame();

    // Use TOTAL XP across all pillars for map progression
    const totalXP = profile
        ? (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
        (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0)
        : 0;

    const currentCityIndex = CITIES.reduce((acc, city, i) => totalXP >= city.xp_needed ? i : acc, 0);
    const nextCity = CITIES[currentCityIndex + 1];
    const progressToNext = nextCity
        ? Math.min(100, ((totalXP - CITIES[currentCityIndex].xp_needed) / (nextCity.xp_needed - CITIES[currentCityIndex].xp_needed)) * 100)
        : 100;

    return (
        <div className="py-12">
            {/* Header */}
            <div className="border-b-8 border-black pb-6 mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-6xl font-black italic uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                        MAPA_CONQUISTA
                    </h2>
                    <p className="text-sm font-black opacity-40 uppercase tracking-widest mt-2">
                        XP TOTAL: {totalXP.toLocaleString()} // CIUDAD ACTUAL: {CITIES[currentCityIndex].name}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-6xl">{CITIES[currentCityIndex].flag}</div>
                    <div className="text-xs font-black uppercase opacity-60 mt-1">{CITIES[currentCityIndex].country}</div>
                </div>
            </div>

            {/* Progress to next city */}
            {nextCity && (
                <div className="mb-12 p-6 border-4 border-black bg-white" style={{ boxShadow: '6px 6px 0 black' }}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-black text-sm uppercase">
                            PRÓXIMO OBJETIVO: {nextCity.flag} {nextCity.name}
                        </span>
                        <span className="font-black text-sm">{totalXP.toLocaleString()} / {nextCity.xp_needed.toLocaleString()} XP</span>
                    </div>
                    <div className="h-6 border-4 border-black bg-gray-100 relative">
                        <motion.div
                            className="h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            style={{ backgroundColor: nextCity.color }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xs">
                            {Math.round(progressToNext)}% COMPLETADO
                        </div>
                    </div>
                    <div className="text-xs font-bold opacity-50 mt-2 uppercase">
                        Faltan {(nextCity.xp_needed - totalXP).toLocaleString()} XP para conquistar {nextCity.name}
                    </div>
                </div>
            )}

            {/* City Path */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-black z-0" />

                <div className="flex flex-col gap-0 relative z-10">
                    {CITIES.map((city, index) => {
                        const isConquered = totalXP >= city.xp_needed;
                        const isCurrent = index === currentCityIndex;
                        const isLocked = !isConquered && !isCurrent;
                        const isLeft = index % 2 === 0;

                        return (
                            <div key={city.name} className="flex items-center min-h-[120px]">
                                {/* Left side content */}
                                <div className={`flex-1 flex ${isLeft ? 'justify-end pr-8' : 'justify-start pl-8'} ${!isLeft ? 'order-last' : ''}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative max-w-[260px] w-full"
                                    >
                                        <div
                                            className="border-4 border-black p-4 relative"
                                            style={{
                                                backgroundColor: isConquered ? city.color : isCurrent ? '#fff' : '#f4f4f4',
                                                boxShadow: isCurrent ? '6px 6px 0 black' : '3px 3px 0 black',
                                                opacity: isLocked ? 0.5 : 1,
                                            }}
                                        >
                                            {/* Flag + Name */}
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-4xl">{city.flag}</span>
                                                <div>
                                                    <div
                                                        className="font-black text-xl uppercase leading-none"
                                                        style={{
                                                            fontFamily: "'Space Mono', monospace",
                                                            color: isConquered && city.color !== '#FFD700' ? '#fff' : '#000',
                                                        }}
                                                    >
                                                        {city.name}
                                                    </div>
                                                    <div
                                                        className="text-[10px] font-bold uppercase opacity-70"
                                                        style={{ color: isConquered && city.color !== '#FFD700' ? '#fff' : '#000' }}
                                                    >
                                                        {city.country}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* XP Requirement */}
                                            <div
                                                className="text-[10px] font-black uppercase"
                                                style={{ color: isConquered && city.color !== '#FFD700' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}
                                            >
                                                {city.xp_needed === 0 ? 'BASE XP' : `${city.xp_needed.toLocaleString()} XP`}
                                            </div>

                                            {/* Status badge */}
                                            {isConquered && (
                                                <div className="absolute -top-3 -right-3 bg-black text-white text-[8px] font-black px-2 py-1 uppercase rotate-2">
                                                    ✓ CONQUISTADA
                                                </div>
                                            )}
                                            {isCurrent && !isConquered && (
                                                <motion.div
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="absolute -top-3 -right-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase"
                                                >
                                                    ◉ OBJETIVO
                                                </motion.div>
                                            )}
                                            {isLocked && (
                                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center border-4 border-black/20">
                                                    <div className="text-2xl font-black rotate-[-5deg] opacity-30">🔒</div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Center node */}
                                <div className="flex-shrink-0 z-20">
                                    <motion.div
                                        animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-10 h-10 border-4 border-black flex items-center justify-center font-black text-sm"
                                        style={{
                                            backgroundColor: isConquered ? city.color : '#fff',
                                            transform: 'rotate(45deg)',
                                        }}
                                    >
                                        <span style={{ transform: 'rotate(-45deg)' }}>
                                            {isConquered ? '✓' : index + 1}
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Spacer for opposite side */}
                                <div className="flex-1" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MapView;
