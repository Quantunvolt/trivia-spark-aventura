import React, { useState, useEffect } from 'react';

interface Star {
  id: number;
  size: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

interface ShootingStarData {
  id: number;
  style: React.CSSProperties;
}


const MovingStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Genera un array de estrellas con propiedades aleatorias para un efecto natural
    const starArray = Array.from({ length: 50 }).map((): Star => ({
      id: Math.random(),
      size: `${Math.random() * 2 + 1}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
    }));
    setStars(starArray);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh); opacity: 1; }
            100% { transform: translateY(110vh); opacity: 1; }
          }
        `}
      </style>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: star.left,
              top: '-10vh',
              animationName: 'fall',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>
    </>
  );
};


const ShootingStar: React.FC = () => {
  const [shootingStars, setShootingStars] = useState<ShootingStarData[]>([]);

  useEffect(() => {
    const createStar = () => {
      const id = Date.now();
      const newStar: ShootingStarData = {
        id,
        style: {
          left: `${Math.random() * 80 + 10}%`,
          top: '-10%',
          animationDuration: `${Math.random() * 1.5 + 1}s`,
        }
      };
      
      setShootingStars(prev => [...prev, newStar]);

      // Limpia la estrella del DOM después de que termine su animación para mantener el rendimiento
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, 3000);
    };
    
    // Crea la primera estrella fugaz después de un breve retraso y luego periódicamente
    const initialTimeout = setTimeout(createStar, 3000);
    const intervalId = setInterval(createStar, 6000); // Frecuencia aumentada para más dinamismo

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes shoot {
            0% { transform: translate(0, 0) rotate(-45deg); opacity: 1; }
            70% { opacity: 1; }
            100% { transform: translate(-150vw, 150vh) rotate(-45deg); opacity: 0; }
          }

          .shooting-star {
            position: absolute;
            width: 3px; height: 3px;
            background: white;
            border-radius: 50%;
            filter: drop-shadow(0 0 6px white);
            animation-name: shoot;
            animation-timing-function: ease-in;
            animation-iteration-count: 1;
            z-index: 5;
          }

          .shooting-star::after {
            content: '';
            position: absolute;
            top: 50%; right: 3px;
            transform: translateY(-50%);
            width: 150px; height: 1.5px;
            background: linear-gradient(to right, white, transparent);
          }
        `}
      </style>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {shootingStars.map(star => (
          <div key={star.id} className="shooting-star" style={star.style} />
        ))}
      </div>
    </>
  );
};

const AnimatedCosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-screen -z-10">
        <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-gray-900 overflow-hidden">
          <MovingStars />
          <ShootingStar />
          <img 
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
            alt="Fondo cósmico" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src='https://placehold.co/1200x800/020617/FFFFFF?text=Fondo'; }}
          />
        </div>
    </div>
  );
};

export default AnimatedCosmicBackground;
