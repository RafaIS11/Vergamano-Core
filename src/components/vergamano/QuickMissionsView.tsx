
import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ChaoticScribble, ScratchMarks } from './ScribbleElements';

const QuickMissionsView: React.FC = () => {
    const { sendMessage, chatMessages, setActiveModule } = useGame();
    const [pilar, setPilar] = useState('architect');
    const [proyecto, setProyecto] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Filtrar el último mensaje de Moltbot que contenga la lista de tareas
    const lastMoltbotMsg = [...chatMessages].reverse().find(m => m.sender === 'moltbot');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proyecto || !prompt) return;

        setIsGenerating(true);
        const fullPrompt = `GENERAR MICRO-TAREAS PARA PILLAR: ${pilar.toUpperCase()}. 
        PROYECTO: ${proyecto.toUpperCase()}. 
        OBJETIVO: ${prompt}. 
        REQUISITO: Desglosa esto en MÍNIMO 10 micro-tareas de MÁXIMO 15 minutos cada una. 
        Formato: Lista numerada, pasos ultra-atómicos (ej: "Pillar lápiz", "Pillar papel").`;

        await sendMessage(fullPrompt);
        setIsGenerating(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 border-b-8 border-black pb-4 mb-10">
                <div className="text-6xl">⚡</div>
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase">QUICK_TASKS</h1>
                    <p className="text-xl font-bold opacity-50">BY MOLTBOT INTELLIGENCE</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* FORMULARIO */}
                <section className="vergamano-border-thick bg-white p-8 vergamano-shadow-large relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <ScratchMarks />
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
                        <div>
                            <label className="block font-black text-xs uppercase mb-2 tracking-widest">SELECCIONAR_PILAR</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['architect', 'spartan', 'mercenary', 'nomad', 'ghost'].map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPilar(p)}
                                        className={`p-2 border-4 border-black font-black text-[10px] uppercase transition-all
                                            ${pilar === p ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block font-black text-xs uppercase mb-2 tracking-widest">PROYECTO_O_AREA</label>
                            <input
                                type="text"
                                value={proyecto}
                                onChange={(e) => setProyecto(e.target.value)}
                                placeholder="EJ: REDISEÑO DASHBOARD / RUTINA PIERNAS"
                                className="w-full vergamano-border p-4 font-black uppercase text-lg focus:ring-4 focus:ring-black outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-black text-xs uppercase mb-2 tracking-widest">¿QUÉ_QUIERES_LOGRAR_HOY?</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                placeholder="DESCRIBE TU OBJETIVO... MOLTBOT LO DESGLOSARÁ EN ÁTOMOS."
                                className="w-full vergamano-border p-4 font-black uppercase text-lg focus:ring-4 focus:ring-black outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className={`w-full p-6 font-black text-2xl uppercase italic tracking-tighter transition-all vergamano-shadow
                                ${isGenerating ? 'bg-gray-200 cursor-not-allowed' : 'bg-black text-white hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isGenerating ? 'GENERANDO_PLAN_DE_ATAQUE...' : 'DESGLOSAR_EN_MICRO_TAREAS'}
                        </button>
                    </form>
                </section>

                {/* OUTPUT DE MOLTBOT */}
                <section className="vergamano-border-thick bg-white p-8 vergamano-shadow-large relative">
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <ChaoticScribble />
                    </div>

                    <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-2">
                        <div className="w-4 h-4 bg-black animate-pulse" />
                        <h2 className="font-black text-xl uppercase tracking-widest">PLAN_DE_ACCION_MOLTBOT</h2>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {lastMoltbotMsg ? (
                            <div className="whitespace-pre-wrap font-bold text-lg leading-snug uppercase">
                                {lastMoltbotMsg.content}
                            </div>
                        ) : (
                            <div className="py-20 text-center opacity-30 italic font-bold uppercase">
                                --- ESPERANDO ENTRADA PARA PROCESAR ---
                            </div>
                        )}
                    </div>

                    {lastMoltbotMsg && (
                        <div className="mt-8 pt-4 border-t-4 border-black border-dotted">
                            <button
                                onClick={() => setActiveModule('arena')}
                                className="text-xs font-black uppercase underline hover:opacity-70"
                            >
                                IR_A_ARENA_PARA_EJECUTAR_MISIÓN_SISTÉMICA
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default QuickMissionsView;
