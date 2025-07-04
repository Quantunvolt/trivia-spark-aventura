import React, { useState, useEffect, useRef } from 'react';
import GameMap from './components/GameMap';
import TriviaLevel from './components/TriviaLevel';
import Hud from './components/Hud';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import Shop from './components/Shop';
import { GameStatus, LevelConfig, CompletedLevel, Achievement, PowerUpId } from './types';
import { LEVEL_CONFIG, MAX_LIVES, LIFE_RECHARGE_MINUTES, getMinCorrectToWin, getXpForNextLevel, XP_PER_CORRECT_ANSWER, XP_PER_INCORRECT_ANSWER, XP_PER_LEVEL_COMPLETE, ACHIEVEMENTS, SHOP_ITEMS } from './constants';
import { StarIcon, HeartIcon, KeyIcon, GemIcon } from './components/icons';
import Ranking from './components/Ranking';
import LevelUpCelebration from './components/LevelUpCelebration';

const GAME_STATE_KEY = 'triviaSparkState_guest'; // Guest state

interface GameState {
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

const getAvatarTargetLevel = (gs: GameState): LevelConfig | undefined => {
    const activeLevels = LEVEL_CONFIG.filter(l => 
        gs.unlockedLevelIds.includes(l.id) && !gs.completedLevels.some(cl => cl.levelId === l.id)
    );

    if (activeLevels.length > 0) {
        // Find the active level with the lowest ID (earliest in progression)
        return activeLevels.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
    } 
    
    if (gs.completedLevels.length > 0) {
        // If all are complete, focus on the highest level completed (by ID)
        const highestCompletedId = Math.max(...gs.completedLevels.map(cl => cl.levelId));
        return LEVEL_CONFIG.find(l => l.id === highestCompletedId);
    }
    
    // Default to level 1 if no progress
    return LEVEL_CONFIG.find(l => l.id === 1);
};


export default function Game(): React.ReactElement {
    const [gameState, setGameState] = useState<GameState>(() => {
        try {
            const savedState = localStorage.getItem(GAME_STATE_KEY);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                parsed.gameStatus = GameStatus.Map; // Always start on map
                // Ensure new properties exist
                parsed.gems = parsed.gems ?? 0;
                parsed.powerUps = parsed.powerUps ?? {};
                parsed.unlockedAchievements = parsed.unlockedAchievements ?? [];
                parsed.lastLoginDate = parsed.lastLoginDate ?? new Date(0).getTime();
                parsed.playerName = parsed.playerName ?? 'Jugador Invitado';
                parsed.playerAvatar = parsed.playerAvatar ?? 'brain';
                parsed.playerCountry = parsed.playerCountry ?? 'ES';
                return parsed;
            }
        } catch (e) {
            console.error("Failed to load game state:", e);
        }
        return {
            gameStatus: GameStatus.Map,
            lives: MAX_LIVES,
            unlockedLevelIds: [1],
            completedLevels: [],
            score: 0,
            keys: 0,
            gems: 0,
            powerUps: {},
            lastLifeRecharge: Date.now(),
            playerLevel: 1,
            playerXp: 0,
            unlockedAchievements: [],
            lastLoginDate: new Date(0).getTime(),
            playerName: 'Jugador Invitado',
            playerAvatar: 'brain',
            playerCountry: 'ES'
        };
    });
    
    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        try {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
        } catch (e) {
            console.error("Failed to save game state:", e);
        }
    }, [gameState]);
    
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
        const targetLevel = getAvatarTargetLevel(gameState);
        if (targetLevel) {
            setAvatarPosition(targetLevel.position);
        }
    }, []); // Run only on initial load

    // Check for daily login bonus
    useEffect(() => {
      const today = new Date().setHours(0, 0, 0, 0);
      const lastLogin = new Date(gameState.lastLoginDate).setHours(0, 0, 0, 0);

      if (today > lastLogin) {
        const reward = 25; // 25 gems daily bonus
        setGameState(prev => ({...prev, gems: prev.gems + reward, lastLoginDate: Date.now()}));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Check for achievements
    useEffect(() => {
        const newlyUnlocked: Achievement[] = [];
        ACHIEVEMENTS.forEach(ach => {
            if (!gameState.unlockedAchievements.includes(ach.id) && ach.check(gameState)) {
                newlyUnlocked.push(ach);
            }
        });

        if (newlyUnlocked.length > 0) {
            const achievementIds = newlyUnlocked.map(a => a.id);
            const gemReward = newlyUnlocked.length * 15; // 15 gems per achievement
            
            setGameState(prev => ({
                ...prev,
                unlockedAchievements: [...prev.unlockedAchievements, ...achievementIds],
                gems: prev.gems + gemReward,
            }));

            // Show a modal for the first unlocked achievement in this batch
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.completedLevels, gameState.playerLevel, gameState.keys]);


    const handleSelectLevel = (level: LevelConfig) => {
        if (level.keyCost && level.keyCost > gameState.keys) {
            showModal("Ruta Bloqueada", ( <div className="flex flex-col items-center"> <KeyIcon className="w-16 h-16 text-yellow-500 my-4" /> <p className="mb-4">Necesitas {level.keyCost} llave(s) para abrir este camino.</p> <p className="font-bold">¡Derrota a los Jefes para conseguir llaves!</p> </div> ), hideModal);
            return;
        }

        if (gameState.lives > 0) {
            setCurrentLevel(level);
            setGameState(prev => ({ ...prev, gameStatus: GameStatus.LevelStart }));
        } else {
            showModal("¡Sin Vidas!", ( <div> <p className="mb-4">Necesitas esperar a que se recargue una vida o visitar la tienda.</p> <button onClick={() => { hideModal(); setShopVisible(true); }} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Ir a la Tienda</button> </div> ), hideModal);
        }
    };

    const handleLevelStart = () => {
        setGameState(prev => {
            if (prev.lives <= 0) return prev; // Safety check
            return {
                ...prev,
                gameStatus: GameStatus.InLevel,
                lives: prev.lives - 1,
                // Start recharge timer if we were at max lives
                lastLifeRecharge: prev.lives === MAX_LIVES ? Date.now() : prev.lastLifeRecharge,
            };
        });
    };
    
    const handleCelebrationEnd = () => {
        setCelebratingLevelUp(false);
        setPendingLevelUpInfo(null);
        // Now move the avatar.
        const nextTargetLevel = getAvatarTargetLevel(gameState);
        if (nextTargetLevel) {
            setAvatarPosition(nextTargetLevel.position);
        }
    };

    const handleLevelEnd = (correctAnswers: number, isWin: boolean) => {
        const levelConfig = currentLevel!;
        let localPendingLevelUp: { from: number, to: number } | null = null;

        const stars = isWin ? (correctAnswers === levelConfig.questionCount ? 3 : correctAnswers > getMinCorrectToWin(levelConfig.questionCount) ? 2 : 1) : 0;
        const points = stars * 100 * levelConfig.id;
        const xpGained = (correctAnswers * XP_PER_CORRECT_ANSWER) + ((levelConfig.questionCount - correctAnswers) * XP_PER_INCORRECT_ANSWER) + (isWin ? XP_PER_LEVEL_COMPLETE : 0);

        setGameState(prev => {
            let { playerLevel, playerXp, unlockedLevelIds, completedLevels, score, keys, lives, lastLifeRecharge, gems } = prev;

            // Life was deducted at the start. If the player wins, we give it back.
            if (isWin) {
                lives = Math.min(lives + 1, MAX_LIVES);
            }
            
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
                const wasBossDefeatedFirstTime = levelConfig.isBossLevel && !prev.completedLevels.some(cl => cl.levelId === levelConfig.id);
                if (wasBossDefeatedFirstTime) {
                    keys++;
                    gems += 50; // Bonus gems for defeating a boss
                }
                if (levelConfig.nextLevelIds?.length > 0) {
                    unlockedLevelIds = [...new Set([...unlockedLevelIds, ...levelConfig.nextLevelIds])];
                }
            }

            return { ...prev, gameStatus: GameStatus.Map, score: score + points, playerLevel: newLevel, playerXp: newTotalXp, unlockedLevelIds, completedLevels, keys, lives, lastLifeRecharge, gems };
        });
        
        const handleModalClose = () => {
            hideModal();
            setTimeout(() => {
                if (localPendingLevelUp) {
                    setPendingLevelUpInfo(localPendingLevelUp);
                    setCelebratingLevelUp(true);
                } else {
                    // No level up, just move avatar
                    const nextTargetLevel = getAvatarTargetLevel(gameStateRef.current);
                    if (nextTargetLevel) {
                        setAvatarPosition(nextTargetLevel.position);
                    }
                }
            }, 300); // Wait for modal to fade out
        };
        
        showModal(isWin ? "¡Nivel Completado!" : "¡Oh No!", (
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
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item || gameState.gems < item.cost) {
            showModal("Fondos Insuficientes", <p>No tienes suficientes gemas para comprar este artículo.</p>);
            return;
        }

        setGameState(prev => {
            const newState = { ...prev, gems: prev.gems - item.cost };
            
            if (itemId === 'life_refill') {
                return { ...newState, lives: MAX_LIVES };
            }
            
            if (itemId === 'key_1') {
                return { ...newState, keys: prev.keys + 1 };
            }
    
            if (itemId.startsWith('powerup_')) {
                const [, powerUpId, quantityStr] = itemId.split('_');
                const quantity = parseInt(quantityStr, 10);
                const currentAmount = newState.powerUps[powerUpId] || 0;
                const newPowerUps = {
                    ...newState.powerUps,
                    [powerUpId]: currentAmount + quantity,
                };
                return { ...newState, powerUps: newPowerUps };
            }
            
            return prev;
        });

        showModal("¡Compra Realizada!", <p>Has comprado {item.name}.</p>);
    };
    
    const handleUsePowerUp = (powerUpId: PowerUpId) => {
        setGameState(prev => {
            const currentAmount = prev.powerUps[powerUpId] || 0;
            if (currentAmount <= 0) return prev;
    
            const newPowerUps = {
                ...prev.powerUps,
                [powerUpId]: currentAmount - 1,
            };
            return { ...prev, powerUps: newPowerUps };
        });
    };

    useEffect(() => {
        if(gameState.gameStatus === GameStatus.LevelStart && currentLevel) {
            showModal(`Nivel ${currentLevel.id}: ${currentLevel.topic}`, (
                <div className="flex flex-col items-center">
                    <p className="my-2">Responde {currentLevel.questionCount} preguntas.</p>
                    <p className="mb-4">¡Acierta al menos {getMinCorrectToWin(currentLevel.questionCount)} para ganar!</p>
                    <p className="text-sm text-slate-500">Esto usará una <HeartIcon className="w-4 h-4 inline-block text-red-500" /> vida para jugar. ¡Gana para recuperarla!</p>
                    <button onClick={() => { hideModal(); handleLevelStart(); }} className="mt-6 bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-colors">
                        ¡Empezar!
                    </button>
                </div>
            ), () => { hideModal(); setGameState(p => ({...p, gameStatus: GameStatus.Map})) });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.gameStatus, currentLevel]);

    useEffect(() => {
        if (gameState.lives >= MAX_LIVES) {
            setRechargeTimer('');
            return;
        }
        const timerId = setInterval(() => {
            const now = Date.now();
            const nextRechargeTimestamp = gameState.lastLifeRecharge + LIFE_RECHARGE_MINUTES * 60 * 1000;

            if (now >= nextRechargeTimestamp) {
                setGameState(prev => {
                    const minutesPassed = (now - prev.lastLifeRecharge) / (1000 * 60);
                    const livesToRecharge = Math.floor(minutesPassed / LIFE_RECHARGE_MINUTES);
                    if (livesToRecharge > 0) {
                        const newLives = Math.min(prev.lives + livesToRecharge, MAX_LIVES);
                        const newRechargeTime = prev.lastLifeRecharge + (livesToRecharge * LIFE_RECHARGE_MINUTES * 60 * 1000);
                        return { ...prev, lives: newLives, lastLifeRecharge: newLives >= MAX_LIVES ? Date.now() : newRechargeTime };
                    }
                    return prev;
                });
            } else {
                const remainingSeconds = Math.floor((nextRechargeTimestamp - now) / 1000);
                setRechargeTimer(`${Math.floor(remainingSeconds / 60).toString().padStart(2, '0')}:${(remainingSeconds % 60).toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(timerId);
    }, [gameState.lives, gameState.lastLifeRecharge]);

    const handleUpdateAvatar = (avatarId: string) => {
        setGameState(prev => ({...prev, playerAvatar: avatarId }));
    }

    const handleUpdateCountry = (countryCode: string) => {
        setGameState(prev => ({...prev, playerCountry: countryCode }));
    }

    const handleUpdatePlayerName = (name: string) => {
        setGameState(prev => ({ ...prev, playerName: name }));
    }

    const renderContent = () => {
        if (gameState.gameStatus === GameStatus.InLevel && currentLevel) {
            return (
              <TriviaLevel 
                level={currentLevel} 
                onLevelComplete={(ca) => handleLevelEnd(ca, true)} 
                onLevelFail={(ca) => handleLevelEnd(ca, false)}
                powerUps={gameState.powerUps}
                onUsePowerUp={handleUsePowerUp}
              />
            );
        }
        return <GameMap 
            levels={LEVEL_CONFIG} 
            unlockedLevelIds={gameState.unlockedLevelIds} 
            completedLevels={gameState.completedLevels} 
            onSelectLevel={handleSelectLevel}
            avatarPosition={avatarPosition}
            playerAvatar={gameState.playerAvatar}
        />;
    };
    
    const unlockedAchievements = ACHIEVEMENTS.filter(a => gameState.unlockedAchievements.includes(a.id));
    const totalStars = gameState.completedLevels.reduce((sum, cl) => sum + cl.stars, 0);
    const bossesDefeated = gameState.completedLevels.filter(cl => LEVEL_CONFIG.find(l => l.id === cl.levelId)?.isBossLevel).length;

    return (
        <>
            <Hud 
                lives={gameState.lives} 
                score={gameState.score} 
                keys={gameState.keys} 
                gems={gameState.gems}
                level={gameState.playerLevel} 
                xp={gameState.playerXp} 
                xpForNextLevel={getXpForNextLevel(gameState.playerLevel)} 
                rechargeTimer={rechargeTimer}
                onOpenProfile={() => setProfileVisible(true)}
                onOpenShop={() => setShopVisible(true)}
                onOpenRanking={() => setRankingVisible(true)}
            />
             <div className="relative w-full h-full">
                {renderContent()}
            </div>
            <Modal title={modalContent.title} show={modalContent.show} onClose={modalContent.onClose ?? hideModal}>
                {modalContent.content}
            </Modal>
            <LevelUpCelebration
                show={isCelebratingLevelUp}
                onCelebrationEnd={handleCelebrationEnd}
                levelInfo={pendingLevelUpInfo}
            />
            <UserProfile
                show={isProfileVisible}
                onClose={() => setProfileVisible(false)}
                playerLevel={gameState.playerLevel}
                playerXp={gameState.playerXp}
                xpForNextLevel={getXpForNextLevel(gameState.playerLevel)}
                stats={{
                  completed: gameState.completedLevels.length,
                  stars: totalStars,
                  bosses: bossesDefeated,
                }}
                achievements={unlockedAchievements}
                playerName={gameState.playerName}
                playerAvatar={gameState.playerAvatar}
                playerCountry={gameState.playerCountry}
                onUpdatePlayerName={handleUpdatePlayerName}
                onUpdateAvatar={handleUpdateAvatar}
                onUpdateCountry={handleUpdateCountry}
            />
            <Shop
                show={isShopVisible}
                onClose={() => setShopVisible(false)}
                gems={gameState.gems}
                items={SHOP_ITEMS}
                onPurchase={handlePurchase}
            />
             <Ranking
                show={isRankingVisible}
                onClose={() => setRankingVisible(false)}
                playerScore={gameState.score}
                playerName={gameState.playerName}
                playerCountry={gameState.playerCountry}
            />
        </>
    );
};