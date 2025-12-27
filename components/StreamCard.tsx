
import React, { useEffect, useRef } from 'react';
import { Participant } from '../types';

interface StreamCardProps {
  participant: Participant;
  stream?: MediaStream | null;
  isLocal?: boolean;
}

const StreamCard: React.FC<StreamCardProps> = ({ participant, stream, isLocal }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative aspect-video bg-[#1c242f] rounded-[48px] overflow-hidden shadow-2xl transition-all border-4 ${!participant.isMuted && !participant.isVideoOff ? 'border-[#2481cc]/40 ring-8 ring-[#2481cc]/5' : 'border-white/5'}`}>
      {/* Background/Avatar */}
      <div className="absolute inset-0 w-full h-full bg-[#0a0f14] flex items-center justify-center">
        {participant.isVideoOff || !stream ? (
          <div className="flex flex-col items-center gap-8 animate-fadeIn">
            <div className="w-40 h-40 rounded-full bg-[#17212b] flex items-center justify-center shadow-2xl border-4 border-[#2481cc]/20 overflow-hidden relative group">
              <img src={participant.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={participant.name} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">{participant.name}</h3>
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
                  {participant.isVideoOff ? "Камера выключена" : "Подключение..."}
                </span>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={isLocal} 
            className={`w-full h-full object-cover ${isLocal ? 'mirror' : ''}`} 
          />
        )}
      </div>

      {/* Name Tag */}
      <div className="absolute bottom-8 left-8 p-1.5 bg-black/40 backdrop-blur-2xl rounded-[20px] border border-white/10 flex items-center gap-3 pr-5">
        <div className="w-8 h-8 rounded-[14px] overflow-hidden">
            <img src={participant.avatar} className="w-full h-full object-cover" />
        </div>
        <span className="text-sm font-bold text-white">{participant.name} {isLocal ? '(Вы)' : ''}</span>
      </div>

      {/* Mic Status */}
      {participant.isMuted && (
        <div className="absolute top-8 right-8 bg-red-500/90 backdrop-blur-xl p-4 rounded-[24px] shadow-2xl border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2.5" />
            </svg>
        </div>
      )}

      <style>{`
        .mirror { transform: scaleX(-1); }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default StreamCard;
