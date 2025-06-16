"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// UI components
import Transcript from "./components/Transcript";
import Events from "./components/Events";
import BottomToolbar from "./components/BottomToolbar";

// Types
import { SessionStatus, TranscriptItem } from "./types";
import type { RealtimeAgent } from '@openai/agents/realtime';

// Context providers & hooks
import { useTranscript } from "./contexts/TranscriptContext";
import { useEvent } from "./contexts/EventContext";

// Utilities
import { RealtimeClient, RealtimeClientOptions } from "./lib/realtimeClient";

// Agent configs - Following OpenAI Advanced Agent Example pattern
import { allAgentSets, defaultAgentSetKey } from "../agents";

export default function Home() {
  // Session state
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [selectedAgentSet, setSelectedAgentSet] = useState<string>(defaultAgentSetKey);
  const [isListening, setIsListening] = useState(false);
  
  // Context hooks
  const { 
    transcriptItems, 
    addTranscriptMessage, 
    updateTranscriptMessage, 
    addTranscriptBreadcrumb,
    updateTranscriptItem
  } = useTranscript();
  const { events, addEvent, clearEvents } = useEvent();
  
  // Refs
  const clientRef = useRef<RealtimeClient | null>(null);
  const sessionIdRef = useRef<string>("");

  // Refs for audio element (exactly like reference)
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
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

  // Initialize session exactly like reference
  const startSession = async () => {
    if (sessionStatus !== "DISCONNECTED") return;
    setSessionStatus("CONNECTING");
    console.log("🎤 Starting session...");

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
      const agents = allAgentSets[selectedAgentSet];
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

        // Process real-time events for streaming responses
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
        // Handle different item types from OpenAI Realtime API
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
      
    } catch (error) {
      console.error("❌ Failed to start session:", error);
      setSessionStatus("DISCONNECTED");
    }
  };

  // End session
  const endSession = async () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setSessionStatus("DISCONNECTED");
    setIsListening(false);
    // clearTranscript();
    // clearEvents();
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">🦑 Squiddles</h1>
              <span className="text-sm text-gray-500">Voice AI Interface</span>
            </div>
            
            {/* Agent Set Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedAgentSet}
                onChange={(e) => setSelectedAgentSet(e.target.value)}
                disabled={sessionStatus === "CONNECTED"}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {Object.keys(allAgentSets).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Session Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  sessionStatus === "CONNECTED" ? "bg-green-500" :
                  sessionStatus === "CONNECTING" ? "bg-yellow-500" : "bg-red-500"
                }`} />
                <span className="text-sm text-gray-600">{sessionStatus}</span>
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
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Transcript items={transcriptItems} />
          </div>
        </div>

        {/* Right Panel - Events */}
        <div className="w-96 bg-gray-50 border-l flex flex-col">
          <div className="bg-white border-b px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-900">Events</h2>
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
        onStartSession={startSession}
        onEndSession={endSession}
        onToggleListening={toggleListening}
        selectedAgentSet={selectedAgentSet}
        agentSets={allAgentSets}
      />
    </div>
  );
}