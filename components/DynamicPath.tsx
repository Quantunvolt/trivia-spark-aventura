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
        // The path should be lit if the level it originates from is completed.
        const isStartNodeCompleted = completedLevels.some(cl => cl.levelId === level.id);

        return level.nextLevelIds.map(nextId => {
          const nextLevel = levels.find(l => l.id === nextId);
          if (!nextLevel) return null;

          const endPos = parsePosition(nextLevel.position);

          const controlX = (startPos.x + endPos.x) / 2 + (startPos.y - endPos.y) * 0.1;
          const controlY = (startPos.y + endPos.y) / 2 + (endPos.x - startPos.x) * 0.1;

          const pathD = `M ${startPos.x}% ${startPos.y}% Q ${controlX}% ${controlY}% ${endPos.x}% ${endPos.y}%`;
          
          if (isStartNodeCompleted) {
            // --- NEW, MORE ROBUST "PATH OF LIGHT" ---
            // Uses multiple stacked strokes instead of a filter for better compatibility and visibility.
            return (
              <g key={`${level.id}-${nextId}-completed`}>
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

          // --- NORMAL PATH (UNCHANGED) ---
          return (
            <g key={`${level.id}-${nextId}-normal`}>
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
