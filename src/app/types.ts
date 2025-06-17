import { z } from "zod";

// NOTE: Comprehensive UI and API types moved to development-archive/experimental/types/
// Only core types needed for active application are defined here

// ==== USER MANAGEMENT (Essential for auth) ====

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'pm' | 'tpm' | 'po' | 'eng' | 'sm' | 'other';
  company?: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  voiceSettings: VoiceSettings;
  theme: 'dark' | 'light' | 'auto';
  notifications: NotificationSettings;
  panelStates: {
    leftPanelCollapsed: boolean;
    rightPanelCollapsed: boolean;
  };
}

export interface VoiceSettings {
  inputDevice?: string;
  outputDevice?: string;
  sensitivity: number;
  pushToTalk: boolean;
  noiseCancellation: boolean;
  echoCancellation: boolean;
  audioQuality: 'low' | 'standard' | 'high' | 'premium';
  voiceActivationEnabled: boolean;
}

export interface NotificationSettings {
  mentions: boolean;
  comments: boolean;
  ticketUpdates: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  browserNotifications: boolean;
}

// Define the allowed moderation categories only once
export const MODERATION_CATEGORIES = [
  "OFFENSIVE",
  "OFF_BRAND",
  "VIOLENCE",
  "NONE",
] as const;

// Derive the union type for ModerationCategory from the array
export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number];

// Create a Zod enum based on the same array
export const ModerationCategoryZod = z.enum([...MODERATION_CATEGORIES]);

export type SessionStatus = "DISCONNECTED" | "CONNECTING" | "CONNECTED";

export interface GuardrailResultType {
  status: "IN_PROGRESS" | "DONE";
  testText?: string; 
  category?: ModerationCategory;
  rationale?: string;
}

export interface TranscriptItem {
  itemId: string;
  type: "MESSAGE" | "BREADCRUMB";
  role?: "user" | "assistant";
  title?: string;
  data?: Record<string, any>;
  expanded: boolean;
  timestamp: string;
  createdAtMs: number;
  status: "IN_PROGRESS" | "DONE";
  isHidden: boolean;
  guardrailResult?: GuardrailResultType;
}

// Update the GuardrailOutputZod schema to use the shared ModerationCategoryZod
export const GuardrailOutputZod = z.object({
  moderationRationale: z.string(),
  moderationCategory: ModerationCategoryZod,
});

export type GuardrailOutput = z.infer<typeof GuardrailOutputZod>;

export interface EventItem {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  source: "client" | "server";
}

export interface RealtimeClientConfig {
  sessionId: string;
  agents: any[];
  onTranscriptUpdate: (message: TranscriptItem) => void;
  onEvent: (event: EventItem) => void;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  format: string;
}

export interface SessionConfig {
  modalities: string[];
  instructions: string;
  voice: string;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription?: {
    model: string;
  };
  turn_detection?: {
    type: string;
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
  tools?: any[];
  tool_choice?: string;
  temperature?: number;
  max_response_output_tokens?: number;
}