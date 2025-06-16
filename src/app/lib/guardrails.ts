// src/app/lib/guardrails.ts
import { GuardrailOutput, GuardrailOutputZod } from '../types';
import { z } from 'zod';

// Exact guardrail implementation from working code
export async function runGuardrailClassifier(message: string): Promise<GuardrailOutput> {
  const messages = [
    {
      role: 'user' as const,
      content: `You are an expert at classifying text according to moderation policies. Your job is to classify messages as one of the following output classes:

<output_classes>
- OFFENSIVE: Content that includes hate speech, discriminatory language, harassment, bullying, threats, or other content that could be harmful to individuals or groups based on identity.
- OFF_BRAND: Content that discusses competitors in a disparaging way, makes unauthorized claims about company capabilities, or otherwise misrepresents the brand.
- VIOLENCE: Content that includes explicit threats of violence, detailed descriptions of violent acts, or content that promotes or glorifies violence.
- NONE: If no other classes are appropriate and the message is fine.
</output_classes>

Additionally, for any content you flag as problematic, provide a brief rationale explaining why it falls into that category.

<message>
${message}
</message>

Please analyze this message and provide your classification and rationale.`
    }
  ];

  try {
    const response = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: messages,
        text: { format: zodTextFormat(GuardrailOutputZod, 'output_format') }
      }),
    });

    if (!response.ok) {
      throw new Error(`Guardrail API failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the structured response from OpenAI
    let parsedContent;
    try {
      parsedContent = JSON.parse(data.content || '{}');
    } catch (parseError) {
      console.error('Failed to parse guardrail response content:', data.content);
      throw new Error('Invalid JSON response from guardrails API');
    }
    
    return GuardrailOutputZod.parse(parsedContent);
  } catch (error) {
    console.error('Guardrail classification failed:', error);
    // Fail open - return NONE if classification fails
    return {
      moderationRationale: 'Classification failed, allowing content',
      moderationCategory: 'NONE'
    };
  }
}

// Helper function to format Zod schema for OpenAI
function zodTextFormat(schema: z.ZodSchema, name: string) {
  return {
    type: 'json_schema',
    json_schema: {
      name,
      schema: zodToJsonSchema(schema),
      strict: true,
    },
  };
}

// Simple Zod to JSON Schema converter (basic implementation)
function zodToJsonSchema(schema: z.ZodSchema): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: any = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodToJsonSchema(value as z.ZodSchema);
      if (!(value as any).isOptional()) {
        required.push(key);
      }
    }

    return {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    };
  }

  if (schema instanceof z.ZodString) {
    return { type: 'string' };
  }

  if (schema instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: schema.options,
    };
  }

  // Add more type conversions as needed
  return { type: 'string' };
}

// Moderation guardrail for RealtimeSession
export const moderationGuardrail = {
  name: 'moderation_guardrail',
  async execute({ agentOutput }: { agentOutput: string }) {
    try {
      const res = await runGuardrailClassifier(agentOutput);
      return {
        tripwireTriggered: res.moderationCategory !== 'NONE',
        outputInfo: res,
      };
    } catch (err) {
      console.error('Guardrail failed:', err);
      return {
        tripwireTriggered: false,
        outputInfo: { error: 'guardrail_failed' },
      };
    }
  },
};