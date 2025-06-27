"use client";

import React, { useState } from 'react';
import { SessionStatus } from '../types';

interface BottomToolbarProps {
  sessionStatus: SessionStatus;
  isListening: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
  onToggleListening: () => void;
  onTextInput?: (text: string) => void;
  selectedAgentSet: string;
  agentSets: Record<string, any[]>;
}

export default function BottomToolbar({
  sessionStatus,
  isListening,
  onStartSession,
  onEndSession,
  onToggleListening,
  onTextInput,
  selectedAgentSet,
  agentSets
}: BottomToolbarProps) {
  
  const [textInput, setTextInput] = useState('');
  const canStartSession = sessionStatus === "DISCONNECTED";
  const canEndSession = sessionStatus === "CONNECTED";
  const canToggleListening = sessionStatus === "CONNECTED";
  const canSendText = sessionStatus === "CONNECTED" && textInput.trim().length > 0;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSendText && onTextInput) {
      onTextInput(textInput.trim());
      setTextInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Session controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onStartSession}
            disabled={!canStartSession}
            className={`px-4 py-2 rounded-md font-medium ${
              canStartSession
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {sessionStatus === "CONNECTING" ? "Connecting..." : "Start Session"}
          </button>
          
          <button
            onClick={onEndSession}
            disabled={!canEndSession}
            className={`px-4 py-2 rounded-md font-medium ${
              canEndSession
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            End Session
          </button>
        </div>

        {/* Center - Voice controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleListening}
            disabled={!canToggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : canToggleListening
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            data-testid={isListening ? "stop-listening" : "start-listening"}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700">
              {isListening ? 'Listening...' : 'Click to speak'}
            </div>
            <div className="text-xs text-gray-500">
              {sessionStatus === "CONNECTED" ? 'Ready' : 'Not connected'}
            </div>
          </div>
        </div>

        {/* Right side - Agent info */}
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">
            Active Scenario: {selectedAgentSet}
          </div>
          <div className="text-xs text-gray-500">
            {agentSets[selectedAgentSet]?.length || 0} agent(s)
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {agentSets[selectedAgentSet]?.map(agent => agent.name).join(', ') || 'No agents'}
          </div>
        </div>
      </div>
      
      {/* Text Input Alternative */}
      {sessionStatus === "CONNECTED" && (
        <div className="mt-4">
          <form onSubmit={handleTextSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your command (e.g., 'Search for authentication docs', 'Create a ticket for...')"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isListening}
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-sm">
                  Stop voice to type
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!canSendText || isListening}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                canSendText && !isListening
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </form>
        </div>
      )}
      
      {/* Quick help */}
      {sessionStatus === "CONNECTED" && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Try saying or typing:</strong> "Search for authentication docs" • "Create a ticket for user login" • "Document the API endpoints"
          </div>
        </div>
      )}
    </div>
  );
}