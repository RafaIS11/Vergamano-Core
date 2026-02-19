
import { useGame } from '../../context/GameContext';
import { Lock } from 'lucide-react';

const MapView = () => {
    const { cities } = useGame();

    return (
        <div className="relative min-h-[80vh] overflow-hidden bg-[#f0f0f0] p-10 border-4 border-black">
            {/* BACKGROUND CANVAS GRID */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <h2 className="game-title text-6xl mb-20 relative z-10">WORLD_DOMINATION_PATH</h2>

            <div className="relative max-w-4xl mx-auto py-20">
                {/* SVG CONNECTION LINE */}
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20" style={{ zIndex: 0 }}>
                    <path
                        d="M 500 0 Q 700 200 500 400 T 500 800"
                        fill="none"
                        stroke="black"
                        strokeWidth="8"
                        strokeDasharray="20 20"
                    />
                </svg>

                <div className="flex flex-col gap-32 relative z-10">
                    {cities.map((city, index) => {
                        const isEven = index % 2 === 0;
                        const isLocked = city.status === 'locked';
                        const isCurrent = city.status === 'current';

                        return (
                            <div
                                key={city.name}
                                className={`flex items-center gap-10 ${isEven ? 'flex-row' : 'flex-row-reverse'} transition-all`}
                            >
                                {/* CITY NODE */}
                                <div className="relative group">
                                    <div className={`
                                        w-32 h-32 rounded-full border-8 border-black flex items-center justify-center text-4xl
                                        transition-all duration-300 transform group-hover:scale-110 shadow-xl
                                        ${isCurrent ? 'bg-red-600 animate-bounce' : isLocked ? 'bg-gray-400 grayscale' : 'bg-white'}
                                    `}>
                                        {isLocked ? <Lock size={40} /> : <span className="text-6xl">{city.flag || '📍'}</span>}
                                    </div>

                                    {isCurrent && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 font-bold whitespace-nowrap animate-pulse">
                                            YOU_ARE_HERE
                                        </div>
                                    )}
                                </div>

                                {/* CITY INFO */}
                                <div className={`max-w-xs ${isEven ? 'text-left' : 'text-right'}`}>
                                    <h3 className="game-title text-4xl mb-2">{city.name}</h3>
                                    <p className="typewriter text-sm font-bold opacity-60">
                                        {isLocked ? `LOCKED: NEEDS ${city.xp_needed} XP` : 'UNLOCKED_READY_FOR_OPERATIONS'}
                                    </p>
                                    <div className="flex gap-2 mt-4 justify-start">
                                        <div className="h-4 w-4 bg-black rounded-full" />
                                        <div className="h-4 w-4 bg-black rounded-full opacity-20" />
                                        <div className="h-4 w-4 bg-black rounded-full opacity-20" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* DECORATIVE ELEMENTS */}
            <div className="absolute bottom-10 right-10 marker-font text-3xl opacity-20 whitespace-pre">
                BERLIN_SECTOR_02<br />
                BERNE_SECTOR_03<br />
                TOKYO_LOCKED
            </div>

            <div className="absolute top-20 right-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-600 rounded-full animate-ping opacity-50" />
                <span className="font-bold text-red-600">INTEL_SIGNAL_STRENGTH: 88%</span>
            </div>
        </div>
    );
};

export default MapView;
