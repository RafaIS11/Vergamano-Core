
import { useGame } from './context/GameContext';
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import MarketView from './components/vergamano/MarketView';
import { LSDFeed } from './components/vergamano/LSDFeed';
import NeuralLinkView from './components/vergamano/NeuralLinkView';
import { BasquiatCrown, InkSplatterSVG, ChaoticScribble, ScratchMarks } from './components/vergamano/ScribbleElements';
import { FloAvatar } from './components/vergamano/FloAvatar';

const PILARS = [
  { id: 'architect', label: 'ARQUITECTO', icon: '🏛️', xpKey: 'xp_architect', color: '#3b82f6' },
  { id: 'spartan', label: 'ESPARTANO', icon: '🛡️', xpKey: 'xp_spartan', color: '#ef4444' },
  { id: 'mercenary', label: 'MERCENARIO', icon: '⚔️', xpKey: 'xp_mercenary', color: '#22c55e' },
  { id: 'nomad', label: 'NÓMADA', icon: '🧭', xpKey: 'xp_nomad', color: '#f59e0b' },
  { id: 'ghost', label: 'FANTASMA', icon: '👻', xpKey: 'xp_ghost', color: '#8b5cf6' },
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
    ? (profile.xp_architect || (profile as any).xp_work || 0) +
    (profile.xp_spartan || (profile as any).xp_body || 0) +
    (profile.xp_mercenary || 0) +
    (profile.xp_nomad || 0) +
    (profile.xp_ghost || 0)
    : 0;

  const hpPercent = profile?.hp ?? 100;
  const level = profile?.level ?? 1;
  const credits = profile?.credits ?? 0;

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#f4f1eb',
      backgroundImage: `
                url("https://www.transparenttextures.com/patterns/canvas-orange.png"),
                radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.02) 0%, transparent 60%)
            `,
    }}>
      {/* DECORACIÓN DE FONDO */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-5 w-32 h-32 opacity-5">
          <InkSplatterSVG variant={1} />
        </div>
        <div className="absolute top-40 right-10 w-24 h-24 opacity-5">
          <InkSplatterSVG variant={2} />
        </div>
        <div className="absolute bottom-40 left-10 w-48 opacity-5">
          <ChaoticScribble />
        </div>
        <div className="absolute top-1/3 right-5 opacity-5">
          <ScratchMarks />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ===== HEADER ===== */}
        <header className="mb-12">
          {/* Título con corona Basquiat */}
          <div className="text-center mb-8 relative">
            <div className="flex items-start justify-center gap-6">
              <div className="w-20 h-12 mt-2">
                <BasquiatCrown className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-black leading-none uppercase"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 'clamp(3rem, 8vw, 7rem)',
                    WebkitTextStroke: '3px black',
                    color: '#f4f1eb',
                    textShadow: '6px 6px 0px #000, -2px -2px 0px #000',
                  }}>
                  VERGAMANO
                </h1>
                <div className="flex justify-center gap-1 mt-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-black opacity-30" />
                  ))}
                </div>
                <p className="font-black text-sm tracking-[0.4em] uppercase mt-2 opacity-60"
                  style={{ fontFamily: "'Space Mono', monospace" }}>
                  PROTOCOLO SOBERANO // OS V5.0
                </p>
              </div>
              <div className="w-20 h-12 mt-2 scale-x-[-1]">
                <BasquiatCrown className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="border-[6px] border-black bg-white p-4 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
            {/* HP */}
            <div className="border-r-2 border-black pr-4">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">HP_PUNTOS_VIDA</p>
              <div className="h-4 border-2 border-black bg-gray-100">
                <div className="h-full transition-all duration-500"
                  style={{ width: `${hpPercent}%`, backgroundColor: hpPercent > 60 ? '#22c55e' : hpPercent > 30 ? '#f59e0b' : '#ef4444' }} />
              </div>
              <p className="font-black text-xl mt-1">{hpPercent}%</p>
            </div>

            {/* XP */}
            <div className="border-r-2 border-black pr-4">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">XP_TOTAL</p>
              <p className="font-black text-3xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                {totalXP.toLocaleString()}
              </p>
            </div>

            {/* NIVEL */}
            <div className="border-r-2 border-black pr-4">
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">NIVEL_OPERADOR</p>
              <p className="font-black text-3xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                LVL {level}
              </p>
            </div>

            {/* CRÉDITOS */}
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">CRÉDITOS</p>
              <p className="font-black text-3xl text-blue-600" style={{ fontFamily: "'Space Mono', monospace" }}>
                {credits.toLocaleString()} CR
              </p>
            </div>

            {/* FLO AVATAR */}
            <div className="flex items-center justify-center border-l-2 border-black pl-4">
              <FloAvatar hp={hpPercent} className="w-24" />
            </div>
          </div>
        </header>

        {/* ===== 5 PILARES ===== */}
        <section className="mb-10">
          <p className="font-black text-xs uppercase tracking-widest opacity-40 mb-3">
                        // SELECCIONA UN PILAR PARA FILTRAR LA ARENA
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PILARS.map(p => {
              const xp = (profile as any)?.[p.xpKey] ?? 0;
              const isActive = activePillar === p.id;
              const xpInLevel = xp % 1000;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(isActive ? null : p.id)}
                  className={`border-[5px] border-black p-4 text-left transition-all relative overflow-hidden
                                        ${isActive ? 'text-white shadow-[8px_8px_0px_#000]' : 'bg-white hover:shadow-[6px_6px_0px_#000]'}`}
                  style={{ backgroundColor: isActive ? p.color : undefined }}
                >
                  <div className="text-3xl mb-2">{p.icon}</div>
                  <div className="font-black text-xs uppercase tracking-wider mb-2">{p.label}</div>
                  <div className="font-black text-xl" style={{ fontFamily: "'Space Mono', monospace" }}>
                    {xp} XP
                  </div>
                  {/* Mini progress */}
                  <div className={`h-2 border-[2px] mt-2 ${isActive ? 'border-white bg-white/20' : 'border-black bg-gray-100'}`}>
                    <div className="h-full transition-all duration-700"
                      style={{
                        width: `${(xpInLevel / 10)}%`,
                        backgroundColor: isActive ? 'white' : p.color
                      }} />
                  </div>
                  {isActive && (
                    <div className="absolute top-1 right-1 w-4 h-4">
                      <InkSplatterSVG variant={1} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ===== NAVEGACIÓN ===== */}
        <nav className="flex flex-wrap gap-2 mb-8">
          {MODULES.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveModule(tab.value as any)}
              className={`font-black text-sm uppercase tracking-wider border-[4px] border-black px-4 py-3 transition-all
                                ${activeModule === tab.value
                  ? 'bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.3)]'
                  : 'bg-white hover:bg-black hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ===== MÓDULO ACTIVO ===== */}
        <main className="border-[8px] border-black bg-white p-6 md:p-10 min-h-[70vh] shadow-[16px_16px_0px_rgba(0,0,0,0.08)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 animate-spin border-8 border-black border-t-transparent" />
                <p className="font-black uppercase">Conectando con el protocolo...</p>
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

        <footer className="mt-16 pt-6 border-t-4 border-black flex justify-between items-center opacity-30">
          <p className="font-black text-xs uppercase tracking-widest">VERGAMANO_OS // PROTOCOLO_SOBERANO_V5.0</p>
          <p className="font-black text-xs uppercase">MOLTBOT_GM_V5.0_ACTIVO 🔥</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
