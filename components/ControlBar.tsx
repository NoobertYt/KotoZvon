
import React from 'react';

interface ControlBarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onLeave: () => void;
  onToggleSidebar: () => void;
}

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { isMuted, isVideoOff, isScreenSharing, onToggleMute, onToggleCamera, onToggleScreenShare, onLeave, onToggleSidebar } = props;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#17212b]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#242f3d] text-gray-300 hover:bg-[#2b3a4a] border border-transparent'}`}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          )}
        </button>

        {/* Camera Button */}
        <button
          onClick={onToggleCamera}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#242f3d] text-gray-300 hover:bg-[#2b3a4a] border border-transparent'}`}
        >
          {isVideoOff ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>

        {/* Screen Share */}
        <button
          onClick={onToggleScreenShare}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isScreenSharing ? 'bg-[#2481cc] text-white' : 'bg-[#242f3d] text-gray-300 hover:bg-[#2b3a4a]'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>

        <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#242f3d] text-gray-300 hover:bg-[#2b3a4a] transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>

        {/* End Call */}
        <button
          onClick={onLeave}
          className="w-16 h-12 flex items-center justify-center rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
