
export interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isAI?: boolean;
  avatar?: string;
}

export enum AppState {
  JOIN = 'JOIN',
  MEETING = 'MEETING'
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}
