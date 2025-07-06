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
}

// Default configuration
const DEFAULT_CONFIG: Partial<NovaSonicConfig> = {
  region: 'us-west-2',
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
  private currentStream: any = null;
  private sessionId: string | null = null;

  constructor(config: Partial<NovaSonicConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config } as NovaSonicConfig;
    
    // Use browser-accessible environment variables
    const region = process.env.NEXT_PUBLIC_AWS_REGION || this.config.region;
    
    this.client = new BedrockRuntimeClient({
      region: region,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
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

  // Connect to Nova Sonic
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('🔊 Nova Sonic already connected');
      return;
    }

    try {
      console.log('🔊 Connecting to Nova Sonic...');
      this.events.emit('connection_change', 'connecting');

      // Generate session ID
      this.sessionId = `nova-sonic-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      // Create bidirectional stream
      const command = new InvokeModelWithBidirectionalStreamCommand({
        modelId: this.config.modelId,
        body: JSON.stringify({
          voice_id: this.config.voiceId,
          audio_format: 'pcm',
          sample_rate: this.config.sampleRate,
          session_id: this.sessionId,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          top_p: this.config.topP,
        }),
      });

      this.currentStream = await this.client.send(command);
      
      // Set up stream event handlers
      this.setupStreamHandlers();
      
      this.isConnected = true;
      this.events.emit('connection_change', 'connected');
      this.events.emit('session_start');
      
      console.log('✅ Nova Sonic connected successfully');
      
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
      
      if (this.currentStream) {
        // Close the stream
        await this.currentStream.return?.();
        this.currentStream = null;
      }
      
      this.isConnected = false;
      this.sessionId = null;
      
      this.events.emit('session_end');
      this.events.emit('connection_change', 'disconnected');
      
      console.log('✅ Nova Sonic disconnected successfully');
      
    } catch (error) {
      console.error('❌ Nova Sonic disconnection error:', error);
      this.events.emit('error', error);
    }
  }

  // Send audio chunk to Nova Sonic
  async sendAudioChunk(audioData: ArrayBuffer): Promise<void> {
    if (!this.isConnected || !this.currentStream) {
      console.warn('⚠️ Cannot send audio: not connected');
      return;
    }

    try {
      // Convert ArrayBuffer to base64 for Nova Sonic
      const base64Audio = this.arrayBufferToBase64(audioData);
      
      const audioMessage = {
        type: 'audio_chunk',
        audio_data: base64Audio,
        session_id: this.sessionId,
      };

      await this.currentStream.input.write(JSON.stringify(audioMessage));
      
    } catch (error) {
      console.error('❌ Failed to send audio chunk:', error);
      this.events.emit('error', error);
    }
  }

  // Send text message to Nova Sonic
  async sendTextMessage(text: string): Promise<void> {
    if (!this.isConnected || !this.currentStream) {
      console.warn('⚠️ Cannot send text: not connected');
      return;
    }

    try {
      const textMessage = {
        type: 'text_message',
        text: text,
        session_id: this.sessionId,
      };

      await this.currentStream.input.write(JSON.stringify(textMessage));
      
    } catch (error) {
      console.error('❌ Failed to send text message:', error);
      this.events.emit('error', error);
    }
  }

  // Set up stream event handlers
  private setupStreamHandlers() {
    if (!this.currentStream) return;

    // Handle incoming stream data
    this.currentStream.output.on('data', (chunk: any) => {
      try {
        const data = JSON.parse(chunk.toString());
        this.handleStreamMessage(data);
      } catch (error) {
        console.error('❌ Failed to parse stream message:', error);
        this.events.emit('error', error);
      }
    });

    // Handle stream errors
    this.currentStream.output.on('error', (error: any) => {
      console.error('❌ Stream error:', error);
      this.events.emit('error', error);
      this.events.emit('connection_change', 'disconnected');
    });

    // Handle stream end
    this.currentStream.output.on('end', () => {
      console.log('🔊 Stream ended');
      this.isConnected = false;
      this.events.emit('connection_change', 'disconnected');
    });
  }

  // Handle incoming stream messages
  private handleStreamMessage(data: any) {
    // Emit raw message for event handling
    this.events.emit('message', data);

    // Handle specific message types
    switch (data.type) {
      case 'audio_chunk':
        if (data.audio_data) {
          const audioBuffer = this.base64ToArrayBuffer(data.audio_data);
          this.events.emit('audio_received', audioBuffer);
        }
        break;

      case 'text_response':
        this.events.emit('message', {
          type: 'response.text.delta',
          delta: data.text,
          item_id: data.session_id,
        });
        break;

      case 'audio_start':
        this.events.emit('audio_start');
        break;

      case 'audio_end':
        this.events.emit('audio_end');
        break;

      case 'session_updated':
        this.events.emit('message', {
          type: 'session.updated',
          session: data.session,
        });
        break;

      case 'error':
        console.error('❌ Nova Sonic error:', data.error);
        this.events.emit('error', data.error);
        break;

      default:
        console.log('🔊 Unknown message type:', data.type);
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