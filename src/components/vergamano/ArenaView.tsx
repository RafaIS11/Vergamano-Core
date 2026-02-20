
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BasquiatCrown, ChaoticScribble } from './ScribbleElements';

const ArenaView: React.FC = () => {
    const { profile, missions, completeMission } = useGame();
    const [evidenceTask, setEvidenceTask] = useState<string | null>(null);
    const [evidenceLink, setEvidenceLink] = useState('');

    if (!profile) return <div className="p-20 text-4xl font-black animate-pulse">CARGANDO_BIO_STATUS...</div>;

    const isLowHP = profile.hp < 30;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">

            {/* SECCIÓN DEL AVATAR: EL LIENZO */}
            <section className="vergamano-border-thick bg-white p-12 relative vergamano-shadow-large overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <ChaoticScribble />
                </div>

                {/* Avatar Bio-Reactivo */}
                <div className={`relative w-80 h-80 vergamano-border transition-all duration-700 bg-gray-200
                  ${isLowHP ? 'filter-homeless grayscale contrast-150' : 'vergamano-shadow'}`}>

                    {/* Representación del Avatar (Estética Moreno/Streetwear) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                        {/* Gafas y Estilo */}
                        <div className="w-full h-full relative overflow-hidden">
                            <div className="absolute top-1/4 left-1/4 right-1/4 h-12 bg-black z-20" /> {/* Gafas */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-zinc-700" /> {/* Streetwear */}
                        </div>
                    </div>

                    {/* Capas de "Failure" para HP Bajo */}
                    {isLowHP && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-600/30 mix-blend-multiply border-8 border-red-600">
                            <span className="text-white font-black text-6xl -rotate-12 border-4 border-white p-2">FAILURE</span>
                        </div>
                    )}

                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-24">
                        <BasquiatCrown />
                    </div>
                </div>

                <div className="mt-12 text-center relative z-10 bg-white p-4 vergamano-border vergamano-shadow">
                    <h2 className="text-5xl font-black italic tracking-tighter">RAFAEL_IBARRA</h2>
                    <div className="flex gap-4 justify-center mt-4">
                        <span className="bg-black text-white px-6 py-2 font-bold text-xl uppercase italic">HP: {profile.hp}</span>
                        <span className="bg-white text-black vergamano-border px-6 py-2 font-bold text-xl">CRED: {profile.credits} CR</span>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE MISIONES: EL BUCLE DE ACCIÓN */}
            <section className="flex flex-col gap-8">
                <h2 className="text-5xl font-black italic uppercase border-b-8 border-black pb-4">BUCLE_DIARIO</h2>

                <div className="flex flex-col gap-6 max-h-[700px] overflow-y-auto pr-4">
                    {missions.map(mission => (
                        <div
                            key={mission.id}
                            className={`vergamano-border p-6 bg-white vergamano-shadow transition-all relative
                                ${mission.status === 'auditing' ? 'border-dashed opacity-70' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">{mission.pilar} // RECOMPENSA: +{mission.xp_reward} XP</span>
                                    <h3 className="text-2xl font-black leading-tight mt-1">{mission.title}</h3>
                                </div>
                                <div className={`w-12 h-12 vergamano-border flex items-center justify-center font-black text-2xl
                                    ${mission.status === 'completed' ? 'bg-green-500' : 'bg-white'}`}>
                                    {mission.status === 'completed' ? '✓' : '?'}
                                </div>
                            </div>

                            {/* Botonera Dinámica */}
                            <div className="mt-6">
                                {mission.status === 'pending' && (
                                    <button
                                        className="btn-basquiat w-full bg-black text-white py-4"
                                        onClick={() => {/* Llama a startTask en el contexto */ }}
                                    >
                                        INICIAR OPERACIÓN
                                    </button>
                                )}

                                {mission.status === 'active' && (
                                    <button
                                        className="btn-basquiat w-full bg-[#FFD700] text-black py-4"
                                        onClick={() => setEvidenceTask(mission.id)}
                                    >
                                        REPORTAR EVIDENCIA
                                    </button>
                                )}

                                {mission.status === 'auditing' && (
                                    <div className="vergamano-border p-4 text-center bg-gray-100 font-black italic animate-pulse">
                                        EN AUDITORÍA... (MOLTBOT ANALIZANDO)
                                    </div>
                                )}

                                {mission.status === 'completed' && (
                                    <div className="vergamano-border p-4 text-center bg-black text-white font-black italic">
                                        MISIÓN CUMPLIDA
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal de Evidencia (Estética Basquiat) */}
            {evidenceTask && (
                <div className="fixed inset-0 z-[200] bg-white/90 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="vergamano-border-thick bg-[#F9F9F7] p-12 max-w-2xl w-full vergamano-shadow-large relative">
                        <button
                            className="absolute top-4 right-4 text-4xl font-black"
                            onClick={() => setEvidenceTask(null)}
                        >X</button>
                        <h2 className="text-4xl font-black mb-6 uppercase">ENTREGAR_PRUEBA</h2>
                        <p className="font-bold mb-8">Pega el link de la prueba (GitHub / Video / Captura) para que Moltbot la audite.</p>
                        <input
                            type="text"
                            className="w-full vergamano-border p-6 text-2xl font-bold bg-white mb-8"
                            placeholder="https://..."
                            value={evidenceLink}
                            onChange={(e) => setEvidenceLink(e.target.value)}
                        />
                        <button
                            className="btn-basquiat w-full bg-black text-white py-6 text-2xl"
                            onClick={() => {
                                const mission = missions.find(m => m.id === evidenceTask);
                                if (mission) {
                                    completeMission(evidenceTask, mission.xp_reward || 0, mission.pilar || 'xp_ghost');
                                } else {
                                    completeMission(evidenceTask, 0, 'xp_ghost'); // Fallback
                                }
                                setEvidenceTask(null);
                                setEvidenceLink('');
                            }}
                        >
                            ENVIAR A AUDITORÍA
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArenaView;
