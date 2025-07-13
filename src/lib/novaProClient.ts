/**
 * Nova Pro Text Client for Squiddles
 * AWS Bedrock Nova Pro text-only implementation for typing interactions
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Event types for Nova Pro client
export type NovaProEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  text_received: [string];
  error: [any];
  response_start: [];
  response_end: [];
};

// Configuration for Nova Pro client
export interface NovaProConfig {
  region: string;
  modelId: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

// Default configuration
const DEFAULT_CONFIG: Partial<NovaProConfig> = {
  region: 'us-west-2',
  modelId: 'amazon.nova-pro-v1:0',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.9,
  systemPrompt: 'You are Squiddles, a helpful AI assistant specialized in project management and technical tasks.',
};

// Simple event emitter for Nova Pro
type Listener<Args extends any[]> = (...args: Args) => void;

class NovaProEmitter<Events extends Record<string, any[]>> {
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

export class NovaProClient {
  private client: BedrockRuntimeClient;
  private config: NovaProConfig;
  private events = new NovaProEmitter<NovaProEvents>();
  private isConnected = false;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  constructor(config: Partial<NovaProConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config } as NovaProConfig;
    
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
  on<K extends keyof NovaProEvents>(event: K, listener: (...args: NovaProEvents[K]) => void) {
    this.events.on(event, listener as any);
  }

  off<K extends keyof NovaProEvents>(event: K, listener: (...args: NovaProEvents[K]) => void) {
    this.events.off(event, listener as any);
  }

  // Connect (for Nova Pro, this is just initialization)
  async connect(): Promise<void> {
    console.log('🔗 Nova Pro connecting...');
    this.events.emit('connection_change', 'connecting');
    
    try {
      // Test connection with a simple ping
      await this.pingModel();
      
      this.isConnected = true;
      this.events.emit('connection_change', 'connected');
      console.log('✅ Nova Pro connected successfully');
      
    } catch (error) {
      console.error('❌ Nova Pro connection failed:', error);
      this.events.emit('connection_change', 'disconnected');
      this.events.emit('error', error);
      throw error;
    }
  }

  // Test model connection
  private async pingModel(): Promise<void> {
    const command = new InvokeModelCommand({
      modelId: this.config.modelId,
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'ping'
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
      contentType: 'application/json',
      accept: 'application/json',
    });

    await this.client.send(command);
  }

  // Disconnect
  async disconnect(): Promise<void> {
    console.log('🔌 Nova Pro disconnecting...');
    this.isConnected = false;
    this.conversationHistory = [];
    this.events.emit('connection_change', 'disconnected');
    console.log('✅ Nova Pro disconnected');
  }

  // Send text message and get response
  async sendTextMessage(text: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Nova Pro client is not connected');
    }

    console.log('📝 Sending text to Nova Pro:', text);
    this.events.emit('response_start');

    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: text });

      // Prepare messages for the API
      const messages = [
        { role: 'system', content: this.config.systemPrompt },
        ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
      ];

      // Create the command
      const command = new InvokeModelCommand({
        modelId: this.config.modelId,
        body: JSON.stringify({
          messages: messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          top_p: this.config.topP,
        }),
        contentType: 'application/json',
        accept: 'application/json',
      });

      // Send the request
      const response = await this.client.send(command);
      
      if (!response.body) {
        throw new Error('No response body from Nova Pro');
      }

      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const assistantMessage = responseBody.content[0]?.text || responseBody.message?.content || '';

      if (!assistantMessage) {
        throw new Error('No text content in Nova Pro response');
      }

      // Add assistant message to history
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      // Emit events
      this.events.emit('text_received', assistantMessage);
      this.events.emit('message', {
        type: 'response.text',
        text: assistantMessage,
        timestamp: new Date().toISOString(),
      });
      this.events.emit('response_end');

      console.log('✅ Nova Pro response received:', assistantMessage.substring(0, 100) + '...');
      return assistantMessage;

    } catch (error) {
      console.error('❌ Nova Pro text message failed:', error);
      this.events.emit('error', error);
      this.events.emit('response_end');
      throw error;
    }
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
    console.log('🗑️ Nova Pro conversation history cleared');
  }

  // Get conversation history
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.isConnected ? 'connected' : 'disconnected';
  }

  // Set system prompt
  setSystemPrompt(prompt: string): void {
    this.config.systemPrompt = prompt;
    console.log('📝 Nova Pro system prompt updated');
  }

  // Update model configuration
  updateConfig(newConfig: Partial<NovaProConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Nova Pro configuration updated');
  }
}

// Factory function for creating Nova Pro client
export function createNovaProClient(config?: Partial<NovaProConfig>): NovaProClient {
  return new NovaProClient(config || {});
}

// Check if Nova Pro is available (has required environment variables)
export function isNovaProAvailable(): boolean {
  return !!(
    (process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION) &&
    (process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID) &&
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)
  );
}

// Get Nova Pro cost information
export function getNovaProCostInfo(): {
  name: string;
  costPer1KTokens: number;
  currency: string;
} {
  return {
    name: 'AWS Nova Pro',
    costPer1KTokens: 0.0008, // Approximate cost per 1K tokens
    currency: 'USD',
  };
}