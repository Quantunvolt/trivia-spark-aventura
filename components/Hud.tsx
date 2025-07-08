import React from 'react';
import { HeartIcon, TrophyIcon, KeyIcon, GemIcon, UserCircleIcon, ShoppingBagIcon, ChartBarIcon } from './icons';
import { MAX_LIVES } from '../constants';

interface HudProps {
  lives: number;
  score: number;
  keys: number;
  gems: number;
  level: number;
  xp: number;
  xpForNextLevel: number;
  rechargeTimer: string;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  onOpenRanking: () => void;
}

const Hud: React.FC<HudProps> = ({ lives, score, keys, gems, level, xp, xpForNextLevel, rechargeTimer, onOpenProfile, onOpenShop, onOpenRanking }) => {
  const xpProgress = xpForNextLevel > 0 ? (xp / xpForNextLevel) * 100 : 0;

  return (
    <div className="fixed top-2 sm:top-4 left-2 right-2 sm:left-4 sm:right-4 z-20 flex justify-between items-start font-body">
      {/* Left side: Resources & Player Level */}
      <div className="flex items-start gap-2">
        {/* Level Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 flex items-center gap-3 shadow-lg w-40 sm:w-48">
            <div className="flex-shrink-0 bg-purple-500 text-white font-bold font-display rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-inner">
                {level}
            </div>
            <div className="w-full">
                <p className="text-xs font-bold text-slate-600 uppercase">Nivel</p>
                <div className="bg-slate-300 rounded-full h-2.5 w-full mt-0.5 overflow-hidden border border-slate-400/50">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full" style={{ width: `${xpProgress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 text-right w-full -mt-0.5">{xp.toLocaleString()}/{xpForNextLevel.toLocaleString()}</p>
            </div>
        </div>

        {/* Score Display */}
        <div className="hidden sm:flex bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 items-center gap-2 shadow-lg">
          <TrophyIcon className="w-6 h-6 text-amber-500" />
          <span className="font-bold text-xl text-slate-700">{score.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Right side: Currencies & Actions */}
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-end gap-1">
          {/* Currencies */}
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
              <HeartIcon className="w-6 h-6 text-red-500" />
              <span className="font-bold text-lg text-slate-700">{lives}</span>
            </div>
            <div className="flex items-center gap-1 px-2 border-r border-slate-300">
              <KeyIcon className="w-6 h-6 text-yellow-600" />
              <span className="font-bold text-lg text-slate-700">{keys}</span>
            </div>
            <div className="flex items-center gap-1 pl-2">
              <GemIcon className="w-6 h-6 text-cyan-500" />
              <span className="font-bold text-lg text-slate-700">{gems}</span>
            </div>
          </div>
          {/* Timer */}
          {lives < MAX_LIVES && rechargeTimer && (
              <div className="text-xs font-mono font-bold text-white bg-black/50 rounded-md px-2 py-1">
                  Próxima vida en: {rechargeTimer}
              </div>
          )}
        </div>

         {/* Action Buttons */}
         <div className="flex flex-col gap-2">
            <button onClick={onOpenProfile} className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-slate-200 transition">
              <UserCircleIcon className="w-6 h-6 text-slate-600" />
            </button>
            <button onClick={onOpenShop} className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-slate-200 transition">
              <ShoppingBagIcon className="w-6 h-6 text-slate-600" />
            </button>
            <button onClick={onOpenRanking} className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-slate-200 transition">
              <ChartBarIcon className="w-6 h-6 text-slate-600" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Hud;