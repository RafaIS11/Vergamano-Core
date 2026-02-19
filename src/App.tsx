import { useGame } from './context/GameContext';
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import MarketView from './components/vergamano/MarketView';
import { LSDFeed } from './components/vergamano/LSDFeed';
import NeuralLinkView from './components/vergamano/NeuralLinkView';

function App() {
  const { profile, activeModule, setActiveModule } = useGame();

  const isDecay = (profile?.hp || 100) < 30;

  return (
    <div className={`min-h-screen p-6 md:p-12 ${isDecay ? 'decay-mode' : ''}`}>
      {isDecay && <div className="basquiat failure-overlay">FAILURE</div>}

      {/* HEADER: EL CORAZON DE RAFAEL */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-20">
        <div className="text-center lg:text-left">
          <h1 className="basquiat-font text-[10vw] leading-none tracking-tighter transform -rotate-2">VERGA<br />MANO</h1>
          <p className="typewriter text-2xl mt-4">OPERATOR_V4.0_CANVAS_EDITION</p>
        </div>

        {/* BIO-AVATAR CENTRAL */}
        <div className="relative group">
          <div className="w-80 h-80 basquiat-border bg-white overflow-hidden relative transform rotate-1 transition-transform group-hover:rotate-0">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-9xl">👑</div>
            {isDecay && <div className="absolute inset-0 bg-red-600/20 animate-pulse" />}
          </div>
          <div className="absolute -top-10 -right-10 basquiat-font text-5xl bg-red-600 text-white p-6 basquiat-border transform rotate-12 shadow-2xl">
            {profile?.hp || 100}% HP
          </div>
        </div>
      </div>

      {/* WARHOL XP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-20">
        {[
          { id: 'arc', l: 'ARCHITECT', c: '#f4d03f', xp: profile?.xp_work },
          { id: 'spa', l: 'SPARTAN', c: '#c41e3a', xp: profile?.xp_body },
          { id: 'mer', l: 'MERCENARY', c: '#3498db', xp: profile?.xp_work },
          { id: 'nom', l: 'NOMAD', c: '#27ae60', xp: profile?.xp_nomad },
          { id: 'gho', l: 'GHOST', c: '#8e44ad', xp: profile?.xp_nomad },
        ].map(p => (
          <div key={p.id} className="basquiat-border p-6 transform hover:rotate-2 transition-transform" style={{ backgroundColor: p.c }}>
            <h4 className="basquiat-font text-xl border-b-2 border-black mb-4">{p.l}</h4>
            <span className="text-7xl font-black italic tracking-tighter">{p.xp || 0}</span>
          </div>
        ))}
      </div>

      {/* NAVIGATION TICKET */}
      <nav className="flex flex-wrap gap-10 mb-20 border-y-4 border-black py-10 justify-center">
        {[
          { label: 'ARENA', value: 'arena' },
          { label: 'MAPA', value: 'map' },
          { label: 'LSD_FEED', value: 'lsd' },
          { label: 'MARKET', value: 'market' },
          { label: 'ENLACE', value: 'neural' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveModule(tab.value as any)}
            className={`nav-btn ${activeModule === tab.value ? 'nav-btn-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>


      {/* ACTION VIEWPORT */}
      <div className="basquiat-border bg-white p-10 min-h-[80vh] relative">
        {activeModule === 'arena' && <ArenaView />}
        {activeModule === 'map' && <MapView />}
        {activeModule === 'lsd' && <LSDFeed />}
        {activeModule === 'market' && <MarketView />}
        {activeModule === 'neural' && <NeuralLinkView />}
      </div>


      <footer className="mt-40 border-t-8 border-black pt-10 flex justify-between items-end">
        <div className="basquiat text-4xl">
          <p>STREAK: {profile?.streak_days || 0} DAYS</p>
          <p className="text-red-600">SECTOR: MADRID_01</p>
        </div>
        <p className="basquiat text-2xl opacity-40">MOLTBOT_GM_PROTOCOL_V4.0</p>
      </footer>
    </div>
  );
}

export default App;
