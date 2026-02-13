import React, { useState, useEffect } from 'react';
import {
  BasquiatCrown,
  ChaoticScribble,
  InkSplatterSVG,
  CharcoalStroke,
  VoidScratch,
  AggressiveArrow,
  ChaoticUnderline,
  ScratchMarks,
  DataStream
} from './components/vergamano/ScribbleElements';
import { DistortedCard, MetricCard, AlertCard } from './components/vergamano/DistortedCard';
import { supabase } from './lib/supabase';

// ----- UTILITY COMPONENTS -----

const TypewriterText: React.FC<{ text: string; className?: string; delay?: number }> = ({
  text,
  className = '',
  delay = 0
}) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50 + Math.random() * 50);

    return () => clearInterval(interval);
  }, [started, text]);

  return <span className={`${className} typewriter-cursor`}>{displayText}</span>;
};

const GlitchNumber: React.FC<{ value: string; className?: string }> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      const chars = '0123456789ABCDEF#@$%&*';
      let glitchCount = 0;

      const glitchLoop = setInterval(() => {
        setDisplayValue(
          value.split('').map((char) =>
            char.match(/[0-9]/) && Math.random() > 0.3
              ? chars[Math.floor(Math.random() * chars.length)]
              : char
          ).join('')
        );
        glitchCount++;

        if (glitchCount > 5) {
          clearInterval(glitchLoop);
          setDisplayValue(value);
          setIsGlitching(false);
        }
      }, 50);
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(glitchInterval);
  }, [value]);

  return (
    <span className={`${className} ${isGlitching ? 'glitch-hover' : ''} font-courier`}>
      {displayValue}
    </span>
  );
};

// ----- MAIN COMPONENT -----

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // ISOLATED XP STATE (Syncing with Supabase)
  const [xpState, setXpState] = useState({
    architect: 0,
    spartan: 0,
    mercenary: 0,
    nomad: 0,
    ghost: 0
  });

  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    console.log('App: Initializing Supabase synchronization...');

    // 1. Initial Fetch
    const fetchXP = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .limit(1)
          .single();

        if (data && !error) {
          console.log('App: XP state fetched successfully');
          setXpState({
            architect: data.xp_architect || 0,
            spartan: data.xp_spartan || 0,
            mercenary: data.xp_mercenary || 0,
            nomad: data.xp_nomad || 0,
            ghost: data.xp_ghost || 0
          });
        } else if (error) {
          console.warn('App: Supabase fetch error (expected if table empty):', error.message);
        }
      } catch (err) {
        console.error('App: Critical error in fetchXP:', err);
      }
    };

    fetchXP();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profile' },
        (payload: any) => {
          if (payload.new) {
            console.log('App: Realtime update received', payload.new);
            setXpState({
              architect: payload.new.xp_architect || 0,
              spartan: payload.new.xp_spartan || 0,
              mercenary: payload.new.xp_mercenary || 0,
              nomad: payload.new.xp_nomad || 0,
              ghost: payload.new.xp_ghost || 0
            });
          }
        }
      )
      .subscribe();

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    const scanInterval = setInterval(() => setScanLine(prev => (prev + 1) % 100), 50);

    return () => {
      clearInterval(timeInterval);
      clearInterval(scanInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  const alerts = [
    { level: 'critical' as const, message: 'CORTISOL SPIKE DETECTED', timestamp: '14:23:07' },
    { level: 'high' as const, message: 'SLEEP DEPRIVATION > 48H', timestamp: '14:21:45' },
    { level: 'medium' as const, message: 'DOPAMINE RECEPTORS: LOW', timestamp: '14:18:22' },
  ];

  const pillars = [
    { id: 'architect', title: 'ARCHITECT', xp: xpState.architect, rotate: 'rotate-[-2deg]', skew: 'skew-x-2' },
    { id: 'spartan', title: 'SPARTAN', xp: xpState.spartan, rotate: 'rotate-[1deg]', skew: 'skew-y-1' },
    { id: 'mercenary', title: 'MERCENARY', xp: xpState.mercenary, rotate: 'rotate-[-3deg]', skew: '-skew-x-3' },
    { id: 'nomad', title: 'NOMAD', xp: xpState.nomad, rotate: 'rotate-[2deg]', skew: 'skew-y-2' },
    { id: 'ghost', title: 'GHOST', xp: xpState.ghost, rotate: 'rotate-[0deg]', skew: 'skew-x-1' },
  ];

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden relative font-helvetica selection:bg-black selection:text-white">

      {/* GLOBAL OVERLAYS */}
      <div className="fixed inset-0 grain-texture pointer-events-none z-50 opacity-20" />
      <div
        className="fixed left-0 right-0 h-px bg-black opacity-10 pointer-events-none z-40"
        style={{ top: `${scanLine}%` }}
      />
      {/* Subtle Data Stream Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <DataStream />
      </div>

      {/* HEADER */}
      <header className="border-b-[12px] border-black bg-white relative z-30">
        <div className="grid grid-cols-12 h-32">
          {/* Logo */}
          <div className="col-span-4 border-r-[12px] border-black p-6 relative flex flex-col justify-center">
            <div className="absolute top-2 left-2 w-12 h-12">
              <BasquiatCrown />
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none relative">
              VERGA
              <br />
              <span className="relative inline-block">
                MANO
                <div className="absolute -bottom-2 w-full h-2 bg-black"></div>
              </span>
            </h1>
          </div>

          {/* Canvas Title */}
          <div className="col-span-6 border-r-[12px] border-black p-6 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <ChaoticScribble className="w-full h-full" />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-4xl italic font-black font-helvetica tracking-widest">
                COMMAND_CANVAS_01
              </h2>
              <div className="w-full h-4 mt-2">
                <ChaoticUnderline />
              </div>
            </div>
          </div>

          {/* Termination Button */}
          <div className="col-span-2 bg-[#FF1A1A] flex items-center justify-center relative group cursor-pointer hover:bg-black transition-colors duration-200">
            <span className="text-white font-courier font-bold text-xl tracking-widest group-hover:hidden">TERMINATE</span>
            <span className="text-white font-courier font-bold text-xl tracking-widest hidden group-hover:block">CONFIRM?</span>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="grid grid-cols-12 min-h-[calc(100vh-128px)]">

        {/* LEFT PANEL: STATUS & LOGS */}
        <aside className="col-span-3 border-r-[12px] border-black p-6 flex flex-col gap-8 relative bg-white">
          {/* Scratch Marks Texture */}
          <div className="absolute top-10 left-0 w-full opacity-20 pointer-events-none">
            <ScratchMarks />
          </div>

          <div className="absolute top-0 right-0 p-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-xs">ID</div>
          </div>

          <div>
            <h3 className="text-4xl font-black mb-4 uppercase">STATUS</h3>
            <ul className="space-y-2">
              <li className="text-2xl font-bold text-gray-300 line-through decoration-4 decoration-black">METRICS</li>
              <li className="text-2xl font-bold text-gray-300 line-through decoration-4 decoration-black">SUBJECTS</li>
              <li className="text-4xl font-black">LOGS</li>
            </ul>
          </div>

          {/* ALERTS SECTION */}
          <div className="flex flex-col gap-4 mt-4 relative z-10">
            {alerts.map((alert, index) => (
              <AlertCard
                key={index}
                level={alert.level}
                message={alert.message}
                timestamp={alert.timestamp}
              />
            ))}
          </div>

          <div className="mt-auto border-[8px] border-black p-4 bg-[#FFEEEE]">
            <div className="flex justify-between items-start mb-2">
              <span className="font-courier text-xs font-bold">SYSTEM_STATUS</span>
              <span className="text-[#FF0000] text-2xl font-black">!</span>
            </div>
            <h4 className="text-2xl font-black text-[#FF0000] leading-none italic">
              <TypewriterText text="COGNITIVE LEAK DETECTED" delay={1000} />
            </h4>
          </div>
        </aside>

        {/* CENTER PANEL: THE 5 PILLARS (Use Distorted Cards) */}
        <section className="col-span-6 border-r-[12px] border-black bg-white p-8 relative">
          {/* Background noise */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 opacity-5 pointer-events-none">
            <InkSplatterSVG variant={2} />
          </div>

          <div className="flex justify-between items-end mb-12 border-b-[8px] border-black pb-4">
            <div>
              <span className="bg-black text-white px-2 py-1 font-courier text-xs">ID: 882-PSI</span>
              <h2 className="text-5xl font-black leading-none mt-2">
                SUBJECT<br />SIGMA
              </h2>
            </div>
            <div className="text-6xl font-black text-[#FF1A1A] font-courier">
              <GlitchNumber value="74%" />
            </div>
          </div>

          {/* PILLARS GRID */}
          <div className="grid grid-cols-1 gap-12 relative z-10 px-4">
            {pillars.map((pillar) => (
              <DistortedCard
                key={pillar.id}
                title={pillar.title}
                className={`transform transition-transform hover:scale-105 hover:z-20 ${pillar.skew} ${pillar.rotate}`}
                arrowDirection="right"
                showArrow={true}
                scribbleIntensity={Math.random() > 0.5 ? 'high' : 'medium'}
              >
                {/* We pass the value as children to use our GlitchNumber component */}
                <div className="flex items-end justify-between mt-4">
                  <div className="font-courier text-xs opacity-60">XP_ACCUMULATION</div>
                  <div className="font-courier text-4xl font-bold">
                    <GlitchNumber value={pillar.xp.toString()} />
                  </div>
                </div>

                {/* Random Void Scratch on some cards */}
                {Math.random() > 0.6 && (
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <VoidScratch className="w-full h-full text-black" />
                  </div>
                )}
                {/* Charcoal Stroke */}
                <div className="absolute -bottom-4 left-0 w-full opacity-80 pointer-events-none">
                  <CharcoalStroke />
                </div>
              </DistortedCard>
            ))}
          </div>
        </section>

        {/* RIGHT PANEL: PSYCH-TELEMETRY */}
        <aside className="col-span-3 p-6 flex flex-col relative overflow-hidden bg-white">
          <h2 className="text-5xl font-black leading-none mb-4">
            PSYCH-<br />TELEMETRY
          </h2>

          <div className="relative mb-8">
            <div className="absolute top-0 right-0 w-16 h-16 transform rotate-45">
              <AggressiveArrow direction="down" className="text-[#FFAAAA]" />
            </div>
          </div>

          {/* Graph Placeholder - Brutalist */}
          <div className="border-l-[8px] border-b-[8px] border-black h-64 relative mb-8">
            <svg className="absolute inset-0 w-full h-full" overflow="visible">
              <path
                d="M0,200 L40,150 L80,180 L120,40 L160,100 L200,80 L240,220 L280,140"
                fill="none"
                stroke="black"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx="120" cy="40" r="6" fill="#FF0000" />
              <text x="130" y="35" className="font-courier text-xs font-bold">ANOMALY DETECTED</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-auto">
            <MetricCard
              label="HEART RATE"
              value="142 BPM"
              chaotic={true}
              trend="up"
            />
            <MetricCard
              label="PUPIL DIL."
              value="MAX"
              chaotic={true}
              trend="up"
              change="CRITICAL"
            />
            <MetricCard
              label="CORTISOL"
              value="8.2mg"
              trend="down"
            />
            <MetricCard
              label="THETA"
              value="4.1Hz"
              trend="neutral"
            />
          </div>
        </aside>

      </main>

      {/* FOOTER - ENVIRONMENTAL */}
      <footer className="border-t-[12px] border-black bg-white grid grid-cols-12">
        <div className="col-span-8 p-4 bg-black text-white font-courier text-xs flex items-center gap-4">
          <span>[{currentTime.toLocaleTimeString()}] INITIALIZING NEURAL UPLINK...</span>
          <span className="text-[#FF0000]">[08:23:44] WARNING: CORTISOL SPIKE</span>
        </div>
        <div className="col-span-4 border-l-[12px] border-black p-4">
          <h3 className="font-black text-xl mb-2">ENVIRONMENTAL</h3>
          <div className="flex gap-4">
            <div className="border-[4px] border-black px-2 py-1">
              <div className="text-[10px] font-courier">TEMP</div>
              <div className="font-bold">19.4°C</div>
            </div>
            <div className="border-[4px] border-black px-2 py-1">
              <div className="text-[10px] font-courier">OXYGEN</div>
              <div className="font-bold">98.2%</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
