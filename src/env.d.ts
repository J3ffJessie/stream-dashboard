/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWITCH_CLIENT_ID: string
  readonly VITE_YOUTUBE_CLIENT_ID: string
  readonly VITE_X_CLIENT_ID: string
  readonly VITE_LINKEDIN_CLIENT_ID: string
  readonly VITE_WEBSOCKET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}