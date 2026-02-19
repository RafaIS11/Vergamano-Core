
import { useGame } from './context/GameContext';
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import MarketView from './components/vergamano/MarketView';
import { LSDFeed } from './components/vergamano/LSDFeed';
import NeuralLinkView from './components/vergamano/NeuralLinkView';

function App() {
  const { profile, activeModule, setActiveModule, activePillar, setActivePillar } = useGame();

  const isDecay = (profile?.hp || 100) < 30;

  return (
    <div className={`min-h-screen p-4 md:p-8 lg:p-12 ${isDecay ? 'decay-mode' : ''}`}>
      {isDecay && <div className="marker-font failure-overlay text-white text-9xl">FAILURE</div>}

      {/* HEADER: OPERATOR STATUS */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
        <div>
          <h1 className="game-title text-[8vw] md:text-[6vw] lg:text-[10vw]">VERGA<br />MANO</h1>
          <div className="bg-black text-white px-6 py-2 inline-block transform -rotate-1 text-2xl font-bold">
            SYSTEM_PROTOCOL_V4.0
          </div>
        </div>

        {/* BIO-AVATAR AREA */}
        <div className="flex items-center gap-8 bg-white border-4 border-black p-6 shadow-[10px_10px_0px_rgba(0,0,0,1)] transform rotate-1">
          <div className="w-24 h-24 bg-gray-200 border-2 border-black flex items-center justify-center text-5xl">
            👤
          </div>
          <div>
            <p className="text-3xl font-black">{profile?.username || 'RAFAEL_IBARRA'}</p>
            <div className="flex gap-4 mt-2">
              <span className="bg-red-600 text-white px-3 py-1 font-bold">{profile?.hp || 100}% HP</span>
              <span className="bg-blue-600 text-white px-3 py-1 font-bold">{profile?.credits || 0} CR</span>
            </div>
            <p className="mt-2 text-sm font-bold opacity-60">STREAK: {profile?.streak_days || 0} DAYS</p>
          </div>
        </div>
      </div>

      {/* THE FIVE PILLARS: INTERACTIVE GRID */}
      <h3 className="game-title text-4xl mb-8">Sovereign_Pillars</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        {[
          { id: 'architect', l: 'ARCHITECT', c: '#ffb703', icon: '🏛️', xp: profile?.xp_work || 0 },
          { id: 'spartan', l: 'SPARTAN', c: '#d90429', icon: '🛡️', xp: profile?.xp_body || 0 },
          { id: 'mercenary', l: 'MERCENARY', c: '#0077b6', icon: '⚔️', xp: profile?.xp_work || 0 },
          { id: 'nomad', l: 'NOMAD', c: '#27ae60', icon: '🌍', xp: profile?.xp_nomad || 0 },
          { id: 'ghost', l: 'GHOST', c: '#ff006e', icon: '👻', xp: 450 },
        ].map(p => (
          <div
            key={p.id}
            onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
            className={`pillar-card ${activePillar === p.id ? 'pillar-card-active' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl">{p.icon}</span>
              <span className="text-xs font-bold opacity-50">LVL {Math.floor(p.xp / 1000) + 1}</span>
            </div>
            <h4 className="marker-font text-2xl border-b-4 border-black mb-2">{p.l}</h4>
            <div className="text-4xl font-black italic">{p.xp} XP</div>

            {/* PROGRESS BAR */}
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(p.xp % 1000) / 10}%`,
                  backgroundColor: activePillar === p.id ? '#fff' : p.c
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* PRIMARY NAVIGATION */}
      <nav className="flex flex-wrap gap-4 mb-12">
        {[
          { label: 'ARENA', value: 'arena' },
          { label: 'MAPA', value: 'map' },
          { label: 'LSD_FEED', value: 'lsd' },
          { label: 'MARKET', value: 'market' },
          { label: 'NEURAL_LINK', value: 'neural' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveModule(tab.value as any)}
            className={`nav-tab ${activeModule === tab.value ? 'nav-tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN VIEWPORT */}
      <main className="bg-white border-8 border-black p-8 min-h-[70vh] shadow-[20px_20px_0px_rgba(0,0,0,0.1)] relative">
        {activeModule === 'arena' && <ArenaView />}
        {activeModule === 'map' && <MapView />}
        {activeModule === 'lsd' && <LSDFeed />}
        {activeModule === 'market' && <MarketView />}
        {activeModule === 'neural' && <NeuralLinkView />}
      </main>

      <footer className="mt-32 border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center opacity-40">
        <p className="font-bold">VERGAMANO_OS // PROTOCOL_V4.0_CANVAS</p>
        <p className="font-bold text-red-600">MOLTBOT_GM_ACTIVE_AUDIT</p>
      </footer>
    </div>
  );
}

export default App;
