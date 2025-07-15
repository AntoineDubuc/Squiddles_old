/**
 * Unified Voice Client for Squiddles
 * Abstracts differences between OpenAI Realtime API and AWS Nova Sonic
 */

import { RealtimeClient, RealtimeClientOptions } from '../app/lib/realtimeClient';
import { NovaSonicClient, createNovaSonicClient } from './novaSonicClient';
// import { NovaProClient, createNovaProClient } from './novaProClient';
import { getVoiceProvider, validateProviderConfig, logProviderConfig } from '../config/voiceProvider';
import { 
  getModelProviderConfig, 
  detectInputType, 
  logModelConfig,
  type TextModel 
} from '../config/modelProvider';
import type { RealtimeAgent } from '@openai/agents/realtime';

// Common event types for unified interface
export type UnifiedVoiceEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  text_received: [string];
  audio_interrupted: [];
  history_added: [any];
  history_updated: [any[]];
  error: [any];
  input_type_detected: ['voice' | 'text'];
  model_switched: [{ from: string; to: string; inputType: 'voice' | 'text' }];
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
  
  // Model selection overrides
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

export class UnifiedVoiceClient {
  private openAiClient: RealtimeClient | null = null;
  private novaSonicClient: NovaSonicClient | null = null;
  // private novaProClient: NovaProClient | null = null;
  private currentProvider: 'openai' | 'nova-sonic' | null = null;
  private currentTextProvider: TextModel | null = null;
  private events = new UnifiedEmitter<UnifiedVoiceEvents>();
  private options: UnifiedVoiceClientOptions;
  private modelConfig = getModelProviderConfig();

  constructor(options: UnifiedVoiceClientOptions) {
    this.options = options;
    
    // Log provider configuration for debugging
    console.log('🔧 UnifiedVoiceClient Configuration:');
    console.log(`  Provider: ${getVoiceProvider()}`);
    console.log(`  Fallback: Disabled (configured through Settings only)`);
    
    // Validate configuration
    const validation = validateProviderConfig();
    if (!validation.isValid) {
      console.error('❌ Voice provider configuration is invalid:', validation.errors);
      validation.errors.forEach(error => {
        this.events.emit('error', new Error(error));
      });
    }
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ Voice provider configuration warnings:', validation.warnings);
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
    // Validate configuration before attempting connection
    const validation = validateProviderConfig();
    if (!validation.isValid) {
      console.error('❌ Voice provider configuration is invalid:', validation.errors);
      this.events.emit('connection_change', 'disconnected');
      this.events.emit('error', {
        type: 'configuration_invalid',
        message: `Voice provider configuration is invalid: ${validation.errors.join(', ')}`,
        errors: validation.errors,
        redirectToSettings: true
      });
      return;
    }

    const provider = getVoiceProvider();
    this.currentProvider = provider;
    
    console.log(`🎙️ Connecting using ${provider === 'openai' ? 'OpenAI' : 'Nova Sonic'} for voice`);
    this.events.emit('connection_change', 'connecting');
    
    try {
      // When using Nova Sonic, we need BOTH Nova Sonic for voice I/O AND OpenAI for agent processing
      if (provider === 'nova-sonic') {
        console.log('🔗 Nova Sonic mode: connecting both Nova Sonic (voice) and OpenAI (agents)');
        await this.connectNovaSonic();
        // Also connect OpenAI for agent processing
        if (this.options.getEphemeralKey && this.options.initialAgents) {
          await this.connectOpenAI();
          console.log('✅ Nova Sonic + OpenAI agent processing connected');
        } else {
          console.warn('⚠️ Nova Sonic connected but no OpenAI agent processing available');
        }
      } else if (provider === 'openai') {
        await this.connectOpenAI();
      } else {
        throw new Error(`Unknown provider: ${provider}`);
      }
      
      // Connect text client
      await this.connectTextClient();
      
      console.log(`✅ Successfully connected to ${provider}`);
      
    } catch (error) {
      console.error(`❌ Failed to connect with ${provider}:`, error);
      
      // Enhanced error details
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorDetails = {
        provider,
        message: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      // No automatic fallback - emit error and direct user to Settings
      console.warn(`⚠️ Voice provider ${provider} failed. Fallback disabled.`);
      
      this.events.emit('connection_change', 'disconnected');
      this.events.emit('error', {
        type: 'provider_failed',
        message: `${provider === 'nova-sonic' ? 'Nova Sonic' : 'OpenAI'} connection failed. Go to Settings to change voice provider.`,
        provider: provider,
        redirectToSettings: true,
        originalError: errorDetails,
        troubleshooting: this.getTroubleshootingInfo(provider, error)
      });
      
      return; // Allow app to continue without voice
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
      // When using Nova Sonic, don't give OpenAI the audio element (Nova Sonic handles audio)
      audioElement: this.currentProvider === 'nova-sonic' ? undefined : this.options.audioElement,
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
    
    // Set system prompt from initial agents if available
    if (this.options.initialAgents && this.options.initialAgents.length > 0) {
      const systemPrompt = this.options.initialAgents.map(agent => 
        `Agent: ${agent.name}\n${agent.instructions}`
      ).join('\n\n');
      
      this.novaSonicClient.setSystemPrompt(systemPrompt);
      console.log('📝 Set Nova Sonic system prompt from agents');
    }
    
    // Forward events and map Nova Sonic events to OpenAI format
    this.novaSonicClient.on('connection_change', (status) => {
      // Only forward Nova Sonic connection status if we don't have OpenAI for agents
      if (!this.openAiClient) {
        this.events.emit('connection_change', status);
      } else {
        console.log('🔊 Nova Sonic connection status:', status);
      }
    });
    
    this.novaSonicClient.on('message', (message) => {
      this.events.emit('message', message);
    });
    
    this.novaSonicClient.on('audio_received', (audioData) => {
      console.log('🔊 UnifiedVoiceClient received audio from Nova Sonic, size:', audioData.byteLength, 'bytes');
      
      // Convert to OpenAI format
      this.events.emit('message', {
        type: 'response.audio.delta',
        delta: audioData,
      });
      
      // Play the audio response if we have an audio element
      if (this.options.audioElement && this.novaSonicClient) {
        console.log('🔊 Playing Nova Sonic audio through audio element');
        this.novaSonicClient.playAudioResponse(audioData, this.options.audioElement);
      } else {
        console.warn('⚠️ No audio element available for Nova Sonic playback:', {
          hasAudioElement: !!this.options.audioElement,
          hasNovaSonicClient: !!this.novaSonicClient
        });
      }
    });

    this.novaSonicClient.on('audio_start', () => {
      console.log('🎤 Nova Sonic: Voice activity started');
      this.events.emit('audio_interrupted'); // Compatible with OpenAI events
    });

    this.novaSonicClient.on('audio_end', () => {
      console.log('🔇 Nova Sonic: Voice activity ended');
    });
    
    this.novaSonicClient.on('error', (error) => {
      this.events.emit('error', error);
    });
    
    await this.novaSonicClient.connect();
  }

  // Connect text client based on configuration
  private async connectTextClient(): Promise<void> {
    const textModel = this.options.forceTextModel || this.modelConfig.textModel;
    this.currentTextProvider = textModel;
    
    console.log(`📝 Connecting text client: ${textModel}`);
    
    try {
      if (textModel === 'nova-pro') {
        console.log('📝 Nova Pro text client temporarily disabled for debugging');
        // await this.connectNovaPro();
      } else if (textModel === 'openai') {
        console.log('📝 OpenAI text client ready (using realtime connection)');
      }
    } catch (error) {
      console.error(`❌ Failed to connect text client (${textModel}):`, error);
      
      // Try text fallback if enabled
      if (this.modelConfig.textFallbackEnabled && !this.options.forceTextModel) {
        await this.tryTextFallback(textModel, error);
      } else {
        console.warn(`⚠️ Text client failed, continuing with voice only`);
      }
    }
  }

  // Connect Nova Pro text client - TEMPORARILY DISABLED
  // private async connectNovaPro(): Promise<void> {
  //   this.novaProClient = createNovaProClient(this.options.novaProConfig);
  //   
  //   // Forward Nova Pro events
  //   this.novaProClient.on('connection_change', (status) => {
  //     this.events.emit('connection_change', status);
  //   });
  //   
  //   this.novaProClient.on('text_received', (text) => {
  //     this.events.emit('text_received', text);
  //     this.events.emit('message', {
  //       type: 'response.text',
  //       text: text,
  //       timestamp: new Date().toISOString(),
  //     });
  //   });
  //   
  //   this.novaProClient.on('error', (error) => {
  //     this.events.emit('error', error);
  //   });
  //   
  //   await this.novaProClient.connect();
  // }

  // Try text fallback
  private async tryTextFallback(failedModel: TextModel, originalError: any): Promise<void> {
    const fallbackModel = this.modelConfig.textFallbackModel;
    
    console.log(`🔄 Attempting text fallback to ${fallbackModel}`);
    
    try {
      if (fallbackModel === 'nova-pro') {
        console.log('📝 Nova Pro fallback temporarily disabled, using OpenAI');
        // await this.connectNovaPro();
      } else {
        console.log('📝 OpenAI text fallback ready (using realtime connection)');
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
      console.warn(`⚠️ No text client available, continuing with voice only`);
    }
  }

  // Fallback functionality disabled - provider selection only through Settings
  // private async tryFallback(failedProvider: 'openai' | 'nova-sonic', originalError: any): Promise<void> {
  //   // Fallback logic removed - user must change provider in Settings manually
  // }

  // Disconnect
  async disconnect(): Promise<void> {
    console.log('🔌 UnifiedVoiceClient disconnecting...');
    
    if (this.openAiClient) {
      console.log('🔌 Disconnecting OpenAI client');
      this.openAiClient.disconnect();
      this.openAiClient = null;
    }
    
    if (this.novaSonicClient) {
      console.log('🔌 Disconnecting Nova Sonic client');
      await this.novaSonicClient.disconnect();
      this.novaSonicClient = null;
    }
    
    // if (this.novaProClient) {
    //   await this.novaProClient.disconnect();
    //   this.novaProClient = null;
    // }
    
    this.currentProvider = null;
    this.currentTextProvider = null;
    
    console.log('✅ UnifiedVoiceClient disconnected');
  }

  // Send user text with smart routing
  sendUserText(text: string, context?: { isVoiceInput?: boolean; isTextInput?: boolean; source?: string }): void {
    // Special case: When using Nova Sonic, transcribed speech should go to OpenAI agents
    if (this.currentProvider === 'nova-sonic' && this.openAiClient) {
      console.log('🎤 Nova Sonic transcribed speech → OpenAI agents:', text.substring(0, 50) + '...');
      this.openAiClient.sendUserText(text);
      return;
    }
    
    // Normal routing for other cases
    const inputType = this.detectInputType(text, context);
    this.events.emit('input_type_detected', inputType);
    
    console.log(`📤 Routing ${inputType} message:`, text.substring(0, 50) + '...');
    
    if (inputType === 'voice') {
      this.sendVoiceMessage(text);
    } else {
      this.sendTextMessage(text);
    }
  }

  // Send voice message
  private sendVoiceMessage(text: string): void {
    if (this.openAiClient) {
      this.openAiClient.sendUserText(text);
    } else if (this.novaSonicClient) {
      this.novaSonicClient.sendTextMessage(text);
    } else {
      throw new Error('No voice client available');
    }
  }

  // Send text message
  private sendTextMessage(text: string): void {
    if (this.currentTextProvider === 'nova-pro') {
      console.log('📝 Nova Pro text sending temporarily disabled, using OpenAI fallback');
      if (this.openAiClient) {
        this.openAiClient.sendUserText(text);
      }
    } else if (this.currentTextProvider === 'openai' && this.openAiClient) {
      // Use OpenAI realtime for text as fallback
      this.openAiClient.sendUserText(text);
    } else {
      // Fallback to voice client if no text client
      console.warn('⚠️ No text client available, using voice client');
      this.sendVoiceMessage(text);
    }
  }

  // Input type detection
  private detectInputType(text: string, context?: { isVoiceInput?: boolean; isTextInput?: boolean; source?: string }): 'voice' | 'text' {
    // Check explicit context
    if (context?.isVoiceInput) return 'voice';
    if (context?.isTextInput) return 'text';
    
    // Check source hints
    if (context?.source === 'microphone') return 'voice';
    if (context?.source === 'keyboard') return 'text';
    
    // Use auto-detection if enabled
    if (this.options.enableAutoDetection !== false && this.modelConfig.autoDetectInputType) {
      return detectInputType(text, context);
    }
    
    // Default to text for safety
    return 'text';
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

  // Get current providers for both voice and text
  getCurrentProviders(): { voice: 'openai' | 'nova-sonic' | null; text: TextModel | null } {
    return {
      voice: this.currentProvider,
      text: this.currentTextProvider,
    };
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    const hasVoiceClient = !!(this.openAiClient || this.novaSonicClient);
    const hasTextClient = !!(this.currentTextProvider === 'openai');
    
    if (hasVoiceClient || hasTextClient) {
      return 'connected';
    }
    
    return 'disconnected';
  }

  // Get troubleshooting information for connection errors
  private getTroubleshootingInfo(provider: 'openai' | 'nova-sonic', error: any): string[] {
    const tips: string[] = [];
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (provider === 'openai') {
      tips.push('Check if OPENAI_API_KEY environment variable is set');
      tips.push('Verify OpenAI API key has Realtime API access');
      tips.push('Ensure network connectivity to api.openai.com');
      
      if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        tips.push('API key is invalid or expired');
      }
      if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        tips.push('API key does not have access to Realtime API');
      }
      if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        tips.push('API quota or rate limit exceeded');
      }
    } else if (provider === 'nova-sonic') {
      tips.push('Check AWS credentials: NEXT_PUBLIC_AWS_ACCESS_KEY_ID and NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY');
      tips.push('Verify AWS region is set to us-east-1 (Nova Sonic requirement)');
      tips.push('Ensure AWS account has Bedrock access');
      tips.push('Check if Nova Sonic model is available in your region');
      
      if (errorMessage.includes('credentials')) {
        tips.push('AWS credentials are missing or invalid');
      }
      if (errorMessage.includes('region')) {
        tips.push('Try setting NEXT_PUBLIC_AWS_REGION=us-east-1');
      }
      if (errorMessage.includes('AccessDenied') || errorMessage.includes('403')) {
        tips.push('AWS account may not have Bedrock permissions');
      }
    }
    
    tips.push('Check browser console for detailed error logs');
    tips.push('Try testing the connection using the API test endpoint');
    
    return tips;
  }
}

// Factory function for creating unified voice client
export function createUnifiedVoiceClient(options: UnifiedVoiceClientOptions): UnifiedVoiceClient {
  return new UnifiedVoiceClient(options);
}