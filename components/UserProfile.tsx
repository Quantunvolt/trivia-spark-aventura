import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { BrainIcon, PencilIcon, PhotoIcon } from './icons';
import { Achievement, AvatarOption } from '../types';
import { AVATAR_OPTIONS, COUNTRY_LIST } from '../constants';

interface UserProfileProps {
  show: boolean;
  onClose: () => void;
  playerLevel: number;
  playerXp: number;
  xpForNextLevel: number;
  stats: {
    completed: number;
    stars: number;
    bosses: number;
  };
  achievements: Achievement[];
  playerName: string;
  playerAvatar: string;
  playerCountry: string;
  onUpdatePlayerName: (name: string) => void;
  onUpdateAvatar: (avatarId: string) => void;
  onUpdateCountry: (countryCode: string) => void;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-slate-100 rounded-lg p-3 text-center">
    <div className="text-2xl font-bold font-display text-slate-700">{value}</div>
    <div className="text-xs font-bold text-slate-500 uppercase">{label}</div>
  </div>
);

const AvatarDisplay: React.FC<{ avatar: string, className?: string }> = ({ avatar, className }) => {
    const isCustomImage = avatar.startsWith('data:image');
    const AvatarComponent = AVATAR_OPTIONS.find(a => a.id === avatar)?.component || BrainIcon;
  
    if (isCustomImage) {
      return <img src={avatar} alt="Player Avatar" className={`object-cover ${className}`} />;
    }
    return <AvatarComponent className={className} />;
};


const UserProfile: React.FC<UserProfileProps> = ({ show, onClose, playerLevel, playerXp, xpForNextLevel, stats, achievements, playerName, playerAvatar, playerCountry, onUpdatePlayerName, onUpdateAvatar, onUpdateCountry }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(playerName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
        setEditedName(playerName);
    }
  }, [isEditing, playerName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpdateAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };
  
  const currentCountryName = COUNTRY_LIST.find(c => c.code === playerCountry)?.name || 'Seleccionar';

  const ViewProfile = () => (
     <div className="flex flex-col items-center -mt-4">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
             <AvatarDisplay avatar={playerAvatar} className="w-full h-full text-purple-600 p-3" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-display text-white text-xl border-4 border-white">
            {playerLevel}
          </div>
           <button onClick={() => setIsEditing(true)} className="absolute -top-1 -right-2 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition-transform hover:scale-110">
              <PencilIcon className="w-5 h-5 text-slate-600" />
           </button>
        </div>
        <h3 className="font-display text-2xl text-slate-800">{playerName}</h3>
        <p className="text-slate-500 text-sm flex items-center gap-2">{getFlagEmoji(playerCountry)} {currentCountryName}</p>

        <div className="w-full my-4">
            <div className="bg-slate-200 rounded-full h-4 w-full overflow-hidden border border-slate-300">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full" style={{ width: `${xpForNextLevel > 0 ? (playerXp / xpForNextLevel) * 100 : 0}%`}}></div>
            </div>
            <p className="text-sm text-slate-500 text-center w-full mt-1">{playerXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full mb-4">
            <StatCard label="Niveles" value={stats.completed} />
            <StatCard label="Estrellas" value={stats.stars} />
            <StatCard label="Jefes" value={stats.bosses} />
        </div>
        <div className="w-full text-left">
            <h4 className="font-bold text-slate-700 mb-2">Logros</h4>
            {achievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto bg-slate-50 p-2 rounded-lg">
                    {achievements.map(ach => (
                        <div key={ach.id} className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
                            <ach.icon className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sm text-slate-800 leading-tight">{ach.name}</p>
                                <p className="text-xs text-slate-500 leading-tight">{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-slate-500 p-4 bg-slate-100 rounded-lg">
                    <p>¡Sigue jugando para desbloquear logros!</p>
                </div>
            )}
        </div>
      </div>
  );

  const EditProfile = () => (
    <div className="w-full text-left">
        <h4 className="font-bold text-slate-700 mb-2">Nombre de Usuario</h4>
        <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg font-body font-semibold text-slate-700 mb-6"
            placeholder="Introduce tu nombre"
            maxLength={20}
        />
        <h4 className="font-bold text-slate-700 mb-2">Cambiar Avatar</h4>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
            {AVATAR_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => onUpdateAvatar(opt.id)} className={`p-2 rounded-lg border-2 transition-all ${playerAvatar === opt.id ? 'border-indigo-500 bg-indigo-100' : 'border-slate-200 hover:bg-slate-100'}`}>
                    <opt.component className="w-full h-full text-slate-600" />
                </button>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${playerAvatar.startsWith('data:image') ? 'border-indigo-500 bg-indigo-100' : 'border-slate-200 hover:bg-slate-100'}`}>
                <PhotoIcon className="w-8 h-8 text-slate-600" />
                <span className="text-xs font-bold text-slate-500 mt-1">Subir</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        
        <h4 className="font-bold text-slate-700 mb-2">País</h4>
        <select value={playerCountry} onChange={e => onUpdateCountry(e.target.value)} className="w-full p-3 bg-slate-100 border-slate-200 border rounded-lg font-body font-semibold text-slate-700">
            {COUNTRY_LIST.map(country => (
                <option key={country.code} value={country.code}>{country.name}</option>
            ))}
        </select>
        
        <button onClick={() => {
            if(editedName.trim()){
                onUpdatePlayerName(editedName.trim());
            }
            setIsEditing(false);
        }} className="w-full mt-6 bg-green-500 text-white font-bold py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
            Guardar Cambios
        </button>
    </div>
  );

  return (
    <Modal title={isEditing ? 'Editar Perfil' : 'Perfil de Jugador'} show={show} onClose={() => { onClose(); setIsEditing(false); }}>
        {isEditing ? <EditProfile /> : <ViewProfile />}
    </Modal>
  );
};

export default UserProfile;