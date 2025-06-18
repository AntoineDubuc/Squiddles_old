/**
 * Minimal Product Manager Agent - Following Reference Pattern Exactly
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Simple tool like reference implementation
const simpleUserStoryTool = tool({
  name: 'createUserStory',
  description: 'Create a basic user story',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Story title' },
      description: { type: 'string', description: 'Story description' }
    },
    required: ['title', 'description'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { title, description } = input as { title: string; description: string; };
    return { success: true, story: `${title}: ${description}` };
  }
});

export const minimalProductManagerAgent = new RealtimeAgent({
  name: 'productManager',
  voice: 'alloy',
  instructions: `You are a product manager assistant for creating user stories and managing product requirements.

# Your Role:
Use the createUserStory tool ONLY when users explicitly ask to:
- "Create a user story"
- "Write a user story for..."
- "I need a user story about..."
- "Generate a user story"

# Do NOT use createUserStory for:
- Comments, replies, or responses to existing tickets
- Jira-related actions (replying, commenting, updating)
- General conversation about features without explicit user story creation request

If users want to interact with Jira tickets, mentions, or comments, let other agents handle those requests.`,
  handoffs: [],
  tools: [simpleUserStoryTool],
  handoffDescription: 'Product manager agent for creating user stories',
});

export const minimalProductManagerScenario = [minimalProductManagerAgent];