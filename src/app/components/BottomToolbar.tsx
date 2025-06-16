"use client";

import React from 'react';
import { SessionStatus } from '../types';

interface BottomToolbarProps {
  sessionStatus: SessionStatus;
  isListening: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
  onToggleListening: () => void;
  selectedAgentSet: string;
  agentSets: Record<string, any[]>;
}

export default function BottomToolbar({
  sessionStatus,
  isListening,
  onStartSession,
  onEndSession,
  onToggleListening,
  selectedAgentSet,
  agentSets
}: BottomToolbarProps) {
  
  const canStartSession = sessionStatus === "DISCONNECTED";
  const canEndSession = sessionStatus === "CONNECTED";
  const canToggleListening = sessionStatus === "CONNECTED";

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
      
      {/* Quick help */}
      {sessionStatus === "CONNECTED" && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Try saying:</strong> "Create a user story for user authentication" or "Create a Jira ticket for this story"
          </div>
        </div>
      )}
    </div>
  );
}