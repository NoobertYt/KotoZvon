
import React, { useState, useRef, useEffect } from 'react';

interface JoinScreenProps {
  onJoin: (name: string, room: string, avatar: string) => void;
}

const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kitty",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Tom",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
];

const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверка URL на наличие комнаты при загрузке
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoom(roomParam);
    }
  }, []);

  const generateRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(7).toUpperCase();
    setRoom(`Koto-${randomId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const finalRoom = room.trim() || "Общий холл 🐾";
      onJoin(name, finalRoom, selectedAvatar);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 bg-[#0e1621]">
      <div className="w-full max-w-md p-8 bg-[#17212b] rounded-[32px] shadow-2xl border border-white/5 animate-fadeIn relative overflow-hidden">
        {/* Декоративное свечение сверху */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2481cc]/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="relative group">
            <div className="w-28 h-28 bg-[#2481cc] rounded-full flex items-center justify-center mb-4 text-5xl shadow-lg border-4 border-[#2481cc]/20 overflow-hidden ring-4 ring-black/20">
              <img src={selectedAvatar} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-0 bg-[#2481cc] p-2.5 rounded-full border-4 border-[#17212b] hover:scale-110 active:scale-90 transition-all shadow-xl z-10"
              title="Загрузить фото"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">KotoZvon</h1>
          <p className="text-gray-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em] opacity-60">New Gen Video Calls • 2025</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="flex justify-center gap-3">
              {AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all p-1 bg-[#242f3d] ${selectedAvatar === url ? 'border-[#2481cc] scale-110 shadow-[0_0_15px_rgba(36,129,204,0.4)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={url} alt="option" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#2481cc] text-[10px] font-black mb-2 uppercase tracking-[0.25em] ml-1">Твой позывной</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как тебя зовут?"
                className="w-full bg-[#242f3d] border border-transparent focus:border-[#2481cc]/50 rounded-2xl py-4 px-5 text-white outline-none transition-all placeholder-gray-600 font-bold"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[#2481cc] text-[10px] font-black uppercase tracking-[0.25em]">Комната</label>
                <button 
                  type="button" 
                  onClick={generateRandomRoom}
                  className="text-[10px] font-black text-gray-500 hover:text-[#2481cc] transition-colors"
                >
                  СЛУЧАЙНАЯ 🎲
                </button>
              </div>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Пусто для общего холла"
                className="w-full bg-[#242f3d]/50 border border-transparent focus:border-[#2481cc]/50 rounded-2xl py-4 px-5 text-white outline-none transition-all placeholder-gray-700 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2481cc] hover:bg-[#288fde] active:scale-95 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#2481cc]/40 flex items-center justify-center gap-3 text-lg uppercase tracking-wider group"
          >
            Начать звонок
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest opacity-40 text-center">
          &copy; 2025 KotoZvon Team • All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default JoinScreen;
