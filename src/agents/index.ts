/**
 * Agent Registry - Transparent Multi-Agent System
 * Based on: OpenAI Advanced Agent Example Pattern
 * 
 * Uses transparent handoffs for seamless user experience - users think
 * they're talking to one agent while getting specialized capabilities
 */

// Import transparent multi-agent system (RECOMMENDED)
import {
  transparentMultiAgentScenario,
  transparentMultiAgent,
  createTransparentMultiAgent
} from './transparentMultiAgent';

// Import unified scenario (single agent fallback)
import { 
  unifiedSquiddlesScenario,
  unifiedSquiddlesAgent
} from './unifiedSquiddles';

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

// Function to create fresh agent sets with current voice settings
export function createFreshAgentSets(): Record<string, RealtimeAgent[]> {
  // Create fresh transparent multi-agent scenario with current voice settings
  const freshTransparentScenario = [
    createTransparentMultiAgent(),
    confluenceIntegrationAgent, 
    jiraIntegrationAgent
  ];

  return {
    // NEW: Transparent multi-agent - seamless handoffs, invisible to users (RECOMMENDED)
    squiddles: freshTransparentScenario,
    
    // Single unified agent - fallback option
    unified: unifiedSquiddlesScenario,
    
    // Multi-agent with visible transfers (for testing)
    collaborative: collaborativeSquiddlesScenario,
    
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
}

// Map of scenario key -> array of RealtimeAgent objects (legacy for backwards compatibility)
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  // NEW: Transparent multi-agent - seamless handoffs, invisible to users (RECOMMENDED)
  squiddles: transparentMultiAgentScenario,
  
  // Single unified agent - fallback option
  unified: unifiedSquiddlesScenario,
  
  // Multi-agent with visible transfers (for testing)
  collaborative: collaborativeSquiddlesScenario,
  
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

// Use the transparent multi-agent system (fixed to work with voice interface)
export const defaultAgentSetKey = 'squiddles';

// Export active agents for direct access
export { 
  transparentMultiAgent,
  unifiedSquiddlesAgent, 
  minimalProductManagerAgent, 
  jiraIntegrationAgent, 
  confluenceIntegrationAgent, 
  slackIntegrationAgent, 
  gmailIntegrationAgent 
};