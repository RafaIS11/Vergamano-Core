import React, { useState, useEffect, useRef } from 'react';
import { 
  BasquiatCrown, 
  HandArrow, 
  ChaoticScribble, 
  CrossOut,
  InkSplatterSVG,
  ScratchMarks,
  ChaoticUnderline,
  DataStream
} from './components/vergamano/ScribbleElements';
import { DistortedCard, MetricCard, AlertCard } from './components/vergamano/DistortedCard';

// Typewriter Text Component
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

  return (
    <span className={`${className} typewriter-cursor`}>
      {displayText}
    </span>
  );
};

// Glitching Number Component
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
    <span className={`${className} ${isGlitching ? 'glitch-hover' : ''}`}>
      {displayValue}
    </span>
  );
};

// Main App Component
function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scanLine, setScanLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(scanInterval);
  }, []);

  const metrics = [
    { label: 'COGNITIVE_LOAD', value: '87.3%', change: '+12.5%', trend: 'up' as const, chaotic: true },
    { label: 'STRESS_INDEX', value: '64.8', change: '-3.2%', trend: 'down' as const, chaotic: false },
    { label: 'FOCUS_DEPTH', value: '92.1', change: '+8.7%', trend: 'up' as const, chaotic: true },
    { label: 'ANXIETY_LVL', value: '41.2', change: '+15.3%', trend: 'up' as const, chaotic: true },
  ];

  const alerts = [
    { level: 'critical' as const, message: 'NEURAL SPIKE DETECTED // SECTOR 7', timestamp: '14:23:07' },
    { level: 'high' as const, message: 'ATTENTION FRAGMENTATION EXCEEDS THRESHOLD', timestamp: '14:21:45' },
    { level: 'medium' as const, message: 'MEMORY RECALL LATENCY INCREASED', timestamp: '14:18:22' },
    { level: 'low' as const, message: 'BIO-RHYTHM SYNC COMPLETE', timestamp: '14:15:00' },
  ];

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white text-black overflow-x-hidden relative"
    >
      {/* Global Grain Texture */}
      <div className="fixed inset-0 grain-texture pointer-events-none z-50 opacity-20" />

      {/* Scan Line Effect */}
      <div 
        className="fixed left-0 right-0 h-px bg-black opacity-10 pointer-events-none z-40"
        style={{ top: `${scanLine}%` }}
      />

      {/* HEADER SECTION */}
      <header className="border-b-[8pt] border-black relative">
        {/* Ink Splatters in Header */}
        <div className="absolute top-4 right-20 w-20 h-20 pointer-events-none">
          <InkSplatterSVG variant={1} />
        </div>
        <div className="absolute bottom-2 left-1/3 w-12 h-12 pointer-events-none opacity-60">
          <InkSplatterSVG variant={2} />
        </div>

        <div className="grid grid-cols-12 gap-0">
          {/* Logo Area */}
          <div className="col-span-3 border-r-[8pt] border-black p-6 relative">
            <div className="absolute -top-2 -left-2 w-8 h-8">
              <BasquiatCrown />
            </div>
            <h1 className="font-helvetica text-4xl font-black tracking-tighter ml-4">
              VERGA
              <span className="crossed-out">MAN</span>
              O
            </h1>
            <p className="font-courier text-xs mt-2 opacity-70">
              PSYCHOLOGICAL COMMAND CENTER
            </p>
            <div className="absolute bottom-2 right-2 w-6 h-3">
              <HandArrow direction="right" />
            </div>
          </div>

          {/* Status Bar */}
          <div className="col-span-6 border-r-[8pt] border-black p-4">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-courier text-[10px] opacity-50 uppercase">System Status</p>
                  <p className="font-helvetica text-sm font-bold">
                    <TypewriterText text="OPERATIONAL" delay={500} />
                  </p>
                </div>
                <div className="w-px h-8 bg-black" />
                <div>
                  <p className="font-courier text-[10px] opacity-50 uppercase">Subject ID</p>
                  <p className="font-courier text-sm font-bold">SUBJ_7749_ALPHA</p>
                </div>
                <div className="w-px h-8 bg-black" />
                <div>
                  <p className="font-courier text-[10px] opacity-50 uppercase">Session</p>
                  <p className="font-courier text-sm font-bold">#4,291</p>
                </div>
              </div>
              <div className="relative">
                <ChaoticScribble className="w-24 h-8" />
              </div>
            </div>
          </div>

          {/* Clock */}
          <div className="col-span-3 p-4 relative">
            <div className="absolute top-2 right-2 w-4 h-4">
              <ScratchMarks />
            </div>
            <p className="font-courier text-[10px] opacity-50 uppercase">Local Time</p>
            <p className="font-courier text-3xl font-bold tracking-widest">
              <GlitchNumber value={currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })} />
            </p>
            <p className="font-courier text-xs opacity-70 mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              }).toUpperCase()}
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="grid grid-cols-12 gap-0 min-h-[calc(100vh-140px)]">
        
        {/* LEFT SIDEBAR - Metrics */}
        <aside className="col-span-3 border-r-[8pt] border-black p-4 space-y-4">
          <div className="mb-6">
            <h2 className="font-helvetica text-lg font-black uppercase crossed-out mb-4">
              Vital Metrics
            </h2>
            <div className="w-full">
              <ChaoticUnderline width={200} />
            </div>
          </div>

          {metrics.map((metric, i) => (
            <MetricCard
              key={i}
              {...metric}
            />
          ))}

          {/* Data Stream Visual */}
          <div className="border-[6pt] border-black p-4 mt-6 relative">
            <p className="font-courier text-[10px] uppercase opacity-50 mb-2">Neural Stream</p>
            <div className="h-32 flex justify-around items-end overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-black transition-all duration-300"
                  style={{
                    height: `${20 + Math.random() * 80}%`,
                    opacity: 0.3 + Math.random() * 0.7
                  }}
                />
              ))}
            </div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8">
              <InkSplatterSVG variant={2} />
            </div>
          </div>

          {/* Hand-drawn Arrow */}
          <div className="flex justify-center py-4">
            <div className="w-12 h-6 transform rotate-90">
              <HandArrow direction="down" />
            </div>
          </div>
        </aside>

        {/* CENTER - Main Display */}
        <section className="col-span-6 border-r-[8pt] border-black relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

          {/* Main Content */}
          <div className="p-6 relative z-10">
            {/* Primary Display Card */}
            <DistortedCard
              title="CONSCIOUSNESS MAP"
              scribbleIntensity="high"
              className="mb-6"
              showArrow
              arrowDirection="right"
              annotation="unstable"
            >
              <div className="h-64 border-4 border-black relative overflow-hidden">
                {/* Abstract Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {/* Concentric chaotic circles */}
                    {[...Array(8)].map((_, i) => (
                      <ellipse
                        key={i}
                        cx="200"
                        cy="100"
                        rx={30 + i * 20}
                        ry={25 + i * 15}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={1 + (8 - i) * 0.5}
                        opacity={0.1 + (8 - i) * 0.1}
                        style={{
                          transform: `rotate(${i * 15}deg)`,
                          transformOrigin: '200px 100px'
                        }}
                      />
                    ))}
                    {/* Center node */}
                    <circle cx="200" cy="100" r="15" fill="#000000" />
                    <circle cx="200" cy="100" r="8" fill="#FFFFFF" />
                    
                    {/* Scattered nodes */}
                    {[
                      [80, 60], [320, 70], [100, 140], [300, 130],
                      [150, 40], [250, 160], [60, 100], [340, 100]
                    ].map(([x, y], i) => (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill="#000000" />
                        <line 
                          x1="200" y1="100" 
                          x2={x} y2={y} 
                          stroke="#000000" 
                          strokeWidth="1" 
                          opacity="0.3"
                          strokeDasharray="4 2"
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4">
                  <p className="font-courier text-xs opacity-70">ACTIVE NODES: 847</p>
                  <p className="font-courier text-xs opacity-70">CONNECTIONS: 12,394</p>
                </div>

                {/* Corner Marks */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black" />
              </div>
            </DistortedCard>

            {/* Secondary Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <DistortedCard
                title="MEMORY_BANK"
                value="73%"
                subtitle="RECALL EFFICIENCY DEGRADED"
                scribbleIntensity="medium"
                crossedOut
              />
              <DistortedCard
                title="EMOTION_STATE"
                value="MIXED"
                subtitle="FLUCTUATION DETECTED"
                scribbleIntensity="high"
                status="warning"
              />
            </div>

            {/* Cross-out Section */}
            <div className="mt-6 border-[6pt] border-black p-4 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-2">
                <span className="font-courier text-xs crossed-out">DEPRECATED METRICS</span>
              </div>
              <div className="grid grid-cols-3 gap-4 opacity-50">
                <div className="text-center">
                  <p className="font-helvetica text-2xl font-bold crossed-out">42.7</p>
                  <p className="font-courier text-[10px]">HAPPINESS_IDX</p>
                </div>
                <div className="text-center">
                  <p className="font-helvetica text-2xl font-bold crossed-out">88.3</p>
                  <p className="font-courier text-[10px]">SANITY_METER</p>
                </div>
                <div className="text-center">
                  <p className="font-helvetica text-2xl font-bold crossed-out">N/A</p>
                  <p className="font-courier text-[10px]">PEACE_LEVEL</p>
                </div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 flex justify-center">
                <CrossOut className="w-3/4" />
              </div>
            </div>
          </div>

          {/* Bottom Ink Splatters */}
          <div className="absolute bottom-10 left-4 w-16 h-16 pointer-events-none">
            <InkSplatterSVG variant={1} />
          </div>
        </section>

        {/* RIGHT SIDEBAR - Alerts & Logs */}
        <aside className="col-span-3 p-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-helvetica text-lg font-black uppercase">
              Alert Log
            </h2>
            <div className="w-6 h-3">
              <HandArrow direction="down" />
            </div>
          </div>

          {/* Alerts Stack */}
          <div className="space-y-3 mb-6">
            {alerts.map((alert, i) => (
              <AlertCard key={i} {...alert} />
            ))}
          </div>

          {/* System Log */}
          <div className="border-[6pt] border-black p-4 relative">
            <div className="absolute -top-3 left-3 bg-white px-1">
              <span className="font-courier text-[10px] uppercase">System Log</span>
            </div>
            <div className="font-courier text-xs space-y-1 h-48 overflow-hidden">
              {[
                '[14:23:12] Neural sync initiated',
                '[14:23:08] WARNING: Spike detected',
                '[14:22:45] Calibrating sensors...',
                '[14:22:30] Baseline established',
                '[14:21:15] Subject responsive',
                '[14:20:00] Session started',
                '[14:19:45] Pre-check complete',
                '[14:19:30] Connecting...',
              ].map((log, i) => (
                <p key={i} className={i === 0 ? 'font-bold' : 'opacity-60'}>
                  {log}
                </p>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4">
              <DataStream />
            </div>
          </div>

          {/* Manual Override Button */}
          <button className="w-full brutalist-btn mt-6 text-lg relative overflow-hidden group">
            <span className="relative z-10">EMERGENCY RESET</span>
            <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              CONFIRM?
            </span>
          </button>

          {/* Decorative Elements */}
          <div className="mt-6 flex justify-between items-center">
            <div className="w-8 h-8">
              <BasquiatCrown />
            </div>
            <ChaoticScribble className="w-24 h-6" />
          </div>
        </aside>
      </main>

      {/* FOOTER */}
      <footer className="border-t-[8pt] border-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <p className="font-courier text-xs opacity-50">
              VERGAMANO v2.4.1 // BUILD 8842
            </p>
            <p className="font-courier text-xs opacity-50">
              LICENSE: RESTRICTED
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-courier text-xs crossed-out">STABLE</span>
            <div className="w-px h-4 bg-black opacity-30" />
            <span className="font-courier text-xs font-bold">CHAOS_MODE: ACTIVE</span>
            <div className="w-2 h-2 bg-black animate-pulse" />
          </div>
        </div>
      </footer>

      {/* Floating Chaos Elements */}
      <div className="fixed top-1/4 right-8 w-20 h-20 pointer-events-none opacity-40 z-30">
        <InkSplatterSVG variant={2} />
      </div>
      <div className="fixed bottom-1/4 left-8 w-16 h-16 pointer-events-none opacity-30 z-30">
        <InkSplatterSVG variant={1} />
      </div>
    </div>
  );
}

export default App;
