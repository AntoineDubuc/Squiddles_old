/**
 * Voice Input Component
 * Implements TICKET-005: Build Voice Input Component
 * 
 * Maintains full compatibility with original OpenAI Realtime API conversation agent
 * while providing enhanced UI integration for dashboard use
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from "uuid";

// Original working voice system imports
import { SessionStatus, TranscriptItem } from "../types";
import { RealtimeClient, RealtimeClientOptions } from "../lib/realtimeClient";
import { allAgentSets, defaultAgentSetKey } from "../../agents";

// Contexts - keeping original working system
import { useTranscript } from "../contexts/TranscriptContext";
import { useEvent } from "../contexts/EventContext";

interface VoiceInputProps {
  // Appearance
  variant?: 'dashboard' | 'floating' | 'inline' | 'hero';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Behavior
  autoStart?: boolean;
  persistSession?: boolean;
  selectedAgentSet?: string;
  
  // Callbacks
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onTranscriptUpdate?: (transcript: TranscriptItem[]) => void;
  onStatusChange?: (status: SessionStatus) => void;
  
  // Styling
  className?: string;
  disabled?: boolean;
}

export default function VoiceInput({
  variant = 'inline',
  size = 'md',
  autoStart = false,
  persistSession = true,
  selectedAgentSet = defaultAgentSetKey,
  onSessionStart,
  onSessionEnd,
  onTranscriptUpdate,
  onStatusChange,
  className = '',
  disabled = false
}: VoiceInputProps) {
  // Voice session state - using original working implementation
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [isListening, setIsListening] = useState(false);
  const [currentAgentSet, setCurrentAgentSet] = useState(selectedAgentSet);
  
  // Original working context hooks
  const { 
    transcriptItems, 
    addTranscriptMessage, 
    updateTranscriptMessage, 
    updateTranscriptItem
  } = useTranscript();
  const { events, addEvent, clearEvents } = useEvent();
  
  // Original working refs and setup
  const clientRef = useRef<RealtimeClient | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element exactly like original implementation
  const sdkAudioElement = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const el = document.createElement('audio');
    el.autoplay = true;
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
  }, []);

  // Attach SDK audio element once it exists (after first render in browser)
  useEffect(() => {
    if (sdkAudioElement && !audioElementRef.current) {
      audioElementRef.current = sdkAudioElement;
    }
  }, [sdkAudioElement]);

  // Original working ephemeral key fetching
  const fetchEphemeralKey = async (): Promise<string | null> => {
    addEvent({
      id: uuidv4(),
      type: 'fetch_session_token_request',
      timestamp: new Date().toISOString(),
      data: { url: "/api/session" },
      source: 'client'
    });
    
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    
    addEvent({
      id: uuidv4(),
      type: 'fetch_session_token_response',
      timestamp: new Date().toISOString(),
      data: data,
      source: 'server'
    });

    if (!data.client_secret?.value) {
      addEvent({
        id: uuidv4(),
        type: 'error.no_ephemeral_key',
        timestamp: new Date().toISOString(),
        data: data,
        source: 'client'
      });
      console.error("No ephemeral key provided by the server");
      setSessionStatus("DISCONNECTED");
      return null;
    }

    return data.client_secret.value;
  };

  // Original working session start implementation
  const startSession = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");
    console.log("🎤 Starting voice session...");

    try {
      // Request microphone permissions first with optimal audio constraints
      console.log("🎤 Requesting microphone permissions...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 24000, // OpenAI Realtime API requirement
            channelCount: 1,    // Mono audio
          }
        });
        console.log("✅ Microphone permission granted", stream.getAudioTracks());
        stream.getTracks().forEach(track => track.stop()); // Clean up test stream
      } catch (permissionError) {
        console.error("❌ Microphone permission denied:", permissionError);
        addEvent({
          id: uuidv4(),
          type: 'error.microphone_permission_denied',
          timestamp: new Date().toISOString(),
          data: { error: permissionError },
          source: 'client'
        });
        setSessionStatus("DISCONNECTED");
        alert("Microphone access is required for voice functionality. Please allow microphone access and try again.");
        return;
      }

      console.log("🔑 Fetching ephemeral key...");
      const EPHEMERAL_KEY = await fetchEphemeralKey();
      if (!EPHEMERAL_KEY) {
        console.error("❌ Failed to get ephemeral key");
        return;
      }
      console.log("✅ Got ephemeral key:", EPHEMERAL_KEY.slice(0, 10) + "...");

      console.log("🤖 Setting up agents...");
      const agents = allAgentSets[currentAgentSet];
      console.log("🤖 Selected agents:", agents.map(a => a.name));
      
      console.log("🔌 Creating RealtimeClient...");
      const client = new RealtimeClient({
        getEphemeralKey: async () => EPHEMERAL_KEY,
        initialAgents: agents,
        audioElement: sdkAudioElement,
        extraContext: {
          addTranscriptMessage,
        },
      } as any);

      clientRef.current = client;

      // Original working event handlers
      client.on("connection_change", (status) => {
        console.log("🔌 Connection status changed:", status);
        if (status === "connected") setSessionStatus("CONNECTED");
        else if (status === "connecting") setSessionStatus("CONNECTING");
        else setSessionStatus("DISCONNECTED");
      });

      client.on("message", (ev) => {
        addEvent({
          id: uuidv4(),
          type: ev.type || 'unknown',
          timestamp: new Date().toISOString(),
          data: ev,
          source: 'server'
        });

        // Process real-time events for streaming responses - ORIGINAL WORKING CODE
        try {
          // Assistant text (or audio-to-text) streaming
          if (
            ev.type === 'response.text.delta' ||
            ev.type === 'response.audio_transcript.delta'
          ) {
            const itemId: string | undefined = (ev as any).item_id ?? (ev as any).itemId;
            const delta: string | undefined = (ev as any).delta ?? (ev as any).text;
            if (!itemId || !delta) return;

            // Check if transcript item exists
            const existingItem = transcriptItems.find(item => item.itemId === itemId);
            if (!existingItem) {
              addTranscriptMessage(itemId, 'assistant', '');
            }
            // Append the latest delta so the UI streams
            updateTranscriptMessage(itemId, delta, true);
            updateTranscriptItem(itemId, { status: 'IN_PROGRESS' });
            return;
          }

          // User transcription streaming
          if (ev.type === 'conversation.input_audio_transcription.delta') {
            const itemId: string | undefined = (ev as any).item_id ?? (ev as any).itemId;
            const delta: string | undefined = (ev as any).delta ?? (ev as any).text;
            if (!itemId || typeof delta !== 'string') return;

            const existingItem = transcriptItems.find(item => item.itemId === itemId);
            if (!existingItem) {
              addTranscriptMessage(itemId, 'user', 'Transcribing…');
            }

            updateTranscriptMessage(itemId, delta, true);
            updateTranscriptItem(itemId, { status: 'IN_PROGRESS' });
            return;
          }

          // Start of user speech
          if (ev.type === 'input_audio_buffer.speech_started') {
            const itemId: string | undefined = (ev as any).item_id;
            if (!itemId) return;

            const exists = transcriptItems.some(item => item.itemId === itemId);
            if (!exists) {
              addTranscriptMessage(itemId, 'user', 'Transcribing…');
              updateTranscriptItem(itemId, { status: 'IN_PROGRESS' });
            }
          }

          // Final user transcript
          if (ev.type === 'conversation.item.input_audio_transcription.completed') {
            const itemId: string | undefined = (ev as any).item_id;
            const transcriptText: string | undefined = (ev as any).transcript;
            if (!itemId || typeof transcriptText !== 'string') return;

            const existingItem = transcriptItems.find(item => item.itemId === itemId);
            if (!existingItem) {
              addTranscriptMessage(itemId, 'user', transcriptText.trim());
            } else {
              updateTranscriptMessage(itemId, transcriptText.trim(), false);
            }
            updateTranscriptItem(itemId, { status: 'DONE' });
          }
        } catch (error) {
          console.error('Error processing message event:', error);
        }
      });

      client.on("history_added", (item) => {
        // Handle different item types from OpenAI Realtime API - ORIGINAL WORKING CODE
        if (item.itemId) {
          let text = '';
          let role: 'user' | 'assistant' = 'assistant';
          
          if ('content' in item && item.content) {
            const content = Array.isArray(item.content) ? item.content[0] : item.content;
            text = (content as any)?.text || (content as any)?.transcript || '';
          } else if ('output' in item && item.output) {
            text = item.output;
          }
          
          if ('role' in item && item.role === 'user') {
            role = 'user';
          }
          
          if (text) {
            addTranscriptMessage(item.itemId, role, text);
          }
        }
      });

      console.log("🚀 Connecting to OpenAI Realtime API...");
      await client.connect();
      console.log("✅ Successfully connected to OpenAI Realtime API!");
      
      if (onSessionStart) onSessionStart();
      
    } catch (error) {
      console.error("❌ Failed to start session:", error);
      setSessionStatus("DISCONNECTED");
    }
  };

  // Original working session end
  const endSession = async () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setSessionStatus("DISCONNECTED");
    setIsListening(false);
    
    if (onSessionEnd) onSessionEnd();
    
    if (!persistSession) {
      clearEvents();
    }
  };

  // Toggle listening - simplified since WebRTC handles audio automatically
  const toggleListening = async () => {
    console.log("🎤 Toggle listening clicked. Current state:", isListening);
    console.log("🎤 Client exists:", !!clientRef.current);
    console.log("🎤 Session status:", sessionStatus);
    
    if (!clientRef.current || sessionStatus !== "CONNECTED") {
      console.log("❌ Cannot toggle listening - not connected");
      return;
    }
    
    // With WebRTC, listening is always active when connected
    // This button now just indicates if we're actively in a conversation
    const newState = !isListening;
    console.log("🎤 Setting listening state to:", newState);
    setIsListening(newState);
    
    if (newState) {
      console.log("🎤 Starting to listen...");
    } else {
      console.log("🎤 Stopping listening...");
    }
  };

  // Effect for callbacks
  useEffect(() => {
    if (onStatusChange) onStatusChange(sessionStatus);
  }, [sessionStatus, onStatusChange]);

  useEffect(() => {
    if (onTranscriptUpdate) onTranscriptUpdate(transcriptItems);
  }, [transcriptItems, onTranscriptUpdate]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && sessionStatus === "DISCONNECTED") {
      startSession();
    }
  }, [autoStart]);

  // Component variants
  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
      xl: "px-8 py-6 text-xl"
    };

    const variantStyles = {
      dashboard: "bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300",
      floating: "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl",
      inline: "bg-blue-600 text-white hover:bg-blue-700",
      hero: "bg-white text-blue-700 shadow-lg hover:shadow-xl hover:scale-105"
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getIconSize = () => {
    const sizes = {
      sm: "w-4 h-4",
      md: "w-5 h-5", 
      lg: "w-6 h-6",
      xl: "w-8 h-8"
    };
    return sizes[size];
  };

  const renderButton = () => {
    if (sessionStatus === "DISCONNECTED") {
      return (
        <button
          onClick={startSession}
          disabled={disabled}
          className={`${getButtonStyles()} ${className}`}
        >
          <svg className={`${getIconSize()} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Start Voice Session
        </button>
      );
    }

    if (sessionStatus === "CONNECTING") {
      return (
        <button disabled className={`${getButtonStyles()} ${className}`}>
          <div className={`${getIconSize()} mr-2 animate-spin rounded-full border-2 border-current border-t-transparent`} />
          Connecting...
        </button>
      );
    }

    if (sessionStatus === "CONNECTED") {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleListening}
            disabled={disabled}
            className={`${getButtonStyles()} ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} ${className}`}
          >
            {isListening ? (
              <>
                <div className={`${getIconSize()} mr-2 bg-red-500 rounded-full animate-pulse`} />
                Listening...
              </>
            ) : (
              <>
                <svg className={`${getIconSize()} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Click to Speak
              </>
            )}
          </button>
          
          <button
            onClick={endSession}
            disabled={disabled}
            className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            End Session
          </button>
        </div>
      );
    }
  };

  return (
    <div className="voice-input-component">
      {renderButton()}
      
      {/* Status indicator for smaller variants */}
      {variant !== 'hero' && sessionStatus === "CONNECTED" && (
        <div className="mt-2 flex items-center text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Connected to {allAgentSets[currentAgentSet]?.[0]?.name || 'AI Agent'}
        </div>
      )}
    </div>
  );
}