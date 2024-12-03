export interface Platform {
  id: string;
  name: 'Twitch' | 'YouTube' | 'X' | 'LinkedIn';
  isConnected: boolean;
  isLive: boolean;
  viewerCount?: number;
  streamKey?: string;
  token?: string;
}

export interface StreamStats {
  platform: string;
  viewerCount: number;
  chatCount: number;
  uptime: string;
}

export interface ChatMessage {
  id: string;
  platform: string;
  username: string;
  message: string;
  timestamp: Date;
}

export interface AuthConfig {
  clientId: string;
  redirectUri: string;
  authUrl: string;
  scopes: string[];
}

export type StreamingSoftwareStatus = 'disconnected' | 'connected' | 'streaming';