"use client";

import { motion } from "framer-motion";

interface AudioWaveformProps {
  className?: string;
  barCount?: number;
  radius?: number;
}

export default function AudioWaveform({ 
  className = "", 
  barCount = 16,
  radius = 200 
}: AudioWaveformProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i);
  const angleStep = (2 * Math.PI) / barCount;

  return (
    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      <svg
        width={radius * 2 + 100}
        height={radius * 2 + 100}
        viewBox={`0 0 ${radius * 2 + 100} ${radius * 2 + 100}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="waveformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#D97706" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B87333" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {bars.map((bar, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const centerX = radius + 50;
          const centerY = radius + 50;
          const startX = centerX + Math.cos(angle) * (radius * 0.3);
          const startY = centerY + Math.sin(angle) * (radius * 0.3);
          const endX = centerX + Math.cos(angle) * radius;
          const endY = centerY + Math.sin(angle) * radius;
          
          // Varying bar heights for visual interest
          const baseHeight = 20 + (index % 3) * 15;
          const barWidth = 4;
          
          // Calculate bar position perpendicular to the radius
          const perpAngle = angle + Math.PI / 2;
          const offsetX = Math.cos(perpAngle) * (barWidth / 2);
          const offsetY = Math.sin(perpAngle) * (barWidth / 2);
          
          return (
            <motion.g key={index}>
              <motion.rect
                x={startX - offsetX}
                y={startY - offsetY}
                width={barWidth}
                height={baseHeight}
                fill="url(#waveformGradient)"
                filter="url(#glow)"
                rx={2}
                style={{
                  transformOrigin: `${startX}px ${startY}px`,
                  transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                }}
                animate={{
                  height: [
                    baseHeight * 0.3,
                    baseHeight * 1.2,
                    baseHeight * 0.5,
                    baseHeight * 1.0,
                    baseHeight * 0.3,
                  ],
                  opacity: [0.6, 1, 0.8, 1, 0.6],
                }}
                transition={{
                  duration: 1.5 + (index % 3) * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
              />
            </motion.g>
          );
        })}
        
        {/* Center microphone icon */}
        <circle
          cx={radius + 50}
          cy={radius + 50}
          r={15}
          fill="url(#waveformGradient)"
          opacity="0.8"
        />
        <circle
          cx={radius + 50}
          cy={radius + 50}
          r={8}
          fill="#1C1C1E"
        />
      </svg>
    </div>
  );
}

