/**
 * Confluence Integration Agent - Voice-enabled Confluence operations
 * Handles page creation, search, and documentation management
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool for searching Confluence pages
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
  execute: async (input: any, details?: any) => {
    const { query, spaceKey, limit = 25 } = input as { 
      query?: string; 
      spaceKey?: string; 
      limit?: number; 
    };

    try {
      console.log('🔍 Confluence search requested:', { query, spaceKey, limit });

      // Build search parameters
      const searchParams = new URLSearchParams();
      if (query) searchParams.append('query', query);
      if (spaceKey) searchParams.append('spaceKey', spaceKey);
      if (limit) searchParams.append('limit', limit.toString());

      // Search pages via API
      const response = await fetch(`/api/confluence/pages?${searchParams.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      // Format a user-friendly response with structured data
      const messageText = query 
        ? `Found ${result.pages.length} pages matching "${query}"${spaceKey ? ` in space ${spaceKey}` : ''}`
        : `Found ${result.pages.length} recent pages${spaceKey ? ` in space ${spaceKey}` : ''}`;
      
      return {
        success: true,
        message: messageText,
        pages: result.pages,
        // Include both human message and structured data for the UI
        displayText: `${messageText}\n\nPages found:\n${result.pages.map((p: any) => `• ${p.title} (${p.spaceName || p.spaceKey})`).join('\n')}`
      };

    } catch (error) {
      console.error('❌ Failed to search pages:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to search pages: ${errorMessage}`
      };
    }
  }
});

// Tool for creating Confluence pages
const createPageTool = tool({
  name: 'createPage',
  description: 'Create a new Confluence page in a specified space',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the page'
      },
      content: {
        type: 'string',
        description: 'The content/body of the page'
      },
      spaceKey: {
        type: 'string',
        description: 'The Confluence space key where the page should be created'
      },
      parentId: {
        type: 'string',
        description: 'Optional parent page ID to create this page as a child (optional)'
      },
      type: {
        type: 'string',
        enum: ['page', 'blogpost'],
        description: 'Type of content to create (default: page)',
        default: 'page'
      }
    },
    required: ['title', 'content', 'spaceKey'],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { title, content, spaceKey, parentId, type = 'page' } = input as {
      title: string;
      content: string;
      spaceKey: string;
      parentId?: string;
      type?: 'page' | 'blogpost';
    };

    try {
      console.log('📄 Confluence page creation requested:', {
        title,
        spaceKey,
        contentLength: content.length,
        type,
        hasParent: !!parentId
      });

      // Create page via API
      const response = await fetch('/api/confluence/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          spaceKey,
          parentId,
          type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        page: result.page,
        message: `Page "${title}" created successfully in space ${spaceKey}`
      };

    } catch (error) {
      console.error('❌ Failed to create page:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to create page: ${errorMessage}`
      };
    }
  }
});

// Tool for getting available spaces
const getSpacesTool = tool({
  name: 'getSpaces',
  description: 'Get list of available Confluence spaces',
  parameters: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of spaces to return (default: 50)',
        default: 50
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    const { limit = 50 } = input as { limit?: number };

    try {
      console.log('🏢 Confluence spaces requested:', { limit });

      // Get spaces via API
      const response = await fetch(`/api/confluence/spaces?limit=${limit}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        spaces: result.spaces,
        message: `Found ${result.spaces.length} accessible spaces`
      };

    } catch (error) {
      console.error('❌ Failed to get spaces:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return {
        success: false,
        error: `Failed to get spaces: ${errorMessage}`
      };
    }
  }
});

// Tool for checking Confluence status
const checkConfluenceStatusTool = tool({
  name: 'checkConfluenceStatus',
  description: 'Check if Confluence integration is working properly',
  parameters: {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async (input: any, details?: any) => {
    try {
      const response = await fetch('/api/confluence/spaces', {
        method: 'POST', // POST endpoint is health check
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      return {
        success: true,
        status: result.status,
        authenticated: result.authenticated,
        user: result.user,
        spacesAccessible: result.spacesAccessible,
        message: `Confluence integration is ${result.status}. Authenticated as ${result.user} with access to ${result.spacesAccessible} spaces.`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Confluence integration is not working properly. Please check your configuration.'
      };
    }
  }
});

export const confluenceIntegrationAgent = new RealtimeAgent({
  name: 'confluenceIntegration',
  voice: 'sage',
  instructions: `You are Antoine's Confluence documentation assistant. You help manage knowledge base, create documentation, and organize information in Confluence.

# Priority Actions - You Handle These IMMEDIATELY:
- ANY mention of "documentation", "docs", "knowledge base", "wiki", "confluence"
- "Create a page", "Write documentation", "Document this"
- "Search for pages", "Find documentation", "Look up info", "search confluence"
- "What spaces do we have?", "Show me spaces"
- Confluence status checks and diagnostics
- ALWAYS respond to search requests related to documentation or knowledge

# Your Tools:
- **createPage**: Create new Confluence pages with structured content
- **searchPages**: Search existing pages or get recent updates
- **getSpaces**: List available Confluence spaces
- **checkConfluenceStatus**: Verify Confluence integration is working

# Command Recognition - RESPOND IMMEDIATELY TO:
When users say ANY variation of:
- "Create documentation for [topic]" → Use createPage with structured content
- "Document [feature/process]" → Create comprehensive page with sections
- "Search for [topic]" → Use searchPages to find relevant documentation
- "Find pages about [topic]" → Use searchPages with query
- "Search confluence for [topic]" → Use searchPages with query
- "Look up [topic] in docs" → Use searchPages with query
- "What spaces are available?" → Use getSpaces
- "Show recent pages" → Use searchPages without query

# Documentation Best Practices:
- Create well-structured pages with clear headings
- Include context, purpose, and actionable information
- Use appropriate space for the content type
- Link related pages and concepts
- Make content searchable and discoverable

# Response Formatting - CRITICAL:
When using searchPages tool:
1. NEVER show raw JSON or tool output to the user
2. Always provide a human-friendly summary first
3. Format results as a readable list
4. Example: "I found 3 pages matching 'API documentation':
   • API Authentication Guide (created by John Doe on Jan 15, 2024)
   • REST API Documentation (created by Jane Smith on Feb 3, 2024)
   • GraphQL API Reference (created by Bob Wilson on Mar 10, 2024)"
5. DO NOT include raw tool output, JSON data, or technical details
6. Focus on page titles, authors, dates, and spaces in a conversational format

# Context Awareness:
- Always ask which space to use if not specified
- Suggest logical page hierarchies (parent pages)
- Provide clear, actionable documentation
- Reference existing pages when relevant
- Format all responses in natural language, not technical output

You take priority over other agents for ANY documentation or Confluence actions.`,
  handoffs: [],
  tools: [createPageTool, searchPagesTool, getSpacesTool, checkConfluenceStatusTool],
  handoffDescription: 'Confluence integration agent for documentation and knowledge management',
});

export const confluenceIntegrationScenario = [confluenceIntegrationAgent];