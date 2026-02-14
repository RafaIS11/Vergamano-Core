import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [xpState, setXpState] = useState({
    architect: 0, spartan: 0, mercenary: 0, nomad: 0, ghost: 0
  });
  const [activePower, setActivePower] = useState<string | null>(null);

  useEffect(() => {
    const fetchXP = async () => {
      const { data } = await supabase.from('profile').select('*').single();
      if (data) {
        setXpState({
          architect: data.xp_architect || 0,
          spartan: data.xp_spartan || 0,
          mercenary: data.xp_mercenary || 0,
          nomad: data.xp_nomad || 0,
          ghost: data.xp_ghost || 0
        });
      }
    };
    fetchXP();

    const channel = supabase.channel('profile_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, 
      (payload: any) => {
        if (payload.new) {
          setXpState({
            architect: payload.new.xp_architect || 0,
            spartan: payload.new.xp_spartan || 0,
            mercenary: payload.new.xp_mercenary || 0,
            nomad: payload.new.xp_nomad || 0,
            ghost: payload.new.xp_ghost || 0
          });
        }
      }).subscribe();

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(timeInterval); supabase.removeChannel(channel); };
  }, []);

  const triggerAction = async (power: string) => {
    const currentXP = xpState[power as keyof typeof xpState];
    await supabase.from('profile').update({ [`xp_${power}`]: currentXP + 10 }).eq('id', 'rafael');
  };

  const powers = [
    { id: 'architect', title: 'ARCHITECT', xp: xpState.architect },
    { id: 'spartan', title: 'SPARTAN', xp: xpState.spartan },
    { id: 'mercenary', title: 'MERCENARY', xp: xpState.mercenary },
    { id: 'nomad', title: 'NOMAD', xp: xpState.nomad },
    { id: 'ghost', title: 'GHOST', xp: xpState.ghost },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-mono p-0">
      <header className="border-b-[10px] border-black p-8 flex justify-between items-center">
        <h1 className="text-8xl font-black tracking-tighter">VERGAMANO</h1>
        <div className="text-right">
          <p className="text-4xl font-black">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm font-bold bg-black text-white px-2">CORE_OS_ACTIVE</p>
        </div>
      </header>

      <main className="grid grid-cols-12 min-h-screen">
        <aside className="col-span-3 border-r-[10px] border-black p-8">
          <h2 className="text-4xl font-black mb-6 underline decoration-8">STATUS</h2>
          <div className="border-4 border-black p-4 bg-black text-white">
            <p className="text-xs font-bold uppercase">Focus</p>
            <p className="text-2xl font-black italic">{activePower || 'NONE'}</p>
          </div>
        </aside>

        <section className="col-span-9 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {powers.map((power) => (
            <div 
              key={power.id}
              onClick={() => setActivePower(power.id)}
              className={`border-[8px] border-black p-6 cursor-pointer ${activePower === power.id ? 'bg-black text-white' : 'bg-white'}`}
            >
              <h3 className="text-5xl font-black uppercase">{power.title}</h3>
              <div className="flex justify-between items-end mt-12">
                <span className="text-6xl font-black italic">{power.xp} XP</span>
              </div>
              {activePower === power.id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); triggerAction(power.id); }}
                  className="w-full mt-6 bg-red-600 text-white p-4 font-black text-2xl border-4 border-white"
                >
                  PUSH_PROGRESS (+10)
                </button>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
