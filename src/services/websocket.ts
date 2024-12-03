import { io, Socket } from 'socket.io-client';
import { useStreamStore } from '../store/useStreamStore';

class ChatWebSocket {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('chat_message', (message) => {
      useStreamStore.getState().addChatMessage(message);
    });

    this.socket.on('viewer_count', ({ platform, count }) => {
      useStreamStore.getState().updateViewerCount(platform, count);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatWebSocket = new ChatWebSocket();