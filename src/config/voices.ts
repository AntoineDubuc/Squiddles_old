/**
 * Voice Configuration for Squiddles Agents
 * Centralized voice and tone settings
 */

export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface VoiceProfile {
  voice: OpenAIVoice;
  tonality: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'calm';
  style: string;
}

export const VOICE_PROFILES: Record<string, VoiceProfile> = {
  professional: {
    voice: 'alloy',
    tonality: 'professional',
    style: 'Be professional, clear, and concise. Use formal language and focus on efficiency.'
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

// Agent-specific voice assignments
export const AGENT_VOICES: Record<string, keyof typeof VOICE_PROFILES> = {
  confluenceIntegration: 'professional', // Documentation needs clarity
  jiraIntegration: 'friendly',           // Ticket management should be supportive
  slackIntegration: 'casual',            // Messaging is conversational
  productManager: 'enthusiastic',       // Brainstorming needs energy
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
        
        // Use global voice if set, or specific agent voice if available
        if (parsed.voice?.globalVoice && parsed.voice?.globalTone) {
          const globalProfile = VOICE_PROFILES[parsed.voice.globalTone];
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
          const agentProfile = VOICE_PROFILES[agentTone];
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
  
  // Fallback to default configuration
  const profileKey = AGENT_VOICES[agentName] || 'professional';
  const defaultConfig = VOICE_PROFILES[profileKey];
  console.log(`🎵 Using default voice config for ${agentName}:`, defaultConfig);
  return defaultConfig;
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