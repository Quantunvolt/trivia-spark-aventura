import React from 'react';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onGoogleLogin, onGuestLogin }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-16 text-center animate-fade-in">
        <h1 
          className="font-display text-7xl text-slate-100 drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]"
          style={{ WebkitTextStroke: '2px #3730a3' }}
        >
          TRIVIA
        </h1>
        <h2 
          className="font-display text-8xl text-yellow-500 -mt-4 drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]"
          style={{ WebkitTextStroke: '2px #a16207' }}
        >
          SPARK
        </h2>
        <p className="font-body text-xl text-slate-300 mt-2">Aventura</p>
      </div>

      {/* Login Buttons Section */}
      <div className="w-full max-w-sm flex flex-col gap-4 animate-slide-in-up">
        {/* Google Login Button */}
        <button
          onClick={onGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-white text-slate-700 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-slate-100 transition-all transform hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C43.37 38.33 46.98 32.07 46.98 24.55z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Continuar con Google
        </button>
        {/* Guest Login Button */}
        <button
          onClick={onGuestLogin}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          Entrar como Invitado
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;