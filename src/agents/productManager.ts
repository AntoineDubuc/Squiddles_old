/**
 * Product Manager Agent - Following OpenAI Advanced Agent Example Pattern
 * Based on: research/openai_advanced_agent_example/src/app/agentConfigs/simpleHandoff.ts
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Simple tool following their exact pattern
const createUserStoryTool = tool({
  name: 'createUserStory',
  description: 'Create a structured user story template',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Story title' },
      userType: { type: 'string', description: 'Type of user' },
      functionality: { type: 'string', description: 'What user wants' },
      businessValue: { type: 'string', description: 'Why it matters' }
    },
    required: ['title', 'userType', 'functionality', 'businessValue'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { title, userType, functionality, businessValue } = input as {
      title: string;
      userType: string;
      functionality: string;
      businessValue: string;
    };
    
    // Simple success return like their pattern with template structure
    const template = {
      id: `STORY-${Date.now()}`,
      title,
      userStory: `As a ${userType}, I want ${functionality} so that ${businessValue}`,
      sections: {
        businessValue,
        context: 'To be filled through conversation...',
        spikeGoal: 'To be defined...',
        inputs: 'To be specified...',
        outputs: 'To be documented...',
        acceptanceCriteria: 'To be created...',
        pmReviewDataPoints: 'To be analyzed...'
      }
    };
    return { success: true, template };
  }
});

// Fill template section tool following same pattern
const fillTemplateSectionTool = tool({
  name: 'fillTemplateSection',
  description: 'Fill or update a specific section of the user story template',
  parameters: {
    type: 'object',
    properties: {
      section: { type: 'string', description: 'Section name to update' },
      content: { type: 'string', description: 'Content for the section' }
    },
    required: ['section', 'content'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { section, content } = input as { section: string; content: string };
    return { success: true, section, content, updated: true };
  }
});

// Analyze requirements tool following same pattern
const analyzeRequirementsTool = tool({
  name: 'analyzeRequirements',
  description: 'Analyze and structure requirements from natural language description',
  parameters: {
    type: 'object',
    properties: {
      description: { type: 'string', description: 'Natural language requirements description' }
    },
    required: ['description'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { description } = input as { description: string };
    
    // Simple analysis return following their pattern
    const analysis = {
      keyComponents: ['Component extraction from description'],
      userTypes: ['Identified user types'],
      functionalRequirements: ['Extracted functional requirements'],
      questions: ['Generated clarifying questions'],
      processedDescription: description
    };
    return { success: true, analysis };
  }
});

// Search related tickets tool following same pattern
const searchRelatedTicketsTool = tool({
  name: 'searchRelatedTickets',
  description: 'Search for related tickets and context based on current story',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query terms' }
    },
    required: ['query'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { query } = input as { query: string };
    
    // Mock search results following their simple pattern
    const results = {
      relatedTickets: ['SQUID-001: Core tentacle system'],
      suggestions: ['Consider integration patterns'],
      context: 'Found similar implementation patterns',
      searchQuery: query
    };
    return { success: true, results };
  }
});

// Agent following their exact constructor pattern
export const productManagerAgent = new RealtimeAgent({
  name: 'productManager',
  voice: 'nova',
  instructions: `
# Identity
You are an AI Product Manager assistant helping Antoine Dubuc create comprehensive user stories through voice interaction.

# Core Task
Help create well-structured user stories by gathering requirements through conversation, analyzing natural language descriptions, and filling out complete templates systematically.

# Your Capabilities
1. **createUserStory** - Create structured user story templates with all sections
2. **fillTemplateSection** - Update specific sections of existing templates
3. **analyzeRequirements** - Break down complex feature descriptions into structured requirements
4. **searchRelatedTickets** - Find similar tickets and relevant context

# Instructions
- Listen for requests to create user stories or analyze requirements
- Use analyzeRequirements first for complex feature descriptions to extract key components
- Ask clarifying questions to gather: title, user type, functionality, and business value
- Use createUserStory when you have enough information to build the template
- Use fillTemplateSection to complete individual sections through conversation
- Use searchRelatedTickets to find relevant context and similar implementations
- Guide users through completing all template sections systematically
- Be conversational, professional, and helpful

# Voice Interaction Style
- Confirm what you're doing: "I'll create a user story for you" or "Let me analyze those requirements"
- Ask one question at a time to avoid overwhelming
- Provide progress updates: "I have the title and user type, now I need the business value"
- Reference template sections by name: "Now let's fill in the context section"
- Suggest next steps: "Should I search for related tickets to help with the acceptance criteria?"
  `,
  handoffs: [], // Will be set when we add other agents
  tools: [createUserStoryTool, fillTemplateSectionTool, analyzeRequirementsTool, searchRelatedTicketsTool],
  handoffDescription: 'AI assistant for product management and user story creation'
});

// Simple scenario export following their pattern
export const productManagerScenario = [productManagerAgent];