import { PLATFORM_CONFIG } from '../config/platforms';
import type { Platform } from '../types/stream';

export async function initiateOAuth(platformId: Platform['id']) {
  const config = PLATFORM_CONFIG[platformId];
  if (!config) throw new Error(`Unsupported platform: ${platformId}`);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: config.state || platformId,
  });

  // LinkedIn specific parameters
  if (platformId === 'linkedin') {
    params.append('response_type', 'code');
    localStorage.setItem('linkedin_state', config.state);
  }

  window.location.href = `${config.authUrl}?${params.toString()}`;
}

export function validateOAuthState(platform: string, state: string): boolean {
  if (platform === 'linkedin') {
    const savedState = localStorage.getItem('linkedin_state');
    return savedState === state;
  }
  return true;
}