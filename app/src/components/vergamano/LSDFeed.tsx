
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FeedItem {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at: string;
}

export const LSDFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const { data, error } = await supabase
        .from('content_feed')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItems(data as FeedItem[]);
      }
      setLoading(false);
    };

    fetchFeed();

    const channel = supabase.channel('feed_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'content_feed' },
        (payload) => {
          setItems(prev => [payload.new as FeedItem, ...prev]);
        }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <div className="basquiat-font text-4xl animate-pulse mt-20 text-center">BUSCANDO_DOPAMINA_UTIL...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-12 border-b-8 border-black pb-6 flex justify-between items-end">
        <h2 className="basquiat-font text-7xl uppercase tracking-tighter transform -rotate-1">LSD_FEED</h2>
        <span className="typewriter text-xl bg-red-600 text-white px-6 py-2 shadow-xl">{items.length} ANOMALÍAS</span>
      </div>

      <div className="grid gap-12">
        {items.length === 0 ? (
          <div className="basquiat-border p-20 text-center opacity-20">
            <p className="basquiat-font text-3xl">[FEED_VACÍO // ESPERANDO_TRANSMISIÓN]</p>
          </div>
        ) : (
          items.map((item, i) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block basquiat-border p-8 bg-white hover:scale-[1.02] transition-all relative
                ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="banksy-card stencil-text text-sm py-1 px-4">
                  {item.category || 'ANOMALY'}
                </span>
                <span className="typewriter text-[10px] font-black">{new Date(item.created_at).toLocaleString()}</span>
              </div>

              <h3 className="basquiat-font text-4xl leading-none mb-6 underline decoration-4">
                {item.title}
              </h3>

              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-red-600 hover:text-black transition-colors">
                <span>EJECUTAR_ENLACE</span>
                <span className="text-2xl">→</span>
              </div>

              {/* Garabato Basquiat Aleatorio */}
              <div className="absolute -bottom-6 -left-6 w-12 h-12 opacity-10">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,20 L80,80 M80,20 L20,80" stroke="black" strokeWidth="10" />
                </svg>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
