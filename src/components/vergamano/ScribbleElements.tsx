import React from 'react';

// Basquiat-style Crown
export const BasquiatCrown: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 60" className={`${className}`} style={{ overflow: 'visible' }}>
    <path
      d="M10 50 L20 20 L35 35 L50 10 L65 35 L80 20 L90 50"
      className="basquiat-crown"
      fill="none"
    />
    <path
      d="M15 45 L25 25 L35 38 L50 15 L65 38 L75 25 L85 45"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="50" cy="25" r="4" fill="#000000" />
    <path d="M50 10 L50 5 M20 20 L15 15 M80 20 L85 15" stroke="#000000" strokeWidth="3" />
  </svg>
);

// Hand-drawn Arrow
export const HandArrow: React.FC<{ direction?: 'left' | 'right' | 'up' | 'down'; className?: string }> = ({ 
  direction = 'right', 
  className = '' 
}) => {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  };
  
  return (
    <svg 
      viewBox="0 0 60 30" 
      className={`${className}`}
      style={{ transform: `rotate(${rotations[direction]}deg)`, overflow: 'visible' }}
    >
      <path
        d="M5 15 Q20 12, 40 15 Q50 16, 55 15 M45 8 Q55 15, 45 22"
        stroke="#000000"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 10 Q52 15, 42 20"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};

// Chaotic Scribble Lines
export const ChaoticScribble: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 100" className={`${className}`} style={{ overflow: 'visible' }}>
    <path
      d="M10 50 Q30 20, 50 50 T90 50 Q110 80, 130 50 T170 50 Q190 30, 200 50"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.7"
    />
    <path
      d="M5 60 Q25 40, 45 60 T85 55 Q105 75, 125 55 T165 60"
      stroke="#000000"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M20 40 Q40 70, 60 40 M80 45 Q100 75, 120 45 M140 40 Q160 70, 180 40"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// Cross-out Mark
export const CrossOut: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 20" className={`${className}`} style={{ overflow: 'visible' }}>
    <path
      d="M0 10 Q25 5, 50 10 Q75 15, 100 10"
      stroke="#000000"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M5 8 Q30 12, 55 8 Q80 4, 95 8"
      stroke="#000000"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Ink Splatter SVG Component
export const InkSplatterSVG: React.FC<{ className?: string; variant?: 1 | 2 }> = ({ 
  className = '', 
  variant = 1 
}) => {
  const splatters = {
    1: (
      <>
        <circle cx="50" cy="50" r="15" fill="#000000" />
        <ellipse cx="30" cy="40" rx="8" ry="5" fill="#000000" />
        <ellipse cx="70" cy="45" rx="10" ry="6" fill="#000000" />
        <ellipse cx="45" cy="70" rx="6" ry="10" fill="#000000" />
        <ellipse cx="60" cy="65" rx="7" ry="5" fill="#000000" />
        <circle cx="20" cy="30" r="4" fill="#000000" />
        <circle cx="80" cy="30" r="5" fill="#000000" />
        <circle cx="25" cy="70" r="3" fill="#000000" />
        <circle cx="75" cy="75" r="4" fill="#000000" />
        <path d="M50 35 L48 15 L52 15 Z" fill="#000000" />
        <path d="M65 50 L85 48 L85 52 Z" fill="#000000" />
        <path d="M35 55 L15 58 L15 54 Z" fill="#000000" />
        <circle cx="10" cy="50" r="2" fill="#000000" />
        <circle cx="90" cy="55" r="2.5" fill="#000000" />
        <circle cx="50" cy="90" r="3" fill="#000000" />
      </>
    ),
    2: (
      <>
        <circle cx="50" cy="45" r="20" fill="#000000" />
        <ellipse cx="25" cy="35" rx="12" ry="8" fill="#000000" />
        <ellipse cx="75" cy="40" rx="10" ry="12" fill="#000000" />
        <ellipse cx="50" cy="75" rx="15" ry="10" fill="#000000" />
        <circle cx="15" cy="55" r="6" fill="#000000" />
        <circle cx="85" cy="60" r="5" fill="#000000" />
        <circle cx="40" cy="20" r="4" fill="#000000" />
        <circle cx="65" cy="85" r="5" fill="#000000" />
        <path d="M50 25 L45 5 L55 8 Z" fill="#000000" />
        <path d="M70 50 L90 45 L88 55 Z" fill="#000000" />
        <circle cx="5" cy="40" r="3" fill="#000000" />
        <circle cx="95" cy="45" r="2" fill="#000000" />
        <circle cx="30" cy="90" r="4" fill="#000000" />
        <circle cx="80" cy="80" r="3" fill="#000000" />
      </>
    )
  };
  
  return (
    <svg viewBox="0 0 100 100" className={`${className}`} style={{ overflow: 'visible' }}>
      {splatters[variant]}
    </svg>
  );
};

// Doodle Frame
export const DoodleFrame: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" className={`${className}`} style={{ overflow: 'visible' }}>
    <path
      d="M10 10 Q100 5, 190 10 Q195 100, 190 190 Q100 195, 10 190 Q5 100, 10 10"
      stroke="#000000"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.4"
    />
    <path
      d="M15 15 Q100 12, 185 15 Q188 100, 185 185 Q100 188, 15 185 Q12 100, 15 15"
      stroke="#000000"
      strokeWidth="1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.3"
    />
  </svg>
);

// Aggressive Scratch Marks
export const ScratchMarks: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 60" className={`${className}`} style={{ overflow: 'visible' }}>
    <path
      d="M5 55 L25 5 M15 55 L35 10 M25 55 L45 8"
      stroke="#000000"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M55 50 L75 15 M65 52 L85 12 M75 50 L95 10"
      stroke="#000000"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// Chaotic Underline
export const ChaoticUnderline: React.FC<{ className?: string; width?: number }> = ({ 
  className = '',
  width = 100 
}) => (
  <svg 
    viewBox={`0 0 ${width} 12`} 
    className={`${className}`}
    style={{ overflow: 'visible', width: `${width}px` }}
  >
    <path
      d={`M0 6 Q${width * 0.1} 2, ${width * 0.2} 6 T${width * 0.4} 6 Q${width * 0.5} 10, ${width * 0.6} 6 T${width * 0.8} 6 Q${width * 0.9} 2, ${width} 6`}
      stroke="#000000"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d={`M2 8 Q${width * 0.15} 4, ${width * 0.3} 8 T${width * 0.5} 8 Q${width * 0.65} 12, ${width * 0.8} 8 T${width - 2} 8`}
      stroke="#000000"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Data Stream Lines
export const DataStream: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 40 200" className={`${className}`} style={{ overflow: 'visible' }}>
    {[...Array(8)].map((_, i) => (
      <rect
        key={i}
        x={10 + (i % 2) * 15}
        y={i * 25}
        width={8 + Math.random() * 8}
        height={3 + Math.random() * 4}
        fill="#000000"
        opacity={0.3 + Math.random() * 0.5}
      />
    ))}
  </svg>
);
