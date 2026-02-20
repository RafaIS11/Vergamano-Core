import React from 'react';
import { useGame } from '../../../context/GameContext';
import { motion } from 'framer-motion';

/**
 * THE VOID
 * V4.0 Protocol: Generative Visual Hostility
 * When HP drops < 30%, this overlay activates mix-blend-mode and CSS aberration
 * to make the app physically uncomfortable to look at.
 */
export const TheVoid: React.FC = () => {
    const { profile } = useGame();
    const hp = profile?.hp ?? 100;

    // Only render the intense layer if HP is critical
    if (hp >= 30) return null;

    // The lower the HP, the more chaotic the distortion
    const intensity = Math.max(0, 30 - hp) / 30; // 0.0 to 1.0
    const filterFrequency = 0.05 + (0.1 * intensity);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: intensity * 0.8 }}
            transition={{ duration: 2 }}
            className="fixed inset-0 pointer-events-none z-50 mix-blend-difference"
            style={{
                willChange: 'transform, opacity, filter',
                backdropFilter: `blur(${intensity * 3}px) contrast(${100 + intensity * 150}%)`,
                backgroundColor: `rgba(255, 0, 0, ${intensity * 0.15})`
            }}
        >
            {/* SVG Generative Turbulence Layer */}
            <svg width="0" height="0" className="absolute">
                <filter id="void-distortion">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency={filterFrequency}
                        numOctaves="3"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale={intensity * 15}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            {/* CSS Chromatic Aberration & Glitch Overlay */}
            <div
                className="w-full h-full"
                style={{
                    filter: 'url(#void-distortion)',
                    backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0, 0, 0, ${intensity * 0.3}) 2px,
                        rgba(0, 0, 0, ${intensity * 0.3}) 4px
                    )`
                }}
            />
        </motion.div>
    );
};
