#!/usr/bin/env node

/**
 * Extended Jira Client with Comment Writing Support
 * 
 * This extends the existing JiraClient to add methods for creating,
 * updating, and deleting comments.
 */

const { getJiraClient } = require('../../../development-archive/integrations/jira/jiraClient');
const { ADFBuilder } = require('./adf-builder');

/**
 * Extend the JiraClient prototype with comment writing methods
 */
function extendJiraClient() {
  const JiraClient = getJiraClient().constructor;
  
  /**
   * Add a comment to an issue
   * @param {string} issueKeyOrId - The issue key (e.g., 'DE-3417') or ID
   * @param {Object} commentBody - The ADF body object or plain text string
   * @returns {Promise<Object>} The created comment
   */
  JiraClient.prototype.addComment = async function(issueKeyOrId, commentBody) {
    // Handle plain text input
    if (typeof commentBody === 'string') {
      commentBody = new ADFBuilder()
        .paragraph(p => p.text(commentBody))
        .build()
        .body;
    }
    
    const endpoint = `${this.baseUrl}/issue/${issueKeyOrId}/comment`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ body: commentBody })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to add comment: ${error}`);
    }
    
    return response.json();
  };
  
  /**
   * Update an existing comment
   * @param {string} issueKeyOrId - The issue key or ID
   * @param {string} commentId - The comment ID
   * @param {Object} commentBody - The new ADF body object
   * @returns {Promise<Object>} The updated comment
   */
  JiraClient.prototype.updateComment = async function(issueKeyOrId, commentId, commentBody) {
    // Handle plain text input
    if (typeof commentBody === 'string') {
      commentBody = new ADFBuilder()
        .paragraph(p => p.text(commentBody))
        .build()
        .body;
    }
    
    const endpoint = `${this.baseUrl}/issue/${issueKeyOrId}/comment/${commentId}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({ body: commentBody })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update comment: ${error}`);
    }
    
    return response.json();
  };
  
  /**
   * Delete a comment
   * @param {string} issueKeyOrId - The issue key or ID
   * @param {string} commentId - The comment ID
   * @returns {Promise<void>}
   */
  JiraClient.prototype.deleteComment = async function(issueKeyOrId, commentId) {
    const endpoint = `${this.baseUrl}/issue/${issueKeyOrId}/comment/${commentId}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: this.headers
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete comment: ${error}`);
    }
  };
  
  /**
   * Add a comment with mentions
   * @param {string} issueKeyOrId - The issue key or ID
   * @param {string} text - The comment text
   * @param {Array<{accountId: string, displayName: string}>} mentions - Users to mention
   * @returns {Promise<Object>} The created comment
   */
  JiraClient.prototype.addCommentWithMentions = async function(issueKeyOrId, text, mentions = []) {
    const builder = new ADFBuilder();
    const p = builder.paragraph(p => {
      // Parse text and insert mentions
      let lastIndex = 0;
      mentions.forEach(mention => {
        const mentionText = `@${mention.displayName}`;
        const index = text.indexOf(mentionText, lastIndex);
        
        if (index !== -1) {
          // Add text before mention
          if (index > lastIndex) {
            p.text(text.substring(lastIndex, index));
          }
          
          // Add mention
          p.mention(mention.accountId, mention.displayName);
          
          lastIndex = index + mentionText.length;
        }
      });
      
      // Add remaining text
      if (lastIndex < text.length) {
        p.text(text.substring(lastIndex));
      }
      
      return p;
    });
    
    const comment = builder.build();
    return this.addComment(issueKeyOrId, comment.body);
  };
  
  /**
   * Add a rich comment using the ADF builder
   * @param {string} issueKeyOrId - The issue key or ID
   * @param {Function} builderCallback - Callback that receives an ADFBuilder instance
   * @returns {Promise<Object>} The created comment
   */
  JiraClient.prototype.addRichComment = async function(issueKeyOrId, builderCallback) {
    const builder = new ADFBuilder();
    builderCallback(builder);
    const comment = builder.build();
    return this.addComment(issueKeyOrId, comment.body);
  };
  
  /**
   * Get all comments for an issue with pagination
   * @param {string} issueKeyOrId - The issue key or ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Comments response with pagination info
   */
  JiraClient.prototype.getCommentsWithPagination = async function(issueKeyOrId, options = {}) {
    const {
      startAt = 0,
      maxResults = 50,
      orderBy = 'created',
      expand = ''
    } = options;
    
    const params = new URLSearchParams({
      startAt,
      maxResults,
      orderBy
    });
    
    if (expand) {
      params.append('expand', expand);
    }
    
    const endpoint = `${this.baseUrl}/issue/${issueKeyOrId}/comment?${params}`;
    
    const response = await fetch(endpoint, {
      headers: this.headers
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get comments: ${error}`);
    }
    
    return response.json();
  };
}

// Apply the extensions
extendJiraClient();

// Export for testing
module.exports = {
  extendJiraClient,
  ADFBuilder
};

// Example usage
if (require.main === module) {
  async function testExtendedClient() {
    const client = getJiraClient();
    
    console.log('Testing extended Jira client...\n');
    
    try {
      // Test 1: Add a simple comment
      console.log('1. Adding simple comment...');
      const simpleComment = await client.addComment('DE-3417', 'This is a test comment from the extended client.');
      console.log('✅ Simple comment added:', simpleComment.id);
      
      // Test 2: Add a rich comment
      console.log('\n2. Adding rich comment...');
      const richComment = await client.addRichComment('DE-3417', builder => {
        builder
          .heading(2, 'Extended Client Test')
          .paragraph(p => p
            .text('This comment was created using the ')
            .code('extendJiraClient')
            .text(' functionality.')
          )
          .bulletList([
            'Supports all ADF features',
            'Integrates with existing client',
            'Provides builder pattern'
          ])
          .codeBlock('const client = getJiraClient();\nawait client.addComment(ticketKey, comment);', 'javascript');
      });
      console.log('✅ Rich comment added:', richComment.id);
      
      // Test 3: Get comments with pagination
      console.log('\n3. Getting comments with pagination...');
      const comments = await client.getCommentsWithPagination('DE-3417', {
        maxResults: 5,
        orderBy: '-created'
      });
      console.log(`✅ Retrieved ${comments.comments.length} of ${comments.total} comments`);
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }
  
  testExtendedClient();
}