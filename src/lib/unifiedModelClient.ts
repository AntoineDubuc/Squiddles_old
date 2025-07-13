/**
 * Unified Model Client for Squiddles
 * Handles both voice and text interactions with appropriate models
 * - Voice: Nova Sonic or OpenAI Realtime API
 * - Text: Nova Pro or OpenAI GPT
 */

import { RealtimeClient, RealtimeClientOptions } from '../app/lib/realtimeClient';
import { NovaSonicClient, createNovaSonicClient } from './novaSonicClient';
import { NovaProClient, createNovaProClient } from './novaProClient';
import { 
  getModelProviderConfig, 
  detectInputType, 
  getRecommendedModel,
  logModelConfig,
  validateModelConfig,
  type VoiceModel,
  type TextModel 
} from '../config/modelProvider';
import type { RealtimeAgent } from '@openai/agents/realtime';

// Input types for the unified client
export type InputType = 'voice' | 'text';
export type InputContext = {
  isVoiceInput?: boolean;
  isTextInput?: boolean;
  source?: 'microphone' | 'keyboard' | 'api';
  timestamp?: number;
};

// Unified events that work for both voice and text
export type UnifiedModelEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  text_received: [string];
  audio_received: [ArrayBuffer];
  audio_interrupted: [];
  history_added: [any];
  history_updated: [any[]];
  error: [any];
  input_type_detected: [InputType];
  model_switched: [{ from: string; to: string; inputType: InputType }];
};

// Unified client options
export interface UnifiedModelClientOptions {
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
  
  // Nova Sonic options (voice)
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
  
  // Nova Pro options (text)
  novaProConfig?: {
    region?: string;
    modelId?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    systemPrompt?: string;
  };
  
  // Model selection
  forceVoiceModel?: VoiceModel;
  forceTextModel?: TextModel;
  enableAutoDetection?: boolean;
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

export class UnifiedModelClient {
  // Voice clients
  private openAiClient: RealtimeClient | null = null;
  private novaSonicClient: NovaSonicClient | null = null;
  
  // Text clients
  private novaProClient: NovaProClient | null = null;
  
  // Current state
  private currentVoiceProvider: VoiceModel | null = null;
  private currentTextProvider: TextModel | null = null;
  private lastInputType: InputType | null = null;
  
  private events = new UnifiedEmitter<UnifiedModelEvents>();
  private options: UnifiedModelClientOptions;
  private config = getModelProviderConfig();

  constructor(options: UnifiedModelClientOptions) {
    this.options = options;
    
    // Log configuration
    logModelConfig();
    
    // Validate configuration
    const validation = validateModelConfig();
    if (!validation.isValid) {
      console.error('❌ Model configuration is invalid:', validation.errors);
      validation.errors.forEach(error => {
        this.events.emit('error', new Error(error));
      });
    }
  }

  // Event listener management
  on<K extends keyof UnifiedModelEvents>(event: K, listener: (...args: UnifiedModelEvents[K]) => void) {
    this.events.on(event, listener as any);
  }

  off<K extends keyof UnifiedModelEvents>(event: K, listener: (...args: UnifiedModelEvents[K]) => void) {
    this.events.off(event, listener as any);
  }

  // Initialize clients (lazy loading)
  async connect(): Promise<void> {
    console.log('🔗 Initializing Unified Model Client...');
    
    try {
      // Initialize voice client
      await this.initializeVoiceClient();
      
      // Initialize text client  
      await this.initializeTextClient();
      
      console.log('✅ Unified Model Client initialized successfully');
      this.events.emit('connection_change', 'connected');
      
    } catch (error) {
      console.error('❌ Failed to initialize Unified Model Client:', error);
      this.events.emit('connection_change', 'disconnected');
      this.events.emit('error', error);
      throw error;
    }
  }

  // Initialize voice client based on configuration
  private async initializeVoiceClient(): Promise<void> {
    const voiceModel = this.options.forceVoiceModel || this.config.voiceModel;
    
    console.log(`🎙️ Initializing voice client: ${voiceModel}`);
    
    try {
      if (voiceModel === 'openai') {
        await this.connectOpenAIVoice();
      } else if (voiceModel === 'nova-sonic') {
        await this.connectNovaSonicVoice();
      }
      
      this.currentVoiceProvider = voiceModel;
      
    } catch (error) {
      console.error(`❌ Failed to initialize voice client (${voiceModel}):`, error);
      
      // Try fallback if enabled
      if (this.config.voiceFallbackEnabled && !this.options.forceVoiceModel) {
        await this.tryVoiceFallback(voiceModel, error);
      } else {
        throw error;
      }
    }
  }

  // Initialize text client based on configuration
  private async initializeTextClient(): Promise<void> {
    const textModel = this.options.forceTextModel || this.config.textModel;
    
    console.log(`📝 Initializing text client: ${textModel}`);
    
    try {
      if (textModel === 'nova-pro') {
        await this.connectNovaProText();
      } else if (textModel === 'openai') {
        // For text, we'll use a simple API call rather than realtime
        console.log('📝 OpenAI text client ready (API-based)');
      }
      
      this.currentTextProvider = textModel;
      
    } catch (error) {
      console.error(`❌ Failed to initialize text client (${textModel}):`, error);
      
      // Try fallback if enabled
      if (this.config.textFallbackEnabled && !this.options.forceTextModel) {
        await this.tryTextFallback(textModel, error);
      } else {
        throw error;
      }
    }
  }

  // Connect OpenAI voice client
  private async connectOpenAIVoice(): Promise<void> {
    if (!this.options.getEphemeralKey || !this.options.initialAgents) {
      throw new Error('OpenAI voice requires getEphemeralKey and initialAgents');
    }

    const openAiOptions: RealtimeClientOptions = {
      getEphemeralKey: this.options.getEphemeralKey,
      initialAgents: this.options.initialAgents,
      audioElement: this.options.audioElement,
      extraContext: this.options.extraContext,
      vadConfig: this.options.vadConfig,
    };

    this.openAiClient = new RealtimeClient(openAiOptions);
    this.setupOpenAIEventForwarding();
    await this.openAiClient.connect();
  }

  // Connect Nova Sonic voice client
  private async connectNovaSonicVoice(): Promise<void> {
    this.novaSonicClient = createNovaSonicClient(this.options.novaSonicConfig);
    this.setupNovaSonicEventForwarding();
    await this.novaSonicClient.connect();
  }

  // Connect Nova Pro text client
  private async connectNovaProText(): Promise<void> {
    this.novaProClient = createNovaProClient(this.options.novaProConfig);
    this.setupNovaProEventForwarding();
    await this.novaProClient.connect();
  }

  // Setup event forwarding for OpenAI
  private setupOpenAIEventForwarding(): void {
    if (!this.openAiClient) return;
    
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
  }

  // Setup event forwarding for Nova Sonic
  private setupNovaSonicEventForwarding(): void {
    if (!this.novaSonicClient) return;
    
    this.novaSonicClient.on('connection_change', (status) => {
      this.events.emit('connection_change', status);
    });
    
    this.novaSonicClient.on('message', (message) => {
      this.events.emit('message', message);
    });
    
    this.novaSonicClient.on('audio_received', (audioData) => {
      this.events.emit('audio_received', audioData);
      this.events.emit('message', {
        type: 'response.audio.delta',
        delta: audioData,
      });
    });
    
    this.novaSonicClient.on('error', (error) => {
      this.events.emit('error', error);
    });
  }

  // Setup event forwarding for Nova Pro
  private setupNovaProEventForwarding(): void {
    if (!this.novaProClient) return;
    
    this.novaProClient.on('connection_change', (status) => {
      this.events.emit('connection_change', status);
    });
    
    this.novaProClient.on('text_received', (text) => {
      this.events.emit('text_received', text);
      this.events.emit('message', {
        type: 'response.text',
        text: text,
        timestamp: new Date().toISOString(),
      });
    });
    
    this.novaProClient.on('error', (error) => {
      this.events.emit('error', error);
    });
  }

  // Try voice fallback
  private async tryVoiceFallback(failedModel: VoiceModel, originalError: any): Promise<void> {
    const fallbackModel = this.config.voiceFallbackModel;
    
    console.log(`🔄 Attempting voice fallback to ${fallbackModel}`);
    
    try {
      if (fallbackModel === 'openai') {
        await this.connectOpenAIVoice();
      } else {
        await this.connectNovaSonicVoice();
      }
      
      this.currentVoiceProvider = fallbackModel;
      console.log(`✅ Voice fallback to ${fallbackModel} successful`);
      
      this.events.emit('model_switched', {
        from: failedModel,
        to: fallbackModel,
        inputType: 'voice'
      });
      
    } catch (fallbackError) {
      console.error(`❌ Voice fallback to ${fallbackModel} also failed:`, fallbackError);
      throw new Error(`Both ${failedModel} and ${fallbackModel} failed for voice. Original: ${originalError.message}, Fallback: ${fallbackError.message}`);
    }
  }

  // Try text fallback
  private async tryTextFallback(failedModel: TextModel, originalError: any): Promise<void> {
    const fallbackModel = this.config.textFallbackModel;
    
    console.log(`🔄 Attempting text fallback to ${fallbackModel}`);
    
    try {
      if (fallbackModel === 'nova-pro') {
        await this.connectNovaProText();
      } else {
        console.log('📝 OpenAI text fallback ready (API-based)');
      }
      
      this.currentTextProvider = fallbackModel;
      console.log(`✅ Text fallback to ${fallbackModel} successful`);
      
      this.events.emit('model_switched', {
        from: failedModel,
        to: fallbackModel,
        inputType: 'text'
      });
      
    } catch (fallbackError) {
      console.error(`❌ Text fallback to ${fallbackModel} also failed:`, fallbackError);
      throw new Error(`Both ${failedModel} and ${fallbackModel} failed for text. Original: ${originalError.message}, Fallback: ${fallbackError.message}`);
    }
  }

  // Smart message sending with input type detection
  async sendMessage(content: string, context?: InputContext): Promise<void> {
    // Detect input type
    const inputType = this.detectInputType(content, context);
    this.lastInputType = inputType;
    this.events.emit('input_type_detected', inputType);
    
    console.log(`📤 Sending ${inputType} message:`, content.substring(0, 100) + '...');
    
    if (inputType === 'voice') {
      await this.sendVoiceMessage(content);
    } else {
      await this.sendTextMessage(content);
    }
  }

  // Send voice message
  private async sendVoiceMessage(content: string): Promise<void> {
    if (this.currentVoiceProvider === 'openai' && this.openAiClient) {
      this.openAiClient.sendUserText(content);
    } else if (this.currentVoiceProvider === 'nova-sonic' && this.novaSonicClient) {
      await this.novaSonicClient.sendTextMessage(content);
    } else {
      throw new Error('No voice client available');
    }
  }

  // Send text message
  private async sendTextMessage(content: string): Promise<void> {
    if (this.currentTextProvider === 'nova-pro' && this.novaProClient) {
      await this.novaProClient.sendTextMessage(content);
    } else if (this.currentTextProvider === 'openai') {
      // For OpenAI text, we could use the regular API or fallback to realtime
      if (this.openAiClient) {
        this.openAiClient.sendUserText(content);
      } else {
        throw new Error('OpenAI text client not available');
      }
    } else {
      throw new Error('No text client available');
    }
  }

  // Input type detection with context
  private detectInputType(content: string, context?: InputContext): InputType {
    // Check explicit context
    if (context?.isVoiceInput) return 'voice';
    if (context?.isTextInput) return 'text';
    
    // Check source hints
    if (context?.source === 'microphone') return 'voice';
    if (context?.source === 'keyboard') return 'text';
    
    // Use auto-detection if enabled
    if (this.options.enableAutoDetection !== false && this.config.autoDetectInputType) {
      return detectInputType(content, context);
    }
    
    // Default to text for safety
    return 'text';
  }

  // Disconnect all clients
  async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting Unified Model Client...');
    
    if (this.openAiClient) {
      this.openAiClient.disconnect();
      this.openAiClient = null;
    }
    
    if (this.novaSonicClient) {
      await this.novaSonicClient.disconnect();
      this.novaSonicClient = null;
    }
    
    if (this.novaProClient) {
      await this.novaProClient.disconnect();
      this.novaProClient = null;
    }
    
    this.currentVoiceProvider = null;
    this.currentTextProvider = null;
    this.lastInputType = null;
    
    this.events.emit('connection_change', 'disconnected');
    console.log('✅ Unified Model Client disconnected');
  }

  // Voice-specific methods
  pushToTalkStart(): void {
    if (this.openAiClient) {
      this.openAiClient.pushToTalkStart();
    } else {
      console.log('🎤 Push-to-talk start (non-OpenAI)');
    }
  }

  pushToTalkStop(): void {
    if (this.openAiClient) {
      this.openAiClient.pushToTalkStop();
    } else {
      console.log('🎤 Push-to-talk stop (non-OpenAI)');
    }
  }

  interrupt(): void {
    if (this.currentVoiceProvider === 'openai' && this.openAiClient) {
      this.openAiClient.interrupt();
    } else {
      console.log('🔊 Interrupt (non-OpenAI)');
    }
  }

  // Status methods
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    const hasVoiceClient = !!(this.openAiClient || this.novaSonicClient);
    const hasTextClient = !!(this.novaProClient || this.currentTextProvider === 'openai');
    
    if (hasVoiceClient || hasTextClient) {
      return 'connected';
    }
    
    return 'disconnected';
  }

  getCurrentProviders(): { voice: VoiceModel | null; text: TextModel | null } {
    return {
      voice: this.currentVoiceProvider,
      text: this.currentTextProvider,
    };
  }

  getLastInputType(): InputType | null {
    return this.lastInputType;
  }
}

// Factory function for creating unified model client
export function createUnifiedModelClient(options: UnifiedModelClientOptions): UnifiedModelClient {
  return new UnifiedModelClient(options);
}