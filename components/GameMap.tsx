import React, { useEffect, useRef } from 'react';
import { LevelConfig, CompletedLevel } from '../types';
import LevelNode from './LevelNode';
import DynamicPath from './DynamicPath';
import PlayerAvatar from './PlayerAvatar';

interface GameMapProps {
  levels: LevelConfig[];
  unlockedLevelIds: number[];
  completedLevels: CompletedLevel[];
  onSelectLevel: (level: LevelConfig) => void;
  avatarPosition: { top: string; left: string } | null;
  playerAvatar: string;
}

const GameMap: React.FC<GameMapProps> = ({ levels, unlockedLevelIds, completedLevels, onSelectLevel, avatarPosition, playerAvatar }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mapContentRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to the player's current area of progression
    useEffect(() => {
        if (scrollContainerRef.current && mapContentRef.current && avatarPosition) {
            const mapHeight = mapContentRef.current.offsetHeight;
            const levelTopPixels = (parseFloat(avatarPosition.top) / 100) * mapHeight;
            const containerHeight = scrollContainerRef.current.offsetHeight;
            
            // Calculate scroll position to center the level, with a small offset
            const scrollToY = levelTopPixels - (containerHeight / 2) + 50; 

            // Use a timeout to ensure layout is stable, especially on initial load
            setTimeout(() => {
                scrollContainerRef.current?.scrollTo({
                    top: scrollToY,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [avatarPosition]);

    return (
        <div ref={scrollContainerRef} className="relative w-full h-full overflow-y-auto">
            <div ref={mapContentRef} className="relative w-full" style={{ height: '1000vh' }}>
                <DynamicPath levels={levels} completedLevels={completedLevels} />
                {levels.map(level => (
                    <LevelNode
                        key={level.id}
                        level={level}
                        unlockedLevelIds={unlockedLevelIds}
                        completedStatus={completedLevels.find(cl => cl.levelId === level.id)}
                        onSelectLevel={onSelectLevel}
                    />
                ))}
                <PlayerAvatar position={avatarPosition} playerAvatar={playerAvatar} />
            </div>
        </div>
    );
};

export default GameMap;