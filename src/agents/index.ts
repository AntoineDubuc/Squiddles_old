/**
 * Agent Registry - Active Core Agents Only
 * Based on: OpenAI Advanced Agent Example Pattern
 * 
 * NOTE: Experimental agents moved to development-archive/experimental/agents/
 */

import { minimalProductManagerScenario, minimalProductManagerAgent } from './minimalProductManager';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  minimal: minimalProductManagerScenario,
};

export const defaultAgentSetKey = 'minimal';

// Export active agents for direct access
export { minimalProductManagerAgent };