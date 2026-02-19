
import { useGame } from './context/GameContext';
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import MarketView from './components/vergamano/MarketView';
import { LSDFeed } from './components/vergamano/LSDFeed';
import NeuralLinkView from './components/vergamano/NeuralLinkView';

function App() {
  const { profile, activeModule, setActiveModule, activePillar, setActivePillar } = useGame();

  return (
    <div className={`min-h-screen p-6 md:p-12 lg:p-16`}>

      {/* CABECERA: ENFOQUE CENTRAL AVATAR */}
      <header className="flex flex-col items-center gap-12 mb-20">
        <div className="text-center">
          <h1 className="game-title text-[14vw] md:text-[10vw]">VERGAMANO</h1>
          <p className="marker-font text-2xl tracking-widest text-red-600">CANVAS_EDITION_V4.0</p>
        </div>

        {/* AVATAR OPERADOR - CRUDO Y POTENTE */}
        <div className="avatar-container">
          <div className="avatar-placeholder">
            👤
          </div>
          <div className="hp-badge">
            {profile?.hp || 100}% HP
          </div>
        </div>

        {/* STATS RÁPIDAS */}
        <div className="flex flex-wrap justify-center gap-10 bg-white border-4 border-black p-6 transform rotate-1 shadow-xl">
          <div className="text-center px-4">
            <span className="block text-xs font-bold opacity-40 uppercase">Operador</span>
            <span className="text-3xl font-black">{profile?.username || 'RAFAEL_IBARRA'}</span>
          </div>
          <div className="w-[4px] h-12 bg-black opacity-10 hidden md:block" />
          <div className="text-center px-4">
            <span className="block text-xs font-bold opacity-40 uppercase">Nivel</span>
            <span className="text-3xl font-black">{profile?.level || 1}</span>
          </div>
          <div className="w-[4px] h-12 bg-black opacity-10 hidden md:block" />
          <div className="text-center px-4">
            <span className="block text-xs font-bold opacity-40 uppercase">Créditos</span>
            <span className="text-3xl font-black text-blue-600">{profile?.credits || 0} CR</span>
          </div>
        </div>
      </header>

      {/* LOS CINCO PILARES: GRID ESPAÑOL */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { id: 'architect', label: 'ARQUITECTO', icon: '🏛️', xp: profile?.xp_work || 0 },
            { id: 'spartan', label: 'ESPARTANO', icon: '🛡️', xp: profile?.xp_body || 0 },
            { id: 'mercenary', label: 'MERCENARIO', icon: '⚔️', xp: profile?.xp_work || 0 },
            { id: 'nomad', label: 'NÓMADA', icon: '🧭', xp: profile?.xp_nomad || 0 },
            { id: 'ghost', label: 'FANTASMA', icon: '👻', xp: 450 },
          ].map(p => (
            <div
              key={p.id}
              onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
              className={`pillar-card ${activePillar === p.id ? 'pillar-card-active' : ''}`}
            >
              <div className="pillar-icon-box">{p.icon}</div>
              <h4 className="marker-font text-xl mb-4">{p.label}</h4>
              <div className="text-3xl font-black">{p.xp} XP</div>
              <div className="w-full h-3 bg-gray-100 mt-4 border-2 border-black">
                <div
                  className="h-full bg-black transition-all duration-700"
                  style={{ width: `${(p.xp % 1000) / 10}%`, backgroundColor: activePillar === p.id ? '#fff' : '#000' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NAVEGACIÓN TÉCNICA */}
      <nav className="flex flex-wrap gap-4 mb-12 justify-center max-w-4xl mx-auto">
        {[
          { label: 'ARENA', value: 'arena' },
          { label: 'MAPA', value: 'map' },
          { label: 'NOTICIAS', value: 'lsd' },
          { label: 'MERCADO', value: 'market' },
          { label: 'ENLACE', value: 'neural' },
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

      {/* VIEWPORT PRINCIPAL */}
      <main className="bg-white border-8 border-black p-6 md:p-12 min-h-[80vh] shadow-[30px_30px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
        {activeModule === 'arena' && <ArenaView />}
        {activeModule === 'map' && <MapView />}
        {activeModule === 'lsd' && <LSDFeed />}
        {activeModule === 'market' && <MarketView />}
        {activeModule === 'neural' && <NeuralLinkView />}
      </main>

      <footer className="mt-32 border-t-4 border-black pt-10 flex flex-col items-center opacity-30 italic font-bold">
        <p>VERGAMANO_OS // PROTOCOLO_SOBERANO_V4.0</p>
        <p>MOLTBOT_GM_ACTIVO</p>
      </footer>
    </div>
  );
}

export default App;
