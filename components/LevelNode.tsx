import React from 'react';
import { LevelConfig, CompletedLevel } from '../types';
import { StarIcon, LockClosedIcon } from './icons';

interface LevelNodeProps {
  level: LevelConfig;
  unlockedLevelIds: number[];
  completedStatus?: CompletedLevel;
  onSelectLevel: (level: LevelConfig) => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({ level, unlockedLevelIds, completedStatus, onSelectLevel }) => {
  const isUnlocked = unlockedLevelIds.includes(level.id);
  const isCompleted = !!completedStatus;
  const isCurrent = isUnlocked && !isCompleted;

  const nodeSize = level.isBossLevel ? 'w-24 h-24' : 'w-20 h-20';
  const textSize = level.isBossLevel ? 'text-4xl' : 'text-3xl';
  
  let baseClasses = `absolute flex items-center justify-center rounded-full font-display transform transition-transform duration-300`;
  let interactiveClasses = '';

  const applyClasses = (current: string, completed: string, locked: string) => {
    if (isCurrent) {
        baseClasses += ` ${nodeSize} ${textSize} ${current}`;
        interactiveClasses = 'hover:scale-110 cursor-pointer';
    } else if (isCompleted) {
        baseClasses += ` ${nodeSize} ${textSize} ${completed}`;
        interactiveClasses = 'cursor-pointer'; // Can be replayed
    } else { // Locked
        baseClasses += ` ${nodeSize} ${textSize} ${locked}`;
    }
  };

  if (level.isBonus) {
      applyClasses(
          'bg-gradient-to-br from-amber-400 to-orange-500 border-8 border-yellow-200 text-white shadow-2xl z-10 animate-pulse-strong',
          'bg-gradient-to-br from-amber-500 to-orange-600 border-4 border-yellow-300 text-yellow-100 shadow-lg',
          'bg-gray-500 border-4 border-gray-400 text-gray-300 shadow-inner opacity-80'
      );
  } else {
      applyClasses(
          'bg-blue-500 border-8 border-blue-300 text-white shadow-2xl z-10 animate-pulse-strong',
          'bg-blue-700 border-4 border-blue-400 text-blue-200 shadow-lg',
          'bg-gray-500 border-4 border-gray-400 text-gray-300 shadow-inner opacity-80'
      );
  }
  
  const positionStyle: React.CSSProperties = {
    top: level.position.top,
    left: level.position.left,
    transform: 'translate(-50%, -50%)',
  };
  
  const getLockedContent = () => {
    if (level.keyCost && !isUnlocked) {
      return <LockClosedIcon className="w-1/2 h-1/2 text-gray-200" />;
    }
    if (level.requiredLevel && !isUnlocked) {
      return <div className="text-center leading-none">
        <div className="text-sm font-bold">NIVEL</div>
        <div className="text-4xl">{level.requiredLevel}</div>
      </div>;
    }
    return <span>{level.id}</span>;
  };

  return (
    <div
      style={positionStyle}
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={() => isUnlocked && onSelectLevel(level)}
    >
      {!isUnlocked ? getLockedContent() : <span>{level.id}</span>}
      
      {isCompleted && (
        <div className="absolute -top-4 flex">
          {[...Array(3)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`w-6 h-6 ${i < completedStatus.stars ? 'text-yellow-400' : 'text-gray-400'}`}
            />
          ))}
        </div>
      )}
      {level.isBossLevel && (
         <div className="absolute -bottom-5">
            <span className="text-sm font-body text-white bg-red-600 px-2 py-1 rounded-full shadow-md">JEFE</span>
         </div>
      )}
      {level.isBonus && !level.isBossLevel && (
         <div className="absolute -bottom-5">
            <span className="text-sm font-body text-white bg-purple-600 px-2 py-1 rounded-full shadow-md">BONUS</span>
         </div>
      )}
    </div>
  );
};

export default LevelNode;