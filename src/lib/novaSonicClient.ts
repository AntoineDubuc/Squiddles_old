/**
 * Nova Sonic Client for Squiddles
 * AWS Bedrock Nova Sonic bidirectional streaming implementation
 */

import { BedrockRuntimeClient, InvokeModelWithBidirectionalStreamCommand } from '@aws-sdk/client-bedrock-runtime';

// Event types for Nova Sonic client
export type NovaSonicEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  audio_received: [ArrayBuffer];
  error: [any];
  session_start: [];
  session_end: [];
  audio_start: [];
  audio_end: [];
};

// Configuration for Nova Sonic client
export interface NovaSonicConfig {
  region: string;
  modelId: string;
  voiceId: string;
  sampleRate: number;
  sessionTimeout: number;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

// Default configuration
const DEFAULT_CONFIG: Partial<NovaSonicConfig> = {
  region: 'us-east-1', // Nova Sonic is only available in us-east-1
  modelId: 'amazon.nova-sonic-v1:0',
  voiceId: 'matthew',
  sampleRate: 24000,
  sessionTimeout: 480000, // 8 minutes
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.9
};

// Simple event emitter for Nova Sonic
type Listener<Args extends any[]> = (...args: Args) => void;

class NovaSonicEmitter<Events extends Record<string, any[]>> {
  #events = new Map<keyof Events, Listener<any[]>[]>();

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    const arr = this.#events.get(event) || [];
    arr.push(fn);
    this.#events.set(event, arr);
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    const arr = this.#events.get(event) || [];
    this.#events.set(
      event,
      arr.filter((f) => f !== fn),
    );
  }

  emit<K extends keyof Events>(event: K, ...args: Events[K]) {
    const arr = this.#events.get(event) || [];
    arr.forEach((fn) => fn(...args));
  }
}

export class NovaSonicClient {
  private client: BedrockRuntimeClient;
  private config: NovaSonicConfig;
  private events = new NovaSonicEmitter<NovaSonicEvents>();
  private isConnected = false;
  private bidirectionalStream: any = null;
  private sessionId: string | null = null;
  private promptName: string | null = null;
  private audioContentName: string | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isAudioStarted = false;
  private sessionGenerator: AsyncGenerator<any, void, unknown> | null = null;
  private eventQueue: any[] = [];
  private resolveNextEvent: (() => void) | null = null;

  constructor(config: Partial<NovaSonicConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config } as NovaSonicConfig;
    
    // Use browser-accessible environment variables
    const region = process.env.NEXT_PUBLIC_AWS_REGION || this.config.region;
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
    
    console.log('🔧 Nova Sonic Configuration:');
    console.log('  Region:', region);
    console.log('  Model ID:', this.config.modelId);
    console.log('  Voice ID:', this.config.voiceId);
    console.log('  Access Key ID:', accessKeyId ? accessKeyId.slice(0, 8) + '...' : 'MISSING');
    console.log('  Secret Key:', secretAccessKey ? '***configured***' : 'MISSING');
    
    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials are missing. Please check NEXT_PUBLIC_AWS_ACCESS_KEY_ID and NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY environment variables.');
    }
    
    this.client = new BedrockRuntimeClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  // Event listener management
  on<K extends keyof NovaSonicEvents>(event: K, listener: (...args: NovaSonicEvents[K]) => void) {
    this.events.on(event, listener as any);
  }

  off<K extends keyof NovaSonicEvents>(event: K, listener: (...args: NovaSonicEvents[K]) => void) {
    this.events.off(event, listener as any);
  }

  // Set system prompt (must be called before connect)
  setSystemPrompt(prompt: string): void {
    this.config.systemPrompt = prompt;
    console.log('📝 Nova Sonic system prompt updated');
  }

  // Connect to Nova Sonic using bidirectional streaming
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('🔊 Nova Sonic already connected');
      return;
    }

    try {
      console.log('🔊 Connecting to Nova Sonic via bidirectional streaming...');
      console.log('🔧 Nova Sonic config:', {
        region: this.config.region,
        modelId: this.config.modelId,
        voiceId: this.config.voiceId,
        sampleRate: this.config.sampleRate
      });
      this.events.emit('connection_change', 'connecting');

      // Generate session ID and prompt name
      this.sessionId = `nova-sonic-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      this.promptName = `prompt-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      // Initialize bidirectional stream first
      await this.initializeBidirectionalStream();
      
      // Mark as connected but don't start audio yet
      this.isConnected = true;
      this.events.emit('session_start');
      
      // Wait a bit to ensure system prompt is sent if configured
      if (this.config.systemPrompt) {
        console.log('⏳ Waiting for system prompt to be processed...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Start microphone capture after system prompt is sent
      await this.startAudioCapture();
      
      this.events.emit('connection_change', 'connected');
      console.log('✅ Nova Sonic connected via bidirectional streaming');
      
    } catch (error) {
      console.error('❌ Nova Sonic connection failed:', error);
      this.events.emit('error', error);
      this.events.emit('connection_change', 'disconnected');
      throw error;
    }
  }

  // Disconnect from Nova Sonic
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      console.log('🔊 Disconnecting from Nova Sonic...');
      
      // Stop audio capture
      this.stopAudioCapture();
      
      // Send prompt end event
      if (this.promptName) {
        const promptEndEvent = {
          event: {
            promptEnd: {
              promptName: this.promptName
            }
          }
        };
        this.enqueueEvent(promptEndEvent);
        console.log('📝 Sent prompt end event');
      }
      
      // Send session end event
      const sessionEndEvent = {
        event: {
          sessionEnd: {}
        }
      };
      this.enqueueEvent(sessionEndEvent);
      console.log('📝 Sent session end event');
      
      // Give time for events to be sent
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Close bidirectional stream
      await this.closeBidirectionalStream();
      
      this.isConnected = false;
      this.sessionId = null;
      this.promptName = null;
      this.audioContentName = null;
      
      this.events.emit('session_end');
      this.events.emit('connection_change', 'disconnected');
      
      console.log('✅ Nova Sonic disconnected successfully');
      
    } catch (error) {
      console.error('❌ Nova Sonic disconnection error:', error);
      this.events.emit('error', error);
    }
  }

  // Send text message to Nova Sonic via established bidirectional stream
  async sendTextMessage(text: string): Promise<void> {
    try {
      if (!this.isConnected) {
        console.warn('⚠️ Cannot send text: not connected to Nova Sonic');
        return;
      }

      // Create content start event
      const contentStartEvent = {
        event: {
          contentStart: {
            role: 'user',
            contentType: 'text'
          }
        }
      };

      // Create text input event for Nova Sonic
      const textEvent = {
        event: {
          textInput: {
            text: text
          }
        }
      };

      // Create content end event
      const contentEndEvent = {
        event: {
          contentEnd: {}
        }
      };

      // Send events in sequence through the established bidirectional stream
      this.enqueueEvent(contentStartEvent);
      this.enqueueEvent(textEvent);
      this.enqueueEvent(contentEndEvent);
      
      console.log(`📝 Sent text to Nova Sonic: "${text.substring(0, 50)}..."`);
      
    } catch (error) {
      console.error('❌ Failed to send text to Nova Sonic:', error);
      this.events.emit('error', error);
    }
  }

  // Utility: Convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Utility: Convert base64 to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.isConnected ? 'connected' : 'disconnected';
  }

  // Get session ID
  getSessionId(): string | null {
    return this.sessionId;
  }

  // Get configuration
  getConfig(): NovaSonicConfig {
    return { ...this.config };
  }

  // Enqueue event for sending through the bidirectional stream
  private enqueueEvent(event: any): void {
    this.eventQueue.push(event);
    if (this.resolveNextEvent) {
      const resolve = this.resolveNextEvent;
      this.resolveNextEvent = null;
      resolve();
    }
  }

  // Create async generator for session and dynamic events (AWS pattern with event queue)
  private async* createSessionGenerator(): AsyncIterable<any> {
    console.log('📝 Starting Nova Sonic session generator...');
    
    // First: Session start event (only inference configuration)
    const sessionStartEvent = {
      event: {
        sessionStart: {
          inferenceConfiguration: {
            maxTokens: this.config.maxTokens || 4096,
            temperature: this.config.temperature || 0.7,
            topP: this.config.topP || 0.9
          }
        }
      }
    };

    console.log('📤 Yielding session start event');
    yield {
      chunk: {
        bytes: new TextEncoder().encode(JSON.stringify(sessionStartEvent))
      }
    };

    // Second: Prompt start event (with audio configuration and system instructions)
    const promptStartEvent = {
      event: {
        promptStart: {
          promptName: this.promptName,
          textOutputConfiguration: {
            mediaType: 'text/plain'
          },
          audioOutputConfiguration: {
            mediaType: 'audio/lpcm',
            sampleRateHertz: this.config.sampleRate,
            sampleSizeBits: 16,
            channelCount: 1,
            voiceId: this.config.voiceId,
            encoding: 'base64',
            audioType: 'SPEECH'
          }
        }
      }
    };

    console.log('📤 Yielding prompt start event');
    yield {
      chunk: {
        bytes: new TextEncoder().encode(JSON.stringify(promptStartEvent))
      }
    };

    // Third: Send system prompt if provided
    if (this.config.systemPrompt) {
      const systemContentName = `system-content-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      // Start system content
      const systemContentStartEvent = {
        event: {
          contentStart: {
            promptName: this.promptName,
            contentName: systemContentName,
            type: 'TEXT',
            role: 'SYSTEM',
            interactive: false,
            textInputConfiguration: {
              mediaType: 'text/plain'
            }
          }
        }
      };
      
      console.log('📤 Yielding system content start event');
      yield {
        chunk: {
          bytes: new TextEncoder().encode(JSON.stringify(systemContentStartEvent))
        }
      };
      
      // Send system text
      const systemTextEvent = {
        event: {
          textInput: {
            promptName: this.promptName,
            contentName: systemContentName,
            content: this.config.systemPrompt
          }
        }
      };
      
      console.log('📤 Yielding system text event');
      yield {
        chunk: {
          bytes: new TextEncoder().encode(JSON.stringify(systemTextEvent))
        }
      };
      
      // End system content
      const systemContentEndEvent = {
        event: {
          contentEnd: {
            promptName: this.promptName,
            contentName: systemContentName
          }
        }
      };
      
      console.log('📤 Yielding system content end event');
      yield {
        chunk: {
          bytes: new TextEncoder().encode(JSON.stringify(systemContentEndEvent))
        }
      };
    }

    console.log('📝 Session and prompt started, now processing dynamic events...');
    
    // Process events from queue as they come in
    while (true) {
      if (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        console.log('📤 Yielding dynamic event from queue');
        yield {
          chunk: {
            bytes: new TextEncoder().encode(JSON.stringify(event))
          }
        };
      } else {
        // Wait for new events to be added to queue
        await new Promise<void>(resolve => {
          this.resolveNextEvent = resolve;
        });
      }
    }
  }

  // Initialize bidirectional stream with Nova Sonic (simplified AWS pattern)
  private async initializeBidirectionalStream(): Promise<void> {
    try {
      console.log('🔄 Initializing Nova Sonic bidirectional stream...');

      // Create simple session generator (AWS official pattern)
      const sessionGenerator = this.createSessionGenerator();

      // Create the bidirectional stream command with simple async generator
      const command = new InvokeModelWithBidirectionalStreamCommand({
        modelId: this.config.modelId, // amazon.nova-sonic-v1:0
        body: sessionGenerator // Simple AsyncIterable generator
      });

      // Execute the command and get the response stream
      const response = await this.client.send(command);
      this.bidirectionalStream = response.body;

      if (!this.bidirectionalStream) {
        throw new Error('Failed to establish bidirectional stream - no response body');
      }

      // Start processing the single response stream
      this.processResponseStream();

      console.log('✅ Nova Sonic bidirectional stream initialized');

    } catch (error) {
      console.error('❌ Failed to initialize bidirectional stream:', error);
      throw error;
    }
  }


  // Process the response stream from Nova Sonic
  private async processResponseStream(): Promise<void> {
    try {
      if (!this.bidirectionalStream) {
        throw new Error('No bidirectional stream available');
      }

      console.log('🔄 Starting to process Nova Sonic response stream...');

      for await (const chunk of this.bidirectionalStream) {
        console.log('📨 Received chunk from Nova Sonic:', chunk);
        
        if (chunk.chunk?.bytes) {
          try {
            const eventData = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
            await this.handleNovaSonicEvent(eventData);
          } catch (parseError) {
            console.error('❌ Failed to parse Nova Sonic event:', parseError);
            console.log('Raw chunk data:', chunk);
          }
        } else {
          console.log('📨 Received chunk without bytes:', chunk);
        }
      }
    } catch (error) {
      console.error('❌ Error processing response stream:', error);
      this.events.emit('error', error);
      
      // Clean up on stream error
      if (this.isConnected) {
        console.log('🔌 Stream error detected, disconnecting...');
        await this.disconnect();
      }
    }
  }

  // Handle events from Nova Sonic
  private async handleNovaSonicEvent(event: any): Promise<void> {
    console.log('📨 Nova Sonic event received:', JSON.stringify(event, null, 2));

    // Handle the proper event structure from AWS Nova Sonic
    if (event.event) {
      const eventType = Object.keys(event.event)[0];
      const eventData = event.event[eventType];
      
      console.log('📨 Processing event type:', eventType);

      switch (eventType) {
        case 'sessionStart':
          console.log('✅ Nova Sonic session started');
          break;

        case 'promptStart':
          console.log('✅ Nova Sonic prompt started:', eventData);
          break;

        case 'contentStart':
          console.log('🎤 Nova Sonic content start');
          this.events.emit('audio_start');
          break;

        case 'audioOutput':
          if (eventData?.content) {
            console.log('🔊 Received audio response from Nova Sonic');
            const audioBuffer = this.base64ToArrayBuffer(eventData.content);
            this.events.emit('audio_received', audioBuffer);
          }
          break;

        case 'textOutput':
          if (eventData?.text) {
            console.log('📝 Nova Sonic transcribed user speech:', eventData.text);
            // This is the user's transcribed speech, not an AI response
            // We need to send this to the agent system for processing
            this.events.emit('message', {
              type: 'input_audio_buffer.speech_stopped',
              transcript: eventData.text,
              session_id: this.sessionId
            });
            console.log('📤 Sent transcribed speech to agent system:', eventData.text);
          }
          break;

        case 'contentEnd':
          console.log('🔇 Nova Sonic content end');
          this.events.emit('audio_end');
          break;

        case 'error':
          console.error('❌ Nova Sonic error:', eventData);
          this.events.emit('error', eventData);
          break;

        case 'usageEvent':
          console.log('📊 Nova Sonic usage event:', eventData);
          // Usage events provide token counts and are informational
          break;

        default:
          console.log('📨 Unknown Nova Sonic event type:', eventType);
      }
    } else {
      console.log('📨 Unexpected event structure:', event);
    }
  }

  // Start audio capture from microphone using Web Audio API for raw PCM
  private async startAudioCapture(): Promise<void> {
    try {
      console.log('🎙️ Requesting microphone access for Nova Sonic...');
      
      // Get user media with Nova Sonic PCM requirements
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000, // Nova Sonic input requirement
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        }
      });

      console.log('✅ Microphone access granted for Nova Sonic');

      // Create AudioContext for raw PCM processing
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(this.audioStream);
      
      // Create ScriptProcessor for raw audio data
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (event) => {
        if (!this.isConnected) return;
        
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0); // Float32Array
        
        // Convert Float32 to Int16 (16-bit PCM)
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          // Clamp to [-1, 1] and convert to 16-bit integer
          const sample = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        }
        
        // Send PCM data to Nova Sonic
        this.sendPCMAudioToNovaSonic(pcmData);
      };

      // Connect audio pipeline
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      // Send audio content start event
      await this.sendAudioContentStart();
      
      console.log('🎤 PCM audio capture started for Nova Sonic streaming');

    } catch (error) {
      console.error('❌ Failed to start audio capture:', error);
      throw new Error(`Audio capture failed: ${error.message}`);
    }
  }

  // Send audio content start event with proper Nova Sonic configuration
  private async sendAudioContentStart(): Promise<void> {
    if (!this.isAudioStarted) {
      // Generate unique content name for this audio stream
      this.audioContentName = `audio-content-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      const contentStartEvent = {
        event: {
          contentStart: {
            promptName: this.promptName,
            contentName: this.audioContentName,
            type: 'AUDIO',
            role: 'USER',
            interactive: true,
            audioInputConfiguration: {
              mediaType: 'audio/lpcm',
              sampleRateHertz: 16000,  // Input is 16kHz
              sampleSizeBits: 16,
              channelCount: 1,
              audioType: 'SPEECH',
              encoding: 'base64'
            }
          }
        }
      };

      this.enqueueEvent(contentStartEvent);
      this.isAudioStarted = true;
      console.log('🎵 Sent audio content start event to Nova Sonic');
    }
  }

  // Send PCM audio data to Nova Sonic via established bidirectional stream
  private sendPCMAudioToNovaSonic(pcmData: Int16Array): void {
    try {
      if (!this.isConnected || !this.isAudioStarted) {
        console.log(`🔇 Skipping audio send - connected: ${this.isConnected}, audioStarted: ${this.isAudioStarted}`);
        return;
      }

      // Convert Int16Array to base64
      const base64Audio = this.pcmToBase64(pcmData);
      
      // Create audio input event for Nova Sonic with proper structure
      const audioEvent = {
        event: {
          audioInput: {
            promptName: this.promptName,
            contentName: this.audioContentName,
            content: base64Audio
          }
        }
      };

      // Send audio event through the established bidirectional stream
      this.enqueueEvent(audioEvent);
      
      console.log(`🎵 Sent PCM audio chunk to Nova Sonic: ${pcmData.length * 2} bytes`);
      
    } catch (error) {
      console.error('❌ Failed to send PCM audio to Nova Sonic:', error);
      this.events.emit('error', error);
    }
  }

  // Convert Int16Array PCM data to base64
  private pcmToBase64(pcmData: Int16Array): string {
    const bytes = new Uint8Array(pcmData.buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Stop audio capture and cleanup resources
  private stopAudioCapture(): void {
    // Send content end event if audio was started
    if (this.isAudioStarted) {
      const contentEndEvent = {
        event: {
          contentEnd: {
            promptName: this.promptName,
            contentName: this.audioContentName
          }
        }
      };
      this.enqueueEvent(contentEndEvent);
      this.isAudioStarted = false;
      console.log('🔇 Sent audio content end event');
    }

    // Stop Web Audio API components
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop MediaRecorder (legacy cleanup)
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    // Stop audio stream
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
      console.log('🔇 Audio stream and Web Audio API released');
    }
  }

  // Close bidirectional stream
  private async closeBidirectionalStream(): Promise<void> {
    try {
      // In the simplified approach, we just need to clean up references
      // The AWS SDK will handle stream cleanup automatically
      if (this.sessionGenerator) {
        // The generator will be garbage collected
        this.sessionGenerator = null;
      }
        
      this.bidirectionalStream = null;
      console.log('🔇 Nova Sonic bidirectional stream closed');
      
    } catch (error) {
      console.error('❌ Error closing bidirectional stream:', error);
    }
  }

  // Play audio response from Nova Sonic
  async playAudioResponse(audioBuffer: ArrayBuffer, audioElement?: HTMLAudioElement): Promise<void> {
    try {
      // Convert ArrayBuffer to Blob
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Use provided audio element or create temporary one
      const audio = audioElement || new Audio();
      audio.src = audioUrl;
      
      // Play the audio
      await audio.play();
      console.log('🔊 Playing Nova Sonic response');

      // Cleanup URL object when done
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('❌ Failed to play audio response:', error);
      this.events.emit('error', error);
    }
  }
}

// Factory function for creating Nova Sonic client
export function createNovaSonicClient(config?: Partial<NovaSonicConfig>): NovaSonicClient {
  const clientConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    // Override with environment variables if available
    region: process.env.AWS_BEDROCK_REGION || config?.region || DEFAULT_CONFIG.region,
    modelId: process.env.NOVA_SONIC_MODEL_ID || config?.modelId || DEFAULT_CONFIG.modelId,
    voiceId: process.env.NOVA_SONIC_VOICE_ID || config?.voiceId || DEFAULT_CONFIG.voiceId,
    sampleRate: process.env.NOVA_SONIC_SAMPLE_RATE 
      ? parseInt(process.env.NOVA_SONIC_SAMPLE_RATE) 
      : config?.sampleRate || DEFAULT_CONFIG.sampleRate,
    sessionTimeout: process.env.NOVA_SONIC_SESSION_TIMEOUT 
      ? parseInt(process.env.NOVA_SONIC_SESSION_TIMEOUT) 
      : config?.sessionTimeout || DEFAULT_CONFIG.sessionTimeout,
    maxTokens: process.env.AWS_BEDROCK_MAX_TOKENS 
      ? parseInt(process.env.AWS_BEDROCK_MAX_TOKENS) 
      : config?.maxTokens || DEFAULT_CONFIG.maxTokens,
    temperature: process.env.AWS_BEDROCK_TEMPERATURE 
      ? parseFloat(process.env.AWS_BEDROCK_TEMPERATURE) 
      : config?.temperature || DEFAULT_CONFIG.temperature,
    topP: process.env.AWS_BEDROCK_TOP_P 
      ? parseFloat(process.env.AWS_BEDROCK_TOP_P) 
      : config?.topP || DEFAULT_CONFIG.topP,
  };

  return new NovaSonicClient(clientConfig);
}