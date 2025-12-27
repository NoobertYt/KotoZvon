
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Participant } from '../types';

interface SidebarProps {
  show: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  participants: Participant[];
}

const Sidebar: React.FC<SidebarProps> = ({ show, onClose, messages, onSendMessage, participants }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'people'>('chat');
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[350px] bg-[#17212b] border-l border-white/5 flex flex-col z-30 shadow-2xl animate-slideInRight">
      {/* Header Tabs */}
      <div className="flex p-3 gap-2 bg-[#1c242f] border-b border-white/5">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'chat' ? 'bg-[#2481cc] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          ЧАТ
        </button>
        <button
          onClick={() => setActiveTab('people')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === 'people' ? 'bg-[#2481cc] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          ДРУЗЬЯ ({participants.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#0e1621]/30" ref={scrollRef}>
        {activeTab === 'chat' ? (
          <div className="space-y-5">
            {messages.length === 0 && (
                <div className="text-center mt-20 opacity-30">
                    <div className="text-6xl mb-6">🐈</div>
                    <p className="text-gray-300 text-sm font-medium">Тут пока тихо...<br/>Напиши что-нибудь!</p>
                </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className="flex flex-col items-start animate-fadeIn">
                <span className="text-[11px] font-bold mb-1 text-[#2481cc] ml-2">
                  {m.sender}
                </span>
                <div className="max-w-[90%] rounded-2xl rounded-tl-none px-4 py-3 text-sm bg-[#242f3d] text-white border border-white/5 shadow-md">
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-600 mt-1 ml-2 font-bold uppercase">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                <div className="relative">
                  <img src={p.avatar} className="w-12 h-12 rounded-full object-cover bg-[#242f3d] p-1 border border-white/10" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#17212b] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-100 truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-2 font-medium">
                    {p.isMuted ? (
                      <span className="text-red-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                        Замутан
                      </span>
                    ) : (
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        В эфире
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <form onSubmit={handleSend} className="p-4 bg-[#17212b] border-t border-white/5">
          <div className="flex items-center gap-3 bg-[#242f3d] rounded-2xl px-4 py-2 border border-transparent focus-within:border-[#2481cc] transition-all shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Написать сообщение..."
              className="flex-1 bg-transparent text-sm py-2 outline-none text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="text-[#2481cc] disabled:text-gray-700 hover:scale-110 transition-transform active:scale-90"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </form>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
    </div>
  );
};

export default Sidebar;
