
import { useState, useEffect } from 'react';
import type { Mission } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { Clock, ExternalLink, CheckCircle2, Copy } from 'lucide-react';

export const TaskCard = ({ mission }: { mission: Mission }) => {
    const { completeMission } = useGame();
    const [timeLeft, setTimeLeft] = useState(mission.timer_minutes ? mission.timer_minutes * 60 : 0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="task-container transition-all hover:shadow-[10px_10px_0px_rgba(217,4,41,0.2)]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="bg-black text-white px-3 py-1 text-xs font-bold mb-2 inline-block">ID_{mission.id.slice(0, 5)}</span>
                    <h4 className="marker-font text-3xl leading-tight">{mission.title}</h4>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-red-600">+{mission.xp_reward} XP</div>
                    <div className="text-sm font-bold opacity-50">{mission.pilar?.toUpperCase()}</div>
                </div>
            </div>

            <p className="typewriter text-lg mb-8">{mission.description || "NO_INTEL_PROVIDED_AUDIT_REQUIRED"}</p>

            {/* STEPS / PROCESS */}
            <div className="space-y-4 mb-8">
                <h5 className="font-bold border-b-2 border-black pb-1 mb-4">// EXECUTION_STEPS</h5>
                {(mission.steps || ['Initialize operation', 'Collect evidence', 'Submit for audit']).map((step, i) => (
                    <div key={i} className="task-step">
                        <span className="opacity-40 mr-2">{i + 1}.</span> {step}
                    </div>
                ))}
            </div>

            {/* SUBTASKS / CHECKLIST */}
            {mission.subtasks && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 border-2 border-dashed border-black">
                    {mission.subtasks.map((st, i) => (
                        <div key={i} className="flex items-center gap-2 font-bold">
                            <input type="checkbox" className="w-5 h-5 border-4 border-black checked:bg-black" defaultChecked={st.completed} />
                            <span>{st.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* RESOURCES & LINKS */}
            <div className="flex flex-wrap gap-4 mb-8">
                {(mission.resources || [{ label: 'View Reference', url: '#' }]).map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noreferrer" className="task-resource-link flex items-center gap-2">
                        <ExternalLink size={16} /> {res.label.toUpperCase()}
                    </a>
                ))}
            </div>

            {/* POMODORO / TIMER */}
            <div className="flex items-center justify-between bg-gray-100 p-6 border-4 border-black mb-8 transform -rotate-1">
                <div className="flex items-center gap-4">
                    <Clock className={isActive ? "animate-spin" : ""} />
                    <span className="text-4xl font-black tracking-tighter">{formatTime(timeLeft)}</span>
                </div>
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="bg-black text-white px-6 py-2 font-bold hover:bg-red-600 transition-colors"
                >
                    {isActive ? 'HALT_EXEC' : 'START_MISSION'}
                </button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
                <button
                    className="flex-1 bg-white border-4 border-black p-4 font-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
                    onClick={() => navigator.clipboard.writeText(`vergamano audit ${mission.id}`)}
                >
                    <Copy size={20} /> COPY_CMD
                </button>
                <button
                    className="flex-1 bg-red-600 text-white border-4 border-black p-4 font-black hover:bg-black transition-all flex items-center justify-center gap-3"
                    onClick={() => completeMission(mission.id, 'PENDING_EVIDENCE')}
                >
                    <CheckCircle2 size={20} /> SUBMIT_PROOF
                </button>
            </div>
        </div>
    );
};
