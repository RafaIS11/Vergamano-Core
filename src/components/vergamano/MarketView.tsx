
import { useGame } from '../../context/GameContext';
import { ShoppingCart, Zap, Skull, ShieldCheck } from 'lucide-react';

const MarketView = () => {
    const { profile } = useGame();

    const rewards = [
        {
            id: '1', name: 'EQUIPO_TÁCTICO', cost: 1500, type: 'perk',
            img: 'https://images.unsplash.com/photo-1557597774-9d2739f3775b?auto=format&fit=crop&q=80&w=400',
            desc: 'Hardware optimizado para operaciones en la sombra.'
        },
        {
            id: '2', name: 'SHOT_ADRENALINA', cost: 500, type: 'boost',
            img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400',
            desc: '+20% de ganancia de XP durante 24h.'
        },
        {
            id: '3', name: 'ID_SOBERANA_GOLD', cost: 3000, type: 'visual',
            img: 'https://images.unsplash.com/photo-1512446813987-199187383a1a?auto=format&fit=crop&q=80&w=400',
            desc: 'Mejora visual dorada para tu perfil de Operador.'
        },
        {
            id: '4', name: 'DRONE_VIGILANCIA', cost: 2500, type: 'intel',
            img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400',
            desc: 'Detecta señales ocultas en el Feed de Noticias.'
        }
    ];

    return (
        <div className="space-y-16">
            <div className="flex justify-between items-center border-b-8 border-black pb-8">
                <div>
                    <h2 className="game-title text-7xl">MERCADO_NEGRO</h2>
                    <p className="marker-font text-2xl opacity-60">Usa tus Créditos con sabiduría.</p>
                </div>
                <div className="bg-blue-600 text-white p-8 border-8 border-black flex flex-col items-end transform -rotate-1">
                    <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Saldo_Disponible</span>
                    <span className="text-5xl font-black">{profile?.credits || 0} CR</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {rewards.map(item => (
                    <div key={item.id} className="flex flex-col border-6 border-black bg-white group hover:shadow-[15px_15px_0px_#000] transition-all">
                        <div className="h-56 overflow-hidden relative border-b-6 border-black">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 font-black text-xs border-2 border-black flex items-center gap-2">
                                <Zap size={14} /> {item.type.toUpperCase()}
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <h3 className="game-title text-3xl mb-4 leading-none">{item.name}</h3>
                            <p className="text-sm font-bold opacity-60 mb-10 uppercase">{item.desc}</p>

                            <div className="mt-auto">
                                <div className="text-3xl font-black mb-6 bg-gray-100 p-4 border-2 border-black text-center">{item.cost} CR</div>
                                <button className="w-full bg-black text-white p-6 font-black flex items-center justify-center gap-4 hover:bg-green-600 transition-all uppercase text-xl">
                                    <ShoppingCart size={24} /> COMPRAR
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-black text-white p-12 flex justify-between items-center mt-20">
                <div className="flex items-center gap-10">
                    <Skull size={80} className="text-red-600 opacity-80" />
                    <div>
                        <h4 className="game-title text-4xl leading-none mb-2">OPERACIÓN_DE_SUMINISTROS</h4>
                        <p className="font-mono text-sm opacity-50">Nuevos suministros en camino // PROTOCOLO_ACTIVO</p>
                    </div>
                </div>
                <div className="border-4 border-white p-6 flex items-center gap-4">
                    <ShieldCheck size={32} />
                    <p className="text-xs font-bold uppercase max-w-[200px]">Transacción protegida por el núcleo de VergaMano</p>
                </div>
            </div>
        </div>
    );
};

export default MarketView;
