"use client";

import React, { useEffect, useRef } from 'react';
import { TranscriptItem } from '../types';

interface TranscriptProps {
  items: TranscriptItem[];
}

export default function Transcript({ items }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getRoleIcon = (role?: TranscriptItem['role']) => {
    switch (role) {
      case 'user': return '👤';
      case 'assistant': return '🤖';
      default: return '💬';
    }
  };

  const getRoleColor = (role?: TranscriptItem['role']) => {
    switch (role) {
      case 'user': return 'bg-blue-50 border-blue-200';
      case 'assistant': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      data-testid="transcript"
    >
      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-2">🦑</div>
          <p>Start a conversation with Squiddles!</p>
          <p className="text-sm mt-2">Click the microphone to begin speaking</p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.itemId}
            className={`border rounded-lg p-4 ${getRoleColor(item.role)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getRoleIcon(item.role)}</span>
                <span className="font-medium text-sm capitalize">
                  {item.role || item.type}
                  {item.title && ` - ${item.title}`}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTimestamp(item.timestamp)}
              </span>
            </div>
            
            <div className="text-gray-800">
              <p className="whitespace-pre-wrap">
                {item.data?.content || item.data?.text || JSON.stringify(item.data, null, 2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}