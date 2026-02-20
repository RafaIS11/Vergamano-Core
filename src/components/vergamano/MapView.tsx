
import React from 'react';
import { useGame } from '../../context/GameContext';

const CITIES = [
    { name: 'CARACAS', xp_needed: 0, status: 'Conquistada' },
    { name: 'MADRID', xp_needed: 500, status: 'Objetivo Actual' },
    { name: 'BRUSELAS', xp_needed: 2000, status: 'Bloqueada' },
    { name: 'BERLÍN', xp_needed: 5000, status: 'Bloqueada' },
    { name: 'TOKIO', xp_needed: 10000, status: 'Bloqueada' },
    { name: 'NUEVA YORK', xp_needed: 20000, status: 'Bloqueada' },
    { name: 'LONDRES', xp_needed: 35000, status: 'Bloqueada' },
    { name: 'PARÍS', xp_needed: 50000, status: 'Bloqueada' },
    { name: 'DUBÁI', xp_needed: 75000, status: 'Bloqueada' },
    { name: 'SINGAPUR', xp_needed: 100000, status: 'Bloqueada' }
];

const MapView: React.FC = () => {
    const { profile } = useGame();
    const currentXP = profile?.xp_nomad || 0;

    return (
        <div className="py-20 flex flex-col items-center relative">
            <h2 className="text-7xl font-black italic mb-20 border-b-8 border-black w-full text-center pb-8">
                MAPA_DE_CONQUISTA
            </h2>

            {/* Línea Central Brutalista */}
            <div className="absolute top-48 bottom-0 w-2 bg-black left-1/2 -translate-x-1/2 z-0" />

            <div className="flex flex-col gap-32 relative z-10 w-full max-w-4xl">
                {CITIES.map((city, index) => {
                    const isLocked = currentXP < city.xp_needed;
                    const isCompleted = index === 0; // Solo para demostración

                    return (
                        <div key={city.name} className={`flex items-center gap-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

                            <div className="flex-1 flex flex-col items-center">
                                <div className={`vergamano-border-thick p-8 bg-white vergamano-shadow-large relative w-full
                                  ${isLocked ? 'opacity-50' : ''}`}>

                                    <h3 className="text-4xl font-black italic">{city.name}</h3>
                                    <span className="font-bold text-sm block mt-2 opacity-60">REQUISITO: {city.xp_needed} XP_NOMAD</span>

                                    {/* Efecto de Spray Negro para ciudades bloqueadas */}
                                    {isLocked && (
                                        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
                                            <svg viewBox="0 0 200 100" className="w-full h-full opacity-90">
                                                <path
                                                    d="M10,50 Q40,10 80,60 T150,40 T190,80"
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="25"
                                                    strokeLinecap="round"
                                                    strokeDasharray="1, 30"
                                                    className="animate-pulse"
                                                />
                                                <path
                                                    d="M20,20 L180,80 M180,20 L20,80"
                                                    fill="none"
                                                    stroke="black"
                                                    strokeWidth="15"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {isCompleted && (
                                        <div className="absolute -top-6 -right-6 bg-black text-white p-4 vergamano-border rotate-12 font-black">
                                            CONQUISTADA
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nodo de Conexión */}
                            <div className="relative">
                                <div className={`w-12 h-12 vergamano-border-thick rounded-none rotate-45 z-10 
                                  ${isLocked ? 'bg-white' : 'bg-black'}`}
                                />
                            </div>

                            <div className="flex-1" />
                        </div>
                    );
                })}
            </div>

            <div className="mt-40 opacity-30 flex gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-2 h-16 bg-black" />
                ))}
            </div>
        </div>
    );
};

export default MapView;
