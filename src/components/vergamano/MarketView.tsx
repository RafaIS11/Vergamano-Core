
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ShoppingCart, Skull, ShieldCheck, Star } from 'lucide-react';
import { InkSplatterSVG } from './ScribbleElements';

const REWARDS = [
    // VIDA REAL
    {
        id: 'cheat_meal', name: 'SALIR DE DIETA', cost: 200, type: 'comida',
        emoji: '🍔', color: '#f59e0b',
        desc: 'Un día libre de comer lo que quieras. Te lo ganaste, loco.'
    },
    {
        id: 'cheesecake', name: 'CHEESECAKE', cost: 150, type: 'comida',
        emoji: '🍰', color: '#f59e0b',
        desc: 'El postre de los dioses. Recompensa por una semana limpia.'
    },
    {
        id: 'cita', name: 'IR DE CITA', cost: 500, type: 'social',
        emoji: '💘', color: '#ef4444',
        desc: 'Una noche fuera. Mereces desconectarte y conectar con alguien.'
    },
    {
        id: 'camiseta', name: 'CAMISETA NUEVA', cost: 300, type: 'swag',
        emoji: '👕', color: '#3b82f6',
        desc: 'Nuevo drop para el armario. Estética de operador limpio.'
    },
    {
        id: 'accesorios', name: 'ACCESORIOS', cost: 400, type: 'swag',
        emoji: '🕶️', color: '#3b82f6',
        desc: 'Gafas, reloj, collar. Suma al look de Flo Escape.'
    },
    // SPOTS
    {
        id: 'cafeteria', name: 'DESBLOQUEAR CAFETERÍA', cost: 350, type: 'spot',
        emoji: '☕', color: '#6b7280',
        desc: 'Permiso de trabajo desde tu café favorito durante 1 día.'
    },
    {
        id: 'barras', name: 'DESBLOQUEAR BARRAS', cost: 250, type: 'spot',
        emoji: '🍺', color: '#6b7280',
        desc: 'Una noche de socializar. Barras desbloqueadas como recompensa.'
    },
    {
        id: 'punto', name: 'DESBLOQUEAR UN POINT', cost: 600, type: 'spot',
        emoji: '📍', color: '#6b7280',
        desc: 'Acceso a un spot nuevo de la ciudad. Exploración desbloqueada.'
    },
    // VICES
    {
        id: 'fumar', name: 'FUMAR', cost: 100, type: 'vicio',
        emoji: '🚬', color: '#374151',
        desc: 'Permiso para un cigarro ocasional. Solo si cumpliste el target del día.'
    },
    // ELITE
    {
        id: 'viaje', name: 'VIAJE', cost: 2000, type: 'elite',
        emoji: '✈️', color: '#8b5cf6',
        desc: 'Trip desbloqueado. Siguiente ciudad del mapa conquistada en la vida real.'
    },
    {
        id: 'hp_refill', name: 'REFILL HP +50', cost: 300, type: 'boost',
        emoji: '💉', color: '#22c55e',
        desc: 'Recupera 50 puntos de HP. Cuando estás en el suelo.'
    },
    {
        id: 'xp_boost', name: 'BOOST XP x2', cost: 800, type: 'boost',
        emoji: '⚡', color: '#22c55e',
        desc: '+100% XP durante 24 horas. Modo turbo activado.'
    },
];

const TYPE_LABELS: Record<string, string> = {
    comida: '🍽️ COMIDA',
    social: '❤️ SOCIAL',
    swag: '👟 SWAG',
    spot: '📍 SPOT',
    vicio: '🚬 VICIO',
    elite: '🏆 ELITE',
    boost: '⚡ BOOST',
};

const AVATAR_STATES = [
    { minHp: 80, label: 'FLO ELITE', emoji: '😎', desc: 'Gafas, puro, brillo. En tu nivel.', color: '#f59e0b' },
    { minHp: 50, label: 'FLO OPERATIVO', emoji: '🧔🏾', desc: 'Activo, limpio, en modo.', color: '#22c55e' },
    { minHp: 30, label: 'FLO CANSAO', emoji: '😮‍💨', desc: 'Te estás resbalando. Recupera.', color: '#f97316' },
    { minHp: 0, label: 'FLO DEGRAO', emoji: '🫠', desc: 'Descuidado, afro sin corte. Sube HP.', color: '#ef4444' },
];

export default function MarketView() {
    const { profile, buyReward } = useGame();
    const credits = profile?.credits || 0;
    const hp = profile?.hp ?? 100;
    const [filter, setFilter] = useState<string | null>(null);

    const avatarState = [...AVATAR_STATES].reverse().find(s => hp >= s.minHp) || AVATAR_STATES[3];

    const types = Array.from(new Set(REWARDS.map(r => r.type)));
    const filtered = filter ? REWARDS.filter(r => r.type === filter) : REWARDS;

    return (
        <div className="space-y-12">
            {/* HEADER */}
            <div className="border-b-[8px] border-black pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <h2 className="font-black text-6xl uppercase"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            MERCADO_NEGRO
                        </h2>
                        <p className="font-bold text-xl opacity-60 mt-1">
                            Gana XP → Gana Créditos → Canjea en la vida real.
                        </p>
                    </div>

                    {/* SALDO + AVATAR */}
                    <div className="flex gap-4 items-stretch">
                        {/* Avatar state */}
                        <div className="border-[6px] border-black p-4 text-center min-w-[140px]"
                            style={{ backgroundColor: avatarState.color }}>
                            <div className="text-5xl mb-2">{avatarState.emoji}</div>
                            <div className="font-black text-white text-xs uppercase leading-tight">{avatarState.label}</div>
                            <div className="text-white text-[10px] font-bold opacity-80 mt-1">{avatarState.desc}</div>
                        </div>

                        {/* Credits */}
                        <div className="bg-black text-white p-6 border-4 border-black text-right relative flex flex-col justify-center">
                            <div className="absolute -top-3 -left-3 w-8 h-8">
                                <InkSplatterSVG variant={2} />
                            </div>
                            <span className="block text-xs font-black opacity-60 uppercase tracking-widest">SALDO</span>
                            <span className="block text-4xl font-black">{credits} CR</span>
                            <span className="block text-xs opacity-40 font-mono mt-1">= {Math.round(credits * 5)} XP total</span>
                        </div>
                    </div>
                </div>

                {/* FILTROS POR TIPO */}
                <div className="flex flex-wrap gap-2 mt-6">
                    <button
                        onClick={() => setFilter(null)}
                        className={`px-4 py-2 border-4 border-black font-black text-xs uppercase transition-all
                            ${!filter ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}>
                        TODO
                    </button>
                    {types.map(type => (
                        <button key={type}
                            onClick={() => setFilter(filter === type ? null : type)}
                            className={`px-4 py-2 border-4 border-black font-black text-xs uppercase transition-all
                                ${filter === type ? 'bg-black text-white' : 'bg-white hover:bg-black hover:text-white'}`}>
                            {TYPE_LABELS[type] || type}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID DE ITEMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(item => {
                    const canAfford = credits >= item.cost;
                    return (
                        <div key={item.id}
                            className="border-[6px] border-black bg-white flex flex-col relative group transition-all hover:shadow-[10px_10px_0px_#000] hover:-translate-y-1">
                            {/* Color bar top */}
                            <div className="h-2 w-full" style={{ backgroundColor: item.color }} />

                            {/* Emoji grande */}
                            <div className="flex items-center justify-center h-28 bg-gray-50 border-b-4 border-black"
                                style={{ fontSize: '4rem' }}>
                                {item.emoji}
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-base leading-tight flex-1"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {item.name}
                                    </h3>
                                    <span className="text-[9px] font-black px-2 py-1 text-white shrink-0 ml-2"
                                        style={{ backgroundColor: item.color }}>
                                        {TYPE_LABELS[item.type]?.split(' ')[0]}
                                    </span>
                                </div>
                                <p className="text-xs font-bold opacity-60 mb-4 flex-1 leading-relaxed">
                                    {item.desc}
                                </p>

                                <div>
                                    <div className="text-xl font-black border-2 border-black text-center py-2 mb-2"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {item.cost} CR
                                    </div>
                                    <button
                                        onClick={() => buyReward(item.id, item.cost, item.name)}
                                        disabled={!canAfford}
                                        className={`w-full py-3 font-black flex items-center justify-center gap-2 text-xs uppercase border-4 border-black transition-all
                                            ${canAfford
                                                ? 'bg-black text-white hover:bg-red-600 active:translate-y-1'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                        {canAfford ? <><ShoppingCart size={14} /> ADQUIRIR</> : '🔒 SIN FONDOS'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* HOW TO EARN */}
            <div className="bg-black text-white p-8 border-4 border-black">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Skull size={48} className="text-red-600 shrink-0" />
                        <div>
                            <h4 className="font-black text-xl">CÓMO GANAR CRÉDITOS</h4>
                            <p className="font-mono text-xs opacity-50 mt-1">
                                Completa misiones → Ganas XP → cada 5 XP = 1 CR // PROTOCOLO_ACTIVO
                            </p>
                        </div>
                    </div>
                    <div className="border-2 border-white p-4 flex items-center gap-4">
                        <Star size={20} className="text-yellow-400" />
                        <div>
                            <p className="text-xs font-black uppercase">Próxima recompensa</p>
                            <p className="text-xs font-mono opacity-50">
                                {credits < 100
                                    ? `${100 - credits} CR para el primer unlock`
                                    : `${credits} CR disponibles — ¡canjea!`}
                            </p>
                        </div>
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
}
