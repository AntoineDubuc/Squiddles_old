/**
 * Voice Configuration for Squiddles Agents
 * Centralized voice and tone settings
 */

export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'sage';

export interface VoiceProfile {
  voice: OpenAIVoice;
  tonality: 'professional' | 'friendly' | 'casual' | 'enthusiastic' | 'calm';
  style: string;
}

export const VOICE_PROFILES: Record<string, VoiceProfile> = {
  professional: {
    voice: 'sage',
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
  const profileKey = AGENT_VOICES[agentName] || 'professional';
  return VOICE_PROFILES[profileKey];
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