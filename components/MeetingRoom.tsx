
import React, { useState, useEffect, useRef } from 'react';
import { Participant, ChatMessage } from '../types';
import StreamCard from './StreamCard';
import ControlBar from './ControlBar';
import Sidebar from './Sidebar';
import { db } from '../firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

interface MeetingRoomProps {
  user: Participant;
  roomId: string;
  onLeave: () => void;
}

// Конфигурация STUN серверов Google для обхода NAT
const iceConfig = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }
  ]
};

const MeetingRoom: React.FC<MeetingRoomProps> = ({ user, roomId, onLeave }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  const safeRoomId = roomId.replace(/[^a-zA-Z0-9]/g, '_');

  // 1. Инициализация локальных медиа
  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Отключаем треки по умолчанию, так как состояние в UI - выключено
        stream.getAudioTracks().forEach(t => t.enabled = false);
        stream.getVideoTracks().forEach(t => t.enabled = false);
        setLocalStream(stream);
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startLocalStream();

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // 2. Регистрация в Firestore и логика WebRTC
  useEffect(() => {
    if (!localStream) return;

    const userDocRef = doc(db, `rooms/${safeRoomId}/participants`, user.id);
    setDoc(userDocRef, { ...user, isMuted, isVideoOff, isScreenSharing, lastSeen: serverTimestamp() });

    const participantsRef = collection(db, `rooms/${safeRoomId}/participants`);
    const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
      const pList: Participant[] = [];
      snapshot.forEach((d) => {
        const p = d.data() as Participant;
        pList.push(p);

        // Если появился новый участник (не я), создаем соединение
        if (p.id !== user.id && !peerConnections.current[p.id]) {
          setupPeerConnection(p.id, false);
        }
      });
      setParticipants(pList);
    });

    // Слушаем входящие офферы/сигналы
    const signalsRef = collection(db, `rooms/${safeRoomId}/signals`);
    const unsubSignals = onSnapshot(signalsRef, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.to === user.id) {
            const pc = peerConnections.current[data.from] || setupPeerConnection(data.from, true);
            
            if (data.type === 'offer') {
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await addDoc(collection(db, `rooms/${safeRoomId}/signals`), {
                type: 'answer',
                from: user.id,
                to: data.from,
                sdp: answer
              });
            } else if (data.type === 'answer') {
              await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            } else if (data.type === 'ice-candidate') {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
          }
        }
      });
    });

    return () => {
      unsubscribe();
      unsubSignals();
      deleteDoc(userDocRef);
      // Fix: Casting Object.values result to RTCPeerConnection[] to avoid "unknown" type error on line 123
      (Object.values(peerConnections.current) as RTCPeerConnection[]).forEach(pc => pc.close());
    };
  }, [localStream]);

  const setupPeerConnection = (targetId: string, isReceiver: boolean) => {
    const pc = new RTCPeerConnection(iceConfig);
    peerConnections.current[targetId] = pc;

    // Добавляем наши треки в соединение
    localStream?.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // Когда получаем чужой поток
    pc.ontrack = (event) => {
      setRemoteStreams(prev => ({
        ...prev,
        [targetId]: event.streams[0]
      }));
    };

    // Обмен ICE кандидатами
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(collection(db, `rooms/${safeRoomId}/signals`), {
          type: 'ice-candidate',
          from: user.id,
          to: targetId,
          candidate: event.candidate.toJSON()
        });
      }
    };

    // Если мы инициатор - создаем оффер
    if (!isReceiver) {
      pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await addDoc(collection(db, `rooms/${safeRoomId}/signals`), {
          type: 'offer',
          from: user.id,
          to: targetId,
          sdp: offer
        });
      };
    }

    return pc;
  };

  // 3. Синхронизация статусов
  useEffect(() => {
    const userDocRef = doc(db, `rooms/${safeRoomId}/participants`, user.id);
    updateDoc(userDocRef, { isMuted, isVideoOff, isScreenSharing });
    
    if (localStream) {
      localStream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      localStream.getVideoTracks().forEach(t => t.enabled = !isVideoOff);
    }
  }, [isMuted, isVideoOff, isScreenSharing]);

  // 4. Чат
  useEffect(() => {
    const q = query(collection(db, `rooms/${safeRoomId}/messages`), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const msgList: ChatMessage[] = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id,
        timestamp: d.data().timestamp?.toDate() || new Date()
      } as ChatMessage));
      setMessages(msgList);
    });
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCamera = () => setIsVideoOff(!isVideoOff);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        // В реальном приложении здесь нужно заменить видео-трек во всех peerConnections
        setIsScreenSharing(true);
        stream.getTracks()[0].onended = () => setIsScreenSharing(false);
      } catch (err) { console.error(err); }
    } else {
      setIsScreenSharing(false);
    }
  };

  const sendMessage = async (text: string) => {
    await addDoc(collection(db, `rooms/${safeRoomId}/messages`), {
      sender: user.name,
      text,
      timestamp: serverTimestamp()
    });
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0e1621] relative">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'mr-[350px]' : ''}`}>
        <div className="h-16 flex items-center justify-between px-6 bg-[#17212b]/95 backdrop-blur-md border-b border-white/5 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#2481cc] rounded-full overflow-hidden border border-white/10">
              <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100">{roomId}</h2>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                {participants.length} в сети
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('room', roomId);
              navigator.clipboard.writeText(url.toString());
              alert("Ссылка скопирована! Отправь её другу.");
            }} 
            className="px-4 py-2 bg-[#242f3d] hover:bg-[#2b3a4a] text-[#2481cc] text-[10px] font-black uppercase rounded-xl transition-all border border-white/5"
          >
            Пригласить друга 🔗
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center overflow-y-auto">
          <div className={`grid gap-6 w-full max-w-6xl transition-all duration-500 ${participants.length <= 1 ? 'grid-cols-1 max-w-2xl' : participants.length <= 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {participants.map((p) => (
              <StreamCard 
                key={p.id} 
                participant={p} 
                stream={p.id === user.id ? localStream : remoteStreams[p.id]}
                isLocal={p.id === user.id}
              />
            ))}
          </div>
        </div>

        <ControlBar 
          isMuted={isMuted} isVideoOff={isVideoOff} isScreenSharing={isScreenSharing}
          onToggleMute={toggleMute} onToggleCamera={toggleCamera} onToggleScreenShare={toggleScreenShare}
          onLeave={onLeave} onToggleSidebar={() => setShowSidebar(!showSidebar)}
        />
      </div>

      <Sidebar 
        show={showSidebar} onClose={() => setShowSidebar(false)}
        messages={messages} onSendMessage={sendMessage} participants={participants}
      />
    </div>
  );
};

export default MeetingRoom;
