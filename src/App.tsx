import React, { useEffect } from 'react';
import { Radio } from 'lucide-react';
import { useStreamStore } from './store/useStreamStore';
import { PlatformCard } from './components/PlatformCard';
import { ChatBox } from './components/ChatBox';
import { StreamStats } from './components/StreamStats';
import { WebcamPreview } from './components/WebcamPreview';
import { Toaster } from 'react-hot-toast';
import { chatWebSocket } from './services/websocket';

function App() {
  const { platforms, chatMessages, togglePlatform } = useStreamStore();

  useEffect(() => {
    // Reconnect to WebSocket for any previously authenticated platforms
    platforms.forEach(platform => {
      const token = localStorage.getItem(`${platform.id}_token`);
      if (token && platform.isConnected) {
        chatWebSocket.connect(token);
      }
    });

    return () => {
      chatWebSocket.disconnect();
    };
  }, [platforms]);

  const stats = platforms
    .filter(p => p.isConnected)
    .map(p => ({
      platform: p.name,
      viewerCount: p.viewerCount || 0,
      chatCount: chatMessages.filter(m => m.platform === p.name).length,
      uptime: '2h 15m',
    }));

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Radio className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Stream Management Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onToggle={() => togglePlatform(platform.id)}
                />
              ))}
            </div>

            <WebcamPreview />
            <StreamStats stats={stats} />
          </div>

          <div className="lg:col-span-1">
            <ChatBox messages={chatMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;