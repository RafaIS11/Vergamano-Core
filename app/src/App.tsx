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
          <h1 className="basquiat text-[12vw] leading-none tracking-tighter transform -rotate-2">VERGA<br />MANO</h1>
          <p className="basquiat text-4xl bg-black text-white px-4 inline-block mt-4">OPERATOR_V4.0_CANVAS</p>
        </div>

        {/* BIO-AVATAR CENTRAL */}
        <div className="relative group">
          <div className="w-80 h-80 basquiat-border bg-white overflow-hidden relative transform rotate-1 transition-transform group-hover:rotate-0">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-9xl">🕶️</div>
            {isDecay && <div className="absolute inset-0 bg-red-600/30 animate-pulse" />}
          </div>
          <div className="absolute -top-10 -right-10 basquiat-font text-5xl bg-red-600 text-white p-4 basquiat-border transform rotate-12 shadow-2xl">
            {profile?.hp || 100}% HP
          </div>
          <p className="basquiat-font text-3xl text-center mt-6 underline decoration-8">RAFAEL_IS_ONLINE</p>
        </div>
      </div>

      {/* WARHOL XP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-20">
        {[
          { id: 'arc', l: 'ARCHITECT', c: 'var(--warhol-yellow)', xp: profile?.xp_work },
          { id: 'spa', l: 'SPARTAN', c: 'var(--warhol-red)', xp: profile?.xp_body },
          { id: 'mer', l: 'MERCENARY', c: 'var(--warhol-blue)', xp: profile?.xp_work },
          { id: 'nom', l: 'NOMAD', c: 'var(--warhol-green)', xp: profile?.xp_nomad },
          { id: 'gho', l: 'GHOST', c: 'var(--warhol-purple)', xp: profile?.xp_nomad },
        ].map(p => (
          <div key={p.id} className="basquiat-border p-6" style={{ backgroundColor: p.c }}>
            <h4 className="basquiat-font text-2xl border-b-4 border-black mb-4">{p.l}</h4>
            <span className="text-6xl font-black italic">{p.xp || 0}</span>
          </div>
        ))}
      </div>

      {/* NAVIGATION TICKET */}
      <nav className="flex flex-wrap gap-6 mb-20 border-y-8 border-black py-8">
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
            className={`basquiat-font text-4xl px-10 py-4 transition-all ${activeModule === tab.value ? 'bg-black text-white -translate-y-2' : 'hover:bg-gray-200'}`}
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
