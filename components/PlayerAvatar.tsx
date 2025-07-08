import React from 'react';
import { AVATAR_OPTIONS } from '../constants';
import { BrainIcon } from './icons';

interface PlayerAvatarProps {
  position: { top: string; left: string; } | null;
  playerAvatar: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ position, playerAvatar }) => {
  if (!position) {
    return null;
  }

  const positionStyle: React.CSSProperties = {
    top: `calc(${position.top} - 40px)`, // Position above the node
    left: position.left,
    transform: 'translateX(-50%)',
    transition: 'top 1.5s ease-in-out, left 1.5s ease-in-out',
  };

  const isCustomImage = playerAvatar.startsWith('data:image');
  const AvatarComponent = AVATAR_OPTIONS.find(a => a.id === playerAvatar)?.component || BrainIcon;

  return (
    <div
      style={positionStyle}
      className="absolute w-14 h-14 z-10 animate-bounce-slow"
      aria-label="Posición del jugador"
    >
      <div className="w-full h-full bg-purple-200 rounded-full border-4 border-white shadow-lg flex justify-center items-center overflow-hidden">
        {isCustomImage ? (
            <img src={playerAvatar} alt="Avatar del jugador" className="w-full h-full object-cover" />
        ) : (
            <AvatarComponent className="w-10 h-10 text-purple-700" />
        )}
      </div>
      {/* Arrow pointing down */}
      <div 
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '12px solid white',
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
        }}
      ></div>
    </div>
  );
};

export default PlayerAvatar;