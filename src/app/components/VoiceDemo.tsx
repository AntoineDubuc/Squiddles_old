/**
 * Voice Demo Component
 * Demonstrates TICKET-005: Build Voice Input Component integration
 * Shows all variants and maintains original conversation agent functionality
 */

"use client";

import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import { SessionStatus, TranscriptItem } from '../types';

export default function VoiceDemo() {
  const [lastTranscript, setLastTranscript] = useState<TranscriptItem[]>([]);
  const [lastStatus, setLastStatus] = useState<SessionStatus>("DISCONNECTED");

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎙️ Voice Input Component Demo
        </h1>
        <p className="text-gray-600">
          Demonstrates integration with original OpenAI Realtime API conversation agents
        </p>
      </div>

      {/* Status Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            lastStatus === 'CONNECTED' ? 'bg-green-100 text-green-800' :
            lastStatus === 'CONNECTING' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {lastStatus}
          </span>
          <span className="text-sm text-gray-600">
            Transcript items: {lastTranscript.length}
          </span>
        </div>
      </div>

      {/* Hero Variant */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Hero Voice Input</h2>
        <p className="text-blue-100 mb-6">Main dashboard style with full conversation agent</p>
        <VoiceInput
          variant="hero"
          size="xl"
          persistSession={true}
          onStatusChange={setLastStatus}
          onTranscriptUpdate={setLastTranscript}
          className="shadow-xl"
        />
      </div>

      {/* Floating Variant */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Floating Voice Input</h2>
        <p className="text-gray-600 mb-4">Perfect for overlay or modal use</p>
        <VoiceInput
          variant="floating"
          size="lg"
          persistSession={false}
          onStatusChange={(status) => console.log('Floating status:', status)}
        />
      </div>

      {/* Inline Variants */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Inline Voice Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Small</h3>
            <VoiceInput variant="inline" size="sm" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Medium</h3>
            <VoiceInput variant="inline" size="md" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Large</h3>
            <VoiceInput variant="inline" size="lg" />
          </div>
        </div>
      </div>

      {/* Dashboard Integration */}
      <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
        <h2 className="text-xl font-semibold text-purple-900 mb-4">Dashboard Integration</h2>
        <p className="text-purple-700 mb-4">Styled for sidebar integration</p>
        <VoiceInput
          variant="dashboard"
          size="md"
          persistSession={false}
          className="w-full"
        />
      </div>

      {/* Original Agent Features */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">
          ✅ Original Conversation Agent Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-green-800 mb-2">Voice Capabilities</h3>
            <ul className="space-y-1 text-green-700">
              <li>• Real-time conversation with AI agents</li>
              <li>• OpenAI Realtime API integration</li>
              <li>• WebRTC audio streaming</li>
              <li>• Live transcription</li>
              <li>• Multi-agent handoffs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-800 mb-2">Product Manager Agent</h3>
            <ul className="space-y-1 text-green-700">
              <li>• Create user stories</li>
              <li>• Analyze requirements</li>
              <li>• Fill template sections</li>
              <li>• Search related tickets</li>
              <li>• Natural conversation flow</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Try These Voice Commands</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">User Story Creation</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p className="bg-white p-2 rounded border italic">
                "Create a user story for login functionality"
              </p>
              <p className="bg-white p-2 rounded border italic">
                "I need a story for user authentication with OAuth"
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Requirements Analysis</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p className="bg-white p-2 rounded border italic">
                "Analyze requirements for a dashboard feature"
              </p>
              <p className="bg-white p-2 rounded border italic">
                "Help me break down this complex feature request"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Transcript */}
      {lastTranscript.length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversation</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {lastTranscript.slice(-5).map((item, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                item.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-white mr-8'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {item.role === 'user' ? '👤 You' : '🤖 Assistant'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{item.data?.text || 'No text content'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}