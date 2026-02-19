
import { useGame } from '../../context/GameContext';
import { Lock } from 'lucide-react';

const MapView = () => {
    const { cities } = useGame();

    return (
        <div className="relative min-h-[100vh] bg-[#f0f0f0] p-10 border-4 border-black">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <h2 className="game-title text-7xl mb-12 relative z-10 border-b-8 border-black inline-block">RUTA_DE_CONQUISTA</h2>
            <p className="marker-font text-3xl mb-24 opacity-60">Desbloquea ciudades ganando XP en los 5 pilares.</p>

            <div className="relative max-w-5xl mx-auto py-20">
                {/* LÍNEA DE CONEXIÓN */}
                <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30" style={{ zIndex: 0 }}>
                    <path
                        d="M 500 0 Q 800 400 500 800 T 500 1600"
                        fill="none"
                        stroke="black"
                        strokeWidth="12"
                        strokeDasharray="30 30"
                    />
                </svg>

                <div className="flex flex-col gap-40 relative z-10">
                    {cities.map((city, index) => {
                        const isEven = index % 2 === 0;
                        const isLocked = city.status === 'locked';
                        const isCurrent = city.status === 'current';

                        return (
                            <div
                                key={city.name}
                                className={`flex items-center gap-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                {/* NODO CIUDAD */}
                                <div className="relative group">
                                    <div className={`
                                        w-40 h-40 rounded-full border-12 border-black flex items-center justify-center text-7xl
                                        transition-all duration-300 transform group-hover:scale-110 shadow-2xl
                                        ${isCurrent ? 'bg-red-600 animate-bounce' : isLocked ? 'bg-gray-400 grayscale' : 'bg-white'}
                                    `}>
                                        {isLocked ? <Lock size={60} /> : <span>{city.flag}</span>}
                                    </div>
                                    {isCurrent && (
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 font-black whitespace-nowrap text-xl">
                                            AQUÍ_ESTÁS
                                        </div>
                                    )}
                                </div>

                                {/* INFO CIUDAD */}
                                <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                                    <h3 className="game-title text-5xl mb-4">{city.name}</h3>
                                    <div className="bg-black text-white p-4 inline-block font-black text-xl italic uppercase">
                                        {isLocked ? `Bloqueado: ${city.xp_needed} XP necesarios` : 'Operaciones abiertas'}
                                    </div>
                                    <div className={`flex gap-3 mt-6 ${isEven ? 'justify-start' : 'justify-end'}`}>
                                        <div className="h-6 w-6 bg-black rounded-sm" />
                                        <div className="h-6 w-6 bg-black rounded-sm opacity-20" />
                                        <div className="h-6 w-6 bg-black rounded-sm opacity-20" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-center p-32 opacity-10">
                <h4 className="game-title text-9xl">INTEL_OVERLOAD</h4>
            </div>
        </div>
    );
};

export default MapView;
