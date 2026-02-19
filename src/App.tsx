
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
    <div className={`min-h-screen p-4 md:p-12 lg:p-20 ${isDecay ? 'decay-mode' : ''}`}>
      {/* HEADER: PREMIUM BRANDING & CENTRAL AVATAR */}
      <div className="flex flex-col items-center text-center gap-12 mb-32">
        <div>
          <h1 className="game-title text-[12vw] md:text-[10vw]">VERGAMANO</h1>
          <p className="bebas-font text-3xl tracking-[0.5em] opacity-40">OPERATOR_V4.0_SOVEREIGN</p>
        </div>

        {/* CENTRAL AVATAR - NO CROWNS, JUST POWER */}
        <div className="relative">
          <div className="avatar-container">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-8xl grayscale hover:grayscale-0 transition-all duration-700">
              {/* Aquí irá la foto del usuario en el futuro */}
              👤
            </div>
          </div>
          <div className="hp-badge">
            {profile?.hp || 100}% HP
          </div>
        </div>

        <div className="flex gap-10 items-center">
          <div className="text-left">
            <span className="block text-xs font-bold opacity-40 tracking-widest uppercase">Operator</span>
            <span className="text-3xl font-black uppercase">{profile?.username || 'RAFAEL_IBARRA'}</span>
          </div>
          <div className="h-12 w-[2px] bg-black opacity-10" />
          <div className="text-left">
            <span className="block text-xs font-bold opacity-40 tracking-widest uppercase">Credits</span>
            <span className="text-3xl font-black uppercase text-blue-600">{profile?.credits || 0} CR</span>
          </div>
        </div>
      </div>

      {/* THE FIVE PILLARS: INTERACTIVE GRID */}
      <div className="max-w-7xl mx-auto">
        <h3 className="game-title text-4xl mb-12 flex items-center gap-4">
          <span className="w-12 h-[4px] bg-black" /> PILLARS_OF_POWER
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-24">
          {[
            { id: 'architect', l: 'ARCHITECT', icon: '🏗️', xp: profile?.xp_work || 0 },
            { id: 'spartan', l: 'SPARTAN', icon: '🛡️', xp: profile?.xp_body || 0 },
            { id: 'mercenary', l: 'MERCENARY', icon: '⚔️', xp: profile?.xp_work || 0 },
            { id: 'nomad', l: 'NOMAD', icon: '🧭', xp: profile?.xp_nomad || 0 },
            { id: 'ghost', l: 'GHOST', icon: '👻', xp: 450 },
          ].map(p => (
            <div
              key={p.id}
              onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
              className={`pillar-card ${activePillar === p.id ? 'pillar-card-active' : ''}`}
            >
              <div className="pillar-icon-box">
                {p.icon}
              </div>
              <h4 className="text-xl font-bold mb-4 tracking-tighter">{p.l}</h4>
              <div className="text-3xl font-black mb-4">{p.xp} <span className="text-xs opacity-50">XP</span></div>

              <div className="w-full h-2 bg-gray-100 relative">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{
                    width: `${(p.xp % 1000) / 10}%`,
                    backgroundColor: activePillar === p.id ? '#fff' : '#000'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* PRIMARY NAVIGATION */}
        <nav className="flex flex-wrap gap-4 mb-16 justify-center">
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
        <main className="bg-white border-[10px] border-black p-10 min-h-[80vh] shadow-[40px_40px_0px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {activeModule === 'arena' && <ArenaView />}
          {activeModule === 'map' && <MapView />}
          {activeModule === 'lsd' && <LSDFeed />}
          {activeModule === 'market' && <MarketView />}
          {activeModule === 'neural' && <NeuralLinkView />}
        </main>
      </div>

      <footer className="mt-40 border-t-2 border-black/10 pt-12 flex justify-between items-center opacity-30 text-xs font-bold uppercase tracking-widest">
        <p>Vergamano Protocol // Built for the Sovereign</p>
        <p>Moltbot v4.0 Active</p>
      </footer>
    </div>
  );
}

export default App;
