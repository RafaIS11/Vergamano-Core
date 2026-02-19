
import type { Mission } from '../../types/game';
import { supabase } from '../../lib/supabase';

interface TaskCardProps {
    task: Mission;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const copyCommand = (cmd: string) => {
        navigator.clipboard.writeText(cmd);
        // Opcional: Notificar a Moltbot que el usuario copió el comando
    };

    const updateStatus = async (newStatus: string) => {
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', task.id);

        if (!error && newStatus === 'active') {
            // Enviar un mensaje de chat automático para que Moltbot lo vea en el servidor
            await supabase.from('chat_messages').insert([{
                content: `INICIANDO OPERACIÓN: ${task.title}`,
                sender: 'rafael'
            }]);
        }
    };

    return (
        <div className={`basquiat-border p-6 bg-white mb-6 relative hover:rotate-1 transition-transform`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="basquiat-font text-2xl uppercase underline">{task.title}</h3>
                <span className="typewriter text-xs font-bold bg-yellow-200 px-2">+{task.xp_reward} XP</span>
            </div>

            <p className="font-mono text-sm mb-6 leading-tight">
                {task.description || 'Sin descripción táctica.'}
            </p>

            {/* Aquí podrías añadir los micro-steps de Moltbot si estuvieran en la DB */}

            <div className="flex flex-wrap gap-4 mt-6">
                {task.status === 'pending' && (
                    <button
                        onClick={() => updateStatus('active')}
                        className="banksy-card stencil-text bg-black text-white hover:bg-red-600 transition-colors"
                    >
                        DESPLEGAR
                    </button>
                )}

                {task.status === 'active' && (
                    <button
                        onClick={() => updateStatus('auditing')}
                        className="banksy-card stencil-text bg-yellow-500 text-black hover:bg-yellow-400"
                    >
                        ENVIAR_PRUEBA
                    </button>
                )}

                <button
                    onClick={() => copyCommand(`ssh molt@84.246.212.214`)}
                    className="basquiat-border px-4 py-2 font-black text-xs hover:bg-gray-100"
                >
                    COPY_LOCAL_SSH
                </button>
            </div>

            {/* Decoración Basquiat */}
            <div className="absolute -top-4 -right-4 w-8 h-8 opacity-20 rotate-12">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10,80 L20,30 L40,60 L60,30 L80,60 L90,30 L100,80 Z" fill="black" />
                </svg>
            </div>
        </div>
    );
};
