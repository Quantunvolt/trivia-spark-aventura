import { LevelConfig, Achievement, ShopItem, CompletedLevel, AvatarOption } from './types';
import { TrophyIcon, StarIcon, BrainIcon, KeyIcon, HeartIcon, FiftyFiftyIcon, SkipIcon, RobotIcon, CatIcon, PlanetIcon } from './components/icons';

export const MAX_LIVES = 5;
export const LIFE_RECHARGE_MINUTES = 5;

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_PER_INCORRECT_ANSWER = 2;
export const XP_PER_LEVEL_COMPLETE = 50;

export const getXpForNextLevel = (level: number): number => {
  return level * 100;
};

export const getMinCorrectToWin = (questionCount: number): number => {
  return questionCount > 3 ? 3 : 2;
};

const getSeasonalTopic = (): string => {
    const month = new Date().getMonth(); // 0 = Enero, 11 = Diciembre
    switch (month) {
        case 5: case 6: case 7: // Verano (Hemisferio Norte)
            return "Trivia de Verano";
        case 9: // Octubre
            return "Trivia de Halloween";
        case 11: // Diciembre
            return "Trivia Navideña";
        default:
            return "Música";
    }
};

const generatedLevels: LevelConfig[] = [];
const numGeneratedLevels = 200;
let currentY = 924.0; // Corresponds to level 16's new 'top'
let currentX = 40.0; // Corresponds to level 16's 'left'

const topics = [
    "Geografía Avanzada", "Historia Antigua", "Física Cuántica", "Maestros del Renacimiento", "Literatura Rusa", 
    "Compositores Clásicos", "Cine de Culto", "Leyendas Olímpicas", "Pioneros de la Informática", 
    "Ecosistemas Marinos", "Alta Cocina", "Filosofía Griega", "Curiosidades Matemáticas", "Química Orgánica",
    "Misterios del Universo", "Anatomía Comparada", "Existencialismo", "Macroeconomía", "Sistemas Políticos",
    "Inventos del Siglo XX", "Revoluciones Mundiales", "Estrellas y Galaxias", "Ópera", "Poesía Moderna",
    "Fútbol Mundial", "Inteligencia Artificial", "Desiertos del Mundo", "Cocina Molecular", "Mitología Nórdica"
];

const verticalSpacing = 3.0; // Was 4.5
const horizontalSpacing = 20; // Was 25
const levelsPerZig = 5;

for (let i = 0; i < numGeneratedLevels; i++) {
    const newId = 17 + i;
    const isBoss = (i + 1) % 10 === 0;

    currentY -= verticalSpacing;
    
    // Create a smoother zig-zag
    const stepInCycle = i % (levelsPerZig * 2);
    if (stepInCycle < levelsPerZig) {
        currentX += (horizontalSpacing / levelsPerZig);
    } else {
        currentX -= (horizontalSpacing / levelsPerZig);
    }
    
    // Clamp X to be within map bounds
    currentX = Math.max(15, Math.min(85, currentX));

    generatedLevels.push({
        id: newId,
        topic: topics[i % topics.length],
        questionCount: isBoss ? 7 : 4,
        position: { top: `${currentY.toFixed(2)}%`, left: `${currentX.toFixed(2)}%` },
        nextLevelIds: (i === numGeneratedLevels - 1) ? [] : [newId + 1],
        isBossLevel: isBoss,
    });
}


export const LEVEL_CONFIG: LevelConfig[] = [
  // SECTION 1: The Beginning (bottom of the map)
  { id: 1, topic: "Conocimiento General", questionCount: 3, position: { top: '990%', left: '20%' }, nextLevelIds: [2] },
  { id: 2, topic: "Animales", questionCount: 3, position: { top: '984%', left: '50%' }, nextLevelIds: [3] },
  { id: 3, topic: "Ciencia", questionCount: 3, position: { top: '978%', left: '35%' }, nextLevelIds: [4, 9] }, // <-- BIFURCACIÓN

  // SECTION 2: Branch 1
  { id: 4, topic: "Capitales del Mundo", questionCount: 4, position: { top: '972%', left: '55%' }, nextLevelIds: [5] },
  { id: 5, topic: "Historia", questionCount: 5, position: { top: '966%', left: '25%' }, isBossLevel: true, nextLevelIds: [6] },
  { id: 6, topic: "Películas", questionCount: 4, position: { top: '960%', left: '45%' }, nextLevelIds: [7, 217] }, // <-- NEW BONUS BRANCH
  { id: 7, topic: getSeasonalTopic(), questionCount: 4, position: { top: '954%', left: '65%' }, nextLevelIds: [8] },
  { id: 8, topic: "Inventos", questionCount: 5, position: { top: '948%', left: '30%' }, nextLevelIds: [13] }, // <-- JOINS MAIN PATH

  // SECTION 2: Branch 2
  { id: 9, topic: "Cultura Pop", questionCount: 4, position: { top: '970%', left: '70%' }, nextLevelIds: [10] },
  { id: 10, topic: "Secretos de Videojuegos", questionCount: 5, position: { top: '960%', left: '80%' }, keyCost: 1, nextLevelIds: [11] },
  { id: 11, topic: "Mitología", questionCount: 5, position: { top: '950%', left: '65%' }, isBossLevel: true, nextLevelIds: [13] }, // <-- JOINS MAIN PATH

  // SECTION 3: The Peak (top of the map)
  { id: 13, topic: "Geografía Mundial", questionCount: 5, position: { top: '942%', left: '50%' }, nextLevelIds: [14] },
  { id: 14, topic: "Cuerpo Humano", questionCount: 5, position: { top: '936%', left: '25%' }, nextLevelIds: [15, 218] }, // <-- NEW BONUS BRANCH
  { id: 15, topic: "Arte y Pintura", questionCount: 5, position: { top: '930%', left: '55%' }, nextLevelIds: [16] },
  { id: 16, topic: "Campeón de Trivia", questionCount: 7, position: { top: '924%', left: '40%' }, isBossLevel: true, nextLevelIds: [17] },

  // Niveles de bonificación
  { id: 12, topic: "Cine Clásico 🎬", questionCount: 5, position: { top: '970%', left: '90%' }, nextLevelIds: [], isBonus: true, requiredLevel: 5 },
  { id: 217, topic: "Logos Famosos 🖼️", questionCount: 5, position: { top: '958%', left: '10%' }, nextLevelIds: [], isBonus: true },
  { id: 218, topic: "Acertijos Mentales 🤔", questionCount: 5, position: { top: '934%', left: '5%' }, nextLevelIds: [], isBonus: true },

  // SECTION 4: The Endless Climb (Generated Levels)
  ...generatedLevels,
];

// Logros
export const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_step', name: 'Primer Paso', description: 'Completa tu primer nivel.', icon: StarIcon,
      check: (gs) => gs.completedLevels.length >= 1 },
    { id: 'level_5', name: 'Aprendiz', description: 'Alcanza el nivel de jugador 5.', icon: BrainIcon,
      check: (gs) => gs.playerLevel >= 5 },
    { id: 'boss_slayer_1', name: 'Mata-Jefes', description: 'Derrota a tu primer jefe.', icon: TrophyIcon,
      check: (gs) => gs.completedLevels.some((cl: CompletedLevel) => LEVEL_CONFIG.find(l => l.id === cl.levelId)?.isBossLevel) },
    { id: 'star_collector_25', name: 'Coleccionista de Estrellas', description: 'Consigue un total de 25 estrellas.', icon: StarIcon,
      check: (gs) => gs.completedLevels.reduce((sum: number, cl: CompletedLevel) => sum + cl.stars, 0) >= 25 },
    { id: 'key_master', name: 'Maestro de las Llaves', description: 'Consigue tu primera llave.', icon: KeyIcon,
      check: (gs) => gs.keys > 0 },
    { id: 'level_10', name: 'Veterano', description: 'Alcanza el nivel de jugador 10.', icon: BrainIcon,
      check: (gs) => gs.playerLevel >= 10 },
];

// Artículos de la tienda
export const SHOP_ITEMS: ShopItem[] = [
    { id: 'life_refill', name: 'Recarga de Vidas', description: `Rellena todas tus vidas al máximo (${MAX_LIVES}).`, icon: HeartIcon, cost: 50 },
    { id: 'key_1', name: 'Llave Maestra', description: 'Una llave para desbloquear caminos especiales.', icon: KeyIcon, cost: 100 },
    { id: 'powerup_fifty_fifty_3', name: 'Pack de 3 x 50/50', description: 'Elimina dos respuestas incorrectas.', icon: FiftyFiftyIcon, cost: 75 },
    { id: 'powerup_skip_3', name: 'Pack de 3 x Saltos', description: 'Salta una pregunta que no sepas.', icon: SkipIcon, cost: 40 },
];

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'brain', name: 'Cerebro', component: BrainIcon },
  { id: 'robot', name: 'Robot', component: RobotIcon },
  { id: 'cat', name: 'Gato', component: CatIcon },
  { id: 'planet', name: 'Planeta', component: PlanetIcon },
];

export const COUNTRY_LIST = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Chile', code: 'CL' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'España', code: 'ES' },
    { name: 'Estados Unidos', code: 'US' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Honduras', code: 'HN' },
    { name: 'México', code: 'MX' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Panamá', code: 'PA' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Perú', code: 'PE' },
    { name: 'República Dominicana', code: 'DO' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Alemania', code: 'DE' },
    { name: 'Francia', code: 'FR' },
    { name: 'Japón', code: 'JP' },
    { name: 'Canadá', code: 'CA' },
    { name: 'Reino Unido', code: 'GB' },
].sort((a,b) => a.name.localeCompare(b.name));
