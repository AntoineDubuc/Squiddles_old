/**
 * Collaborative Squiddles Multi-Agent System
 * Based on OpenAI Advanced Agent Example patterns
 * 
 * Creates a true multi-agent system where agents can handoff to each other
 * for specialized tasks while maintaining context across transfers.
 */

import { minimalProductManagerAgent } from './minimalProductManager';
import { jiraIntegrationAgent } from './jiraIntegration';
import { confluenceIntegrationAgent } from './confluenceIntegration';
import { slackIntegrationAgent } from './slackIntegration';

// Set up bidirectional handoff relationships following OpenAI pattern
// Each agent can transfer to any other agent based on user needs

// Product Manager can handoff to all specialists
(minimalProductManagerAgent.handoffs as any).push(
  jiraIntegrationAgent,
  confluenceIntegrationAgent, 
  slackIntegrationAgent
);

// Jira Agent can handoff to other specialists for related work
(jiraIntegrationAgent.handoffs as any).push(
  confluenceIntegrationAgent,
  slackIntegrationAgent,
  minimalProductManagerAgent
);

// Confluence Agent can handoff to other specialists for related work  
(confluenceIntegrationAgent.handoffs as any).push(
  jiraIntegrationAgent,
  slackIntegrationAgent,
  minimalProductManagerAgent
);

// Slack Agent can handoff to other specialists for related work
(slackIntegrationAgent.handoffs as any).push(
  jiraIntegrationAgent,
  confluenceIntegrationAgent,
  minimalProductManagerAgent
);

// Single collaborative scenario with all interconnected agents
// ProductManager leads as primary orchestrator, others are specialists
export const collaborativeSquiddlesScenario = [
  minimalProductManagerAgent,    // Primary/orchestrator - strategic thinking
  jiraIntegrationAgent,         // Ticket specialist
  confluenceIntegrationAgent,   // Documentation specialist  
  slackIntegrationAgent,        // Communication specialist
];

// Export individual agents for direct access if needed
export {
  minimalProductManagerAgent,
  jiraIntegrationAgent, 
  confluenceIntegrationAgent,
  slackIntegrationAgent
};