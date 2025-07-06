/**
 * Voice Configuration for Squiddles Agents
 * Centralized voice and tone settings
 */

export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type NovaSonicVoice = 'matthew' | 'tiffany' | 'amy';
export type UnifiedVoice = OpenAIVoice | NovaSonicVoice;

export interface VoiceProfile {
  voice: UnifiedVoice;
  tonality: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'calm';
  style: string;
}

// OpenAI Voice Profiles
export const OPENAI_VOICE_PROFILES: Record<string, VoiceProfile> = {
  professional: {
    voice: 'alloy',
    tonality: 'professional',
    style: 'Be brief, clear, and direct. Use minimal words and focus on efficiency.'
  },
  friendly: {
    voice: 'echo',
    tonality: 'friendly', 
    style: 'Be warm, friendly, and approachable. Use casual language and show enthusiasm for helping.'
  },
  casual: {
    voice: 'nova',
    tonality: 'casual',
    style: 'Be relaxed and conversational. Use informal language and speak like a helpful colleague.'
  },
  enthusiastic: {
    voice: 'fable',
    tonality: 'enthusiastic',
    style: 'Be energetic, positive, and expressive. Celebrate successes and maintain an upbeat tone.'
  },
  calm: {
    voice: 'shimmer',
    tonality: 'calm',
    style: 'Be calm, gentle, and reassuring. Use a soothing tone and speak thoughtfully.'
  }
};

// Nova Sonic Voice Profiles
export const NOVA_SONIC_VOICE_PROFILES: Record<string, VoiceProfile> = {
  professional: {
    voice: 'matthew',
    tonality: 'professional',
    style: 'Be brief, clear, and direct. Use minimal words and focus on efficiency.'
  },
  friendly: {
    voice: 'tiffany',
    tonality: 'friendly', 
    style: 'Be warm, friendly, and approachable. Use casual language and show enthusiasm for helping.'
  },
  casual: {
    voice: 'amy',
    tonality: 'casual',
    style: 'Be relaxed and conversational. Use informal language and speak like a helpful colleague.'
  },
  enthusiastic: {
    voice: 'amy',
    tonality: 'enthusiastic',
    style: 'Be energetic, positive, and expressive. Celebrate successes and maintain an upbeat tone.'
  },
  calm: {
    voice: 'matthew',
    tonality: 'calm',
    style: 'Be calm, gentle, and reassuring. Use a soothing tone and speak thoughtfully.'
  }
};

// Default to OpenAI profiles for backward compatibility
export const VOICE_PROFILES = OPENAI_VOICE_PROFILES;

// Nova Sonic voice definitions
export const NOVA_SONIC_VOICES: Record<NovaSonicVoice, string> = {
  matthew: 'Matthew - Natural, clear male voice',
  tiffany: 'Tiffany - Warm, professional female voice',
  amy: 'Amy - Bright, engaging female voice'
};

// OpenAI voice definitions
export const OPENAI_VOICES: Record<OpenAIVoice, string> = {
  alloy: 'Alloy - Neutral, balanced',
  echo: 'Echo - Friendly, warm',
  fable: 'Fable - Expressive, dynamic',
  onyx: 'Onyx - Deep, authoritative',
  nova: 'Nova - Bright, engaging',
  shimmer: 'Shimmer - Gentle, soft'
};

// Agent-specific voice assignments
export const AGENT_VOICES: Record<string, string> = {
  confluenceIntegration: 'professional', // Documentation needs clarity
  jiraIntegration: 'friendly',           // Ticket management should be supportive
  slackIntegration: 'casual',            // Messaging is conversational
  productManager: 'professional',       // Clear, concise responses
  gmailIntegration: 'professional',     // Email communication needs professionalism
};

// Get voice configuration for an agent
export function getAgentVoiceConfig(agentName: string): VoiceProfile {
  // Check if we're in a browser environment and try to load saved settings
  if (typeof window !== 'undefined') {
    try {
      const savedSettings = localStorage.getItem('squiddles-settings');
      console.log(`🎵 Loading voice config for ${agentName}:`, savedSettings ? 'Found saved settings' : 'No saved settings');
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        console.log(`🎵 Parsed settings:`, parsed.voice);
        
        // Determine which voice provider to use
        const provider = parsed.voiceProvider?.provider || 'openai';
        const voiceProfiles = getVoiceProfilesForProvider(provider);
        
        // Use global voice if set, or specific agent voice if available
        if (parsed.voice?.globalVoice && parsed.voice?.globalTone) {
          const globalProfile = voiceProfiles[parsed.voice.globalTone];
          if (globalProfile) {
            const config = {
              ...globalProfile,
              voice: parsed.voice.globalVoice
            };
            console.log(`🎵 Using global voice config for ${agentName}:`, config);
            return config;
          }
        }
        
        // Check for agent-specific voice setting
        if (parsed.voice?.agentVoices?.[agentName]) {
          const agentTone = parsed.voice.agentVoices[agentName];
          const agentProfile = voiceProfiles[agentTone];
          if (agentProfile) {
            console.log(`🎵 Using agent-specific voice config for ${agentName}:`, agentProfile);
            return agentProfile;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load voice settings from localStorage:', error);
    }
  }
  
  // Fallback to default configuration - use OpenAI profiles as default
  const profileKey = AGENT_VOICES[agentName] || 'professional';
  const defaultConfig = OPENAI_VOICE_PROFILES[profileKey];
  console.log(`🎵 Using default voice config for ${agentName}:`, defaultConfig);
  return defaultConfig;
}

// Helper functions for voice management
export function isNovaSonicVoice(voice: string): voice is NovaSonicVoice {
  return Object.keys(NOVA_SONIC_VOICES).includes(voice);
}

export function isOpenAIVoice(voice: string): voice is OpenAIVoice {
  return Object.keys(OPENAI_VOICES).includes(voice);
}

export function getVoiceDescription(voice: UnifiedVoice): string {
  if (isNovaSonicVoice(voice)) {
    return NOVA_SONIC_VOICES[voice];
  } else if (isOpenAIVoice(voice)) {
    return OPENAI_VOICES[voice];
  }
  return 'Unknown voice';
}

export function getDefaultVoiceForProvider(provider: 'openai' | 'nova-sonic'): UnifiedVoice {
  return provider === 'openai' ? 'echo' : 'matthew';
}

export function getVoiceProfilesForProvider(provider: 'openai' | 'nova-sonic'): Record<string, VoiceProfile> {
  return provider === 'openai' ? OPENAI_VOICE_PROFILES : NOVA_SONIC_VOICE_PROFILES;
}

// Generate instruction text for an agent's communication style
export function generateStyleInstructions(agentName: string): string {
  const config = getAgentVoiceConfig(agentName);
  
  return `
# Communication Style:
${config.style}

# Voice Characteristics:
- Tone: ${config.tonality}
- Voice: ${config.voice}
- Always maintain consistency in your chosen communication style
- Adapt your energy level to match user needs while staying true to your personality
`;
}