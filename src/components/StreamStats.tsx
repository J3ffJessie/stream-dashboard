import React from 'react';
import { Users, Clock } from 'lucide-react';
import type { StreamStats } from '../types/stream';

interface StreamStatsProps {
  stats: StreamStats[];
}

export function StreamStats({ stats }: StreamStatsProps) {
  const totalViewers = stats.reduce((sum, stat) => sum + stat.viewerCount, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <Users className="w-5 h-5" />
          <h3 className="font-semibold">Total Viewers</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{totalViewers}</p>
      </div>
      
      {stats.map((stat) => (
        <div key={stat.platform} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{stat.platform}</h3>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              Viewers: <span className="font-medium">{stat.viewerCount}</span>
            </p>
            <p className="text-sm">
              Chat Messages: <span className="font-medium">{stat.chatCount}</span>
            </p>
            <p className="text-sm">
              Uptime: <span className="font-medium">{stat.uptime}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}