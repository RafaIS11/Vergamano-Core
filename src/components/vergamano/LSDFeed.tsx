
import { useGame } from '../../context/GameContext';
import { Share2, Bookmark, BarChart3 } from 'lucide-react';

export const LSDFeed = () => {
  const { feedItems } = useGame();

  return (
    <div className="space-y-12">
      <h2 className="game-title text-6xl border-b-8 border-black pb-4">LSD_FEED_INTEL</h2>
      <p className="typewriter text-xl opacity-60 max-w-2xl mb-12">
        DIK: DIGITAL_INTELLIGENCE_KERNEL. Curated signals for the sovereign individual. Scan, extract, apply.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {feedItems.map((item) => (
          <div key={item.id} className="group relative flex flex-col bg-white border-4 border-black overflow-hidden shadow-[15px_15px_0px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2">
            {/* THUMBNAIL */}
            <div className="h-64 overflow-hidden relative border-b-4 border-black bg-gray-200">
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-20">📡</div>
              )}
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-bold text-xs">
                {item.category?.toUpperCase() || 'GENERAL_SIGNAL'}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-8 space-y-6">
              <h3 className="marker-font text-4xl leading-tight">{item.title}</h3>

              <div className="bg-gray-100 p-6 border-l-8 border-black">
                <h4 className="font-black text-sm mb-2 opacity-40">// HOW_TO_APPLY_TO_PROGRESS</h4>
                <p className="font-bold leading-relaxed">{item.how_to_apply || 'No implementation details provided. Analyze manually.'}</p>
              </div>

              <p className="text-sm opacity-60 leading-relaxed line-clamp-3">
                {item.source ? `SOURCE: ${item.source} // ` : ''}
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'TIME_UNKNOWN'}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-4 border-t-2 border-black">
                <button className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all">
                  <Bookmark size={20} />
                </button>
                <button className="p-4 border-2 border-black hover:bg-black hover:text-white transition-all">
                  <Share2 size={20} />
                </button>
                <button className="flex-1 bg-black text-white p-4 font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition-all">
                  <BarChart3 size={20} /> VIEW_FULL_INTEL
                </button>
              </div>
            </div>

            {/* DECORATIVE NUMBERS */}
            <span className="absolute bottom-2 right-4 text-xs font-black opacity-10">
              0x{Math.random().toString(16).slice(2, 8).toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center p-20 opacity-20">
        <p className="marker-font text-5xl">END_OF_SIGNALS_RELOADING...</p>
      </div>
    </div>
  );
};
