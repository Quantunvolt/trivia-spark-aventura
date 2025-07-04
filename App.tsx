import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Game from './Game';
import AnimatedCosmicBackground from './components/AnimatedCosmicBackground';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Para este ejemplo, cualquier acción de inicio de sesión lleva al juego.
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="w-full h-screen">
      <AnimatedCosmicBackground />
      {isLoggedIn ? <Game /> : <LoginScreen onGuestLogin={handleLogin} onGoogleLogin={handleLogin} />}
    </div>
  );
}
