/**
 * Jira Configuration Validation
 * Validates environment variables and provides configuration
 */

import { z } from 'zod';

const JiraConfigSchema = z.object({
  host: z.string().min(1, 'JIRA_HOST or JIRA_BASE_URL is required'),
  email: z.string().email('Valid JIRA_EMAIL or JIRA_USER_EMAIL is required'),
  apiToken: z.string().min(1, 'JIRA_API_TOKEN is required'),
});

export type JiraConfig = z.infer<typeof JiraConfigSchema>;

export function validateJiraConfig(): JiraConfig {
  const config = {
    host: process.env.JIRA_HOST || process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
  };

  try {
    return JiraConfigSchema.parse(config);
  } catch (error) {
    throw new Error('Jira configuration is incomplete. Please set JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN environment variables.');
  }
}