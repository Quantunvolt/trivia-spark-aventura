import React, { useEffect, useRef } from 'react';

interface LevelUpCelebrationProps {
  show: boolean;
  levelInfo: { from: number; to: number } | null;
  onCelebrationEnd: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute top-0" style={style}>
    <div className="w-2 h-4" />
  </div>
);

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ show, levelInfo, onCelebrationEnd }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio on component mount
    if (!audioRef.current) {
        audioRef.current = new Audio("https://raw.githubusercontent.com/Quantunvolt/trivia-spark-aventura/main/dist/assets/sounds/music_level_complete.mp3");
        audioRef.current.preload = 'auto';
    }

    if (show) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => console.error("Audio playback failed:", error));
      }
      
      const timer = setTimeout(() => {
        onCelebrationEnd();
      }, 4000); // 4-second celebration

      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
      };
    }
  }, [show, onCelebrationEnd]);


  if (!show || !levelInfo) {
    return null;
  }

  const confetti = Array.from({ length: 50 }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      animation: `confetti-fall ${1 + Math.random() * 2}s linear ${Math.random() * 2}s forwards`,
      backgroundColor: ['#f43f5e', '#3b82f6', '#22c55e', '#facc15', '#a855f7'][Math.floor(Math.random() * 5)],
      transform: `rotate(${Math.random() * 360}deg)`,
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[60] animate-fade-in overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {confetti}
      </div>
      <div className="text-center text-white transform animate-slide-in-up">
        <h2 className="font-display text-5xl md:text-7xl text-yellow-300 drop-shadow-lg mb-4" style={{ WebkitTextStroke: '2px #ca8a04' }}>
          ¡SUBISTE DE NIVEL!
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <span className="font-display text-6xl opacity-70">{levelInfo.from}</span>
          <svg className="w-12 h-12 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
          <span className="font-display text-9xl animate-pulse-strong">{levelInfo.to}</span>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebration;