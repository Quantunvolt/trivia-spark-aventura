import React, { useState, useEffect } from 'react';
import { GoogleIcon } from './icons';
import { signInWithGoogle } from '../services/firebaseService';

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoTransforms, setLogoTransforms] = useState({
    trivia: {},
    spark: {},
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const moveX = (clientX / innerWidth - 0.5) * 2; // Range -1 to 1
      const moveY = (clientY / innerHeight - 0.5) * 2; // Range -1 to 1

      const triviaStrength = 12;
      const sparkStrength = 8;
      const rotateStrength = 2; // max degrees

      setLogoTransforms({
        trivia: {
          transform: `translate(${moveX * triviaStrength}px, ${moveY * triviaStrength}px) rotateZ(${moveX * rotateStrength}deg)`,
        },
        spark: {
          transform: `translate(${-moveX * sparkStrength}px, ${-moveY * sparkStrength}px) rotateZ(${-moveX * rotateStrength * 0.5}deg)`,
        },
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // onAuthStateChanged in App.tsx will handle the navigation
    } catch (error) {
      console.error("Login failed:", error);
      setError("No se pudo iniciar sesión. Por favor, inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-16 text-center animate-fade-in" style={{ perspective: '800px' }}>
        <h1 
          className="font-display text-7xl text-slate-100 drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out"
          style={{ ...logoTransforms.trivia, WebkitTextStroke: '2px #3730a3' }}
        >
          TRIVIA
        </h1>
        <h2 
          className="font-display text-8xl text-yellow-500 -mt-4 drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out"
          style={{ ...logoTransforms.spark, WebkitTextStroke: '2px #a16207' }}
        >
          SPARK
        </h2>
        <p className="font-body text-xl text-slate-300 mt-2">Aventura</p>
      </div>

      {/* Login Button Section */}
      <div className="w-full max-w-sm flex flex-col gap-4 animate-slide-in-up">
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 w-full bg-white text-slate-700 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-slate-200 transition-all transform hover:scale-105 disabled:bg-slate-300 disabled:scale-100"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <GoogleIcon className="w-6 h-6" />
          )}
          {isLoading ? 'Iniciando Sesión...' : 'Continuar con Google'}
        </button>
        {error && <p className="text-center text-sm text-red-300 mt-2">{error}</p>}
        <p className="text-center text-xs text-slate-400 mt-2 px-4">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;