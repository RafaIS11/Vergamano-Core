import { useGame } from './context/GameContext';

import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import MarketView from './components/vergamano/MarketView';
import { LSDFeed } from './components/vergamano/LSDFeed';
import NeuralLinkView from './components/vergamano/NeuralLinkView';
import { InkSplatterSVG, ChaoticScribble, ScratchMarks } from './components/vergamano/ScribbleElements';
import { FloAvatar } from './components/vergamano/FloAvatar';
import { TheVoid } from './components/vergamano/effects/TheVoid';
import { motion } from 'framer-motion';

// CANONICAL PILLARS - colors from the original concept
const PILARS = [
  { id: 'architect', label: 'ARQUITECTO', icon: '🏛️', xpKey: 'xp_architect', color: '#3b82f6', description: 'BUILD' },
  { id: 'spartan', label: 'ESPARTANO', icon: '⚔️', xpKey: 'xp_spartan', color: '#ef4444', description: 'BODY' },
  { id: 'mercenary', label: 'MERCENARIO', icon: '💰', xpKey: 'xp_mercenary', color: '#22c55e', description: 'MONEY' },
  { id: 'nomad', label: 'NÓMADA', icon: '🧭', xpKey: 'xp_nomad', color: '#f59e0b', description: 'MOVE' },
  { id: 'ghost', label: 'FANTASMA', icon: '👻', xpKey: 'xp_ghost', color: '#8b5cf6', description: 'MIND' },
];

const MODULES = [
  { label: '⚔️ ARENA', value: 'arena' },
  { label: '🗺️ MAPA', value: 'map' },
  { label: '📡 NOTICIAS', value: 'lsd' },
  { label: '🛒 MERCADO', value: 'market' },
  { label: '🧠 MOLTBOT', value: 'neural' },
];

function App() {
  const { profile, activeModule, setActiveModule, activePillar, setActivePillar, isLoading } = useGame();


  const totalXP = profile
    ? (profile.xp_architect || 0) + (profile.xp_spartan || 0) +
    (profile.xp_mercenary || 0) + (profile.xp_nomad || 0) + (profile.xp_ghost || 0)
    : 0;

  const hpPercent = profile?.hp ?? 100;
  const level = profile?.level ?? 1;
  const credits = profile?.credits ?? 0;


  return (
    <div
      className="min-h-screen"
      style={{
        // Off-white canvas — the VERGAMANO paper background
        backgroundColor: '#f4f1eb',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-5 w-32 h-32 opacity-[0.04]"><InkSplatterSVG variant={1} /></div>
        <div className="absolute top-40 right-10 w-24 h-24 opacity-[0.04]"><InkSplatterSVG variant={2} /></div>
        <div className="absolute bottom-40 left-10 w-48 opacity-[0.04]"><ChaoticScribble /></div>
        <div className="absolute top-1/3 right-5 opacity-[0.04]"><ScratchMarks /></div>
      </div>

      {/* THE VOID — fires when HP < 30 */}
      <TheVoid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ===== HEADER ===== */}
        <header className="mb-10">
          <div className="flex items-start gap-6 mb-6">

            {/* Avatar Column — left side */}
            <div className="w-36 flex-shrink-0 hidden md:block">
              <FloAvatar hp={hpPercent} className="w-full" />
            </div>

            {/* Title + Stats */}
            <div className="flex-1">
              {/* Title */}
              <div className="relative mb-4">
                <h1
                  className="font-black leading-none uppercase"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                    WebkitTextStroke: '2px black',
                    color: '#f4f1eb',
                    textShadow: '5px 5px 0px #000, -2px -2px 0px #000',
                  }}
                >
                  VERGAMANO
                </h1>
                <p className="font-black text-xs tracking-[0.4em] uppercase opacity-50 mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
                  PROTOCOLO SOBERANO // OS V5.0 // NOMADA ARCHITECT
                </p>
              </div>

              {/* STATS BAR */}
              <div className="border-[5px] border-black bg-white p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center" style={{ boxShadow: '6px 6px 0 black' }}>
                {/* HP */}
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">HP_VIDA</p>
                  <div className="h-3 border-2 border-black bg-gray-100">
                    <div
                      className="h-full transition-all duration-700"
                      style={{ width: `${hpPercent}%`, backgroundColor: hpPercent > 60 ? '#22c55e' : hpPercent > 30 ? '#f59e0b' : '#ef4444' }}
                    />
                  </div>
                  <p className="font-black text-lg mt-0.5" style={{ fontFamily: "'Space Mono', monospace" }}>{hpPercent}%</p>
                </div>

                {/* XP */}
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">XP_TOTAL</p>
                  <p className="font-black text-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>{totalXP.toLocaleString()}</p>
                </div>

                {/* LEVEL */}
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">NIVEL</p>
                  <p className="font-black text-2xl" style={{ fontFamily: "'Space Mono', monospace" }}>LVL {level}</p>
                </div>

                {/* CREDITS */}
                <div>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">CRÉDITOS</p>
                  <p className="font-black text-2xl text-blue-600" style={{ fontFamily: "'Space Mono', monospace" }}>{credits.toLocaleString()} CR</p>
                </div>
              </div>
            </div>
          </div>

          {/* PILLAR SELECTOR */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {PILARS.map(p => {
              const xp = (profile as any)?.[p.xpKey] ?? 0;
              const isActive = activePillar === p.id;
              const xpInLevel = xp % 1000;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => setActivePillar(isActive ? null : p.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  className="border-[4px] border-black p-3 text-left transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: isActive ? p.color : '#fff',
                    boxShadow: isActive ? '5px 5px 0 black' : '3px 3px 0 rgba(0,0,0,0.15)',
                  }}
                >
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <div className="font-black text-[9px] uppercase tracking-wider mb-1" style={{ color: isActive ? '#fff' : '#000' }}>
                    {p.label}
                  </div>
                  <div className="font-black text-sm" style={{ fontFamily: "'Space Mono', monospace", color: isActive ? '#fff' : '#000' }}>
                    {xp.toLocaleString()} <span className="text-[8px]">XP</span>
                  </div>
                  <div className="h-1.5 border border-current mt-1.5" style={{ opacity: 0.5 }}>
                    <div className="h-full transition-all duration-700" style={{ width: `${(xpInLevel / 10)}%`, backgroundColor: isActive ? '#fff' : p.color }} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* NAV TABS */}
          <nav className="flex flex-wrap gap-2">
            {MODULES.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveModule(tab.value as any)}
                className="font-black text-sm uppercase tracking-wider border-[4px] border-black px-4 py-3 transition-all"
                style={{
                  backgroundColor: activeModule === tab.value ? '#000' : '#fff',
                  color: activeModule === tab.value ? '#fff' : '#000',
                  boxShadow: activeModule === tab.value ? '4px 4px 0 rgba(0,0,0,0.3)' : 'none',
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* ===== MAIN MODULE ===== */}
        <main
          className="border-[6px] border-black bg-white p-6 md:p-10 min-h-[70vh]"
          style={{ boxShadow: '12px 12px 0 rgba(0,0,0,0.08)' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 animate-spin border-8 border-black border-t-transparent" />
                <p className="font-black uppercase tracking-widest">CONECTANDO CON EL PROTOCOLO...</p>
              </div>
            </div>
          ) : (
            <>
              {activeModule === 'arena' && <ArenaView />}
              {activeModule === 'map' && <MapView />}
              {activeModule === 'lsd' && <LSDFeed />}
              {activeModule === 'market' && <MarketView />}
              {activeModule === 'neural' && <NeuralLinkView />}
            </>
          )}
        </main>

        <footer className="mt-12 pt-6 border-t-4 border-black flex justify-between items-center opacity-30">
          <p className="font-black text-xs uppercase tracking-widest">VERGAMANO_OS // V5.0</p>
          <p className="font-black text-xs uppercase">MOLTBOT_GM_ACTIVO 🔥</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
