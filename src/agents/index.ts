/**
 * Agent Registry - Following OpenAI Advanced Agent Example Pattern
 * Based on: research/openai_advanced_agent_example/src/app/agentConfigs/index.ts
 */

import { productManagerScenario, productManagerAgent } from './productManager';
import { jiraScenario, jiraAgent } from './jiraIntegration';
import { slackScenario, slackAgent } from './slackIntegration';
import { simpleTestScenario, simpleTestAgent } from './testSimple';
import { minimalProductManagerScenario, minimalProductManagerAgent } from './minimalProductManager';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Configure handoffs between agents
productManagerAgent.handoffs = [jiraAgent, slackAgent];
jiraAgent.handoffs = [productManagerAgent, slackAgent];
slackAgent.handoffs = [productManagerAgent, jiraAgent];

// Combined scenario with all agents
export const squiddlesPocScenario = [productManagerAgent, jiraAgent, slackAgent];

// Map of scenario key -> array of RealtimeAgent objects (EXACT COPY OF REFERENCE)
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  productManager: productManagerScenario,
  jira: jiraScenario,
  slack: slackScenario,
  poc: squiddlesPocScenario,
  test: simpleTestScenario,
  minimal: minimalProductManagerScenario,
};

export const defaultAgentSetKey = 'minimal';

// Export individual agents for direct access
export { productManagerAgent, jiraAgent, slackAgent };