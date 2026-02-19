
import { useGame } from '../../context/GameContext';
import { ShoppingCart, Zap, Skull, ShieldCheck } from 'lucide-react';
import { InkSplatterSVG } from './ScribbleElements';

const MarketView = () => {
    const { profile, buyReward } = useGame();

    const rewards = [
        {
            id: 'equipment', name: 'EQUIPO TÁCTICO', cost: 1500, type: 'perk',
            emoji: '⚙️',
            desc: 'Hardware optimizado para operaciones en la sombra.'
        },
        {
            id: 'adrenalina', name: 'SHOT ADRENALINA', cost: 500, type: 'boost',
            emoji: '⚡',
            desc: '+20% de ganancia de XP durante 24 horas de operación.'
        },
        {
            id: 'id_gold', name: 'ID SOBERANA GOLD', cost: 3000, type: 'visual',
            emoji: '🏆',
            desc: 'Identidad dorada de Operador Elite. Nivel de acceso máximo.'
        },
        {
            id: 'drone', name: 'DRONE VIGILANCIA', cost: 2500, type: 'intel',
            emoji: '🛸',
            desc: 'Detecta señales ocultas. Acceso al LSD Feed clasificado.'
        },
        {
            id: 'bunker', name: 'MODO BÚNKER', cost: 800, type: 'mode',
            emoji: '🔒',
            desc: 'Activa aislamiento total. Focus máximo. Sin distracciones.'
        },
        {
            id: 'refill', name: 'REFILL HP+50', cost: 300, type: 'health',
            emoji: '💉',
            desc: 'Recupera 50 puntos de HP. Para cuando te estás cayendo.'
        },
    ];

    const typeColors: Record<string, string> = {
        perk: '#3b82f6',
        boost: '#ef4444',
        visual: '#f59e0b',
        intel: '#8b5cf6',
        mode: '#374151',
        health: '#22c55e',
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="border-b-[8px] border-black pb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-6xl uppercase"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            MERCADO_NEGRO
                        </h2>
                        <p className="font-bold text-xl opacity-60 mt-1">
                            Gasta con sabiduría. Cada crédito conta.
                        </p>
                    </div>
                    <div className="bg-black text-white p-6 border-4 border-black text-right relative">
                        <div className="absolute -top-3 -left-3 w-8 h-8">
                            <InkSplatterSVG variant={2} />
                        </div>
                        <span className="block text-xs font-black opacity-60 uppercase tracking-widest">SALDO</span>
                        <span className="block text-4xl font-black">{profile?.credits || 0} CR</span>
                    </div>
                </div>
            </div>

            {/* Grid de items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rewards.map(item => {
                    const canAfford = (profile?.credits || 0) >= item.cost;
                    const color = typeColors[item.type] || '#000';
                    return (
                        <div key={item.id} className="border-[6px] border-black bg-white flex flex-col relative group transition-all hover:shadow-[10px_10px_0px_#000]">
                            {/* Top color bar */}
                            <div className="h-3 w-full" style={{ backgroundColor: color }} />

                            {/* Emoji display */}
                            <div className="flex items-center justify-center h-32 bg-gray-50 border-b-4 border-black text-7xl">
                                {item.emoji}
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-black text-lg leading-tight">{item.name}</h3>
                                    <span className="text-[10px] font-black px-2 py-1 text-white"
                                        style={{ backgroundColor: color }}>
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm font-bold opacity-60 mb-6 flex-1">{item.desc}</p>

                                <div>
                                    <div className="text-2xl font-black border-2 border-black text-center py-2 mb-3">
                                        {item.cost} CR
                                    </div>
                                    <button
                                        onClick={() => buyReward(item.id, item.cost, item.name)}
                                        disabled={!canAfford}
                                        className={`w-full py-3 font-black flex items-center justify-center gap-3 text-sm uppercase border-4 border-black transition-all
                                            ${canAfford
                                                ? 'bg-black text-white hover:bg-red-600 active:translate-y-1'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart size={16} />
                                        {canAfford ? 'ADQUIRIR' : 'SIN FONDOS'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="bg-black text-white p-8 flex justify-between items-center mt-12 border-4 border-black">
                <div className="flex items-center gap-6">
                    <Skull size={48} className="text-red-600" />
                    <div>
                        <h4 className="font-black text-xl">OPERACIÓN_SUMINISTROS</h4>
                        <p className="font-mono text-xs opacity-50">Nuevos items disponibles al subir de nivel // PROTOCOLO_ACTIVO</p>
                    </div>
                </div>
                <div className="border-2 border-white p-4 flex items-center gap-3">
                    <ShieldCheck size={24} />
                    <div className="flex items-center gap-2 opacity-50">
                        <Zap size={14} />
                        <p className="text-xs font-black uppercase">Sistema Seguro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketView;
