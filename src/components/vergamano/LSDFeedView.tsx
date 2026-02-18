
import React from 'react';
import { useGame } from '../../context/GameContext';
import { ExternalLink, Trash2, Zap } from 'lucide-react';

const LSDFeedView: React.FC = () => {
    const { feedItems } = useGame();

    return (
        <div className="p-8 bg-white min-h-screen">
            <div className="flex justify-between items-end border-b-[12px] border-black pb-4 mb-8">
                <div>
                    <h2 className="text-6xl font-black uppercase tracking-tighter">LSD_FEED</h2>
                    <p className="font-courier text-sm mt-2 opacity-60 uppercase tracking-widest">INYECCIÓN DE DOPAMINA ÚTIL // NO ENTRES A TIKTOK</p>
                </div>
                <div className="text-right">
                    <span className="bg-black text-white px-4 py-2 font-black text-2xl">
                        {feedItems.length} ITEMS
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feedItems.map((item) => (
                    <div key={item.id} className="border-[8px] border-black p-6 relative flex flex-col bg-white hover:translate-x-2 hover:-translate-y-2 transition-transform shadow-[10px_10px_0_rgba(0,0,0,1)] group">
                        <div className="absolute -top-4 -right-4 bg-[#FF1A1A] text-white p-2 border-[4px] border-black">
                            <Zap size={20} />
                        </div>

                        <div className="flex gap-2 mb-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 border-[2px] border-black uppercase
                ${item.category === 'AIRDROP' ? 'bg-[#FFD700]' :
                                    item.category === 'SPARTAN' ? 'bg-[#FF1A1A] text-white' :
                                        'bg-black text-white'}`}>
                                {item.category}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black uppercase leading-none mb-6 group-hover:underline">
                            {item.title}
                        </h3>

                        <div className="mt-auto flex gap-4">
                            <button
                                onClick={() => window.open(item.url, '_blank')}
                                className="flex-1 bg-black text-white p-4 font-black flex items-center justify-center gap-2 hover:bg-[#FF1A1A] transition-colors"
                            >
                                CONSUMIR <ExternalLink size={20} />
                            </button>
                            <button className="border-[4px] border-black p-4 hover:bg-black hover:text-white transition-colors">
                                <Trash2 size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {feedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                    <h3 className="text-4xl font-black italic">[FEED VACÍO // MOLTBOT ESTÁ BUSCANDO...]</h3>
                </div>
            )}
        </div>
    );
};

export default LSDFeedView;
