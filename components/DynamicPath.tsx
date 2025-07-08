import React from 'react';
import { LevelConfig, CompletedLevel } from '../types';

interface DynamicPathProps {
  levels: LevelConfig[];
  completedLevels: CompletedLevel[];
}

const parsePosition = (pos: { top: string; left: string }) => ({
  y: parseFloat(pos.top),
  x: parseFloat(pos.left),
});

const DynamicPath: React.FC<DynamicPathProps> = ({ levels, completedLevels }) => {
  return (
    <svg
      width="100%"
      height="100%"
      className="absolute top-0 left-0"
      style={{ pointerEvents: 'none', zIndex: 1 }}
    >
      {levels.map(level => {
        const startPos = parsePosition(level.position);
        const isStartNodeCompleted = completedLevels.some(cl => cl.levelId === level.id);

        return level.nextLevelIds.map(nextId => {
          const nextLevel = levels.find(l => l.id === nextId);
          if (!nextLevel) return null;

          const endPos = parsePosition(nextLevel.position);
          const isEndNodeCompleted = completedLevels.some(cl => cl.levelId === nextId);

          const controlX = (startPos.x + endPos.x) / 2 + (startPos.y - endPos.y) * 0.1;
          const controlY = (startPos.y + endPos.y) / 2 + (endPos.x - startPos.x) * 0.1;

          const pathD = `M ${startPos.x} ${startPos.y} Q ${controlX} ${controlY} ${endPos.x} ${endPos.y}`;
          
          if (isStartNodeCompleted && isEndNodeCompleted) {
            // --- "TRAVELED" PATH ---
            // A solid, pulsing path for routes between two completed levels.
            return (
                <g key={`${level.id}-${nextId}-traveled`}>
                    {/* 1. Base path (solid, vibrant color) */}
                    <path
                      d={pathD}
                      stroke="#4f46e5" // indigo-600
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* 2. Pulsing highlight on top */}
                    <path
                      d={pathD}
                      stroke="#a5b4fc" // indigo-300
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      className="animate-pulse-strong"
                    />
                </g>
            );
          }
          
          if (isStartNodeCompleted) {
            // --- "POTENTIAL" PATH (Path of Light) ---
            // For paths leading from a completed level to an uncompleted one.
            return (
              <g key={`${level.id}-${nextId}-potential`}>
                {/* 1. Outer glow layer (thick, semi-transparent) */}
                <path
                  d={pathD}
                  stroke="#fef08a" // Light yellow
                  strokeWidth="12"
                  strokeOpacity="0.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* 2. Main path color (medium thickness) */}
                <path
                  d={pathD}
                  stroke="#facc15" // Golden yellow
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* 3. Bright core (thin) */}
                <path
                  d={pathD}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            );
          }

          // --- "LOCKED" PATH (Dashed) ---
          return (
            <g key={`${level.id}-${nextId}-locked`}>
              <path
                d={pathD}
                stroke="rgba(45, 27, 99, 0.6)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={pathD}
                stroke="#a78bfa"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1 8"
                strokeDashoffset="0"
                style={{ animation: 'dash 1s linear infinite' }}
              />
            </g>
          );
        });
      })}
    </svg>
  );
};

export default DynamicPath;