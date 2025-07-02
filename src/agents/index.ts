/**
 * Agent Registry - Collaborative Multi-Agent System
 * Based on: OpenAI Advanced Agent Example Pattern
 * 
 * Uses true multi-agent collaboration with handoffs between specialists
 */

// Import collaborative scenario with proper handoff relationships
import { 
  collaborativeSquiddlesScenario,
  minimalProductManagerAgent,
  jiraIntegrationAgent, 
  confluenceIntegrationAgent,
  slackIntegrationAgent
} from './collaborativeSquiddles';

// Import legacy isolated scenarios for backwards compatibility
import { minimalProductManagerScenario } from './minimalProductManager';
import { jiraIntegrationScenario } from './jiraIntegration';
import { confluenceIntegrationScenario } from './confluenceIntegration';
import { slackIntegrationScenario } from './slackIntegration';
import { gmailIntegrationScenario, gmailIntegrationAgent } from './gmailIntegration';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  // NEW: True collaborative multi-agent system (RECOMMENDED)
  squiddles: collaborativeSquiddlesScenario,
  
  // Legacy isolated scenarios (for backwards compatibility)
  minimal: minimalProductManagerScenario,
  jira: jiraIntegrationScenario,
  confluence: confluenceIntegrationScenario,
  slack: slackIntegrationScenario,
  gmail: gmailIntegrationScenario,
  
  // Legacy combined scenarios (just concatenated arrays - no handoffs)
  withJira: [...jiraIntegrationScenario, ...minimalProductManagerScenario],
  withConfluence: [...confluenceIntegrationScenario, ...minimalProductManagerScenario],
  withSlack: [...slackIntegrationScenario, ...minimalProductManagerScenario],
  withGmail: [...gmailIntegrationScenario, ...minimalProductManagerScenario],
  full: [...confluenceIntegrationScenario, ...jiraIntegrationScenario, ...slackIntegrationScenario, ...gmailIntegrationScenario, ...minimalProductManagerScenario],
};

// Use the new collaborative system as default
export const defaultAgentSetKey = 'squiddles';

// Export active agents for direct access
export { minimalProductManagerAgent, jiraIntegrationAgent, confluenceIntegrationAgent, slackIntegrationAgent, gmailIntegrationAgent };