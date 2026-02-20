
import React from 'react';
import { useGame } from '../../context/GameContext';
import { ChaoticScribble } from './ScribbleElements';
import { FloAvatar } from './FloAvatar';
import { TaskCard } from './TaskCard';

const ArenaView: React.FC = () => {
    const { profile, missions, activePillar } = useGame();

    if (!profile) return <div className="p-20 text-4xl font-black animate-pulse">CARGANDO_BIO_STATUS...</div>;

    // Filter missions if a pillar is selected
    const filteredMissions = activePillar
        ? missions.filter(m => m.pilar === activePillar)
        : missions;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">

            {/* SECCIÓN DEL AVATAR: EL LIENZO */}
            <section className="lg:col-span-4 vergamano-border-thick bg-white p-12 relative vergamano-shadow-large overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <ChaoticScribble className="opacity-20" />
                </div>

                {/* Avatar Bio-Reactivo de Cabeza (FloAvatar) */}
                <div className="relative w-full aspect-square flex items-center justify-center mb-10">
                    <FloAvatar hp={profile.hp} className="w-64 h-64" />
                </div>

                <div className="text-center relative z-10 bg-white p-4 vergamano-border vergamano-shadow w-full">
                    <h2 className="text-3xl font-black italic tracking-tighter">RAFAEL_IBARRA</h2>
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="bg-black text-white px-4 py-1 font-bold text-lg uppercase italic">HP: {profile.hp}%</div>
                        <div className="bg-white text-black vergamano-border px-4 py-1 font-bold text-lg">CRED: {profile.credits} CR</div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE MISIONES: EL BUCLE DE ACCIÓN */}
            <section className="lg:col-span-8 flex flex-col gap-8">
                <div className="flex justify-between items-end border-b-8 border-black pb-4">
                    <h2 className="text-5xl font-black italic uppercase">LA_ARENA</h2>
                    {activePillar && (
                        <span className="bg-red-600 text-white px-4 py-1 font-black text-sm rotate-2">SECTOR_{activePillar.toUpperCase()}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 max-h-[1000px] overflow-y-auto pr-4 scrollbar-hide">
                    {filteredMissions.length > 0 ? (
                        filteredMissions.map(mission => (
                            <TaskCard key={mission.id} mission={mission} />
                        ))
                    ) : (
                        <div className="p-32 border-8 border-dashed border-gray-100 text-center text-4xl font-black opacity-20">
                            SIN_ACTIVIDAD_DETECTADA
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ArenaView;
