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
import { getCurrentUser } from "../lib/auth";

// Agent configs - Following OpenAI Advanced Agent Example pattern
import { allAgentSets, defaultAgentSetKey } from "../agents";

export default function Home() {
  // App state
  const [currentView, setCurrentView] = useState<'dashboard' | 'voice' | 'tickets' | 'settings' | 'integrations' | 'templates' | 'loading'>('loading');
  const [user, setUser] = useState<any>(null);
  
  // Session state (for voice interface)
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
  const { replyState, setReplyStatus, setLastPostedComment, clearSelectedMention } = useReply();
  const { ticketDisplay, showTickets, hideTickets, clearTickets } = useTicketDisplay();

  // Check authentication on mount
  useEffect(() => {
    // For now, default directly to dashboard to show the new UI
    // Users can log in later or we can add authentication flow
    setCurrentView('dashboard');
    setUser({
      id: 'user_001',
      name: 'Test User',
      email: 'test@squiddles.dev',
      role: 'pm'
    });
  }, []);

  // Safety fallback - never stay in loading state for more than 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentView === 'loading') {
        console.log('⚠️ Fallback: Still in loading state after 5s, defaulting to voice');
        setCurrentView('voice');
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
  const clientRef = useRef<RealtimeClient | null>(null);
  const sessionIdRef = useRef<string>("");
  const lastSelectedMentionKeyRef = useRef<string | null>(null);

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

      console.log("🔑 Fetching ephemeral key...");
      const EPHEMERAL_KEY = await fetchEphemeralKey();
      if (!EPHEMERAL_KEY) {
        console.error("❌ Failed to get ephemeral key");
        return;
      }
      console.log("✅ Got ephemeral key:", EPHEMERAL_KEY.slice(0, 10) + "...");

      console.log("🤖 Setting up agents...");
      console.log("🤖 Current selectedAgentSet:", selectedAgentSet);
      console.log("🤖 Available agent sets:", Object.keys(allAgentSets));
      console.log("🤖 Reply state selected mention:", replyState.selectedMention);
      
      // Use the full agent set to include Jira integration
      const agents = allAgentSets[selectedAgentSet] || allAgentSets.full;
      console.log("🔍 DEBUG: Using agent set:", selectedAgentSet);
      console.log("🤖 Selected agents:", agents?.map(a => a.name) || 'NO AGENTS!');
      
      console.log("🔌 Creating RealtimeClient...");
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
      
      const client = new RealtimeClient({
        getEphemeralKey: async () => EPHEMERAL_KEY,
        initialAgents: agents,
        audioElement: sdkAudioElement,
        extraContext: {
          addTranscriptMessage,
          selectedMention: replyState.selectedMention,
          setReplyStatus,
          setLastPostedComment,
          refreshDashboard: () => {
            // Trigger dashboard refresh if needed
            console.log('🔄 Dashboard refresh requested from voice agent');
          },
        },
        vadConfig: {
          threshold: 0.6,           // Higher threshold = less sensitive to background noise
          prefix_padding_ms: 200,   // Shorter padding = less audio processed
          silence_duration_ms: 800  // Longer silence required before stopping = fewer false triggers
        }
      } as any);

      clientRef.current = client;

      client.on("connection_change", (status) => {
        console.log("🔌 Connection status changed:", status);
        if (status === "connected") {
          setSessionStatus("CONNECTED");
          setIsListening(true); // Set listening to true when connected
        } else if (status === "connecting") {
          setSessionStatus("CONNECTING");
        } else {
          setSessionStatus("DISCONNECTED");
          setIsListening(false); // Set listening to false when disconnected
        }
      });

      // Handle errors like connection failures
      client.on("error", (event) => {
        console.error("❌ Realtime client error:", event);
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

        // Log audio events
        if (ev.type?.includes('audio')) {
          console.log('🔊 Audio event:', ev.type, (ev as any).delta ? `${(ev as any).delta.length} bytes` : '');
        }

        // Log transcription failures with details
        if (ev.type === 'conversation.item.input_audio_transcription.failed') {
          console.error('❌ Audio transcription failed:', ev);
          console.error('❌ Transcription error details:', JSON.stringify(ev.error, null, 2));
          console.error('❌ Item ID:', ev.item_id);
          console.error('❌ Content index:', ev.content_index);
        }

        // Log tool calls and responses
        if (ev.type?.includes('function_call')) {
          console.log('🔧 Tool event:', ev.type, (ev as any).name || 'unknown', (ev as any).arguments || '');
        }

        // Handle function call outputs for ticket display
        if (ev.type === 'response.function_call_arguments.done') {
          const functionName = (ev as any).name;
          const args = (ev as any).arguments;
          
          console.log('🔧 Function call completed:', functionName, args);
          
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
                console.log('🎫 Jira search results received:', parsed.issues.length);
                
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

        // Log all response events for debugging
        if (ev.type?.startsWith('response')) {
          console.log('🤖 Response event:', ev.type, (ev as any).response_id || '');
        }
        
        if (ev.type === 'response.done') {
          console.log('🤖 Full response completed');
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
              console.log('🤖 New assistant message started:', itemId);
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
            
            // Log assistant responses to console
            console.log('🤖 Assistant delta:', delta);
            
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
                    description: page.excerpt || 'No excerpt available',
                    status: 'Published',
                    priority: 'Medium',
                    assignee: page.author || 'Unknown',
                    reporter: page.author || 'Unknown',
                    created: page.created,
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
    }
  };

  // End session
  const endSession = async () => {
    console.log("🛑 Ending session and cleaning up...");
    console.log("🛑 Current session status:", sessionStatus);
    console.log("🛑 Current isListening:", isListening);
    console.log("🛑 Client ref exists:", !!clientRef.current);
    
    if (clientRef.current) {
      // Cancel any ongoing responses first
      try {
        console.log("🛑 Attempting to cancel response...");
        clientRef.current.cancelResponse();
        console.log("🛑 Response canceled successfully");
      } catch (error) {
        console.log("⚠️ No response to cancel during session end:", error);
      }
      
      // Then disconnect
      console.log("🛑 Disconnecting client...");
      clientRef.current.disconnect();
      clientRef.current = null;
      console.log("🛑 Client disconnected and cleared");
    }
    
    console.log("🛑 Setting status to DISCONNECTED...");
    setSessionStatus("DISCONNECTED");
    console.log("🛑 Setting isListening to false...");
    setIsListening(false);
    console.log("✅ Session ended and cleaned up");
    // clearTranscript();
    // clearEvents();
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

  // Toggle listening - when red (listening), clicking should end the session
  const toggleListening = async () => {
    console.log("🎤 Toggle listening clicked. Current state:", isListening);
    console.log("🎤 Session status:", sessionStatus);
    console.log("🎤 Client ref exists:", !!clientRef.current);
    
    if (sessionStatus === "CONNECTED" && isListening) {
      // If we're currently listening (red microphone), end the session completely
      console.log("🎤 Ending session because microphone was clicked while listening");
      console.log("🎤 About to call endSession()...");
      await endSession();
      console.log("🎤 endSession() completed");
    } else if (sessionStatus === "CONNECTED" && !isListening) {
      // If connected but not listening, start listening again
      console.log("🎤 Starting to listen again");
      setIsListening(true);
    } else if (sessionStatus === "DISCONNECTED") {
      // If disconnected, start a new session
      console.log("🎤 Starting new session");
      await startSession();
    } else {
      console.log("🎤 No action - session is connecting or in invalid state");
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
  if (currentView === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Initializing Squiddles...</p>
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
        />
        {ticketDisplay && ticketDisplay.isVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="relative bg-[#0A0A0B] rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={hideTickets}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
              <TicketList
                tickets={ticketDisplay.tickets}
                totalCount={ticketDisplay.totalCount}
                voiceMessage={ticketDisplay.voiceMessage}
                onTicketClick={(ticket) => {
                  console.log('Ticket clicked:', ticket.key);
                  window.open(ticket.url, '_blank');
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  if (currentView === 'voice') {
    return (
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