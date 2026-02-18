
import React from 'react';
import { useGame } from '../../context/GameContext';
import { Lock, MapPin, CheckCircle2 } from 'lucide-react';
import { ChaoticScribble, AggressiveArrow } from './ScribbleElements';

const CITIES = [
    'Caracas', 'Madrid', 'Bruselas', 'Berlín', 'Copenhague',
    'Bali', 'Oslo', 'San Francisco', 'Londres', 'Nueva York'
];

const MapView: React.FC = () => {
    const { } = useGame();
    const currentCityIndex = 1; // Testing value: Madrid

    return (
        <div className="p-12 relative min-h-screen bg-white">
            <div className="absolute top-20 right-20 w-64 h-64 opacity-10">
                <ChaoticScribble />
            </div>

            <h2 className="text-6xl font-black mb-12 uppercase tracking-tighter">MAPA_DE_CONQUISTA</h2>

            <div className="relative flex flex-col gap-12 max-w-2xl">
                {CITIES.map((city, index) => {
                    const isCompleted = index < currentCityIndex;
                    const isActive = index === currentCityIndex;
                    const isLocked = index > currentCityIndex;

                    return (
                        <div key={city} className="flex items-center gap-8 relative group">
                            {/* Connector Line */}
                            {index !== CITIES.length - 1 && (
                                <div className={`absolute left-8 top-16 w-2 h-16 border-l-[6px] border-black border-dashed opacity-30
                   ${isCompleted ? 'border-solid opacity-100' : ''}`} />
                            )}

                            {/* City Node */}
                            <div className={`relative w-16 h-16 border-[8px] border-black flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-black text-white' : 'bg-white text-black'}
                ${isActive ? 'scale-125 z-10 shadow-[0_0_30px_rgba(0,0,0,0.2)]' : ''}
                ${isLocked ? 'opacity-30' : ''}`}>

                                {isCompleted ? <CheckCircle2 size={32} /> :
                                    isActive ? <MapPin size={32} className="animate-bounce" /> :
                                        <Lock size={24} />}
                            </div>

                            {/* City Name */}
                            <div className="flex flex-col">
                                <span className={`text-4xl font-black uppercase tracking-tighter transition-all
                  ${isLocked ? 'opacity-20 line-through' : ''}
                  ${isActive ? 'text-[#FF1A1A]' : ''}`}>
                                    {city}
                                </span>
                                {isActive && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-black text-white px-2 py-0.5 font-courier text-xs uppercase">OBJETIVO ACTUAL</span>
                                        <div className="w-12 h-4">
                                            <AggressiveArrow direction="right" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Boss Fight / Evidence Upload Placeholder */}
            <div className="fixed bottom-20 right-20 border-[8px] border-black p-8 bg-white max-w-md rotate-2 shadow-[20px_20px_0_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black uppercase mb-4">PRUEBA_DE_CONQUISTA</h3>
                <p className="font-courier text-sm mb-6">Sube evidencia para desbloquear la siguiente ciudad. Moltbot validará tu progreso.</p>
                <button className="w-full bg-black text-white p-4 font-black hover:bg-[#FF1A1A] transition-colors">
                    SUBIR EVIDENCIA / BOSS_FIGHT
                </button>
            </div>
        </div>
    );
};

export default MapView;
