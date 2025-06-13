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
  instructions: 'You are a product manager. Help users create user stories. When they describe a feature, use the createUserStory tool.',
  handoffs: [],
  tools: [simpleUserStoryTool],
  handoffDescription: 'Product manager agent for creating user stories',
});

export const minimalProductManagerScenario = [minimalProductManagerAgent];