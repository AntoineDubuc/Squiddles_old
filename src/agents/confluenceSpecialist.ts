/**
 * Confluence Specialist Agent - Transparent Documentation Expert
 * 
 * This agent handles Confluence operations invisibly - users think they're 
 * talking to the main assistant, not a specialist. Returns responses as if
 * from the primary assistant without mentioning delegation or specialization.
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig } from '../config/voices';

// Confluence search tool - same as unified agent but with enhanced context
const searchPagesTool = tool({
  name: 'searchPages',
  description: 'Search for Confluence pages by title or get recent pages',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query for page titles (optional - if not provided, returns recent pages)'
      },
      spaceKey: {
        type: 'string',
        description: 'Confluence space key to limit search to (optional)'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (default: 25)',
        default: 25
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query, spaceKey, limit = 25 } = input as { 
      query?: string; 
      spaceKey?: string; 
      limit?: number; 
    };

    try {
      console.log('🔍 [Confluence Specialist] Search requested:', { query, spaceKey, limit });

      const searchParams = new URLSearchParams();
      if (query) searchParams.append('query', query);
      if (spaceKey) searchParams.append('spaceKey', spaceKey);
      if (limit) searchParams.append('limit', limit.toString());

      const response = await fetch(`/api/confluence/pages?${searchParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ [Confluence Specialist] Search completed:', result.pages?.length || 0, 'pages found');

      // Return clean results without commentary
      return {
        success: true,
        pages: result.pages || [],
        total: result.total || 0
      };

    } catch (error) {
      console.error('❌ [Confluence Specialist] Search failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        pages: []
      };
    }
  }
});

const voiceConfig = getAgentVoiceConfig('productManager');

// Confluence specialist agent - invisible to users
export const confluenceSpecialistAgent = new RealtimeAgent({
  name: 'ConfluenceCapability',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's personal assistant helping with Confluence documentation. When users ask about Confluence pages, documentation, or company knowledge, you search and present the information naturally as if you always had this capability.

CRITICAL: Never mention that you are a specialist, that this was delegated, or that you're transferring anything. Always respond as if you are the main assistant who happens to have access to Confluence.

# How to Respond
- Present Confluence pages naturally: "I found these pages for you..."
- Use first person: "I searched" not "the Confluence system found"
- Be helpful and conversational
- If no results, suggest alternatives or different search terms
- Format results clearly with titles, spaces, and descriptions

# Response Style
- Natural and helpful tone
- Focus on the content, not the process
- Provide context about what the pages contain
- Suggest follow-up actions when relevant

# Never Say
- "Transferring to Confluence expert"
- "I'm a Confluence specialist"
- "This was delegated to me"
- "Handing off to documentation team"

Instead, seamlessly provide the information as Antoine's unified assistant.`,
  handoffs: [], // No further handoffs - this is a leaf specialist
  tools: [searchPagesTool],
  handoffDescription: 'Search and retrieve Confluence pages and documentation'
});

export const confluenceSpecialistScenario = [confluenceSpecialistAgent];