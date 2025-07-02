/**
 * Agent Registry - Active Core Agents Only
 * Based on: OpenAI Advanced Agent Example Pattern
 * 
 * NOTE: Experimental agents moved to development-archive/experimental/agents/
 */

import { minimalProductManagerScenario, minimalProductManagerAgent } from './minimalProductManager';
import { jiraIntegrationScenario, jiraIntegrationAgent } from './jiraIntegration';
import { confluenceIntegrationScenario, confluenceIntegrationAgent } from './confluenceIntegration';
import { slackIntegrationScenario, slackIntegrationAgent } from './slackIntegration';
import { gmailIntegrationScenario, gmailIntegrationAgent } from './gmailIntegration';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  minimal: minimalProductManagerScenario,
  jira: jiraIntegrationScenario,
  confluence: confluenceIntegrationScenario,
  slack: slackIntegrationScenario,
  gmail: gmailIntegrationScenario,
  withJira: [...jiraIntegrationScenario, ...minimalProductManagerScenario],
  withConfluence: [...confluenceIntegrationScenario, ...minimalProductManagerScenario],
  withSlack: [...slackIntegrationScenario, ...minimalProductManagerScenario],
  withGmail: [...gmailIntegrationScenario, ...minimalProductManagerScenario],
  full: [...confluenceIntegrationScenario, ...jiraIntegrationScenario, ...slackIntegrationScenario, ...gmailIntegrationScenario, ...minimalProductManagerScenario],
};

export const defaultAgentSetKey = 'full';

// Export active agents for direct access
export { minimalProductManagerAgent, jiraIntegrationAgent, confluenceIntegrationAgent, slackIntegrationAgent, gmailIntegrationAgent };