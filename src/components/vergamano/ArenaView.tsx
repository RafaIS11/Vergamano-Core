
import React from 'react';
import { useGame } from '../../context/GameContext';
import { DistortedCard } from './DistortedCard';
import { BasquiatCrown, ChaoticScribble, InkSplatterSVG } from './ScribbleElements';

const ArenaView: React.FC = () => {
    const { profile, missions, completeMission } = useGame();

    if (!profile) return <div className="p-20 text-4xl font-black animate-pulse">CARGANDO_ENLACE_BIO...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 relative overflow-hidden">
            {/* Bio-Reactive Avatar Section */}
            <section className="flex flex-col items-center justify-center min-h-[500px] border-[12px] border-black p-12 relative bg-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <ChaoticScribble />
                </div>

                {/* The Avatar */}
                <div className={`relative w-64 h-64 border-[8px] border-black transition-all duration-500 
          ${profile.hp < 30 ? 'grayscale blur-sm' : ''} 
          ${profile.hp > 80 ? 'shadow-[0_0_50px_rgba(255,26,26,0.5)]' : ''}`}>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20">
                        <BasquiatCrown />
                    </div>
                    {/* Avatar visual representation - simple for now */}
                    <div className="w-full h-full bg-black flex items-center justify-center text-white text-8xl font-black">
                        {profile.hp < 30 ? '?' : 'Σ'}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h2 className="text-6xl font-black tracking-tighter uppercase mb-2">OPERADOR_SIGMA</h2>
                    <div className="flex gap-4 justify-center">
                        <span className="bg-black text-white px-4 py-1 font-courier font-bold">HP: {profile.hp}</span>
                        <span className="bg-[#FF1A1A] text-white px-4 py-1 font-courier font-bold">LVL: {Math.floor((profile.xp_architect + profile.xp_spartan + profile.xp_mercenary + profile.xp_nomad + profile.xp_ghost) / 1000)}</span>
                    </div>
                </div>
            </section>

            {/* Daily Loop / Mission Log */}
            <section className="flex flex-col gap-6">
                <h2 className="text-4xl font-black uppercase border-b-[8px] border-black pb-2">BUCLE_DIARIO</h2>

                {missions.length === 0 ? (
                    <div className="p-8 border-[4px] border-black border-dashed opacity-50 text-xl font-bold">
                        [DÍA ABSOLUTO - SIN MISIONES PENDIENTES]
                    </div>
                ) : (
                    missions.map(mission => (
                        <DistortedCard
                            key={mission.id}
                            title={mission.title}
                            className={`hover:scale-[1.02] transform transition-all cursor-pointer ${mission.status === 'pending_audit' ? 'border-[#FFD700] ring-4 ring-[#FFD700] ring-opacity-50' : ''}`}
                        >
                            <div className="flex justify-between items-end mt-4">
                                <div className="flex flex-col">
                                    <span className="font-courier text-xs opacity-60 uppercase">RECOMPENSA: +{mission.xp_reward} XP {mission.category}</span>
                                    {mission.status === 'pending_audit' && (
                                        <span className="text-sm font-bold text-[#D4AF37] animate-pulse mt-2">AUDITANDO_EVIDENCIA...</span>
                                    )}
                                </div>
                                {mission.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            const proof = window.prompt("PEGA EL LINK DE EVIDENCIA (GITHUB / FOTO):");
                                            if (proof) completeMission(mission.id, proof);
                                        }}
                                        className="bg-black text-white px-6 py-2 font-bold hover:bg-[#FF1A1A] transition-colors"
                                    >
                                        COMPLETAR
                                    </button>
                                )}
                            </div>
                        </DistortedCard>
                    ))
                )}

                <div className="mt-auto opacity-40">
                    <InkSplatterSVG />
                </div>
            </section>
        </div>
    );
};

export default ArenaView;
