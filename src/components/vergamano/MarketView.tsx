

import { useGame } from '../../context/GameContext';
import { ShoppingBag, CreditCard, Tag } from 'lucide-react';

const REWARDS = [
    { id: 'cheesecake', title: 'CHEESECAKE (EL BUENO)', cost: 500, description: 'Recompensas de dopamina inmediata. Solo si lo mereces.' },
    { id: 'cita', title: 'CITA / SALIDA SOCIAL', cost: 2000, description: 'Desbloquea el mundo exterior. Solo con saldo positivo.' },
    { id: 'shoes', title: 'NUEVAS ZAPATILLAS', cost: 5000, description: 'Equipamiento táctico para tu cuerpo. Requiere grind extremo.' },
    { id: 'tech', title: 'APP O GADGET NUEVO', cost: 1500, description: 'Inversión en arquitectura. Moltbot auditará la utilidad.' }
];

const MarketView = () => {
    const { profile, buyReward } = useGame();

    return (
        <div className="p-8 bg-white min-h-screen">
            <div className="flex justify-between items-end border-b-[12px] border-black pb-4 mb-8">
                <div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter">MERCADO_NEGRO</h2>
                    <p className="font-courier text-sm mt-2 opacity-60 uppercase tracking-widest">INTERCAMBIA TU ESFUERZO POR RECOMPENSAS REALES</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <span className="font-courier text-xs uppercase opacity-40">SALDO DISPONIBLE</span>
                    <span className="bg-[#FFD700] text-black px-6 py-2 border-[4px] border-black font-black text-4xl shadow-[8px_8px_0_rgba(0,0,0,1)]">
                        {profile?.credits || 0} CR
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {REWARDS.map((reward) => (
                    <div key={reward.id} className="border-[8px] border-black p-8 relative flex flex-col bg-[#F9F9F9] hover:bg-white transition-colors">
                        <div className="absolute top-4 right-4 text-gray-300">
                            <ShoppingBag size={48} strokeWidth={3} />
                        </div>

                        <h3 className="text-3xl font-black uppercase leading-tight mb-2 pr-12">
                            {reward.title}
                        </h3>

                        <p className="font-courier text-sm mb-8 opacity-60">
                            {reward.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t-[4px] border-black pt-6">
                            <div className="flex items-center gap-2">
                                <Tag className="text-[#FF1A1A]" />
                                <span className="text-4xl font-black">{reward.cost} <span className="text-sm font-bold">CR</span></span>
                            </div>

                            <button
                                onClick={() => buyReward(reward.id, reward.cost)}
                                disabled={(profile?.credits || 0) < reward.cost}
                                className={`flex items-center gap-3 px-8 py-4 font-black text-xl transition-all
                  ${(profile?.credits || 0) >= reward.cost
                                        ? 'bg-black text-white hover:bg-[#FF1A1A] hover:scale-105 active:scale-95'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border-[4px] border-gray-400'}`}
                            >
                                <CreditCard /> COMPRAR
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 border-[4px] border-black border-dashed bg-[#FFFBEB]">
                <h4 className="text-xl font-bold uppercase mb-2">(!) REGLA DEL JUEGO</h4>
                <p className="font-courier text-sm italic">
                    No puedes comprar fuera de la app. Si lo haces, estás hackeando tu propia vida y Moltbot lo sabrá. El castigo por hackeo es un reset de HP.
                </p>
            </div>
        </div>
    );
};

export default MarketView;
