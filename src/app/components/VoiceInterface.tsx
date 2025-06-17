/**
 * Voice Interface Component
 * Extracted from original page.tsx for modular architecture
 */

"use client";

import React from "react";

// UI components
import Transcript from "./Transcript";
import Events from "./Events";
import BottomToolbar from "./BottomToolbar";

// Types
import { SessionStatus, TranscriptItem, EventItem } from "../types";
import { allAgentSets } from "../../agents";

interface VoiceInterfaceProps {
  sessionStatus: SessionStatus;
  selectedAgentSet: string;
  setSelectedAgentSet: (agentSet: string) => void;
  isListening: boolean;
  transcriptItems: TranscriptItem[];
  events: EventItem[];
  onStartSession: () => void;
  onEndSession: () => void;
  onToggleListening: () => void;
  onNavigateToDashboard: () => void;
}

export default function VoiceInterface({
  sessionStatus,
  selectedAgentSet,
  setSelectedAgentSet,
  isListening,
  transcriptItems,
  events,
  onStartSession,
  onEndSession,
  onToggleListening,
  onNavigateToDashboard
}: VoiceInterfaceProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Back to Dashboard Button */}
              <button
                onClick={onNavigateToDashboard}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src="/squiddles_logo_nobg.png" 
                  alt="Squiddles" 
                  className="h-8 w-8"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.textContent = '🦑';
                  }}
                />
                <span className="text-2xl">🦑</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Squiddles Voice Interface</h1>
                  <p className="text-xs text-gray-500">Real-time AI Conversation</p>
                </div>
              </div>
            </div>
            
            {/* Agent Set Selector and Status */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedAgentSet}
                onChange={(e) => setSelectedAgentSet(e.target.value)}
                disabled={sessionStatus === "CONNECTED"}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(allAgentSets).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Session Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  sessionStatus === "CONNECTED" ? "bg-green-500 animate-pulse" :
                  sessionStatus === "CONNECTING" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
                }`} />
                <span className="text-sm text-gray-600 font-medium">
                  {sessionStatus === "CONNECTED" ? "Connected" :
                   sessionStatus === "CONNECTING" ? "Connecting..." : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Panel - Transcript */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Items: {transcriptItems.length}</span>
                {isListening && (
                  <span className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Listening</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Transcript items={transcriptItems} />
          </div>
        </div>

        {/* Right Panel - Events */}
        <div className="w-96 bg-gray-50 border-l flex flex-col">
          <div className="bg-white border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Events</h2>
              <span className="text-sm text-gray-500">
                {events.length} events
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Events events={events} />
          </div>
        </div>
      </main>

      {/* Bottom Toolbar */}
      <BottomToolbar
        sessionStatus={sessionStatus}
        isListening={isListening}
        onStartSession={onStartSession}
        onEndSession={onEndSession}
        onToggleListening={onToggleListening}
        selectedAgentSet={selectedAgentSet}
        agentSets={allAgentSets}
      />

      {/* Voice Interface Help */}
      {sessionStatus === "DISCONNECTED" && (
        <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Voice Interface Guide</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click "Start Session" to begin voice conversation</li>
                    <li>Speak naturally - the AI will respond in real-time</li>
                    <li>Try: "Create a story for user authentication" or "Show me my tickets"</li>
                    <li>Use the microphone button to control listening</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}