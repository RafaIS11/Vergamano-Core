import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useGame } from '../../context/GameContext';

interface Task {
    id: string;
    title: string;
    description: string;
    power: string;
    xp_base: number;
    status: string;
}

export const ArenaView: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { completeMission } = useGame();
    const [evidenceTask, setEvidenceTask] = useState<string | null>(null);
    const [evidenceLink, setEvidenceLink] = useState('');

    const fetchTasks = async () => {
        const { data } = await supabase
            .from('tasks')
            .select('*')
            .eq('status', 'Todo')
            .order('created_at', { ascending: false });
        if (data) setTasks(data);
    };

    useEffect(() => {
        fetchTasks();

        const channel = supabase.channel('tasks_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' },
                () => {
                    fetchTasks();
                }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-6xl font-black italic border-b-8 border-black pb-4">ARENA_MISS_01</h2>
            <div className="grid gap-4">
                {tasks.map(task => (
                    <div key={task.id} className="border-8 border-black p-6 bg-white hover:bg-red-600 hover:text-white transition-colors group">
                        <div className="flex justify-between items-center mb-4">
                            <span className="bg-black text-white px-3 py-1 text-xs font-black group-hover:bg-white group-hover:text-black uppercase">{task.power}</span>
                            <span className="text-4xl font-black italic">+{task.xp_base} XP</span>
                        </div>
                        <h3 className="text-4xl font-black uppercase mb-2">{task.title}</h3>
                        <p className="font-bold mb-4">{task.description}</p>
                        <button
                            className="w-full border-4 border-black py-2 font-black uppercase group-hover:border-white"
                            onClick={() => setEvidenceTask(task.id)}
                        >
                            Enviar Prueba →
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de Evidencia (Estética Basquiat-Moltbot) */}
            {evidenceTask && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="border-[10px] border-black bg-white p-12 max-w-2xl w-full relative">
                        <button
                            className="absolute top-4 right-4 text-4xl font-black"
                            onClick={() => setEvidenceTask(null)}
                        >X</button>
                        <h2 className="text-4xl font-black mb-6 uppercase">ENTREGAR_PRUEBA</h2>
                        <p className="font-bold mb-8 text-black">Pega el link de la prueba (GitHub / Video / Captura) para que Moltbot la audite.</p>
                        <input
                            type="text"
                            className="w-full border-4 border-black p-6 text-2xl font-bold bg-white mb-8 text-black"
                            placeholder="https://..."
                            value={evidenceLink}
                            onChange={(e) => setEvidenceLink(e.target.value)}
                        />
                        <button
                            className="w-full bg-black text-white py-6 text-2xl font-black uppercase"
                            onClick={() => {
                                completeMission(evidenceTask, evidenceLink);
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
