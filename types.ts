import React from 'react';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LevelConfig {
  id: number;
  topic: string;
  questionCount: number;
  position: {
    top: string;
    left: string;
  };
  nextLevelIds: number[];
  isBossLevel?: boolean;
  keyCost?: number;
  isBonus?: boolean;
  requiredLevel?: number;
}

export interface CompletedLevel {
  levelId: number;
  stars: number;
}

export enum GameStatus {
  Map,
  InLevel,
  LevelStart,
  LevelComplete,
  LevelFailed,
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  check: (gameState: any) => boolean; // `any` para evitar referencias circulares
}

export type PowerUpId = 'fifty_fifty' | 'skip';

export interface ShopItem {
  id: string; // e.g. 'life_refill', 'key_1', 'powerup_skip_3'
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cost: number;
}

export interface AvatarOption {
    id: string;
    name: string;
    component: React.ComponentType<{ className?: string }>;
}
