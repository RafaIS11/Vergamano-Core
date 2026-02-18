
import { useGame } from './context/GameContext';
import {
  BasquiatCrown,
  InkSplatterSVG,
  DataStream
} from './components/vergamano/ScribbleElements';

// Modules
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import NeuralLinkView from './components/vergamano/NeuralLinkView';
import LSDFeedView from './components/vergamano/LSDFeedView';
import MarketView from './components/vergamano/MarketView';

export default function App() {
  const { profile, activeModule, setActiveModule, isBunkerMode, isLoading } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-courier text-2xl">
        <div className="w-20 h-20 mb-8"><BasquiatCrown /></div>
        <div className="animate-pulse">SINCRONIZANDO_CON_MOLTBOT...</div>
      </div>
    );
  }

  const isLowHP = (profile?.hp || 100) < 30;

  return (
    <div className={`min-h-screen bg-[#F9F9F7] text-black overflow-x-hidden relative selection:bg-black selection:text-white 
      ${isLowHP ? 'filter-homeless' : ''} ${profile?.hp && profile.hp < 15 ? 'filter-critical' : ''}`}>

      {/* OVERLAYS BIO-REACTIVOS */}
      {isLowHP && <div className="noise-overlay" />}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <DataStream />
      </div>

      {/* HEADER TÁCTICO */}
      <header className={`vergamano-border-thick bg-white relative z-30 m-4 vergamano-shadow transition-all ${isBunkerMode ? 'opacity-0 -translate-y-full' : ''}`}>
        <div className="grid grid-cols-12 h-24">
          <div className="col-span-3 border-r-8 border-black p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-black leading-none">VERGA<br />MANO_HUD</h1>
            <span className="text-[10px] font-bold opacity-50">V3.5_LIFE_CLIENT</span>
          </div>

          <nav className="col-span-7 border-r-8 border-black flex items-center px-6 overflow-x-auto gap-4">
            {[
              { id: 'arena', label: 'ARENA' },
              { id: 'map', label: 'MAPA' },
              { id: 'neural', label: 'ENLACE' },
              { id: 'lsd', label: 'LSD_FEED' },
              { id: 'market', label: 'MERCADO' }
            ].map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as any)}
                className={`px-4 py-2 font-black text-sm uppercase transition-all vergamano-border
                  ${activeModule === module.id ? 'bg-black text-white scale-110 vergamano-shadow' : 'hover:bg-gray-100 bg-white'}`}
              >
                {module.label}
              </button>
            ))}
          </nav>

          <div className={`col-span-2 flex flex-col items-center justify-center p-2 transition-colors ${isLowHP ? 'bg-red-600' : 'bg-black'} text-white`}>
            <span className="font-bold text-[10px] uppercase">BIOMETRÍA</span>
            <span className="text-2xl font-black italic">{isLowHP ? 'CRÍTICO' : 'ESTABLE'}</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="px-4 pb-24 relative">
        <div className="max-w-7xl mx-auto">
          {activeModule === 'arena' && <ArenaView />}
          {activeModule === 'map' && <MapView />}
          {activeModule === 'neural' && <NeuralLinkView />}
          {activeModule === 'lsd' && <LSDFeedView />}
          {activeModule === 'market' && <MarketView />}
        </div>

        {/* MODO BUNKER (OVERLAY) */}
        {isBunkerMode && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white p-12 text-center">
            <h2 className="text-[15vw] leading-none mb-8 animate-pulse text-red-600">FOCUS</h2>
            <div className="text-6xl font-courier mb-12 border-4 border-white p-6">24:59</div>
            <button className="vergamano-border-thick bg-red-600 text-white px-12 py-6 font-black text-2xl hover:bg-white hover:text-black transition-all vergamano-shadow-large">
              ABORTAR (-10 HP)
            </button>
          </div>
        )}
      </main>

      {/* FOOTER DE ESTADO */}
      {!isBunkerMode && (
        <footer className="fixed bottom-0 left-0 right-0 border-t-8 border-black bg-white p-6 flex justify-between items-center z-40">
          <div className="flex gap-16">
            <div className="flex flex-col">
              <span className="text-[10px] font-black opacity-40 uppercase">ENERGÍA_VITAL</span>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-4 h-8 vergamano-border ${i < (profile?.hp || 0) / 10 ? 'bg-black' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black opacity-40 uppercase">DIVISA_ECONÓMICA</span>
              <div className="text-4xl font-black">{profile?.credits || 0} <span className="text-xl">CR</span></div>
            </div>
            <div className="hidden lg:block">
              <span className="text-[10px] font-black opacity-40 uppercase">LOCALIZACIÓN</span>
              <div className="text-xl font-bold italic">MADRID_SECTOR_01</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-black opacity-40 uppercase">MOLTBOT_REALTIME</span>
              <div className="text-sm font-bold text-green-600">CONECTADO_ACTIVO</div>
            </div>
            <div className="w-16 h-16 opacity-30"><InkSplatterSVG /></div>
          </div>
        </footer>
      )}
    </div>
  );
}
