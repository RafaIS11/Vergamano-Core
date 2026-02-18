import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-white text-black font-mono p-0 overflow-x-hidden">
      {/* HEADER BRUTALISTA */}
      <header className="border-b-[10px] border-black p-8 flex justify-between items-start">
        <div>
          <h1 className="text-8xl font-black tracking-tighter leading-none">VERGA<br/>MANO_HUD</h1>
          <p className="text-xs font-bold mt-2">V3.5_LIFE_CLIENT</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="flex gap-4">
            <div className="text-right border-r-4 border-black pr-4">
              <p className="text-xs font-bold uppercase">Biometría</p>
              <p className={`text-4xl font-black ${profile?.hp < 30 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                {profile?.hp < 30 ? 'CRÍTICA' : 'ESTABLE'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">{currentTime.toLocaleTimeString([], {hour12: false})}</p>
              <p className="text-sm font-bold bg-black text-white px-2">WED 18 FEB 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* NAV SECUNDARIO */}
      <nav className="border-b-[10px] border-black flex flex-wrap">
        {[
          { id: 'arena', label: 'ARENA' },
          { id: 'map', label: 'MAPA' },
          { id: 'enlace', label: 'ENLACE' },
          { id: 'lsd', label: 'LSD_FEED' },
          { id: 'mercado', label: 'MERCADO' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-6 text-3xl font-black border-r-8 border-black transition-all ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="grid grid-cols-12 min-h-screen">
        <section className="col-span-12 lg:col-span-9 p-12 border-r-[10px] border-black">
          {activeTab === 'lsd' && <LSDFeed />}
          {activeTab === 'arena' && <ArenaView />}
          {activeTab === 'map' && (
            <div className="text-center p-20 border-8 border-dashed border-black">
              <h2 className="text-6xl font-black">[MAPA_BLOQUEADO]</h2>
              <p className="text-xl font-bold mt-4">NECESITAS LVL 5 EN NOMAD PARA EXPLORAR OTROS SECTORES</p>
            </div>
          )}
        </section>

        {/* SIDEBAR DE STATS */}
        <aside className="col-span-12 lg:col-span-3 p-8 bg-white space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase italic">Energía_Vital</p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-8 w-full border-2 border-black ${i < (profile?.hp / 10) ? 'bg-black' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>

          <div className="border-8 border-black p-4 space-y-4">
            <div className="flex justify-between items-end border-b-2 border-black pb-2">
              <span className="text-xs font-bold uppercase">Divisa_Económica</span>
              <span className="text-3xl font-black">{profile?.streak_days * 10 || 0} CR</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase">Localización</span>
              <span className="text-xl font-black uppercase">Madrid_Sector_01</span>
            </div>
          </div>

          {/* AVATAR STATE */}
          <div className="border-[10px] border-black p-6 bg-black text-white text-center">
            <p className="text-xs font-bold uppercase mb-4">Moltbot_Realtime</p>
            <p className="text-2xl font-black uppercase italic tracking-widest text-green-400">Conectado_Activo</p>
            <div className="mt-8 opacity-20 text-6xl">👤</div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
