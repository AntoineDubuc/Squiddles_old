"use client";

import React, { useEffect, useRef } from 'react';
import { EventItem } from '../types';

interface EventsProps {
  events: EventItem[];
}

export default function Events({ events }: EventsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventIcon = (type: string) => {
    if (type.includes('session')) return '🔗';
    if (type.includes('conversation')) return '💬';
    if (type.includes('input_audio')) return '🎤';
    if (type.includes('output_audio')) return '🔊';
    if (type.includes('response')) return '📝';
    if (type.includes('tool')) return '🔧';
    if (type.includes('error')) return '❌';
    return '📡';
  };

  const getEventColor = (type: string) => {
    if (type.includes('error')) return 'border-red-200 bg-red-50';
    if (type.includes('session')) return 'border-blue-200 bg-blue-50';
    if (type.includes('tool')) return 'border-orange-200 bg-orange-50';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-2"
    >
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <div className="text-2xl mb-2">📡</div>
          <p className="text-sm">Events will appear here</p>
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className={`border rounded p-3 text-xs ${getEventColor(event.type)}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1">
                <span>{getEventIcon(event.type)}</span>
                <span className="font-mono font-medium">{event.type}</span>
                <span className={`px-1 rounded text-xs ${
                  event.source === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {event.source}
                </span>
              </div>
              <span className="text-gray-500">
                {formatTimestamp(event.timestamp)}
              </span>
            </div>
            
            {event.data && Object.keys(event.data).length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  View Data
                </summary>
                <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-x-auto">
                  {JSON.stringify(event.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))
      )}
    </div>
  );
}