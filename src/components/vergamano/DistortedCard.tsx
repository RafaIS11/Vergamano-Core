import { useState, useRef, useEffect } from 'react';
import { InkSplatterSVG, HandArrow } from './ScribbleElements';

interface DistortedCardProps {
  title: string;
  value?: string;
  subtitle?: string;
  status?: 'normal' | 'warning' | 'critical';
  crossedOut?: boolean;
  scribbleIntensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
  className?: string;
  arrowDirection?: 'left' | 'right' | 'up' | 'down';
  showArrow?: boolean;
  annotation?: string;
}

export const DistortedCard: React.FC<DistortedCardProps> = ({
  title,
  value,
  subtitle,
  status = 'normal',
  crossedOut = false,
  scribbleIntensity = 'medium',
  children,
  className = '',
  arrowDirection = 'right',
  showArrow = false,
  annotation
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [skewValues, setSkewValues] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setSkewValues({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 3
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setSkewValues({ x: 0, y: 0 });
    }
  }, [isHovered]);

  const statusStyles = {
    normal: '',
    warning: 'bg-black text-white',
    critical: 'bg-black text-white'
  };

  const scribblePositions = {
    low: [{ top: '5%', left: '85%' }],
    medium: [
      { top: '5%', left: '85%' },
      { bottom: '10%', right: '5%' }
    ],
    high: [
      { top: '5%', left: '85%' },
      { top: '40%', left: '-5%' },
      { bottom: '10%', right: '5%' },
      { bottom: '30%', left: '90%' }
    ]
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ink Splatters */}
      {scribblePositions[scribbleIntensity].map((pos, i) => (
        <div
          key={i}
          className="absolute w-12 h-12 pointer-events-none z-10"
          style={{
            ...pos,
            transform: `rotate(${Math.random() * 360}deg) scale(${0.6 + Math.random() * 0.4})`,
            opacity: 0.7
          }}
        >
          <InkSplatterSVG variant={(i % 2 + 1) as 1 | 2} />
        </div>
      ))}

      {/* Main Card */}
      <div
        className={`
          relative bg-white border-[8pt] border-black p-6
          transition-all duration-100
          ${statusStyles[status]}
        `}
        style={{
          transform: `skew(${skewValues.x}deg, ${skewValues.y}deg)`,
          clipPath: isHovered
            ? 'polygon(2% 0%, 98% 2%, 100% 98%, 0% 100%)'
            : 'polygon(0% 1%, 100% 0%, 99% 100%, 1% 99%)'
        }}
      >
        {/* Secondary Border Effect */}
        <div
          className="absolute inset-0 border-2 border-black opacity-20 pointer-events-none"
          style={{ transform: 'translate(4px, 4px)' }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <div className="flex items-start justify-between mb-4">
            <h3 className={`
              font-helvetica text-sm font-black tracking-wider uppercase
              ${crossedOut ? 'crossed-out' : ''}
            `}>
              {title}
            </h3>
            {showArrow && (
              <div className="w-8 h-4">
                <HandArrow direction={arrowDirection} />
              </div>
            )}
          </div>

          {/* Value */}
          {value && (
            <div className="mb-2">
              <span className="font-courier text-4xl font-bold tracking-tighter">
                {value}
              </span>
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="font-courier text-xs opacity-70 mt-2">
              {subtitle}
            </p>
          )}

          {/* Custom Content */}
          {children}
        </div>

        {/* Annotation */}
        {annotation && (
          <div className="absolute -bottom-8 -right-4 font-courier text-xs transform rotate-[-5deg]">
            <span className="chaotic-underline">{annotation}</span>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {status !== 'normal' && (
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-black border-4 border-white">
          <div className="w-full h-full animate-pulse bg-white" />
        </div>
      )}
    </div>
  );
};

// Compact Metric Card
export const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  chaotic?: boolean;
}> = ({ label, value, change, trend = 'neutral', chaotic = false }) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (chaotic) {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [chaotic]);

  return (
    <div className={`
      relative bg-white border-[6pt] border-black p-4
      ${chaotic ? 'hover:skew-x-1 hover:skew-y-0.5' : ''}
      transition-transform duration-100
    `}>
      {/* Grain Texture */}
      <div className="absolute inset-0 grain-texture pointer-events-none opacity-30" />

      <div className="relative z-10">
        <p className="font-helvetica text-[10px] font-black uppercase tracking-widest mb-2 crossed-out-steep">
          {label}
        </p>
        <div className="flex items-baseline gap-3">
          <span className={`
            font-courier text-2xl font-bold
            ${glitch ? 'translate-x-0.5' : ''}
            transition-transform
          `}>
            {value}
          </span>
          {change && (
            <span className={`
              font-courier text-xs
              ${trend === 'up' ? '' : trend === 'down' ? 'crossed-out' : ''}
            `}>
              {change}
            </span>
          )}
        </div>
      </div>

      {/* Chaos Element */}
      {chaotic && (
        <div className="absolute -top-2 -left-2 w-4 h-4">
          <InkSplatterSVG variant={1} />
        </div>
      )}
    </div>
  );
};

// Alert Card with High Chaos
export const AlertCard: React.FC<{
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}> = ({ level, message, timestamp }) => {
  const levelStyles = {
    low: 'border-black',
    medium: 'border-black bg-gray-50',
    high: 'border-black bg-gray-100',
    critical: 'border-[10pt] border-black bg-black text-white'
  };

  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    if (level === 'critical') {
      const interval = setInterval(() => {
        setFlicker(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [level]);

  return (
    <div className={`
      relative border-[8pt] p-4
      ${levelStyles[level]}
      ${flicker ? 'opacity-90' : 'opacity-100'}
      transition-opacity
    `}>
      {/* Scratch Marks for High/Critical */}
      {(level === 'high' || level === 'critical') && (
        <div className="absolute -top-3 right-10 w-16 h-8">
          <svg viewBox="0 0 60 30" className="w-full h-full">
            <path d="M5 25 L15 5 M10 25 L20 8" stroke="#000000" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className={`
            font-helvetica text-xs font-black uppercase tracking-wider mb-1
            ${level === 'critical' ? 'text-white' : 'crossed-out'}
          `}>
            ALERT_{level}
          </p>
          <p className={`
            font-courier text-sm
            ${level === 'critical' ? 'text-white' : ''}
          `}>
            {message}
          </p>
        </div>
        <span className={`
          font-courier text-[10px]
          ${level === 'critical' ? 'text-white opacity-70' : 'opacity-50'}
        `}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};
