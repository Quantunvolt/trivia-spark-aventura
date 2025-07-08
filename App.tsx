import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Game from './Game';
import AnimatedCosmicBackground from './components/AnimatedCosmicBackground';
import { onAuthChange, firebaseSignOut, type User } from './services/firebaseService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      // onAuthChange will handle setting the user to null
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (user) {
      return <Game key={user.uid} user={user} onLogout={handleLogout} />;
    }
    
    return <LoginScreen />;
  };

  return (
    <div className="w-full h-screen">
      <AnimatedCosmicBackground />
      {renderScreen()}
    </div>
  );
}