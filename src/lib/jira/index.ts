/**
 * Jira Integration - Main Export
 * Provides a production-ready Jira client with ExtendTV integration
 */

import { JiraClient, getJiraClient } from './jiraClient';

// Export the main client
export const jiraClient = getJiraClient();

// Export types and utilities
export * from './jiraClient';
export * from './config';