import { create } from 'zustand';
import type { Platform, ChatMessage, StreamingSoftwareStatus } from '../types/stream';

interface StreamStore {
  platforms: Platform[];
  chatMessages: ChatMessage[];
  streamingSoftwareStatus: StreamingSoftwareStatus;
  togglePlatform: (platformId: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateViewerCount: (platformId: string, count: number) => void;
  setStreamingSoftwareStatus: (status: StreamingSoftwareStatus) => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  platforms: [
    { id: 'twitch', name: 'Twitch', isConnected: false, isLive: false },
    { id: 'youtube', name: 'YouTube', isConnected: false, isLive: false },
    { id: 'x', name: 'X', isConnected: false, isLive: false },
    { id: 'linkedin', name: 'LinkedIn', isConnected: false, isLive: false },
  ],
  chatMessages: [],
  streamingSoftwareStatus: 'disconnected',
  
  togglePlatform: (platformId) =>
    set((state) => ({
      platforms: state.platforms.map((platform) =>
        platform.id === platformId
          ? { ...platform, isConnected: !platform.isConnected }
          : platform
      ),
    })),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [message, ...state.chatMessages].slice(0, 100),
    })),

  updateViewerCount: (platformId, count) =>
    set((state) => ({
      platforms: state.platforms.map((platform) =>
        platform.id === platformId
          ? { ...platform, viewerCount: count }
          : platform
      ),
    })),

  setStreamingSoftwareStatus: (status) =>
    set(() => ({
      streamingSoftwareStatus: status,
    })),
}));