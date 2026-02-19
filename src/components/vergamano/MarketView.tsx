
import { useGame } from '../../context/GameContext';
import { ShoppingCart, Tag, Zap } from 'lucide-react';

const MarketView = () => {
    const { profile } = useGame();

    const rewards = [
        {
            id: '1', name: 'DIGITAL_BUNKER', cost: 1500, type: 'perk',
            img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400',
            desc: 'Unlock private channel in Neural Link.'
        },
        {
            id: '2', name: 'ADRENALINE_SHOT', cost: 500, type: 'boost',
            img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=400',
            desc: '+20% XP boost for the next 24 hours.'
        },
        {
            id: '3', name: 'SOVEREIGN_ID_CARD', cost: 3000, type: 'status',
            img: 'https://images.unsplash.com/photo-1512446813987-199187383a1a?auto=format&fit=crop&q=80&w=400',
            desc: 'Visual upgrade for your Operator profile.'
        },
        {
            id: '4', name: 'INTEL_DROPS', cost: 200, type: 'info',
            img: 'https://images.unsplash.com/photo-1557597774-9d2739f3775b?auto=format&fit=crop&q=80&w=400',
            desc: 'Unlock 3 high-priority news in LSD Feed.'
        }
    ];

    return (
        <div className="space-y-16">
            <div className="flex justify-between items-center border-b-8 border-black pb-8">
                <h2 className="game-title text-6xl">THE_MARKET</h2>
                <div className="bg-blue-600 text-white p-6 border-4 border-black flex items-center gap-4 transform -rotate-2">
                    <span className="text-sm font-bold opacity-70">CURRENT_BALANCE:</span>
                    <span className="text-4xl font-black">{profile?.credits || 0} CR</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {rewards.map(item => (
                    <div key={item.id} className="flex flex-col border-4 border-black bg-white group transition-all hover:scale-105">
                        <div className="h-48 overflow-hidden relative border-b-4 border-black bg-gray-200">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover filter contrast-125 brightness-75 group-hover:brightness-100 transition-all" />
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 font-bold text-xs border-2 border-black flex items-center gap-1">
                                <Zap size={12} /> {item.type.toUpperCase()}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col items-center text-center">
                            <h3 className="marker-font text-2xl mb-4">{item.name}</h3>
                            <p className="text-xs font-bold opacity-60 mb-6">{item.desc.toUpperCase()}</p>

                            <div className="mt-auto w-full">
                                <div className="text-3xl font-black mb-4">{item.cost} <span className="text-sm">CR</span></div>
                                <button className="w-full bg-black text-white p-4 font-black flex items-center justify-center gap-3 hover:bg-green-600 transition-all border-4 border-black">
                                    <ShoppingCart size={20} /> PURCHASE_UPGRADE
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DECORATIVE SHOP ELEMENTS */}
            <div className="bg-black text-white p-10 transform skew-x-3 mt-20 flex justify-between items-center">
                <div className="flex gap-10 items-center">
                    <Tag size={64} className="opacity-20 translate-x-10" />
                    <div>
                        <p className="marker-font text-4xl">DAILY_DEALS_ACTIVE</p>
                        <p className="font-mono">NEXT_REFRESH: 14:22:09</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-50 font-bold mb-2">// MARKET_NOTICE</p>
                    <p className="max-w-xs text-xs font-bold italic">ALL PURCHASES ARE FINAL. NO REFUNDS IN THE SOVEREIGN OPERATING SYSTEM. OPERATE WITH CAUTION.</p>
                </div>
            </div>
        </div>
    );
};

export default MarketView;
