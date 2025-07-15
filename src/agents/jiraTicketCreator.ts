/**
 * Jira Ticket Creator Agent - Conversational Ticket Creation
 * Guides users through creating comprehensive tickets with all required PM fields
 */

import { RealtimeAgent, tool } from '@openai/agents/realtime';
import { getAgentVoiceConfig, generateStyleInstructions } from '../config/voices';

// Conversation state for ticket creation
interface TicketCreationState {
  ticketType?: 'Story' | 'Task' | 'Bug';
  summary?: string;
  businessValue?: string;
  context?: string;
  userStoryOrGoal?: string;
  inputs?: string;
  outputs?: string;
  acceptanceCriteria?: string[];
  pmDataPoints?: string;
  currentStep: number;
  isComplete: boolean;
  projectKey?: string;
  priority?: string;
}

// Global state management (in a real app, this would be in a proper state management system)
const activeCreationSessions = new Map<string, TicketCreationState>();

// Helper function to get or create session
function getCreationSession(sessionId: string = 'default'): TicketCreationState {
  if (!activeCreationSessions.has(sessionId)) {
    activeCreationSessions.set(sessionId, {
      currentStep: 0,
      isComplete: false,
      acceptanceCriteria: []
    });
  }
  return activeCreationSessions.get(sessionId)!;
}

// Helper function to get step name
function getStepName(step: number): string {
  const steps = [
    'ticketType', 'summary', 'businessValue', 'context', 
    'userStoryOrGoal', 'inputs', 'outputs', 'acceptanceCriteria', 'pmDataPoints'
  ];
  return steps[step] || 'complete';
}

// Start ticket creation tool
const startTicketCreationTool = tool({
  name: 'startTicketCreation',
  description: 'Begin the guided ticket creation process',
  parameters: {
    type: 'object',
    properties: {
      sessionId: {
        type: 'string',
        description: 'Session identifier for this creation process',
        default: 'default'
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { sessionId = 'default' } = input;
    
    // Initialize new session
    activeCreationSessions.set(sessionId, {
      currentStep: 0,
      isComplete: false,
      acceptanceCriteria: []
    });
    
    return {
      success: true,
      message: "I'll help you create a comprehensive Jira ticket. First, what type of ticket is this - a Story, Task, or Bug?",
      nextStep: 'ticketType',
      sessionId
    };
  }
});

// Collect ticket information step by step
const collectTicketInfoTool = tool({
  name: 'collectTicketInfo',
  description: 'Collect information for a specific ticket field',
  parameters: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        enum: ['ticketType', 'summary', 'businessValue', 'context', 'userStoryOrGoal', 'inputs', 'outputs', 'acceptanceCriteria', 'pmDataPoints'],
        description: 'The field to collect information for'
      },
      value: {
        type: 'string',
        description: 'The user-provided value for this field'
      },
      sessionId: {
        type: 'string',
        description: 'Session identifier',
        default: 'default'
      }
    },
    required: ['field', 'value'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { field, value, sessionId = 'default' } = input;
    const session = getCreationSession(sessionId);
    
    // Store the field value
    if (field === 'ticketType') {
      const normalizedType = value.toLowerCase();
      if (normalizedType.includes('story')) session.ticketType = 'Story';
      else if (normalizedType.includes('task')) session.ticketType = 'Task';
      else if (normalizedType.includes('bug')) session.ticketType = 'Bug';
      else session.ticketType = 'Story'; // Default
    } else if (field === 'acceptanceCriteria') {
      // Handle acceptance criteria as array
      if (!session.acceptanceCriteria) session.acceptanceCriteria = [];
      session.acceptanceCriteria.push(value);
    } else {
      (session as any)[field] = value;
    }
    
    // Move to next step
    session.currentStep++;
    
    // Determine next question based on ticket type and current step
    let nextMessage = '';
    let isComplete = false;
    
    switch (session.currentStep) {
      case 1: // After ticket type, ask for summary
        nextMessage = `Great! Now, what's a brief but descriptive summary of this ${session.ticketType?.toLowerCase()}?`;
        break;
      case 2: // After summary, ask for business value
        nextMessage = `Perfect. What's the business value? How does this ${session.ticketType?.toLowerCase()} help the company or users?`;
        break;
      case 3: // After business value, ask for context
        nextMessage = `Excellent. Can you provide context about the current situation and why this is needed now?`;
        break;
      case 4: // After context, ask for user story/goal
        if (session.ticketType === 'Story') {
          nextMessage = `Now let's define the user story. Can you describe this as: "As a [user type], I want [functionality] so that [benefit]"?`;
        } else if (session.ticketType === 'Task') {
          nextMessage = `What's the specific objective or goal of this task?`;
        } else { // Bug
          nextMessage = `Please describe the problem - what's not working as expected?`;
        }
        break;
      case 5: // After user story/goal, ask for inputs
        nextMessage = `What inputs, data, or resources will this ${session.ticketType?.toLowerCase()} need to work with?`;
        break;
      case 6: // After inputs, ask for outputs
        nextMessage = `What should this ${session.ticketType?.toLowerCase()} produce or output when it's done?`;
        break;
      case 7: // After outputs, ask for acceptance criteria
        nextMessage = `What are the specific acceptance criteria? How will we know this is done correctly? (You can provide multiple criteria)`;
        break;
      case 8: // After acceptance criteria, ask for PM data points
        nextMessage = `Finally, what data points or metrics should the PM review to validate success?`;
        break;
      default:
        isComplete = true;
        nextMessage = `Great! I have all the information needed. Let me show you a preview of the ticket before creating it.`;
    }
    
    session.isComplete = isComplete;
    
    return {
      success: true,
      message: nextMessage,
      currentStep: session.currentStep,
      nextStep: getStepName(session.currentStep),
      isComplete,
      sessionId
    };
  }
});

// Add more acceptance criteria
const addAcceptanceCriteriaTool = tool({
  name: 'addAcceptanceCriteria',
  description: 'Add additional acceptance criteria to the current ticket',
  parameters: {
    type: 'object',
    properties: {
      criteria: {
        type: 'string',
        description: 'Additional acceptance criteria'
      },
      sessionId: {
        type: 'string',
        description: 'Session identifier',
        default: 'default'
      }
    },
    required: ['criteria'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { criteria, sessionId = 'default' } = input;
    const session = getCreationSession(sessionId);
    
    if (!session.acceptanceCriteria) session.acceptanceCriteria = [];
    session.acceptanceCriteria.push(criteria);
    
    return {
      success: true,
      message: `Added acceptance criteria. Would you like to add more criteria, or shall I show you the ticket preview?`,
      totalCriteria: session.acceptanceCriteria.length
    };
  }
});

// Preview ticket before creation
const previewTicketTool = tool({
  name: 'previewTicket',
  description: 'Show a preview of the ticket before creating it',
  parameters: {
    type: 'object',
    properties: {
      sessionId: {
        type: 'string',
        description: 'Session identifier',
        default: 'default'
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { sessionId = 'default' } = input;
    const session = getCreationSession(sessionId);
    
    // Format the description with all sections
    const description = `
## Business Value
${session.businessValue || 'Not specified'}

## Context
${session.context || 'Not specified'}

## ${session.ticketType === 'Story' ? 'User Story' : session.ticketType === 'Task' ? 'Task Goal' : 'Problem Description'}
${session.userStoryOrGoal || 'Not specified'}

## Inputs
${session.inputs || 'Not specified'}

## Outputs
${session.outputs || 'Not specified'}

## Acceptance Criteria
${session.acceptanceCriteria && session.acceptanceCriteria.length > 0 
  ? session.acceptanceCriteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')
  : 'Not specified'
}

## PM Data Points Review
${session.pmDataPoints || 'Not specified'}
    `.trim();
    
    const preview = {
      summary: session.summary || 'Untitled',
      ticketType: session.ticketType || 'Story',
      description,
      projectKey: session.projectKey || 'DE',
      priority: session.priority || 'Medium'
    };
    
    return {
      success: true,
      preview,
      message: `Here's your ticket preview. Does this look correct? Say "create it" to proceed or "modify [field]" to make changes.`
    };
  }
});

// Create the final ticket
const createTicketTool = tool({
  name: 'createTicket',
  description: 'Create the Jira ticket with collected information',
  parameters: {
    type: 'object',
    properties: {
      sessionId: {
        type: 'string',
        description: 'Session identifier',
        default: 'default'
      },
      projectKey: {
        type: 'string',
        description: 'Project key for the ticket',
        default: 'DE'
      },
      priority: {
        type: 'string',
        description: 'Priority level',
        default: 'Medium'
      }
    },
    required: [],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { sessionId = 'default', projectKey = 'DE', priority = 'Medium' } = input;
    const session = getCreationSession(sessionId);
    
    if (!session.summary || !session.businessValue) {
      return {
        success: false,
        error: 'Missing required fields. Please complete the ticket creation process first.'
      };
    }
    
    // Format the complete description
    const description = `
## Business Value
${session.businessValue}

## Context
${session.context || 'Not specified'}

## ${session.ticketType === 'Story' ? 'User Story' : session.ticketType === 'Task' ? 'Task Goal' : 'Problem Description'}
${session.userStoryOrGoal || 'Not specified'}

## Inputs
${session.inputs || 'Not specified'}

## Outputs
${session.outputs || 'Not specified'}

## Acceptance Criteria
${session.acceptanceCriteria && session.acceptanceCriteria.length > 0 
  ? session.acceptanceCriteria.map((criteria, index) => `${index + 1}. ${criteria}`).join('\n')
  : 'Not specified'
}

## PM Data Points Review
${session.pmDataPoints || 'Not specified'}
    `.trim();
    
    try {
      // Create ticket via existing API
      const response = await fetch('/api/jira/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: session.summary,
          description,
          projectKey,
          issueType: session.ticketType || 'Story',
          priority
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      // Clean up session
      activeCreationSessions.delete(sessionId);
      
      return {
        success: true,
        ticket: result.ticket,
        message: `✅ Ticket ${result.ticket.key} created successfully! Would you like to add it to a sprint or notify the team?`
      };
      
    } catch (error) {
      console.error('❌ Failed to create ticket:', error);
      return {
        success: false,
        error: `Failed to create ticket: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

// Modify existing field
const modifyFieldTool = tool({
  name: 'modifyField',
  description: 'Modify a previously collected field value',
  parameters: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        enum: ['ticketType', 'summary', 'businessValue', 'context', 'userStoryOrGoal', 'inputs', 'outputs', 'acceptanceCriteria', 'pmDataPoints'],
        description: 'The field to modify'
      },
      newValue: {
        type: 'string',
        description: 'The new value for this field'
      },
      sessionId: {
        type: 'string',
        description: 'Session identifier',
        default: 'default'
      }
    },
    required: ['field', 'newValue'],
    additionalProperties: false
  },
  execute: async (input: any) => {
    const { field, newValue, sessionId = 'default' } = input;
    const session = getCreationSession(sessionId);
    
    // Update the field
    if (field === 'acceptanceCriteria') {
      session.acceptanceCriteria = [newValue]; // Replace all criteria
    } else {
      (session as any)[field] = newValue;
    }
    
    return {
      success: true,
      message: `Updated ${field}. Would you like to preview the ticket again or create it?`
    };
  }
});

const voiceConfig = getAgentVoiceConfig('jiraTicketCreator');

export const jiraTicketCreatorAgent = new RealtimeAgent({
  name: 'jiraTicketCreator',
  voice: voiceConfig.voice,
  instructions: `You are Antoine's specialized Jira ticket creation assistant. You guide users through creating comprehensive, well-structured tickets with all required PM fields.

${generateStyleInstructions('jiraTicketCreator')}

# Your Specialty: Guided Ticket Creation

You excel at helping users create high-quality Jira tickets through natural conversation. You collect all required information systematically while keeping the process conversational and engaging.

## Required Ticket Fields (You MUST collect all of these):

1. **Ticket Type**: Story, Task, or Bug
2. **Summary**: Clear, actionable title
3. **Business Value**: Why this matters to the business
4. **Context**: Background and current situation
5. **User Story/Goal**: 
   - Stories: "As a [user], I want [feature] so that [benefit]"
   - Tasks: Specific objective to accomplish
   - Bugs: Problem description
6. **Inputs**: Required data, resources, or dependencies
7. **Outputs**: Expected deliverables or results
8. **Acceptance Criteria**: Specific testable conditions (can be multiple)
9. **PM Data Points Review**: Metrics/data for PM validation

## Conversation Approach:

- **Be Conversational**: Ask questions naturally, not like a form
- **Guide Quality**: Help users write better requirements
- **Provide Examples**: Offer templates and examples when helpful
- **Validate Completeness**: Ensure all fields are properly filled
- **Allow Iteration**: Let users modify previous responses
- **Only ask one question at a time**: Keep it focused and manageable

## Your Tools:

- **startTicketCreation**: Begin the guided process
- **collectTicketInfo**: Gather information for each field step-by-step
- **addAcceptanceCriteria**: Add multiple acceptance criteria
- **previewTicket**: Show complete ticket before creation
- **createTicket**: Create the final Jira ticket
- **modifyField**: Allow users to change previous responses

## Process Flow:

1. Start with ticket type identification
2. Collect summary and business value
3. Gather context and user story/goal
4. Define inputs and outputs
5. Develop acceptance criteria (can be multiple)
6. Specify PM data points
7. Preview complete ticket
8. Create and confirm success

## Quality Guidelines:

- **Business Value**: Must clearly explain business impact
- **Acceptance Criteria**: Should be specific and testable
- **User Stories**: Follow proper format for stories
- **Context**: Should provide enough background for any team member
- **Inputs/Outputs**: Be specific about data and deliverables

## Response Style:

- Keep responses conversational and encouraging
- Ask follow-up questions for incomplete responses
- Provide examples when users seem stuck
- Validate and suggest improvements
- Celebrate completion and offer next steps

Remember: You're not just collecting information - you're helping users think through and improve their requirements. Guide them to create tickets that will be clear, actionable, and valuable for the entire team.`,
  handoffs: [],
  tools: [
    startTicketCreationTool,
    collectTicketInfoTool, 
    addAcceptanceCriteriaTool,
    previewTicketTool,
    createTicketTool,
    modifyFieldTool
  ],
  handoffDescription: 'Specialized agent for guided Jira ticket creation with comprehensive PM requirements',
});

export const jiraTicketCreatorScenario = [jiraTicketCreatorAgent];