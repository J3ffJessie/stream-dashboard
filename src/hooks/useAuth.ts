import { useState, useCallback } from 'react';
import { initiateOAuth, validateOAuthState } from '../services/auth';
import { useStreamStore } from '../store/useStreamStore';
import { chatWebSocket } from '../services/websocket';
import toast from 'react-hot-toast';

export function useAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const togglePlatform = useStreamStore((state) => state.togglePlatform);

  const connectPlatform = useCallback(async (platformId: string) => {
    setIsAuthenticating(true);
    try {
      // Validate state parameter for LinkedIn
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get('state');
      
      if (platformId === 'linkedin' && state) {
        if (!validateOAuthState('linkedin', state)) {
          throw new Error('Invalid state parameter');
        }
        localStorage.removeItem('linkedin_state');
      }

      await initiateOAuth(platformId);
      togglePlatform(platformId);
      
      // Connect to WebSocket for real-time updates
      const token = localStorage.getItem(`${platformId}_token`);
      if (token) {
        chatWebSocket.connect(token);
      }
      
      toast.success(`Successfully connected to ${platformId}`);
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(`Failed to connect to ${platformId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAuthenticating(false);
    }
  }, [togglePlatform]);

  return { isAuthenticating, connectPlatform };
}