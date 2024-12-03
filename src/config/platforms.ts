export const PLATFORM_CONFIG = {
  twitch: {
    clientId: import.meta.env.VITE_TWITCH_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/twitch/callback`,
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    scopes: ['channel:read:stream_key', 'chat:read', 'chat:edit', 'channel:moderate'],
  },
  youtube: {
    clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/youtube/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.force-ssl'],
  },
  x: {
    clientId: import.meta.env.VITE_X_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/x/callback`,
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
  },
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/linkedin/callback`,
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'w_member_social'],
    state: crypto.randomUUID(),
  },
};