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

  const getRoleIcon = (type: TranscriptItem['type']) => {
    switch (type) {
      case 'user': return '👤';
      case 'assistant': return '🤖';
      case 'system': return '⚙️';
      case 'tool_call': return '🔧';
      case 'tool_result': return '📊';
      default: return '💬';
    }
  };

  const getRoleColor = (type: TranscriptItem['type']) => {
    switch (type) {
      case 'user': return 'bg-blue-50 border-blue-200';
      case 'assistant': return 'bg-green-50 border-green-200';
      case 'system': return 'bg-gray-50 border-gray-200';
      case 'tool_call': return 'bg-orange-50 border-orange-200';
      case 'tool_result': return 'bg-purple-50 border-purple-200';
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
            key={item.id}
            className={`border rounded-lg p-4 ${getRoleColor(item.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getRoleIcon(item.type)}</span>
                <span className="font-medium text-sm capitalize">
                  {item.type.replace('_', ' ')}
                  {item.agent && ` (${item.agent})`}
                  {item.toolName && ` - ${item.toolName}`}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTimestamp(item.timestamp)}
              </span>
            </div>
            
            <div className="text-gray-800">
              {item.type === 'tool_call' || item.type === 'tool_result' ? (
                <pre className="whitespace-pre-wrap font-mono text-sm bg-white p-2 rounded border">
                  {typeof item.content === 'object' 
                    ? JSON.stringify(item.content, null, 2)
                    : item.content
                  }
                </pre>
              ) : (
                <p className="whitespace-pre-wrap">{item.content}</p>
              )}
              
              {item.formatted?.transcript && item.formatted.transcript !== item.content && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <span className="text-xs text-gray-500">Transcript:</span>
                  <p className="text-sm" data-testid="transcription">
                    {item.formatted.transcript}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}