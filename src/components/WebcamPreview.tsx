import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, MonitorPlay, Power } from 'lucide-react';
import { streamingSoftware } from '../services/streamingSoftware';
import { useStreamStore } from '../store/useStreamStore';
import toast from 'react-hot-toast';

export function WebcamPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string>('');
  const [obsAddress, setObsAddress] = useState('ws://localhost:4455');
  const [obsPassword, setObsPassword] = useState('');
  const streamingSoftwareStatus = useStreamStore((state) => state.streamingSoftwareStatus);

  useEffect(() => {
    if (!isEnabled) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError('');
      } catch (err) {
        setError('Failed to access camera');
        setIsEnabled(false);
        console.error('Camera access error:', err);
      }
    }

    startCamera();
  }, [isEnabled]);

  const handleConnectOBS = async () => {
    try {
      const success = await streamingSoftware.connect(obsAddress, obsPassword);
      if (success) {
        const softwareType = streamingSoftware.getSoftwareType();
        toast.success(`Connected to ${softwareType} successfully`);
      } else {
        toast.error('Failed to connect to streaming software');
      }
    } catch (error) {
      toast.error('Failed to connect to streaming software');
      console.error('Streaming software connection error:', error);
    }
  };

  const handleStreamToggle = async () => {
    try {
      if (streamingSoftwareStatus === 'streaming') {
        await streamingSoftware.stopStreaming();
        toast.success('Stream stopped');
      } else if (streamingSoftwareStatus === 'connected') {
        await streamingSoftware.startStreaming();
        toast.success('Stream started');
      } else {
        toast.error('Please connect to streaming software first');
      }
    } catch (error) {
      toast.error('Failed to toggle stream');
      console.error('Stream toggle error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isEnabled ? (
            <Camera className="w-5 h-5 text-green-600" />
          ) : (
            <CameraOff className="w-5 h-5 text-gray-600" />
          )}
          <h2 className="font-semibold">Camera Preview</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`px-3 py-1 rounded-md text-sm ${
              isEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        {isEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Camera disabled
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Streaming Software WebSocket URL</label>
          <input
            type="text"
            value={obsAddress}
            onChange={(e) => setObsAddress(e.target.value)}
            className="px-3 py-2 border rounded-md"
            placeholder="ws://localhost:4455 (OBS) or ws://localhost:59650 (Streamlabs)"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Password (if required)</label>
          <input
            type="password"
            value={obsPassword}
            onChange={(e) => setObsPassword(e.target.value)}
            className="px-3 py-2 border rounded-md"
            placeholder="WebSocket password"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleConnectOBS}
            className={`flex items-center space-x-1 px-4 py-2 rounded-md ${
              streamingSoftwareStatus === 'disconnected'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-green-100 text-green-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{streamingSoftwareStatus === 'disconnected' ? 'Connect' : 'Connected'}</span>
          </button>

          {streamingSoftwareStatus !== 'disconnected' && (
            <button
              onClick={handleStreamToggle}
              className={`flex items-center space-x-1 px-4 py-2 rounded-md ${
                streamingSoftwareStatus === 'streaming'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <MonitorPlay className="w-4 h-4" />
              <span>{streamingSoftwareStatus === 'streaming' ? 'Stop Stream' : 'Start Stream'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}