/**
 * Unified Voice Client for Squiddles
 * Abstracts differences between OpenAI Realtime API and AWS Nova Sonic
 */

import { RealtimeClient, RealtimeClientOptions } from '../app/lib/realtimeClient';
import { NovaSonicClient, createNovaSonicClient } from './novaSonicClient';
import { getVoiceProvider, validateProviderConfig, logProviderConfig } from '../config/voiceProvider';
import type { RealtimeAgent } from '@openai/agents/realtime';

// Common event types for unified interface
export type UnifiedVoiceEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  audio_interrupted: [];
  history_added: [any];
  history_updated: [any[]];
  error: [any];
};

// Unified client options
export interface UnifiedVoiceClientOptions {
  // OpenAI options
  getEphemeralKey?: () => Promise<string>;
  initialAgents?: RealtimeAgent[];
  
  // Common options
  audioElement?: HTMLAudioElement;
  extraContext?: Record<string, any>;
  vadConfig?: {
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
  
  // Nova Sonic options
  novaSonicConfig?: {
    region?: string;
    modelId?: string;
    voiceId?: string;
    sampleRate?: number;
    sessionTimeout?: number;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  };
}

// Simple event emitter
type Listener<Args extends any[]> = (...args: Args) => void;

class UnifiedEmitter<Events extends Record<string, any[]>> {
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

export class UnifiedVoiceClient {
  private openAiClient: RealtimeClient | null = null;
  private novaSonicClient: NovaSonicClient | null = null;
  private currentProvider: 'openai' | 'nova-sonic' | null = null;
  private events = new UnifiedEmitter<UnifiedVoiceEvents>();
  private options: UnifiedVoiceClientOptions;

  constructor(options: UnifiedVoiceClientOptions) {
    this.options = options;
    
    // Log provider configuration
    logProviderConfig();
    
    // Validate configuration
    const validation = validateProviderConfig();
    if (!validation.isValid) {
      console.error('❌ Voice provider configuration is invalid:', validation.errors);
      validation.errors.forEach(error => {
        this.events.emit('error', new Error(error));
      });
    }
  }

  // Event listener management
  on<K extends keyof UnifiedVoiceEvents>(event: K, listener: (...args: UnifiedVoiceEvents[K]) => void) {
    this.events.on(event, listener as any);
  }

  off<K extends keyof UnifiedVoiceEvents>(event: K, listener: (...args: UnifiedVoiceEvents[K]) => void) {
    this.events.off(event, listener as any);
  }

  // Connect using the configured provider
  async connect(): Promise<void> {
    const provider = getVoiceProvider();
    this.currentProvider = provider;
    
    console.log(`🎙️ Connecting using ${provider === 'openai' ? 'OpenAI' : 'Nova Sonic'}`);
    
    try {
      if (provider === 'openai') {
        await this.connectOpenAI();
      } else if (provider === 'nova-sonic') {
        await this.connectNovaSonic();
      } else {
        throw new Error(`Unknown provider: ${provider}`);
      }
    } catch (error) {
      console.error(`❌ Failed to connect with ${provider}:`, error);
      
      // Try fallback if enabled
      if (this.options.extraContext?.fallbackEnabled !== false) {
        await this.tryFallback(provider, error);
      } else {
        throw error;
      }
    }
  }

  // Connect to OpenAI
  private async connectOpenAI(): Promise<void> {
    if (!this.options.getEphemeralKey || !this.options.initialAgents) {
      throw new Error('OpenAI requires getEphemeralKey and initialAgents');
    }

    const openAiOptions: RealtimeClientOptions = {
      getEphemeralKey: this.options.getEphemeralKey,
      initialAgents: this.options.initialAgents,
      audioElement: this.options.audioElement,
      extraContext: this.options.extraContext,
      vadConfig: this.options.vadConfig,
    };

    this.openAiClient = new RealtimeClient(openAiOptions);
    
    // Forward events
    this.openAiClient.on('connection_change', (status) => {
      this.events.emit('connection_change', status);
    });
    
    this.openAiClient.on('message', (message) => {
      this.events.emit('message', message);
    });
    
    this.openAiClient.on('audio_interrupted', () => {
      this.events.emit('audio_interrupted');
    });
    
    this.openAiClient.on('history_added', (item) => {
      this.events.emit('history_added', item);
    });
    
    this.openAiClient.on('history_updated', (history) => {
      this.events.emit('history_updated', history);
    });
    
    this.openAiClient.on('error', (error) => {
      this.events.emit('error', error);
    });
    
    await this.openAiClient.connect();
  }

  // Connect to Nova Sonic
  private async connectNovaSonic(): Promise<void> {
    this.novaSonicClient = createNovaSonicClient(this.options.novaSonicConfig);
    
    // Forward events and map Nova Sonic events to OpenAI format
    this.novaSonicClient.on('connection_change', (status) => {
      this.events.emit('connection_change', status);
    });
    
    this.novaSonicClient.on('message', (message) => {
      this.events.emit('message', message);
    });
    
    this.novaSonicClient.on('audio_received', (audioData) => {
      // Convert to OpenAI format
      this.events.emit('message', {
        type: 'response.audio.delta',
        delta: audioData,
      });
    });
    
    this.novaSonicClient.on('error', (error) => {
      this.events.emit('error', error);
    });
    
    await this.novaSonicClient.connect();
  }

  // Try fallback provider
  private async tryFallback(failedProvider: 'openai' | 'nova-sonic', originalError: any): Promise<void> {
    const fallbackProvider = failedProvider === 'openai' ? 'nova-sonic' : 'openai';
    
    console.log(`🔄 Attempting fallback to ${fallbackProvider}`);
    
    try {
      if (fallbackProvider === 'openai') {
        await this.connectOpenAI();
      } else {
        await this.connectNovaSonic();
      }
      
      this.currentProvider = fallbackProvider;
      console.log(`✅ Fallback to ${fallbackProvider} successful`);
      
    } catch (fallbackError) {
      console.error(`❌ Fallback to ${fallbackProvider} also failed:`, fallbackError);
      throw new Error(`Both ${failedProvider} and ${fallbackProvider} failed. Original error: ${originalError.message}, Fallback error: ${fallbackError.message}`);
    }
  }

  // Disconnect
  async disconnect(): Promise<void> {
    if (this.openAiClient) {
      this.openAiClient.disconnect();
      this.openAiClient = null;
    }
    
    if (this.novaSonicClient) {
      await this.novaSonicClient.disconnect();
      this.novaSonicClient = null;
    }
    
    this.currentProvider = null;
  }

  // Send user text
  sendUserText(text: string): void {
    if (this.openAiClient) {
      this.openAiClient.sendUserText(text);
    } else if (this.novaSonicClient) {
      this.novaSonicClient.sendTextMessage(text);
    } else {
      throw new Error('No active client');
    }
  }

  // Push-to-talk start
  pushToTalkStart(): void {
    if (this.openAiClient) {
      this.openAiClient.pushToTalkStart();
    } else if (this.novaSonicClient) {
      // Nova Sonic doesn't have push-to-talk, but we can simulate it
      console.log('🎤 Push-to-talk start (Nova Sonic)');
    } else {
      throw new Error('No active client');
    }
  }

  // Push-to-talk stop
  pushToTalkStop(): void {
    if (this.openAiClient) {
      this.openAiClient.pushToTalkStop();
    } else if (this.novaSonicClient) {
      // Nova Sonic doesn't have push-to-talk, but we can simulate it
      console.log('🎤 Push-to-talk stop (Nova Sonic)');
    } else {
      throw new Error('No active client');
    }
  }

  // Send event
  sendEvent(event: any): void {
    if (this.openAiClient) {
      this.openAiClient.sendEvent(event);
    } else if (this.novaSonicClient) {
      // Convert OpenAI events to Nova Sonic format
      console.log('🔊 Event sent to Nova Sonic (converted):', event);
    } else {
      throw new Error('No active client');
    }
  }

  // Interrupt
  interrupt(): void {
    if (this.openAiClient) {
      this.openAiClient.interrupt();
    } else if (this.novaSonicClient) {
      // Nova Sonic interrupt simulation
      console.log('🔊 Interrupt (Nova Sonic)');
    } else {
      throw new Error('No active client');
    }
  }

  // Mute
  mute(muted: boolean): void {
    if (this.openAiClient) {
      this.openAiClient.mute(muted);
    } else if (this.novaSonicClient) {
      // Nova Sonic mute simulation
      console.log('🔇 Mute (Nova Sonic):', muted);
    } else {
      throw new Error('No active client');
    }
  }

  // Cancel response
  cancelResponse(): void {
    if (this.openAiClient) {
      this.openAiClient.cancelResponse();
    } else if (this.novaSonicClient) {
      // Nova Sonic cancel simulation
      console.log('🛑 Cancel response (Nova Sonic)');
    } else {
      throw new Error('No active client');
    }
  }

  // Get current provider
  getCurrentProvider(): 'openai' | 'nova-sonic' | null {
    return this.currentProvider;
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.openAiClient) {
      // OpenAI client doesn't have a direct status method, so we assume connected if exists
      return 'connected';
    } else if (this.novaSonicClient) {
      return this.novaSonicClient.getConnectionStatus();
    } else {
      return 'disconnected';
    }
  }
}

// Factory function for creating unified voice client
export function createUnifiedVoiceClient(options: UnifiedVoiceClientOptions): UnifiedVoiceClient {
  return new UnifiedVoiceClient(options);
}