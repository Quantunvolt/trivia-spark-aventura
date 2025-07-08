import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { GameState } from '../Game';
import { GameStatus } from '../types';
import { MAX_LIVES, AVATAR_OPTIONS } from '../constants';

// Re-export User type from firebase/auth and define Unsubscribe
export type User = firebase.User;
export type Unsubscribe = () => void;

const firebaseConfig = {
  apiKey: "AIzaSyBg41M0NIoMvPzDf0mwl4CI5AGJV1JjLg8",
  authDomain: "triviaspark-pww0u.firebaseapp.com",
  projectId: "triviaspark-pww0u",
  storageBucket: "triviaspark-pww0u.firebasestorage.app",
  messagingSenderId: "717859505739",
  appId: "1:717859505739:web:a464342732ee84f4fd2fce",
  measurementId: "G-CN6NX3DFLK"
};

// Initialize Firebase, but only if it hasn't been initialized yet.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ===== AUTHENTICATION FUNCTIONS =====

const createInitialUserData = async (user: User) => {
  const userDocRef = db.collection('users').doc(user.uid).collection('gameState').doc('data');
  try {
    const docSnap = await userDocRef.get();
    if (!docSnap.exists) {
      const defaultAvatar = AVATAR_OPTIONS[0].id;
      const initialGameState: Omit<GameState, 'gameStatus'> = {
        lives: MAX_LIVES,
        unlockedLevelIds: [1],
        completedLevels: [],
        score: 0,
        keys: 0,
        gems: 50,
        powerUps: { 'fifty_fifty': 1, 'skip': 1 },
        lastLifeRecharge: Date.now(),
        playerLevel: 1,
        playerXp: 0,
        unlockedAchievements: [],
        lastLoginDate: new Date(0).getTime(),
        playerName: user.displayName || 'Nuevo Aventurero',
        playerAvatar: user.photoURL || defaultAvatar,
        playerCountry: 'ES',
      };
      await userDocRef.set(initialGameState);
    }
  } catch (error) {
    console.error("Error creando los datos iniciales del usuario:", error);
  }
};

export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      await createInitialUserData(result.user);
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export const firebaseSignOut = (): Promise<void> => {
  return auth.signOut();
};

export const onAuthChange = (callback: (user: User | null) => void): Unsubscribe => {
    const unsubscribe = auth.onAuthStateChanged(callback);
    return unsubscribe;
};

// ===== GAME STATE FUNCTIONS =====

export const onGameStateUpdate = (
  uid: string,
  callback: (state: GameState | null, error?: Error) => void
): Unsubscribe => {
  const gameStateDocRef = db.collection('users').doc(uid).collection('gameState').doc('data');
  return gameStateDocRef.onSnapshot(
    (docSnap) => {
      if (docSnap.exists) {
        callback({ ...(docSnap.data() as Omit<GameState, 'gameStatus'>), gameStatus: GameStatus.Map }, undefined);
      } else {
        // If the doc doesn't exist, it might be a new user. 
        // We call back with null, and createInitialUserData will trigger a new snapshot.
        callback(null, undefined);
      }
    },
    (error) => {
      console.error("Error en el snapshot de Firestore:", error);
      callback(null, error);
    }
  );
};

export const updateGameState = (uid: string, data: Partial<GameState>): Promise<void> => {
    const gameStateDocRef = db.collection('users').doc(uid).collection('gameState').doc('data');
    return gameStateDocRef.update(data);
};

export const updateUserProfile = (uid: string, data: { playerName?: string, playerAvatar?: string, playerCountry?: string }): Promise<void> => {
    const gameStateDocRef = db.collection('users').doc(uid).collection('gameState').doc('data');
    return gameStateDocRef.update(data);
};
