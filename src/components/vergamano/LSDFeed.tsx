import { useGame } from '../../context/GameContext';
import { Bookmark, BarChart3, AlertTriangle } from 'lucide-react';
import { InkSplatterSVG, ChaoticScribble } from './ScribbleElements';

const PILAR_KEYS = {
  architect: 'xp_architect',
  spartan: 'xp_spartan',
  mercenary: 'xp_mercenary',
  nomad: 'xp_nomad',
  ghost: 'xp_ghost'
} as const;

export const LSDFeed = () => {
  const { feedItems, profile } = useGame();

  // 1. Determine Weakest Pillar for the Contextual Ghost Logic
  let weakestPillar = 'ghost'; // Default fallback
  if (profile) {
    let minXp = Infinity;
    Object.entries(PILAR_KEYS).forEach(([pillar, key]) => {
      const xp = (profile as any)[key] || 0;
      if (xp < minXp) {
        minXp = xp;
        weakestPillar = pillar;
      }
    });
  }

  // 2. Sort Feed: Prioritize weakest pillar intel
  const sortedFeed = [...feedItems].sort((a, b) => {
    const aIsPriority = a.category?.toLowerCase() === weakestPillar;
    const bIsPriority = b.category?.toLowerCase() === weakestPillar;
    if (aIsPriority && !bIsPriority) return -1;
    if (!aIsPriority && bIsPriority) return 1;
    // Fallback to date
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  return (
    <div className="space-y-16">
      <header className="mb-12 border-b-[8px] border-black pb-8 relative">
        <div className="absolute -top-10 -right-4 w-32 h-32 opacity-20 pointer-events-none">
          <ChaoticScribble />
        </div>
        <h2 className="font-black text-6xl uppercase leading-none" style={{ fontFamily: "'Space Mono', monospace" }}>LSD_INTEL</h2>
        <div className="mt-4 bg-red-600 text-white p-4 font-black flex items-center gap-4 text-xl border-4 border-black">
          <AlertTriangle size={32} />
          <span>PRIORITY OVERRIDE: PILAR <span className="underline">{weakestPillar.toUpperCase()}</span> REQUIRES IMMEDIATE REINFORCEMENT.</span>
        </div>
      </header>

      <div className="columns-1 md:columns-2 gap-8 space-y-8">
        {sortedFeed.map((item, index) => {
          const isPriority = item.category?.toLowerCase() === weakestPillar;
          const rotation = (index % 2 === 0 ? '-1deg' : '1.5deg');
          const bgColor = isPriority ? '#fff5f5' : '#ffffff';
          const borderColor = isPriority ? '#ef4444' : '#000000';

          return (
            <div
              key={item.id}
              className="relative break-inside-avoid flex flex-col border-[4px] p-6 shadow-[10px_10px_0px_#000] hover:-translate-y-2 transition-transform"
              style={{
                transform: `rotate(${rotation})`,
                backgroundColor: bgColor,
                borderColor: borderColor
              }}
            >
              {/* Tape / Pin effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200/80 border-2 border-black rotate-3 z-10"></div>

              {/* Ink Splatter BG for Priority items */}
              {isPriority && (
                <div className="absolute top-10 right-4 w-20 h-20 opacity-10 pointer-events-none">
                  <InkSplatterSVG variant={1} />
                </div>
              )}

              {/* THUMBNAIL */}
              <div className={`h-48 overflow-hidden relative border-[3px] border-black mb-6 ${isPriority ? 'grayscale-0' : 'grayscale'}`}>
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center font-black text-4xl opacity-20">NO_IMG</div>
                )}
                <div className={`absolute top-2 left-2 px-3 py-1 font-black text-xs uppercase border-2 border-black ${isPriority ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
                  {item.category || 'UNAFFILIATED'}
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-4 relative z-10">
                <h3 className="font-black text-2xl uppercase leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>{item.title}</h3>

                <div className="bg-gray-50 p-4 border-l-[4px] border-black relative">
                  <h4 className="font-black text-[10px] mb-2 opacity-50 uppercase tracking-widest">// APPLICATION_VECTOR</h4>
                  <p className="font-bold text-sm leading-relaxed">{item.how_to_apply || 'Extract signals manually.'}</p>
                </div>

                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                  {item.source ? `SRC: ${item.source} // ` : ''}
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'TIME_UNKNOWN'}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-4">
                  <button className="flex-1 bg-black text-white py-3 font-black text-xs uppercase border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                    <BarChart3 size={16} /> EXTRACT
                  </button>
                  <button className="px-4 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors">
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center py-20 opacity-30">
        <ChaoticScribble className="w-32 h-32 mx-auto mb-4" />
        <p className="font-black text-2xl uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>END_OF_SIGNALS</p>
      </div>
    </div>
  );
};
