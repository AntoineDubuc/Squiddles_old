/**
 * Voice Hero Section Component
 * Implements TICKET-004: Create Main Dashboard UI
 * Enhanced for TICKET-005: Build Voice Input Component
 */

"use client";

import React, { useState } from 'react';
import VoiceInput from '../VoiceInput';

interface VoiceMetrics {
  sessionsToday: number;
  avgSessionLength: number;
  commandSuccessRate: number;
  lastUsed: Date;
}

interface VoiceHeroSectionProps {
  voiceMetrics: VoiceMetrics;
  onActivateVoice: () => void;
}

export default function VoiceHeroSection({ voiceMetrics, onActivateVoice }: VoiceHeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Space' && !event.repeat) {
      event.preventDefault();
      setIsPressed(true);
      onActivateVoice();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setIsPressed(false);
    }
  };

  React.useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && event.target === document.body) {
        event.preventDefault();
        setIsPressed(true);
        onActivateVoice();
      }
    };

    const handleGlobalKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        setIsPressed(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keyup', handleGlobalKeyUp);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [onActivateVoice]);

  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          What would you like to do?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Create tickets, search projects, or update status with your voice
        </p>

        {/* Voice Activation Button */}
        <div className="mb-8">
          <VoiceInput
            variant="hero"
            size="xl"
            persistSession={true}
            onSessionStart={() => console.log('🎙️ Voice session started from hero')}
            onSessionEnd={() => console.log('🎙️ Voice session ended from hero')}
            onStatusChange={(status) => console.log('🎙️ Status changed:', status)}
            className="hero-voice-button"
          />
        </div>

        {/* Voice Commands Examples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🎫</span>
              <span className="font-semibold text-white">Create Tickets</span>
            </div>
            <p className="text-blue-100 text-sm">
              "Create a story for user authentication"
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🔍</span>
              <span className="font-semibold text-white">Search & Navigate</span>
            </div>
            <p className="text-blue-100 text-sm">
              "Show me tickets assigned to Alex"
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">📊</span>
              <span className="font-semibold text-white">Get Updates</span>
            </div>
            <p className="text-blue-100 text-sm">
              "What's the status of our current sprint?"
            </p>
          </div>
        </div>

        {/* Voice Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{voiceMetrics.sessionsToday}</div>
            <div className="text-sm text-blue-200">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.floor(voiceMetrics.avgSessionLength / 60)}:{(voiceMetrics.avgSessionLength % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-blue-200">Avg Session</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{voiceMetrics.commandSuccessRate}%</div>
            <div className="text-sm text-blue-200">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {voiceMetrics.lastUsed.getHours()}:{voiceMetrics.lastUsed.getMinutes().toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-blue-200">Last Used</div>
          </div>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-blue-200 text-sm">
            <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
            <span>to activate voice anywhere</span>
          </div>
        </div>
      </div>
    </div>
  );
}