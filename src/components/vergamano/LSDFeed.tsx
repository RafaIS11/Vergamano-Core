import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface FeedItem {
  id: string;
  title: string;
  url: string;
  category: string;
  created_at: string;
}

export const LSDFeed: React.FC = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const { data, error } = await supabase
        .from('content_feed')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setItems(data);
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

  if (loading) return <div className="text-2xl font-black animate-pulse">[BUSCANDO_DOPAMINA_UTIL...]</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b-8 border-black pb-4">
        <h2 className="text-6xl font-black italic">LSD_FEED</h2>
        <span className="text-2xl font-bold bg-black text-white px-4">{items.length} ITEMS</span>
      </div>
      
      <div className="grid gap-6">
        {items.length === 0 ? (
          <div className="border-4 border-dashed border-black p-12 text-center text-xl font-bold italic text-gray-400">
            [FEED VACÍO // MOLTBOT ESTÁ BUSCANDO...]
          </div>
        ) : (
          items.map(item => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group border-4 border-black p-6 hover:bg-black hover:text-white transition-all block"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold bg-black text-white px-2 group-hover:bg-white group-hover:text-black uppercase">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-3xl font-black mt-2 leading-none uppercase">{item.title}</h3>
              <p className="text-xs mt-4 underline group-hover:text-red-500">VER_CONTENIDO_AHORA →</p>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
