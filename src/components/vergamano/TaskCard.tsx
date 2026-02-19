
import { useState, useEffect } from 'react';
import type { Mission } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { CheckSquare, List, Link } from 'lucide-react';

export const TaskCard = ({ mission }: { mission: Mission }) => {
    const { completeMission } = useGame();
    const [seconds, setSeconds] = useState(mission.timer_minutes ? mission.timer_minutes * 60 : 0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds(s => s - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div className="task-card transform transition-transform hover:scale-[1.01]">
            <div className="flex justify-between items-start mb-10">
                <div className="max-w-2xl">
                    <span className="bg-black text-white px-3 py-1 font-bold text-xs mb-3 inline-block">ID_OPERACIÓN: {mission.id}</span>
                    <h3 className="game-title text-5xl leading-none mb-4">{mission.title}</h3>
                    <p className="text-xl font-bold opacity-60 leading-relaxed">{mission.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-red-600">+{mission.xp_reward} XP</div>
                    <div className="marker-font text-xl opacity-60 mt-2">{mission.pilar?.toUpperCase()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* SUBTAREAS */}
                <div className="task-step-list">
                    <h4 className="marker-font text-2xl mb-6 flex items-center gap-2"><CheckSquare /> SUBTAREAS</h4>
                    {mission.subtasks?.map((st, i) => (
                        <div key={i} className="flex items-center gap-4 mb-4 text-lg font-bold">
                            <input type="checkbox" className="w-6 h-6 border-4 border-black" defaultChecked={st.completed} />
                            <span>{st.label}</span>
                        </div>
                    ))}
                </div>

                {/* PASOS A PASO */}
                <div className="task-step-list border-l-0 border-t-8 md:border-t-0 md:border-l-8 border-black">
                    <h4 className="marker-font text-2xl mb-6 flex items-center gap-2"><List /> PASOS_EJECUCIÓN</h4>
                    {mission.steps?.map((step, i) => (
                        <div key={i} className="task-step-item">
                            <span className="text-red-600">[{i + 1}]</span> {step}
                        </div>
                    ))}
                </div>
            </div>

            {/* RECURSOS */}
            <div className="flex gap-4 mt-8">
                {mission.resources?.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black text-white px-4 py-2 font-bold hover:bg-red-600 transition-all">
                        <Link size={18} /> {res.label.toUpperCase()}
                    </a>
                ))}
            </div>

            {/* TIMER POMODORO */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-black pt-8">
                <div className="flex items-center gap-6">
                    <div className="timer-box">{formatTime(seconds)}</div>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`p-6 border-4 border-black font-black text-2xl transition-all ${isActive ? 'bg-red-600 text-white animate-pulse' : 'bg-white hover:bg-black hover:text-white'}`}
                    >
                        {isActive ? 'DETENER' : 'INICIAR_OPERACIÓN'}
                    </button>
                </div>
                <button
                    onClick={() => completeMission(mission.id, 'proof_placeholder')}
                    className="bg-black text-white px-10 py-6 text-3xl font-black hover:bg-red-600 transform hover:rotate-1 transition-all"
                >
                    MARCAR_COMO_COMPLETADA
                </button>
            </div>
        </div>
    );
};
