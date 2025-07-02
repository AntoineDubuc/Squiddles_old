/**
 * Realtime Client for Squiddles
 * Based exactly on OpenAI Advanced Agent Example realtimeClient.ts
 */

import { RealtimeSession, RealtimeAgent, OpenAIRealtimeWebRTC } from '@openai/agents/realtime';
import { moderationGuardrail } from './guardrails';

// Minimal event emitter (browser-safe, no Node polyfill)
type Listener<Args extends any[]> = (...args: Args) => void;

class MiniEmitter<Events extends Record<string, any[]>> {
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

export type ClientEvents = {
  connection_change: ['connected' | 'connecting' | 'disconnected'];
  message: [any];
  audio_interrupted: [];
  history_added: [import('@openai/agents/realtime').RealtimeItem];
  history_updated: [import('@openai/agents/realtime').RealtimeItem[]];
  error: [any];
};

export interface RealtimeClientOptions {
  getEphemeralKey: () => Promise<string>; // returns ek_ string
  initialAgents: RealtimeAgent[]; // first item is root agent
  audioElement?: HTMLAudioElement;
  extraContext?: Record<string, any>;
  vadConfig?: {
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
}

export class RealtimeClient {
  #session: RealtimeSession | null = null;
  #events = new MiniEmitter<ClientEvents>();
  #options: RealtimeClientOptions;

  constructor(options: RealtimeClientOptions) {
    this.#options = options;
  }

  on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void) {
    this.#events.on(event, listener as any);
  }

  off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void) {
    this.#events.off(event, listener as any);
  }

  async connect() {
    if (this.#session) return;

    const ek = await this.#options.getEphemeralKey();
    const rootAgent = this.#options.initialAgents[0];

    const transportValue: any = this.#options.audioElement
      ? new OpenAIRealtimeWebRTC({
          useInsecureApiKey: true,
          audioElement: this.#options.audioElement,
        })
      : 'webrtc';

    this.#session = new RealtimeSession(rootAgent, {
      transport: transportValue,
      outputGuardrails: [moderationGuardrail as any],
      context: this.#options.extraContext ?? {},
    });

    // Immediately notify UI that we've started connecting.
    this.#events.emit('connection_change', 'connecting');

    // Forward every transport event as message for handler and watch for
    // low-level connection state changes so we can propagate *disconnections*
    // after initial setup.
    const transport: any = this.#session.transport;

    transport.on('*', (ev: any) => {
      // Surface raw session.updated to console for debugging missing instructions.
      if (ev?.type === 'session.updated') {
        console.log('🔧 SESSION UPDATED:', JSON.stringify(ev, null, 2));
      }
      this.#events.emit('message', ev);
    });

    transport.on('connection_change', (status: any) => {
      if (status === 'disconnected') {
        this.#events.emit('connection_change', 'disconnected');
      }
    });


    // Track seen items so we can re-emit granular additions.
    const seenItems = new Map<string, string>(); // itemId -> serialized status marker

    this.#session.on('history_updated', (history: any) => {
      (history as any[]).forEach((item) => {
        const key = `${item.itemId}:${item.status}`;
        if (!seenItems.has(key)) {
          seenItems.set(key, key);
          this.#events.emit('history_added', item);
        }
      });
      // Also expose full history if callers want it.
      this.#events.emit('history_updated', history);
    });

    this.#session.on('audio_interrupted', () => {
      this.#events.emit('audio_interrupted');
    });

    this.#session.on('guardrail_tripped', (info: any) => {
      this.#events.emit('message', { type: 'guardrail_tripped', info });
    });

    // Wait for full connection establishment (data channel open).
    await this.#session.connect({ apiKey: ek });

    // Configure VAD settings to reduce costs
    this.configureVAD();

    // Now we are truly connected.
    this.#events.emit('connection_change', 'connected');
  }

  private configureVAD() {
    if (!this.#session) return;

    // Configure VAD settings to reduce costs and improve performance
    const vadConfig = this.#options.vadConfig || {
      threshold: 0.5,           // Higher threshold = less sensitive (default ~0.2)
      prefix_padding_ms: 300,   // Shorter padding = less audio processed
      silence_duration_ms: 500  // Longer silence before stopping = fewer triggers
    };

    console.log('🔧 Configuring VAD for cost optimization:', vadConfig);

    // Send session.update with optimized VAD settings
    this.#session.transport.sendEvent({
      type: 'session.update',
      session: {
        turn_detection: {
          type: 'server_vad',        // Use server VAD instead of semantic for better control
          threshold: vadConfig.threshold,
          prefix_padding_ms: vadConfig.prefix_padding_ms,
          silence_duration_ms: vadConfig.silence_duration_ms,
          create_response: true,
          interrupt_response: true
        },
        input_audio_transcription: {
          model: 'whisper-1'         // Use standard Whisper instead of mini-transcribe for cost
        }
      }
    } as any);
  }

  disconnect() {
    this.#session?.close();
    this.#session = null;
    this.#events.emit('connection_change', 'disconnected');
  }

  sendUserText(text: string) {
    if (!this.#session) throw new Error('not connected');
    this.#session.sendMessage(text);
  }

  pushToTalkStart() {
    if (!this.#session) return;
    this.#session.transport.sendEvent({ type: 'input_audio_buffer.clear' } as any);
  }

  pushToTalkStop() {
    if (!this.#session) return;
    this.#session.transport.sendEvent({ type: 'input_audio_buffer.commit' } as any);
    this.#session.transport.sendEvent({ type: 'response.create' } as any);
  }

  sendEvent(event: any) {
    this.#session?.transport.sendEvent(event);
  }

  interrupt() {
    this.#session?.transport.interrupt();
  }

  mute(muted: boolean) {
    this.#session?.mute(muted);
  }

  cancelResponse() {
    if (!this.#session) return;
    // Cancel any ongoing response generation
    this.#session.transport.sendEvent({ type: 'response.cancel' } as any);
    console.log('🛑 Sent response.cancel event');
  }
}