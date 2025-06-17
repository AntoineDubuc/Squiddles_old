/**
 * Simple Test Agent - Exact copy of reference pattern
 */

import { RealtimeAgent } from '@openai/agents/realtime';

export const simpleTestAgent = new RealtimeAgent({
  name: 'simpleTest',
  voice: 'alloy',
  instructions: 'You are a simple test agent. Just greet the user and tell them this is a test.',
  handoffs: [],
  tools: [],
  handoffDescription: 'Simple test agent',
});

export const simpleTestScenario = [simpleTestAgent];