import React from 'react';
import { Power } from 'lucide-react';
import type { Platform } from '../types/stream';
import { useAuth } from '../hooks/useAuth';

interface PlatformCardProps {
  platform: Platform;
  onToggle: () => void;
}

export function PlatformCard({ platform, onToggle }: PlatformCardProps) {
  const { isAuthenticating, connectPlatform } = useAuth();

  const handleToggle = async () => {
    if (!platform.isConnected) {
      await connectPlatform(platform.id);
    } else {
      onToggle();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-3 h-3 rounded-full ${platform.isLive ? 'bg-red-500' : 'bg-gray-300'}`} />
        <h3 className="font-semibold">{platform.name}</h3>
        {platform.viewerCount !== undefined && (
          <span className="text-sm text-gray-600">
            {platform.viewerCount} viewers
          </span>
        )}
      </div>
      <button
        onClick={handleToggle}
        disabled={isAuthenticating}
        className={`p-2 rounded-md transition-colors ${
          platform.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        } ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Power className="w-5 h-5" />
      </button>
    </div>
  );
}