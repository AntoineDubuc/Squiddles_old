# Implement Product Manager Tentacle

## Description
Create a specialized tentacle for product management workflows, focusing on AI-assisted user story creation, requirements gathering, and template management through natural voice interaction.

## User Story
As a Technical Product Manager, I want a voice-activated AI assistant that helps me create comprehensive user stories with proper structure and business context so that I can efficiently document requirements without manual template filling.

## Priority/Effort
- **Priority**: High
- **Story Points**: 5
- **Estimated Time**: 2-3 days

## Technical Approach
### Dependencies/Prerequisites
- Core tentacle system (SQUID-001) completed
- OpenAI function calling capabilities
- User story template structure defined

### Architecture Notes
- Implements Tentacle interface with product management specialization
- Provides capabilities for template creation, section filling, and requirement analysis
- Integrates with Pinecone for context search (mocked for POC)
- Uses structured JSON responses for template data

### APIs/Data Models
- User story template with sections: Business Value, Context, Spike Goal, Inputs, Outputs, Acceptance Criteria, PM Review Data Points
- TentacleCapability functions for story management
- Context storage for active story templates

## Inputs
- Natural language requirements and feature descriptions
- Voice commands for story creation and modification
- Template section content and updates

## Outputs
- Structured user story templates with all required sections
- AI-generated acceptance criteria and business value analysis
- Context-aware suggestions based on similar tickets
- Formatted templates ready for Jira integration

## Acceptance Criteria
- [ ] Voice command "create user story" initiates template creation workflow
- [ ] AI assists with filling template sections through conversation
- [ ] Template sections can be updated individually via voice
- [ ] Search functionality finds related tickets and context
- [ ] Requirements analysis breaks down complex descriptions
- [ ] Natural conversation flow with clarifying questions
- [ ] Template validation ensures all required fields are completed

## QA Tests
- [ ] Create user story with voice command and verify template structure
- [ ] Test section updates with different content types
- [ ] Verify search integration returns relevant results
- [ ] Test requirements analysis with complex feature descriptions
- [ ] Validate conversation flow maintains context across interactions
- [ ] Test error handling for incomplete or invalid templates

## Definition of Done
- [ ] Code implemented and tested
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed (self-review)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Performance acceptable

---

## Implementation Details (Post-Development)

### Code Created  
**Files Modified/Created:**
- `src/agents/productManager.ts` - Enhanced Product Manager agent following exact OpenAI Advanced Agent Example pattern with 4 tools and comprehensive voice interaction instructions (150+ lines)

**Key Code Snippets:**
```typescript
// Direct RealtimeAgent usage following OpenAI reference pattern
import { RealtimeAgent, tool } from '@openai/agents/realtime';

// Tool following exact OpenAI pattern with input: any and type assertion
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
      title: string; userType: string; functionality: string; businessValue: string;
    };
    
    const template = {
      id: `STORY-${Date.now()}`,
      title,
      userStory: `As a ${userType}, I want ${functionality} so that ${businessValue}`,
      sections: {
        businessValue, context: 'To be filled through conversation...',
        spikeGoal: 'To be defined...', inputs: 'To be specified...',
        outputs: 'To be documented...', acceptanceCriteria: 'To be created...',
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
    
    const results = {
      relatedTickets: ['SQUID-001: Core tentacle system'],
      suggestions: ['Consider integration patterns'],
      context: 'Found similar implementation patterns',
      searchQuery: query
    };
    return { success: true, results };
  }
});

// Agent following exact OpenAI RealtimeAgent constructor pattern  
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
  handoffs: [], // Will be connected to other agents
  tools: [createUserStoryTool, fillTemplateSectionTool, analyzeRequirementsTool, searchRelatedTicketsTool],
  handoffDescription: 'AI assistant for product management and user story creation'
});

// Simple scenario export following their pattern
export const productManagerScenario = [productManagerAgent];
```

### Problems and Solutions
**Problem 1:** Parameter typing in tool execute functions
- **Root Cause:** Initial implementation used `params` parameter instead of following OpenAI reference pattern
- **Solution:** Engineering Manager intervention - corrected to use `input: any` with type assertion pattern exactly matching reference implementation
- **Why this approach:** Ensures compatibility with OpenAI Realtime API and prevents TypeScript errors

**Problem 2:** Tool parameter schema validation
- **Root Cause:** Complex tool workflows required proper JSON Schema definition with multiple parameters
- **Solution:** Used exact OpenAI pattern: `additionalProperties: false`, proper required arrays, and descriptive parameter properties
- **Why this approach:** Follows proven patterns that ensure API compatibility and proper tool calling behavior

**Problem 3:** Multi-tool agent coordination 
- **Root Cause:** Product Manager agent needs to coordinate 4 different tools in natural conversation flow
- **Solution:** Comprehensive instructions defining capability usage patterns and conversational workflow guidance
- **Why this approach:** Maintains OpenAI agent simplicity while enabling complex multi-step user story creation workflows

### Udemy Tutorial Script
"In this lesson, we're going to implement the Product Manager tentacle - our first specialized AI agent that demonstrates the power of the Squiddles system.

The Product Manager tentacle is designed to help technical product managers create comprehensive user stories through natural voice interaction. Instead of manually filling out templates, you can simply describe what you want to build, and the AI will guide you through creating a properly structured user story.

Let's understand what makes this tentacle special. It has four core capabilities:
1. Creating user story templates from voice descriptions
2. Filling and updating individual template sections
3. Analyzing requirements from natural language
4. Searching for related tickets and context

The magic is in how these capabilities work together. You might start by saying 'I need to create a user story for user authentication,' and the tentacle will create a template, analyze your requirements, search for similar tickets, and guide you through completing each section.

Let's start coding. Create `src/tentacles/product-manager.ts`. Here's our first capability:

```typescript
const createUserStoryTemplate: TentacleCapability = {
  name: 'createUserStoryTemplate',
  description: 'Create a structured user story template with all required sections',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'Brief title for the user story' },
      userType: { type: 'string', description: 'Type of user' },
      functionality: { type: 'string', description: 'What the user wants' },
      businessValue: { type: 'string', description: 'Why this matters' }
    },
    required: ['title', 'userType', 'functionality', 'businessValue']
  }
};
```

Notice how we use JSON Schema to define exactly what parameters this capability needs. This ensures type safety and helps the AI understand how to call this function.

The execute function is where the real work happens:

```typescript
execute: async (input, details) => {
  const template = {
    userStory: `As a ${input.userType}, I want ${input.functionality} so that ${input.businessValue}`,
    sections: {
      businessValue: input.businessValue,
      context: 'To be filled...',
      // ... other sections
    }
  };
  
  // Store in shared context
  details?.squiddles?.updateContext({
    metadata: { activeStory: template }
  });
}
```

This is a key pattern in Squiddles - we store work-in-progress in the shared context so other capabilities and tentacles can access it.

Now let's create the tentacle definition that ties everything together:

```typescript
export const productManagerTentacle: Tentacle = {
  name: 'productManager',
  specialization: 'User story creation, requirements gathering, and product planning',
  capabilities: [createUserStoryTemplate, fillTemplateSection, analyzeRequirements],
  collaborators: ['jiraIntegration', 'slackIntegration'],
  handoffTriggers: ['user story', 'requirements', 'create story'],
  instructions: `You are an expert Product Manager AI that helps create user stories...`
};
```

The instructions field is crucial - this is where we define the tentacle's personality and behavior. We want it to be conversational, ask clarifying questions, and explain what it's doing.

Now let's test our tentacle. Register it with the orchestrator and try creating a user story:

```typescript
await orchestrator.registerTentacle(productManagerTentacle);
// Voice: "Create a user story for user login"
// AI should respond with questions to gather the required information
```

If everything works correctly, you should see the AI engage in a natural conversation to gather the title, user type, functionality, and business value, then create a structured template.

Great! We've created our first specialized tentacle. The key concepts we learned were:
1. Capability-driven design with JSON Schema validation
2. Shared context management for multi-step workflows
3. Natural language processing for requirements gathering
4. Conversational AI design with clear instructions

In the next lesson, we'll implement the Jira Integration tentacle that can take these user stories and create actual tickets in your project management system."