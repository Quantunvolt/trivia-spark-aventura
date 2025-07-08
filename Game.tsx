import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameMap from './components/GameMap';
import TriviaLevel from './components/TriviaLevel';
import Hud from './components/Hud';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import Shop from './components/Shop';
import Ranking from './components/Ranking';
import LevelUpCelebration from './components/LevelUpCelebration';
import { GameStatus, LevelConfig, CompletedLevel, Achievement, PowerUpId } from './types';
import { LEVEL_CONFIG, MAX_LIVES, LIFE_RECHARGE_MINUTES, getMinCorrectToWin, getXpForNextLevel, XP_PER_CORRECT_ANSWER, XP_PER_INCORRECT_ANSWER, XP_PER_LEVEL_COMPLETE, ACHIEVEMENTS, SHOP_ITEMS } from './constants';
import { StarIcon, GemIcon, KeyIcon } from './components/icons';
import { onGameStateUpdate, updateGameState, updateUserProfile, type User } from './services/firebaseService';

export interface GameState {
    gameStatus: GameStatus;
    lives: number;
    unlockedLevelIds: number[];
    completedLevels: CompletedLevel[];
    score: number;
    keys: number;
    gems: number;
    lastLifeRecharge: number;
    playerLevel: number;
    playerXp: number;
    unlockedAchievements: string[];
    lastLoginDate: number;
    powerUps: { [key: string]: number };
    playerName: string;
    playerAvatar: string;
    playerCountry: string;
}

interface GameProps {
  user: User;
  onLogout: () => void;
}

const getAvatarTargetLevel = (gs: GameState): LevelConfig | undefined => {
    const activeLevels = LEVEL_CONFIG.filter(l => 
        gs.unlockedLevelIds.includes(l.id) && !gs.completedLevels.some(cl => cl.levelId === l.id)
    );

    if (activeLevels.length > 0) {
        return activeLevels.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
    } 
    
    if (gs.completedLevels.length > 0) {
        const highestCompletedId = Math.max(...gs.completedLevels.map(cl => cl.levelId));
        return LEVEL_CONFIG.find(l => l.id === highestCompletedId);
    }
    
    return LEVEL_CONFIG.find(l => l.id === 1);
};


export default function Game({ user, onLogout }: GameProps): React.ReactElement {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        const unsubscribe = onGameStateUpdate(user.uid, (state, err) => {
            if (err) {
                console.error("Error fetching game state:", err);
                setError("No se pudo conectar con el servidor del juego. Revisa tu conexión e inténtalo de nuevo.");
                setLoading(false);
                return;
            }
            
            // If state is not null, we have the data.
            if (state) {
                setGameState(state);
                const targetLevel = getAvatarTargetLevel(state);
                if (targetLevel) setAvatarPosition(targetLevel.position);
                setLoading(false); // Stop loading ONLY when we have data.
            }
            // If state is null, we don't stop loading. We wait for the next snapshot,
            // which will be triggered when createInitialUserData completes.
            // This prevents a race condition for new users.
        });

        return () => unsubscribe();
    }, [user.uid]);
    
    const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
    const [modalContent, setModalContent] = useState<{title: string, content: React.ReactNode, show: boolean, onClose?: () => void}>({title: '', content: null, show: false});
    const [rechargeTimer, setRechargeTimer] = useState<string>('');
    const [isProfileVisible, setProfileVisible] = useState(false);
    const [isShopVisible, setShopVisible] = useState(false);
    const [isRankingVisible, setRankingVisible] = useState(false);
    const [avatarPosition, setAvatarPosition] = useState<{ top: string; left: string } | null>(null);
    const [isCelebratingLevelUp, setCelebratingLevelUp] = useState(false);
    const [pendingLevelUpInfo, setPendingLevelUpInfo] = useState<{ from: number; to: number } | null>(null);

    const hideModal = () => setModalContent(prev => ({...prev, show: false}));
    const showModal = (title: string, content: React.ReactNode, onClose?: () => void) => {
      setModalContent({ title, content, show: true, onClose });
    }
    
    useEffect(() => {
        if (!gameState?.lastLoginDate || loading) return;
        const today = new Date().setHours(0, 0, 0, 0);
        const lastLogin = new Date(gameState.lastLoginDate).setHours(0, 0, 0, 0);

        if (today > lastLogin) {
            const reward = 25;
            updateGameState(user.uid, { gems: gameState.gems + reward, lastLoginDate: Date.now() });
            showModal("¡Bono Diario!", (
              <div className="flex flex-col items-center text-center">
                <p className="text-lg">¡Bienvenido de nuevo! Aquí tienes tu recompensa por jugar hoy.</p>
                <div className="flex items-center justify-center my-4">
                  <GemIcon className="w-12 h-12 text-cyan-400" />
                  <p className="text-4xl font-display text-slate-700 ml-2">+{reward}</p>
                </div>
                <button onClick={hideModal} className="mt-4 bg-green-500 text-white font-bold py-2 px-6 rounded-full">¡Gracias!</button>
              </div>
            ));
        }
    }, [gameState?.lastLoginDate, user.uid, loading]);

    useEffect(() => {
        if (!gameState) return;
        const newlyUnlocked: Achievement[] = [];
        ACHIEVEMENTS.forEach(ach => {
            if (!gameState.unlockedAchievements.includes(ach.id) && ach.check(gameState)) {
                newlyUnlocked.push(ach);
            }
        });

        if (newlyUnlocked.length > 0) {
            const achievementIds = newlyUnlocked.map(a => a.id);
            const gemReward = newlyUnlocked.length * 15;
            
            updateGameState(user.uid, {
                unlockedAchievements: [...gameState.unlockedAchievements, ...achievementIds],
                gems: gameState.gems + gemReward,
            });

            const firstAch = newlyUnlocked[0];
            showModal("¡Logro Desbloqueado!", (
                <div className="text-center">
                    <firstAch.icon className="w-24 h-24 text-yellow-400 mx-auto my-4" />
                    <h3 className="text-2xl font-bold">{firstAch.name}</h3>
                    <p className="text-slate-500 mt-2">{firstAch.description}</p>
                    <p className="font-bold text-lg mt-4 text-cyan-600">Recompensa: +{gemReward} <GemIcon className="inline w-5 h-5" /></p>
                    <button onClick={hideModal} className="mt-6 bg-green-500 text-white font-bold py-2 px-6 rounded-full">¡Genial!</button>
                </div>
            ));
        }
    }, [gameState?.completedLevels, gameState?.playerLevel, gameState?.keys, user.uid]);


    const handleSelectLevel = (level: LevelConfig) => {
        if (!gameState) return;
        if (level.keyCost && level.keyCost > gameState.keys) {
            showModal("Ruta Bloqueada", ( <div className="flex flex-col items-center"> <KeyIcon className="w-16 h-16 text-yellow-500 my-4" /> <p className="mb-4">Necesitas {level.keyCost} llave(s) para abrir este camino.</p> <p className="font-bold">¡Derrota a los Jefes para conseguir llaves!</p> </div> ), hideModal);
            return;
        }

        if (gameState.lives > 0) {
            setCurrentLevel(level);
            updateGameState(user.uid, { gameStatus: GameStatus.LevelStart });
        } else {
            showModal("¡Sin Vidas!", ( <div> <p className="mb-4">Necesitas esperar a que se recargue una vida o visitar la tienda.</p> <button onClick={() => { hideModal(); setShopVisible(true); }} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Ir a la Tienda</button> </div> ), hideModal);
        }
    };

    const handleLevelStart = () => {
        updateGameState(user.uid, { gameStatus: GameStatus.InLevel });
    };
    
    const handleCelebrationEnd = useCallback(() => {
        setCelebratingLevelUp(false);
        setPendingLevelUpInfo(null);
        const nextTargetLevel = getAvatarTargetLevel(gameStateRef.current!);
        if (nextTargetLevel) {
            setAvatarPosition(nextTargetLevel.position);
        }
    }, []);

    const handleLevelEnd = (correctAnswers: number, isWin: boolean) => {
        const levelConfig = currentLevel!;
        if (!gameStateRef.current) return;
        
        const prevGameState = gameStateRef.current;
        let localPendingLevelUp: { from: number; to: number } | null = null;

        const stars = isWin ? (correctAnswers === levelConfig.questionCount ? 3 : correctAnswers > getMinCorrectToWin(levelConfig.questionCount) ? 2 : 1) : 0;
        const points = stars * 100 * levelConfig.id;
        const xpGained = (correctAnswers * XP_PER_CORRECT_ANSWER) + ((levelConfig.questionCount - correctAnswers) * XP_PER_INCORRECT_ANSWER) + (isWin ? XP_PER_LEVEL_COMPLETE : 0);

        let { playerLevel, playerXp, unlockedLevelIds, completedLevels, score, keys, lives, lastLifeRecharge, gems } = prevGameState;
        let newTotalXp = playerXp + xpGained;
        let newLevel = playerLevel;
        let xpForNext = getXpForNextLevel(newLevel);
        while (newTotalXp >= xpForNext) {
            newTotalXp -= xpForNext;
            newLevel++;
            xpForNext = getXpForNextLevel(newLevel);
        }
        if (newLevel > playerLevel) {
            localPendingLevelUp = { from: playerLevel, to: newLevel };
        }
        
        if (isWin) {
            const existing = completedLevels.find(cl => cl.levelId === levelConfig.id);
            if (existing) {
                completedLevels = completedLevels.map(cl => cl.levelId === levelConfig.id ? {...cl, stars: Math.max(cl.stars, stars)} : cl);
            } else {
                completedLevels = [...completedLevels, { levelId: levelConfig.id, stars }];
            }
            const wasBossDefeatedFirstTime = levelConfig.isBossLevel && !prevGameState.completedLevels.some(cl => cl.levelId === levelConfig.id);
            if (wasBossDefeatedFirstTime) {
                keys++;
                gems += 50;
            }
            if (levelConfig.nextLevelIds?.length > 0) {
                unlockedLevelIds = [...new Set([...unlockedLevelIds, ...levelConfig.nextLevelIds])];
            }
        } else {
            if (lives > 0) {
                const wasAtMaxLives = lives === MAX_LIVES;
                lives--;
                if(wasAtMaxLives) lastLifeRecharge = Date.now();
            }
        }
        
        updateGameState(user.uid, { gameStatus: GameStatus.Map, score: score + points, playerLevel: newLevel, playerXp: newTotalXp, unlockedLevelIds, completedLevels, keys, lives, lastLifeRecharge, gems });
        
        const handleModalClose = () => {
            hideModal();
            setTimeout(() => {
                if (localPendingLevelUp) {
                    setPendingLevelUpInfo(localPendingLevelUp);
                    setCelebratingLevelUp(true);
                } else {
                    const nextTargetLevel = getAvatarTargetLevel(gameStateRef.current!);
                    if (nextTargetLevel) setAvatarPosition(nextTargetLevel.position);
                }
            }, 300);
        };
        
        showModal(isWin ? "¡Planeta Conquistado!" : "¡Oh No!", (
            <div className="flex flex-col items-center">
                {isWin ? (
                    <>
                        <div className="flex my-4">
                            {[...Array(3)].map((_, i) => <StarIcon key={i} className={`w-12 h-12 ${i < stars ? 'text-yellow-400 animate-pulse' : 'text-gray-300'}`} />)}
                        </div>
                        <p className="text-xl font-bold">¡Ganaste {points.toLocaleString()} puntos!</p>
                    </>
                ) : ( <p className="text-lg my-4">No respondiste suficientes preguntas correctamente. ¡No te rindas!</p> )}
                <p className="text-lg font-bold text-blue-600 mt-2">+ {xpGained} XP</p>
                <button onClick={handleModalClose} className={`mt-6 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors ${isWin ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {isWin ? "¡Genial!" : "Volver al Mapa"}
                </button>
            </div>
        ));
    };

    const handlePurchase = (itemId: string) => {
        if (!gameState) return;
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || gameState.gems < item.cost) {
            showModal("Fondos Insuficientes", <p>No tienes suficientes gemas para comprar este artículo.</p>);
            return;
        }

        const updates: Partial<GameState> = { gems: gameState.gems - item.cost };
        if (itemId === 'life_refill') updates.lives = MAX_LIVES;
        if (itemId === 'key_1') updates.keys = gameState.keys + 1;
        if (itemId.startsWith('powerup_')) {
            const [, powerUpId, quantityStr] = itemId.split('_');
            const quantity = parseInt(quantityStr, 10);
            const currentAmount = gameState.powerUps[powerUpId] || 0;
            updates.powerUps = { ...gameState.powerUps, [powerUpId]: currentAmount + quantity };
        }
        updateGameState(user.uid, updates);
        showModal("¡Compra Realizada!", <p>Has comprado {item.name}.</p>);
    };
    
    const handleUsePowerUp = (powerUpId: PowerUpId) => {
        if (!gameState) return;
        const currentAmount = gameState.powerUps[powerUpId] || 0;
        if (currentAmount <= 0) return;
        updateGameState(user.uid, { powerUps: { ...gameState.powerUps, [powerUpId]: currentAmount - 1 } });
    };

    useEffect(() => {
        if(gameState?.gameStatus === GameStatus.LevelStart && currentLevel) {
            showModal(`Planeta ${currentLevel.id}: ${currentLevel.topic}`, (
                <div className="flex flex-col items-center">
                    <p className="my-2">Responde {currentLevel.questionCount} preguntas.</p>
                    <p className="mb-4">¡Acierta al menos {getMinCorrectToWin(currentLevel.questionCount)} para ganar!</p>
                    <button onClick={() => { hideModal(); handleLevelStart(); }} className="mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors">
                        ¡Empezar!
                    </button>
                </div>
            ), () => { hideModal(); updateGameState(user.uid, {gameStatus: GameStatus.Map}) });
        }
    }, [gameState?.gameStatus, currentLevel, user.uid]);

    useEffect(() => {
        const timerId = setInterval(() => {
            const gs = gameStateRef.current;
            if (!gs || !user) return;
    
            if (gs.lives >= MAX_LIVES) {
                setRechargeTimer('');
                return;
            }
    
            const now = Date.now();
            const minutesPassed = (now - gs.lastLifeRecharge) / (1000 * 60);
            const livesToAdd = Math.floor(minutesPassed / LIFE_RECHARGE_MINUTES);
    
            if (livesToAdd > 0) {
                const newLives = Math.min(gs.lives + livesToAdd, MAX_LIVES);
                const newLastRecharge = gs.lastLifeRecharge + (livesToAdd * LIFE_RECHARGE_MINUTES * 60 * 1000);
                updateGameState(user.uid, { lives: newLives, lastLifeRecharge: newLives >= MAX_LIVES ? now : newLastRecharge });
            } else {
                const nextRechargeTimestamp = gs.lastLifeRecharge + LIFE_RECHARGE_MINUTES * 60 * 1000;
                const remainingSeconds = Math.max(0, Math.floor((nextRechargeTimestamp - now) / 1000));
                const newTimerValue = `${Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:${(remainingSeconds % 60).toString().padStart(2, '0')}`;
                setRechargeTimer(newTimerValue);
            }
        }, 1000);
    
        return () => clearInterval(timerId);
    }, [user]);

    const handleUpdateProfile = async (data: { playerName?: string, playerAvatar?: string, playerCountry?: string }) => {
        await updateUserProfile(user.uid, data);
    }
    
    if (loading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center font-body text-white text-center p-4 bg-red-900/50">
            <h2 className="text-2xl font-bold mb-4">Error de Conexión</h2>
            <p>{error}</p>
        </div>
      );
    }

    if (!gameState) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center font-body text-white text-center p-4">
            <h2 className="text-2xl font-bold mb-4">Cargando partida...</h2>
            <p>Preparando tu aventura cósmica. ¡Un momento!</p>
        </div>
      );
    }

    const renderContent = () => {
        if (gameState.gameStatus === GameStatus.InLevel && currentLevel) {
            return <TriviaLevel level={currentLevel} onLevelComplete={(ca) => handleLevelEnd(ca, true)} onLevelFail={(ca) => handleLevelEnd(ca, false)} powerUps={gameState.powerUps} onUsePowerUp={handleUsePowerUp}/>;
        }
        return <GameMap levels={LEVEL_CONFIG} unlockedLevelIds={gameState.unlockedLevelIds} completedLevels={gameState.completedLevels} onSelectLevel={handleSelectLevel} avatarPosition={avatarPosition} playerAvatar={gameState.playerAvatar} />;
    };
    
    const unlockedAchievements = ACHIEVEMENTS.filter(a => gameState.unlockedAchievements.includes(a.id));
    const totalStars = gameState.completedLevels.reduce((sum, cl) => sum + cl.stars, 0);
    const bossesDefeated = gameState.completedLevels.filter(cl => LEVEL_CONFIG.find(l => l.id === cl.levelId)?.isBossLevel).length;

    return (
        <>
            <Hud lives={gameState.lives} score={gameState.score} keys={gameState.keys} gems={gameState.gems} level={gameState.playerLevel} xp={gameState.playerXp} xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} rechargeTimer={rechargeTimer} onOpenProfile={() => setProfileVisible(true)} onOpenShop={() => setShopVisible(true)} onOpenRanking={() => setRankingVisible(true)} />
            <div className="relative w-full h-full">{renderContent()}</div>
            <Modal title={modalContent.title} show={modalContent.show} onClose={modalContent.onClose ?? hideModal}>{modalContent.content}</Modal>
            <LevelUpCelebration show={isCelebratingLevelUp} onCelebrationEnd={handleCelebrationEnd} levelInfo={pendingLevelUpInfo} />
            <UserProfile show={isProfileVisible} onClose={() => setProfileVisible(false)} playerLevel={gameState.playerLevel} playerXp={gameState.playerXp} xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} stats={{ completed: gameState.completedLevels.length, stars: totalStars, bosses: bossesDefeated }} achievements={unlockedAchievements} playerName={gameState.playerName} playerAvatar={gameState.playerAvatar} playerCountry={gameState.playerCountry} onUpdateProfile={handleUpdateProfile} onLogout={onLogout} />
            <Shop show={isShopVisible} onClose={() => setShopVisible(false)} gems={gameState.gems} items={SHOP_ITEMS} onPurchase={handlePurchase} />
            <Ranking show={isRankingVisible} onClose={() => setRankingVisible(false)} playerScore={gameState.score} playerName={gameState.playerName} playerCountry={gameState.playerCountry} />
        </>
    );
};