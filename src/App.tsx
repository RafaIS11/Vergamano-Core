
import { useState, useEffect } from 'react';
import {
  BasquiatCrown,
  InkSplatterSVG,
  DataStream
} from './components/vergamano/ScribbleElements';
import { XPTestTrigger } from './components/vergamano/XPTestTrigger';
import { useGame } from './context/GameContext';

// Modules
import ArenaView from './components/vergamano/ArenaView';
import MapView from './components/vergamano/MapView';
import NeuralLinkView from './components/vergamano/NeuralLinkView';
import LSDFeedView from './components/vergamano/LSDFeedView';
import MarketView from './components/vergamano/MarketView';

// ----- MAIN HUD COMPONENT -----

function App() {
  const { profile, activeModule, setActiveModule, isBunkerMode, isLoading } = useGame();
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const scanInterval = setInterval(() => setScanLine(prev => (prev + 1) % 100), 50);
    return () => clearInterval(scanInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-courier text-2xl">
        <div className="w-20 h-20 mb-8"><BasquiatCrown /></div>
        <div className="animate-pulse">INICIALIZANDO_ENLACE_NEURAL...</div>
      </div>
    );
  }

  const isLowHP = (profile?.hp || 100) < 30;

  return (
    <div className={`min-h-screen bg-white text-black overflow-x-hidden relative font-helvetica selection:bg-black selection:text-white 
      ${isLowHP ? 'filter-homeless' : ''}`}>

      {/* BIO-REACTIVE OVERLAYS */}
      {isLowHP && <div className="noise-overlay" />}
      <div className="fixed inset-0 grain-texture pointer-events-none z-50 opacity-10" />
      <div
        className="fixed left-0 right-0 h-px bg-black opacity-10 pointer-events-none z-40"
        style={{ top: `${scanLine}%` }}
      />
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <DataStream />
      </div>

      {/* HUD HEADER */}
      <header className={`border-b-[12px] border-black bg-white relative z-30 transition-all ${isBunkerMode ? 'opacity-0 -translate-y-full' : ''}`}>
        <div className="grid grid-cols-12 h-24">
          <div className="col-span-3 border-r-[12px] border-black p-4 relative flex flex-col justify-center">
            <h1 className="text-4xl font-black tracking-tighter leading-none">VERGA<br />MANO_HUD</h1>
          </div>

          <nav className="col-span-7 border-r-[12px] border-black flex items-center px-4 overflow-x-auto gap-2">
            {[
              { id: 'arena', label: 'ARENA' },
              { id: 'map', label: 'MAPA' },
              { id: 'neural', label: 'CHAT' },
              { id: 'lsd', label: 'LSD_FEED' },
              { id: 'market', label: 'MERCADO' }
            ].map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as any)}
                className={`px-4 py-2 font-black text-sm uppercase transition-all
                  ${activeModule === module.id ? 'bg-black text-white scale-110' : 'hover:bg-gray-100'}`}
              >
                {module.label}
              </button>
            ))}
          </nav>

          <div className="col-span-2 bg-[#FF1A1A] flex flex-col items-center justify-center p-2">
            <span className="text-white font-courier font-bold text-xs uppercase">STATUS</span>
            <span className="text-white font-black text-2xl uppercase">{isLowHP ? 'CRÍTICO' : 'OPERATOR'}</span>
          </div>
        </div>
      </header>

      {/* MAIN HUD CONTENT */}
      <main className={`min-h-[calc(100vh-192px)] relative transition-all ${isBunkerMode ? 'scale-110' : ''}`}>
        {activeModule === 'arena' && <ArenaView />}
        {activeModule === 'map' && <MapView />}
        {activeModule === 'neural' && <NeuralLinkView />}
        {activeModule === 'lsd' && <LSDFeedView />}
        {activeModule === 'market' && <MarketView />}

        {/* Bunker Mode Layer */}
        {isBunkerMode && (
          <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center text-white">
            <h2 className="text-9xl font-black mb-8 animate-pulse text-[#FF1A1A]">FOCUS</h2>
            <div className="text-6xl font-courier mb-12">24:59</div>
            <button className="bg-[#FF1A1A] text-white px-12 py-6 font-black text-2xl hover:bg-white hover:text-black transition-all">
              ABORTAR (-5 HP)
            </button>
          </div>
        )}
      </main>

      {/* HUD FOOTER */}
      {!isBunkerMode && (
        <footer className="border-t-[12px] border-black bg-white flex justify-between items-center p-4 h-24">
          <div className="flex gap-12">
            <div>
              <div className="text-[10px] font-black uppercase opacity-40">CARGA_BIO</div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-3 h-6 border-2 border-black ${i < (profile?.hp || 0) / 10 ? 'bg-black' : 'bg-transparent'}`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase opacity-40">CRÉDITOS</div>
              <div className="text-2xl font-black">{profile?.credits || 0} CR</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] font-black uppercase opacity-40">MOLTBOT_SIGNAL</div>
              <div className="text-sm font-bold text-[#00FF41]">ESTABLE_01</div>
            </div>
            <div className="w-12 h-12 opacity-50"><InkSplatterSVG /></div>
          </div>
        </footer>
      )}

      {/* DEV TOOLS (Injected by Moltbot) */}
      <XPTestTrigger />
    </div>
  );
}

export default App;
