"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Main components
import Dashboard from "./components/Dashboard";
import VoiceInterface from "./components/VoiceInterface";
import Settings from "./components/Settings";
import Integrations from "./components/Integrations";
import TemplateManager from "./components/TemplateManager";
import TicketList from "./components/TicketList";

// Types
import { SessionStatus, TranscriptItem } from "./types";
import type { RealtimeAgent } from '@openai/agents/realtime';

// Context providers & hooks
import { useTranscript } from "./contexts/TranscriptContext";
import { useEvent } from "./contexts/EventContext";
import { useReply } from "./contexts/ReplyContext";
import { useTicketDisplay } from "./contexts/TicketDisplayContext";

// Utilities
import { RealtimeClient, RealtimeClientOptions } from "./lib/realtimeClient";
import { UnifiedVoiceClient, UnifiedVoiceClientOptions } from "../lib/unifiedVoiceClient";
import { getCurrentUser } from "../lib/auth";
import { getVoiceProvider, getVoiceProviderConfig, isFallbackEnabled } from "../config/voiceProvider";

// Agent configs - Following OpenAI Advanced Agent Example pattern
import { allAgentSets, defaultAgentSetKey, createFreshAgentSets } from "../agents";

export default function Home() {
  // App state - start with dashboard instead of loading to avoid hydration issues
  const [currentView, setCurrentView] = useState<'dashboard' | 'voice' | 'tickets' | 'settings' | 'integrations' | 'templates' | 'loading'>('dashboard');
  const [user, setUser] = useState<any>({
    id: 'user_001',
    name: 'Test User',
    email: 'test@squiddles.dev',
    role: 'pm'
  });
  
  // Session state (for voice interface)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [selectedAgentSet, setSelectedAgentSet] = useState<string>(defaultAgentSetKey);
  const [isListening, setIsListening] = useState(false);
  
  // Provider error state
  const [providerError, setProviderError] = useState<{
    message: string;
    provider: string;
    redirectToSettings: boolean;
  } | null>(null);
  
  // Current voice provider state
  const [currentVoiceProvider, setCurrentVoiceProvider] = useState<'openai' | 'nova-sonic' | null>(null);
  
  // Context hooks
  const { 
    transcriptItems, 
    addTranscriptMessage, 
    updateTranscriptMessage, 
    addTranscriptBreadcrumb,
    updateTranscriptItem
  } = useTranscript();
  const { events, addEvent, clearEvents } = useEvent();
  const { replyState, setReplyStatus, setLastPostedComment, clearSelectedMention } = useReply();
  const { ticketDisplay, showTickets, hideTickets, clearTickets } = useTicketDisplay();

  // Authentication setup - now using initial state instead of useEffect
  // This avoids hydration mismatch issues with server/client state differences

  // Safety fallback - never stay in loading state for more than 5 seconds
  useEffect(() => {
    console.log('🔍 Safety fallback useEffect triggered, currentView:', currentView);
    const timeout = setTimeout(() => {
      console.log('⏰ 5 second timeout reached, checking currentView:', currentView);
      if (currentView === 'loading') {
        console.log('⚠️ Fallback: Still in loading state after 5s, defaulting to dashboard');
        setCurrentView('dashboard');
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [currentView]);

  // Listen for voice settings changes
  useEffect(() => {
    const handleVoiceSettingsChange = (event: CustomEvent) => {
      console.log('🎵 Voice settings changed:', event.detail);
      console.log('🎵 Current session status:', sessionStatus);
      
      // If we have an active session, we need to restart it for voice changes to take effect
      if (sessionStatus === "CONNECTED" && clientRef.current) {
        console.log('🔄 Restarting session to apply new voice settings...');
        console.log('🔄 Ending current session...');
        
        // End current session
        endSession();
        
        // Start new session after a brief delay
        setTimeout(() => {
          console.log('🔄 Starting new session with updated voice...');
          startSession();
        }, 1000);
      } else {
        console.log('🎵 No active session to restart, voice will be applied on next connection');
      }
    };

    window.addEventListener('voiceSettingsChanged', handleVoiceSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('voiceSettingsChanged', handleVoiceSettingsChange as EventListener);
    };
  }, [sessionStatus]);

  // Watch for selected mention changes and recreate session if needed
  useEffect(() => {
    const currentMentionKey = replyState.selectedMention?.ticketKey || null;
    const lastMentionKey = lastSelectedMentionKeyRef.current;
    
    // Only recreate session if mention actually changed and we're connected
    if (currentMentionKey !== lastMentionKey && sessionStatus === "CONNECTED") {
      console.log('🎯 Selected mention changed during session:', {
        from: lastMentionKey,
        to: currentMentionKey
      });
      
      // We'll handle session recreation by setting a flag that the startSession can use
      // This is better than trying to call functions that might not be defined yet
      console.log('🔄 Session will be recreated on next voice activation with updated context');
    }
    
    // Update the ref
    lastSelectedMentionKeyRef.current = currentMentionKey;
  }, [replyState.selectedMention?.ticketKey]);
  
  // Refs
  const clientRef = useRef<UnifiedVoiceClient | null>(null);
  const sessionIdRef = useRef<string>("");
  const lastSelectedMentionKeyRef = useRef<string | null>(null);
  const responseAccumulator = useRef<Map<string, string>>(new Map());

  // Refs for audio element (exactly like reference)
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  const sdkAudioElement = React.useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const el = document.createElement('audio');
    el.autoplay = true;
    el.style.display = 'none';
    el.controls = true; // Add controls for debugging
    
    // Add event listeners for debugging
    el.addEventListener('loadstart', () => console.log('🔊 Audio: loadstart'));
    el.addEventListener('loadeddata', () => console.log('🔊 Audio: loadeddata'));
    el.addEventListener('canplay', () => console.log('🔊 Audio: canplay'));
    el.addEventListener('play', () => console.log('🔊 Audio: play started, volume:', el.volume, 'muted:', el.muted));
    el.addEventListener('pause', () => console.log('🔊 Audio: pause'));
    el.addEventListener('ended', () => console.log('🔊 Audio: ended'));
    el.addEventListener('error', (e) => console.error('🔊 Audio error:', e));
    el.addEventListener('volumechange', () => console.log('🔊 Audio: volume changed to', el.volume, 'muted:', el.muted));
    
    document.body.appendChild(el);
    console.log('🔊 Audio element created and added to DOM:', el);
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
        // Basic check before attempting to use getUserMedia
        if (!navigator.mediaDevices) {
          console.error('🔍 Browser environment debug:', {
            userAgent: navigator.userAgent,
            isSecureContext: window.isSecureContext,
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            hasNavigator: !!navigator,
            hasMediaDevices: !!navigator.mediaDevices,
            hasGetUserMedia: !!((navigator as any).getUserMedia || (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia)
          });
          throw new Error('MediaDevices API not available - this usually happens in non-secure contexts or when another app is blocking microphone access');
        }
        
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

      // Fetch ephemeral key for OpenAI (needed for agents even when using Nova Sonic)
      let EPHEMERAL_KEY = null;
      const voiceProvider = getVoiceProvider();
      console.log("🎙️ Voice provider detected:", voiceProvider);
      
      if (voiceProvider === 'openai') {
        console.log("🔑 Fetching OpenAI ephemeral key...");
        EPHEMERAL_KEY = await fetchEphemeralKey();
        if (!EPHEMERAL_KEY) {
          console.error("❌ Failed to get OpenAI ephemeral key");
          return;
        }
        console.log("✅ Got OpenAI ephemeral key:", EPHEMERAL_KEY.slice(0, 10) + "...");
      } else if (voiceProvider === 'nova-sonic') {
        console.log("🔊 Using Nova Sonic for voice, but also fetching OpenAI key for agent processing...");
        EPHEMERAL_KEY = await fetchEphemeralKey();
        if (!EPHEMERAL_KEY) {
          console.error("❌ Failed to get OpenAI ephemeral key for agent processing");
          return;
        }
        console.log("✅ Got OpenAI ephemeral key for agents:", EPHEMERAL_KEY.slice(0, 10) + "...");
      }

      console.log("🤖 Setting up agents...");
      console.log("🤖 Current selectedAgentSet:", selectedAgentSet);
      console.log("🤖 Available agent sets:", Object.keys(allAgentSets));
      console.log("🤖 Reply state selected mention:", replyState.selectedMention);
      
      // Use fresh agent sets to get current voice settings
      const freshAgentSets = createFreshAgentSets();
      const agents = freshAgentSets[selectedAgentSet] || freshAgentSets.full;
      console.log("🔍 DEBUG: Using agent set:", selectedAgentSet);
      console.log("🤖 Selected agents:", agents?.map(a => a.name) || 'NO AGENTS!');
      
      console.log("🔌 Creating UnifiedVoiceClient...");
      console.log("🔍 DEBUG: Agent details:", agents?.map(a => ({
        name: a.name,
        voice: a.voice,
        instructions: a.instructions?.slice(0, 100) + '...',
        toolCount: a.tools?.length || 0
      })));
      console.log("🔍 DEBUG: Audio element:", sdkAudioElement);
      console.log("🔍 DEBUG: Extra context:", {
        selectedMention: replyState.selectedMention,
        hasAddTranscriptMessage: !!addTranscriptMessage
      });
      
      const client = new UnifiedVoiceClient({
        // OpenAI options (only when using OpenAI)
        getEphemeralKey: EPHEMERAL_KEY ? async () => EPHEMERAL_KEY : undefined,
        initialAgents: agents,
        audioElement: sdkAudioElement,
        extraContext: {
          addTranscriptMessage,
          selectedMention: replyState.selectedMention,
          setReplyStatus,
          setLastPostedComment,
          fallbackEnabled: isFallbackEnabled(),
          refreshDashboard: () => {
            // Trigger dashboard refresh if needed
            console.log('🔄 Dashboard refresh requested from voice agent');
          },
        },
        vadConfig: {
          threshold: 0.6,           // Higher threshold = less sensitive to background noise
          prefix_padding_ms: 200,   // Shorter padding = less audio processed
          silence_duration_ms: 800  // Longer silence required before stopping = fewer false triggers
        },
        // Nova Sonic options
        novaSonicConfig: {
          region: process.env.AWS_BEDROCK_REGION || 'us-east-1',
          voiceId: process.env.NOVA_SONIC_VOICE_ID || 'matthew',
          sampleRate: parseInt(process.env.NOVA_SONIC_SAMPLE_RATE || '24000'),
          sessionTimeout: parseInt(process.env.NOVA_SONIC_SESSION_TIMEOUT || '480000'),
        }
      });

      clientRef.current = client;

      client.on("connection_change", (status) => {
        console.log("🔌 Connection status changed:", status);
        console.log("🔌 Before update - sessionStatus:", sessionStatus, "isListening:", isListening);
        
        if (status === "connected") {
          setSessionStatus("CONNECTED");
          setIsListening(true); // Set listening to true when connected
          
          // Update current provider when connected
          const provider = client.getCurrentProvider();
          setCurrentVoiceProvider(provider);
          console.log("🔌 Current voice provider:", provider);
          
          console.log("🔌 After update - should be CONNECTED and listening:true");
        } else if (status === "connecting") {
          setSessionStatus("CONNECTING");
          console.log("🔌 After update - should be CONNECTING");
        } else {
          setSessionStatus("DISCONNECTED");
          setIsListening(false); // Set listening to false when disconnected
          
          // Clear provider when disconnected
          setCurrentVoiceProvider(null);
          
          console.log("🔌 After update - should be DISCONNECTED and listening:false");
        }
      });

      // Handle errors like connection failures
      client.on("error", (event) => {
        console.error("❌ Realtime client error:", event);
        
        // Handle provider failure errors specifically
        if (event.type === 'provider_failed') {
          setProviderError({
            message: event.message,
            provider: event.provider,
            redirectToSettings: event.redirectToSettings
          });
        }
        
        addEvent({
          id: uuidv4(),
          type: 'error.realtime_client',
          timestamp: new Date().toISOString(),
          data: { error: event },
          source: 'client'
        });
        // Don't immediately disconnect on error - let the connection_change handler deal with it
      });

      client.on("message", (ev) => {
        addEvent({
          id: uuidv4(),
          type: ev.type || 'unknown',
          timestamp: new Date().toISOString(),
          data: ev,
          source: 'server'
        });

        // Log only important audio events
        if (ev.type === 'input_audio_buffer.speech_started') {
          console.log('🎤 User started speaking');
        } else if (ev.type === 'input_audio_buffer.speech_stopped') {
          console.log('🎤 User finished speaking');
        }

        // Log transcription failures (simplified)
        if (ev.type === 'conversation.item.input_audio_transcription.failed') {
          console.error('❌ Audio transcription failed');
        }

        // Log tool calls (simplified)
        if (ev.type === 'response.function_call_arguments.done') {
          console.log('🔧 Tool executed:', (ev as any).name);
        }

        // Handle Nova Sonic transcription - send to agent system for processing
        if (ev.type === 'input_audio_buffer.speech_stopped' && (ev as any).transcript) {
          const transcript = (ev as any).transcript;
          console.log('🎤 Nova Sonic transcribed speech, sending to agents:', transcript);
          
          // Send the transcribed text to the agent system for processing
          if (client) {
            client.sendUserText(transcript);
          } else {
            console.error('❌ No client available to send transcribed speech to agents');
          }
        }

        // Handle function call outputs for ticket display
        if (ev.type === 'response.function_call_arguments.done') {
          const functionName = (ev as any).name;
          const args = (ev as any).arguments;
          
          // Store function call info for later processing
          if (functionName === 'searchJiraTickets') {
            try {
              const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
              // Store the search query for when we get the output
              (window as any).__pendingJiraSearch = parsedArgs.query;
            } catch (e) {
              console.error('Failed to parse function args:', e);
            }
          }
        }

        // Handle function outputs
        if (ev.type === 'response.output_item.done') {
          const output = (ev as any).output;
          if (output && typeof output === 'string') {
            try {
              const parsed = JSON.parse(output);
              
              // Check if this is a Jira search result
              if (parsed.success && parsed.issues && Array.isArray(parsed.issues)) {
                
                // Format tickets for display
                const tickets = parsed.issues.map((issue: any) => ({
                  key: issue.key,
                  summary: issue.summary,
                  description: issue.description,
                  status: issue.status,
                  priority: issue.priority || 'Medium',
                  assignee: issue.assignee,
                  reporter: issue.reporter || 'Unknown',
                  created: issue.created,
                  type: issue.type || 'Story',
                  url: issue.url
                }));
                
                // Show tickets in UI with the voice message
                const voiceMessage = parsed.message || `Found ${tickets.length} tickets`;
                showTickets(tickets, parsed.total || tickets.length, voiceMessage, (window as any).__pendingJiraSearch);
                
                // Clear the pending search
                delete (window as any).__pendingJiraSearch;
              }
            } catch (e) {
              // Not JSON or not a ticket result, ignore
            }
          }
        }

        // Response handling (minimal logging)
        if (ev.type === 'response.created') {
          console.log('🤖 Agent is responding...');
        } else if (ev.type === 'response.done') {
          console.log('🤖 Agent finished responding');
        }

        // Log complete response when text/audio response is done
        if (ev.type === 'response.text.done' || ev.type === 'response.audio_transcript.done') {
          const itemId: string | undefined = (ev as any).item_id ?? (ev as any).itemId;
          if (itemId && responseAccumulator.current.has(itemId)) {
            const completeResponse = responseAccumulator.current.get(itemId);
            if (completeResponse && completeResponse.trim()) {
              console.log('🤖 Agent said:', completeResponse.trim());
            }
            // Clean up the accumulator
            responseAccumulator.current.delete(itemId);
          }
        }

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
              console.log('🤖 Agent started speaking');
            }
            
            // Filter raw JSON from streaming assistant responses (but allow formatted tool responses)
            let filteredDelta = delta;
            if ((delta.includes('"success":true') && delta.includes('"pages":[')) || 
                (delta.includes('"success":true') && delta.includes('"spaces":[')) ||
                (delta.includes('{"') && delta.includes('"}') && delta.length > 100 && !delta.includes('Found '))) {
              // If this looks like raw JSON data, don't stream it - wait for complete message
              console.log('🤖 Filtering raw JSON from response:', delta.slice(0, 100));
              return;
            }
            
            // Accumulate the response fragments for complete logging
            const currentAccumulated = responseAccumulator.current.get(itemId) || '';
            const newAccumulated = currentAccumulated + filteredDelta;
            responseAccumulator.current.set(itemId, newAccumulated);
            
            // Append the latest delta so the UI streams
            updateTranscriptMessage(itemId, filteredDelta, true);
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
            
            // Clean up response accumulator for completed user messages
            if (responseAccumulator.current.has(itemId)) {
              responseAccumulator.current.delete(itemId);
            }
          }
        } catch (error) {
          console.error('Error processing message event:', error);
        }
      });

      client.on("history_added", (item) => {
        // Handle function calls and their outputs
        if (item.type === 'function_call') {
          const functionName = (item as any).name;
          const args = (item as any).arguments;
          const output = (item as any).output;
          
          console.log('📋 Function call in history:', functionName, { args, output });
          
          // Check if this is a Jira search with output
          if (functionName === 'searchJiraTickets' && output) {
            try {
              const result = typeof output === 'string' ? JSON.parse(output) : output;
              
              if (result.success && result.issues && Array.isArray(result.issues)) {
                console.log('🎫 Jira search results from history:', result.issues.length);
                
                // Format tickets for display
                const tickets = result.issues.map((issue: any) => ({
                  key: issue.key,
                  summary: issue.summary,
                  description: issue.description,
                  status: issue.status,
                  priority: issue.priority || 'Medium',
                  assignee: issue.assignee,
                  reporter: issue.reporter || 'Unknown',
                  created: issue.created,
                  type: issue.type || 'Story',
                  url: issue.url
                }));
                
                // Show tickets in UI with the voice message
                const voiceMessage = result.message || `Found ${tickets.length} tickets`;
                const searchQuery = typeof args === 'string' ? JSON.parse(args).query : args.query;
                showTickets(tickets, result.total || tickets.length, voiceMessage, searchQuery);
              }
            } catch (e) {
              console.error('Failed to parse function output:', e);
            }
          }
        }
        
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
            // Filter raw JSON responses for better UX
            let displayText = text;
            if (role === 'assistant' && text.includes('"success":true') && text.includes('"pages":[')) {
              try {
                const parsed = JSON.parse(text);
                if (parsed.pages && Array.isArray(parsed.pages)) {
                  const pageCount = parsed.pages.length;
                  const query = parsed.message?.match(/matching "([^"]+)"/)?.[1];
                  if (query) {
                    displayText = `I found ${pageCount} Confluence pages matching "${query}".`;
                  } else {
                    displayText = `I found ${pageCount} Confluence pages.`;
                  }
                }
              } catch (e) {
                displayText = "I found some Confluence pages for you.";
              }
            }
            
            addTranscriptMessage(item.itemId, role, displayText);
            
            // Store original data if it was filtered
            if (displayText !== text && role === 'assistant') {
              updateTranscriptItem(item.itemId, { 
                data: { content: text, text: text }
              });
            }
          }
        }
      });

      // Also handle history updates to catch function outputs that come later
      client.on("history_updated", (history) => {
        history.forEach((item: any) => {
          if (item.type === 'function_call' && item.output) {
            const functionName = item.name;
            const args = item.arguments;
            const output = item.output;
            
            console.log('📋 Function call updated in history:', functionName, { args, output });
            
            // Check if this is a Jira search with output
            if (functionName === 'searchJiraTickets') {
              try {
                const result = typeof output === 'string' ? JSON.parse(output) : output;
                
                if (result.success && result.issues && Array.isArray(result.issues)) {
                  console.log('🎫 Jira search results from history update:', result.issues.length);
                  
                  // Format tickets for display
                  const tickets = result.issues.map((issue: any) => ({
                    key: issue.key,
                    summary: issue.summary,
                    description: issue.description,
                    status: issue.status,
                    priority: issue.priority || 'Medium',
                    assignee: issue.assignee,
                    reporter: issue.reporter || 'Unknown',
                    created: issue.created,
                    type: issue.type || 'Story',
                    url: issue.url
                  }));
                  
                  // Show tickets in UI with the voice message
                  const voiceMessage = result.message || `Found ${tickets.length} tickets`;
                  const searchQuery = typeof args === 'string' ? JSON.parse(args).query : args.query;
                  showTickets(tickets, result.total || tickets.length, voiceMessage, searchQuery);
                }
              } catch (e) {
                console.error('Failed to parse function output:', e);
              }
            }
            
            // Check if this is a Confluence search with output
            if (functionName === 'searchPages') {
              try {
                const result = typeof output === 'string' ? JSON.parse(output) : output;
                
                if (result.success && result.pages && Array.isArray(result.pages)) {
                  console.log('📄 Confluence search results from history update:', result.pages.length);
                  
                  // Format pages for display (similar to tickets)
                  const pages = result.pages.map((page: any) => ({
                    key: page.id,
                    summary: page.title,
                    description: page.excerpt || 'No content preview available',
                    status: 'Published',
                    priority: 'Medium',
                    assignee: page.author?.displayName || page.lastUpdatedBy?.displayName || 'Unknown',
                    reporter: page.author?.displayName || 'Unknown',
                    created: page.createdDate || page.lastModified,
                    type: 'Page',
                    url: page.url
                  }));
                  
                  // Show pages in UI with the voice message
                  const voiceMessage = result.message || `Found ${pages.length} pages`;
                  const searchQuery = typeof args === 'string' ? JSON.parse(args).query : args.query || 'recent pages';
                  showTickets(pages, result.total || pages.length, voiceMessage, searchQuery);
                }
              } catch (e) {
                console.error('Failed to parse Confluence function output:', e);
              }
            }
          }
        });
      });

      console.log("🚀 Connecting to OpenAI Realtime API...");
      await client.connect();
      console.log("✅ Successfully connected to OpenAI Realtime API!");
      
    } catch (error) {
      console.error("❌ Failed to start session:", error);
      setSessionStatus("DISCONNECTED");
      
      // Show user-friendly error message for common issues
      if (error instanceof Error) {
        if (error.message.includes('credentials') || error.message.includes('Access')) {
          console.warn("⚠️ Voice service unavailable: AWS credentials not configured");
        } else if (error.message.includes('EPHEMERAL_KEY')) {
          console.warn("⚠️ Voice service unavailable: OpenAI API key not configured");
        } else {
          console.warn("⚠️ Voice service unavailable:", error.message);
        }
      }
    }
  };

  // End session
  const endSession = async () => {
    console.log("🛑 Session ended");
    if (clientRef.current) {
      try {
        clientRef.current.cancelResponse();
      } catch (error) {
        // Ignore cancellation errors
      }
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    
    // Clean up response accumulator
    responseAccumulator.current.clear();
    
    setSessionStatus("DISCONNECTED");
    setIsListening(false);
  };

  // Push-to-talk handlers
  const pushToTalkStart = () => {
    if (!clientRef.current || sessionStatus !== "CONNECTED") {
      console.log("❌ Cannot start push-to-talk - not connected");
      return;
    }
    
    console.log("🎤 Push-to-talk START");
    setIsListening(true);
    clientRef.current.pushToTalkStart();
  };

  const pushToTalkStop = () => {
    if (!clientRef.current || sessionStatus !== "CONNECTED") {
      console.log("❌ Cannot stop push-to-talk - not connected");
      return;
    }
    
    console.log("🎤 Push-to-talk STOP");
    setIsListening(false);
    clientRef.current.pushToTalkStop();
  };

  // Toggle listening - handle all microphone states including yellow (connecting)
  const toggleListening = async () => {
    if (sessionStatus === "CONNECTED" && isListening) {
      // If we're currently listening (red microphone), end the session completely
      console.log("🎤 Ending session");
      await endSession();
    } else if (sessionStatus === "CONNECTED" && !isListening) {
      // If connected but not listening, start listening again
      console.log("🎤 Starting to listen");
      setIsListening(true);
    } else if (sessionStatus === "CONNECTING") {
      // If connecting (yellow microphone), cancel the connection and revert to disconnected
      console.log("🎤 Canceling connection attempt - reverting to disconnected");
      await endSession(); // This will properly disconnect and cleanup
    } else if (sessionStatus === "DISCONNECTED") {
      // If disconnected, start a new session
      console.log("🎤 Starting session");
      await startSession();
    }
  };

  // Navigation handlers
  const handleNavigateToVoice = () => {
    console.log('🎙️ Navigating to voice interface');
    console.log('🔍 Current view before navigation:', currentView);
    setCurrentView('voice');
    console.log('✅ Voice view should now be active');
  };

  const handleNavigateToTickets = () => {
    console.log('🎫 Navigating to tickets');
    setCurrentView('tickets');
  };

  const handleNavigateToDashboard = () => {
    console.log('📊 Navigating to dashboard');
    setCurrentView('dashboard');
  };

  const handleNavigateToSettings = () => {
    console.log('⚙️ Navigating to settings');
    setCurrentView('settings');
  };

  const handleNavigateToIntegrations = () => {
    console.log('🔗 Navigating to integrations');
    setCurrentView('integrations');
  };

  const handleNavigateToTemplates = () => {
    console.log('📋 Navigating to templates');
    setCurrentView('templates');
  };

  // Text input handler - sends text to the realtime client like voice
  const handleTextInput = (text: string) => {
    if (!clientRef.current || sessionStatus !== "CONNECTED") {
      console.warn('⚠️ Cannot send text: not connected');
      return;
    }

    console.log('💬 Sending text input:', text);
    console.log('💬 Current agent set:', selectedAgentSet);
    console.log('💬 Available agents:', clientRef.current ? 'Client exists' : 'No client');
    
    // Add to transcript immediately
    const itemId = uuidv4();
    addTranscriptMessage(itemId, 'user', text);

    try {
      // Send text to the realtime client (same as voice)
      clientRef.current.sendUserText(text);
      console.log('✅ Text sent successfully to realtime client');
    } catch (error) {
      console.error('❌ Failed to send text:', error);
    }
  };

  // Render based on current view
  console.log('🎨 Rendering with currentView:', currentView);
  
  if (currentView === 'loading') {
    console.log('🔄 Showing loading screen...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Initializing Squiddles...</p>
          <p className="text-xs text-gray-400">Debug: currentView = {currentView}</p>
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <>
        <Dashboard 
          onNavigateToVoice={handleNavigateToVoice}
          onNavigateToTickets={handleNavigateToTickets}
          onNavigateToSettings={handleNavigateToSettings}
          onNavigateToIntegrations={handleNavigateToIntegrations}
          onNavigateToTemplates={handleNavigateToTemplates}
          onStartVoiceSession={startSession}
          onEndVoiceSession={endSession}
          onTextInput={handleTextInput}
          onPushToTalkStart={pushToTalkStart}
          onPushToTalkStop={pushToTalkStop}
          sessionStatus={sessionStatus}
          isListening={isListening}
          searchResults={ticketDisplay}
          onClearSearchResults={hideTickets}
          currentVoiceProvider={currentVoiceProvider}
        />
        
        {/* Provider Error Modal */}
        {providerError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Voice Provider Error</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                {providerError.message}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setProviderError(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Dismiss
                </button>
                {providerError.redirectToSettings && (
                  <button
                    onClick={() => {
                      setProviderError(null);
                      handleNavigateToSettings();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Settings
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (currentView === 'voice') {
    return (
      <>
        <VoiceInterface
          sessionStatus={sessionStatus}
          selectedAgentSet={selectedAgentSet}
          setSelectedAgentSet={setSelectedAgentSet}
          isListening={isListening}
          transcriptItems={transcriptItems}
          events={events}
          onStartSession={startSession}
          onEndSession={endSession}
          onToggleListening={toggleListening}
          onTextInput={handleTextInput}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
        
        {/* Provider Error Modal */}
        {providerError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Voice Provider Error</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                {providerError.message}
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setProviderError(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Dismiss
                </button>
                {providerError.redirectToSettings && (
                  <button
                    onClick={() => {
                      setProviderError(null);
                      handleNavigateToSettings();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Settings
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (currentView === 'settings') {
    return (
      <Settings onNavigateBack={handleNavigateToDashboard} />
    );
  }

  if (currentView === 'integrations') {
    return (
      <Integrations onNavigateBack={handleNavigateToDashboard} />
    );
  }

  if (currentView === 'templates') {
    return (
      <TemplateManager onNavigateBack={handleNavigateToDashboard} />
    );
  }

  if (currentView === 'tickets') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tickets View</h2>
          <p className="text-gray-600 mb-6">This view is not yet implemented</p>
          <button
            onClick={handleNavigateToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <Dashboard 
      onNavigateToVoice={handleNavigateToVoice}
      onNavigateToTickets={handleNavigateToTickets}
    />
  );
}