import React from 'react';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage } from '../types/stream';

interface ChatBoxProps {
  messages: ChatMessage[];
}

export function ChatBox({ messages }: ChatBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[500px] flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="w-5 h-5" />
        <h2 className="font-semibold">Live Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{message.username}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </span>
              <span className="text-xs text-gray-400">via {message.platform}</span>
            </div>
            <p className="text-sm mt-1">{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}