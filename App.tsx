
import React, { useState, useCallback } from 'react';
import { AppState, Participant } from './types';
import JoinScreen from './components/JoinScreen';
import MeetingRoom from './components/MeetingRoom';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppState>(AppState.JOIN);
  const [user, setUser] = useState<Participant | null>(null);
  const [roomId, setRoomId] = useState<string>('');

  const handleJoin = useCallback((name: string, room: string, avatar: string) => {
    const newUser: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      avatar: avatar
    };
    setUser(newUser);
    setRoomId(room);
    setCurrentStep(AppState.MEETING);
  }, []);

  const handleLeave = useCallback(() => {
    setCurrentStep(AppState.JOIN);
    setUser(null);
    setRoomId('');
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#0e1621]">
      {currentStep === AppState.JOIN ? (
        <JoinScreen onJoin={handleJoin} />
      ) : (
        user && <MeetingRoom user={user} roomId={roomId} onLeave={handleLeave} />
      )}
    </div>
  );
};

export default App;
