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
  onTextInput?: (text: string) => void;
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
  onTextInput,
  onNavigateToDashboard
}: VoiceInterfaceProps) {
  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <button
                onClick={onNavigateToDashboard}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Back to Dashboard"
              >
                <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div className="logo">🦑 Squiddles Voice</div>
            </div>
            <div className="header-right">
              <select
                value={selectedAgentSet}
                onChange={(e) => setSelectedAgentSet(e.target.value)}
                disabled={sessionStatus === "CONNECTED"}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  color: '#FFFFFF',
                  fontSize: '0.875rem'
                }}
              >
                {Object.keys(allAgentSets).map((key) => (
                  <option key={key} value={key} style={{background: '#1A1A1A', color: '#FFFFFF'}}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: sessionStatus === "CONNECTED" ? '#10B981' :
                                 sessionStatus === "CONNECTING" ? '#F59E0B' : '#EF4444'
                }} />
                <span style={{fontSize: '0.875rem', color: '#A1A1AA', fontWeight: 500}}>
                  {sessionStatus === "CONNECTED" ? "Connected" :
                   sessionStatus === "CONNECTING" ? "Connecting..." : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="main-layout">
          <main className="main-content">
            {/* Conversation Panel */}
            <div style={{
              background: 'rgba(20, 20, 20, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>💬</span>
                  <span>Conversation</span>
                </h2>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#A1A1AA'}}>
                  <span>Items: {transcriptItems.length}</span>
                  {isListening && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10B981'}}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        animation: 'pulse 2s infinite'
                      }} />
                      <span>Listening</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{flex: 1, overflow: 'hidden'}}>
                <Transcript items={transcriptItems} />
              </div>
            </div>
          </main>

          {/* Right Panel - Events */}
          <aside className="recent-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-header">
                <h3 className="sidebar-title">
                  <span>⚡</span>
                  <span>Events</span>
                </h3>
                <span style={{fontSize: '0.875rem', color: '#6B7280'}}>
                  {events.length} events
                </span>
              </div>
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                <Events events={events} />
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Toolbar */}
        <BottomToolbar
          sessionStatus={sessionStatus}
          isListening={isListening}
          onStartSession={onStartSession}
          onEndSession={onEndSession}
          onToggleListening={onToggleListening}
          onTextInput={onTextInput}
          selectedAgentSet={selectedAgentSet}
          agentSets={allAgentSets}
        />

        {/* Voice Interface Help */}
        {sessionStatus === "DISCONNECTED" && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem',
            margin: '1rem 2rem'
          }}>
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
              <svg style={{width: '1.5rem', height: '1.5rem', color: '#3B82F6', flexShrink: 0, marginTop: '0.125rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 style={{fontSize: '0.875rem', fontWeight: 500, color: '#3B82F6', marginBottom: '0.5rem'}}>Voice Interface Guide</h3>
                <div style={{fontSize: '0.875rem', color: '#A1A1AA'}}>
                  <ul style={{listStyle: 'disc', paddingLeft: '1rem', lineHeight: 1.5}}>
                    <li>Click "Start Session" to begin voice conversation</li>
                    <li>Speak naturally - the AI will respond in real-time</li>
                    <li>Try: "Create a story for user authentication" or "Show me my tickets"</li>
                    <li>Use the microphone button to control listening</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}