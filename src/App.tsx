import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LSDFeed } from './components/vergamano/LSDFeed';
import { ArenaView } from './components/vergamano/ArenaView';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'arena' | 'lsd' | 'map'>('arena');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profile').select('*').single();
      if (data) setProfile(data);
    };
    fetchProfile();

    const channel = supabase.channel('profile_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, 
      (payload) => {
        setProfile(payload.new);
      }).subscribe();

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(timeInterval); supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-mono p-0 overflow-x-hidden border-[20px] border-black">
      {/* HEADER TÉCNICO */}
      <header className="border-b-[10px] border-black p-8 flex justify-between items-start">
        <div>
          <h1 className="text-6xl font-black tracking-tighter leading-none uppercase">VergaMano_OS</h1>
          <p className="text-sm font-bold mt-2 bg-black text-white px-2 inline-block">VERSION: 3.5.1 // MOTOR: MOLTBOT</p>
        </div>
        <div className="text-right">
          <p className="text-5xl font-black">{currentTime.toLocaleTimeString([], {hour12: false})}</p>
          <p className="text-xs font-bold uppercase mt-1">Sincronización Neuronal: Estable</p>
        </div>
      </header>

      {/* NAVEGACIÓN TÉCNICA */}
      <nav className="border-b-[10px] border-black flex flex-wrap bg-white">
        {[
          { id: 'arena', label: 'ARENA' },
          { id: 'map', label: 'MAPA' },
          { id: 'lsd', label: 'LSD_FEED' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-12 py-8 text-3xl font-black border-r-[10px] border-black transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* CORE DISPLAY */}
      <main className="grid grid-cols-12 min-h-screen">
        <section className="col-span-12 lg:col-span-8 p-10 border-r-[10px] border-black bg-white">
          {activeTab === 'lsd' && <LSDFeed />}
          {activeTab === 'arena' && <ArenaView />}
          {activeTab === 'map' && (
            <div className="text-center p-20 border-8 border-dashed border-black">
              <h2 className="text-6xl font-black">[MAPA_BLOQUEADO]</h2>
              <p className="text-xl font-bold mt-4 italic">NECESITAS LVL 5 EN NOMAD PARA EXPLORAR OTROS SECTORES</p>
            </div>
          )}
        </section>

        {/* SIDEBAR DE STATUS */}
        <aside className="col-span-12 lg:col-span-4 p-10 bg-white space-y-12">
          <div className="space-y-4 border-[10px] border-black p-6">
            <p className="text-sm font-black uppercase italic border-b-4 border-black pb-2">Status_Biométrico</p>
            <div className="flex justify-between items-end">
              <p className="text-7xl font-black">{profile?.hp || 100}%</p>
              <p className="text-2xl font-black uppercase">HP_Level</p>
            </div>
            <div className="flex gap-2 mt-6 h-10">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-full w-full border-4 border-black ${i < (profile?.hp / 10) ? 'bg-black' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>

          <div className="border-[10px] border-black p-6 space-y-6 bg-gray-50">
            <div className="flex justify-between items-end border-b-4 border-black pb-4">
              <span className="text-sm font-black uppercase">Divisa_Global</span>
              <span className="text-5xl font-black">{profile?.streak_days * 10 || 0} CR</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-black uppercase">OPERATOR</span>
              <span className="text-3xl font-black uppercase underline decoration-8">Rafael_IS</span>
            </div>
          </div>

          <div className="border-[10px] border-black p-8 bg-black text-white text-center">
            <p className="text-xs font-black uppercase tracking-widest mb-4">Neural_Bridge_Active</p>
            <p className="text-3xl font-black uppercase italic text-green-400 animate-pulse font-mono">ONLINE_STABLE</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
