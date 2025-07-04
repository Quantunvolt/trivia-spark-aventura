import React, { useState, useMemo } from 'react';
import Modal from './Modal';

interface RankingProps {
  show: boolean;
  onClose: () => void;
  playerScore: number;
  playerName: string;
  playerCountry: string;
}

// --- MOCK DATA ---
const mockLeaderboard = [
  { name: 'CosmicComet', score: 185230, country: 'US' },
  { name: 'QuantumQuizzer', score: 179850, country: 'DE' },
  { name: 'TriviaTitan', score: 175100, country: 'ES' },
  { name: 'GalacticGamer', score: 168400, country: 'US' },
  { name: 'LogicLord', score: 162330, country: 'ES' },
  { name: 'ProtonPlayer', score: 155980, country: 'MX' },
  { name: 'SynapseSurfer', score: 148720, country: 'FR' },
  { name: 'StarlightSeeker', score: 141500, country: 'JP' },
  { name: 'BrainiacBrawler', score: 135600, country: 'ES' },
  { name: 'PuzzleProdigy', score: 129880, country: 'CA' },
  { name: 'CleverCat', score: 112000, country: 'MX' },
  { name: 'CaptainCortex', score: 98500, country: 'US' },
  { name: 'MajorMind', score: 85430, country: 'DE' },
  { name: 'SirKnowsALot', score: 71200, country: 'GB' },
  { name: 'WiseWhiz', score: 65330, country: 'ES' },
].sort((a, b) => b.score - a.score);

const mockFriends = [
    { name: 'AmigoAitor', score: 125300, online: true },
    { name: 'BestieBeatriz', score: 98500, online: false },
    { name: 'ColegaCarlos', score: 81200, online: true },
    { name: 'DanielaLaDivertida', score: 55400, online: false },
];

const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 text-center font-bold text-sm sm:text-base border-b-4 transition-colors duration-200 ${
            isActive
                ? 'text-indigo-600 border-indigo-500'
                : 'text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700'
        }`}
    >
        {label}
    </button>
);


const Ranking: React.FC<RankingProps> = ({ show, onClose, playerScore, playerName, playerCountry }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'country' | 'friends'>('global');

  const { global, country, friends } = useMemo(() => {
    const playerEntry = { name: playerName, score: playerScore, country: playerCountry };

    // Global Leaderboard
    const globalBoard = [...mockLeaderboard, playerEntry]
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }));

    // Country Leaderboard
    const countryBoard = [...mockLeaderboard, playerEntry]
      .filter(p => p.country === playerCountry)
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }));

    // Friends Leaderboard
    const friendsBoard = [...mockFriends, { ...playerEntry, online: true }]
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({ ...p, rank: i + 1 }));
      
    return { global: globalBoard, country: countryBoard, friends: friendsBoard };
  }, [playerScore, playerName, playerCountry]);
  
  const leaderboards = { global, country, friends };
  const currentBoard = leaderboards[activeTab];
  const playerRank = currentBoard.find(p => p.name === playerName)?.rank;
  const topPlayers = currentBoard.slice(0, 15);
  const isPlayerInTop = topPlayers.some(p => p.name === playerName);

  return (
    <Modal title="Clasificación" show={show} onClose={onClose}>
        <div className="flex flex-col text-left -mx-6 -my-4">
            {/* Tabs */}
            <div className="flex border-b-2 border-slate-200 mb-2 bg-slate-50/50 rounded-t-2xl">
                <TabButton label="Global" isActive={activeTab === 'global'} onClick={() => setActiveTab('global')} />
                <TabButton label="País" isActive={activeTab === 'country'} onClick={() => setActiveTab('country')} />
                <TabButton label="Amigos" isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
            </div>

            <div className='px-6 pb-4'>
                {/* Header */}
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase px-3 pb-2 border-b border-slate-200">
                    <div className="w-1/6">Rango</div>
                    <div className="w-3/6">Jugador</div>
                    <div className="w-2/6 text-right">Puntuación</div>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto">
                    {topPlayers.map(player => (
                        <div 
                            key={`${activeTab}-${player.rank}`}
                            className={`flex items-center p-3 rounded-lg my-1 transition-colors ${player.name === playerName ? 'bg-indigo-100' : 'hover:bg-slate-50'}`}
                        >
                            <div className="w-1/6 font-display text-xl text-slate-700">#{player.rank}</div>
                            <div className="w-3/6 font-bold text-slate-800 flex items-center">
                                {'country' in player && player.country && (
                                    <span className="mr-3 text-2xl leading-none">{getFlagEmoji(player.country)}</span>
                                )}
                                {player.name}
                                {'online' in player && (
                                     <span className={`w-2.5 h-2.5 rounded-full ml-2 shadow-sm ${player.online ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                                )}
                            </div>
                            <div className="w-2/6 text-right font-semibold text-indigo-600">{player.score.toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                {/* Player's Rank if not in top list */}
                {!isPlayerInTop && playerRank && (
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300">
                        <div className="flex items-center p-3 rounded-lg bg-indigo-100">
                            <div className="w-1/6 font-display text-xl text-slate-700">#{playerRank}</div>
                            <div className="w-3/6 font-bold text-slate-800 flex items-center">
                                {(activeTab === 'global' || activeTab === 'country') && (
                                    <span className="mr-3 text-2xl leading-none">{getFlagEmoji(playerCountry)}</span>
                                )}
                                {playerName}
                                {activeTab === 'friends' && (
                                    <span className="w-2.5 h-2.5 rounded-full ml-2 bg-green-400"></span>
                                )}
                            </div>
                            <div className="w-2/6 text-right font-semibold text-indigo-600">{playerScore.toLocaleString()}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Modal>
  );
};

export default Ranking;