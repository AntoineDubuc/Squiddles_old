#!/usr/bin/env tsx
/**
 * Check if tickets have comments and show how to include them
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../.env') });

async function checkComments() {
  console.log('💬 Checking comments on tickets...\n');
  
  try {
    // Check both tickets
    const tickets = ['DE-3397', 'DE-3270'];
    
    for (const ticketKey of tickets) {
      console.log(`\n🎫 Checking ${ticketKey}...`);
      
      const response = await fetch(
        `${process.env.JIRA_HOST || process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketKey}?expand=renderedFields,comments`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(
              `${process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_TOKEN}`
            ).toString('base64')}`,
            'Accept': 'application/json',
          },
          method: 'GET'
        }
      );

      if (!response.ok) {
        console.error(`❌ Failed to fetch ${ticketKey}`);
        continue;
      }

      const issue = await response.json();
      const comments = issue.fields.comment?.comments || [];
      
      console.log(`📊 Comment count: ${comments.length}`);
      
      if (comments.length > 0) {
        console.log('\nComments found:');
        comments.forEach((comment: any, idx: number) => {
          const text = extractTextFromADF(comment.body);
          console.log(`\n${idx + 1}. Comment by ${comment.author.displayName}`);
          console.log(`   Date: ${new Date(comment.created).toLocaleDateString()}`);
          console.log(`   Preview: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
          console.log(`   Length: ${text.length} characters`);
        });
        
        // Show what the combined content would look like
        console.log('\n📝 Combined content approach:');
        console.log('Option 1: Single document with all comments');
        console.log('Option 2: Separate documents per comment (current approach)');
        console.log('Option 3: Ticket + recent comments only');
      }
    }
    
    console.log('\n\n💡 Current vs Proposed Approaches:');
    console.log('\n❌ CURRENT: Only ticket content indexed');
    console.log('- Missing valuable context from comments');
    console.log('- Comments might contain solutions, updates, links');
    
    console.log('\n✅ PROPOSED OPTIONS:');
    console.log('\n1. Combined Document (ticket + all comments):');
    console.log('   - Single vector for entire conversation');
    console.log('   - Better context but might dilute relevance');
    console.log('   - Larger embeddings');
    
    console.log('\n2. Separate Documents (current multiSourceService approach):');
    console.log('   - One vector per ticket, one per comment');
    console.log('   - Can search comments independently');
    console.log('   - More granular but more storage');
    
    console.log('\n3. Smart Combination:');
    console.log('   - Include last N comments in ticket embedding');
    console.log('   - Or include comments with mentions/keywords');
    console.log('   - Balance between context and relevance');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Helper to extract text from ADF
function extractTextFromADF(adf: any): string {
  if (!adf) return '';
  if (typeof adf === 'string') return adf;
  
  if (adf.type === 'doc' && adf.content) {
    return extractTextFromADFContent(adf.content);
  }
  
  return '';
}

function extractTextFromADFContent(content: any[]): string {
  if (!Array.isArray(content)) return '';
  
  return content.map(node => {
    if (node.type === 'text') {
      return node.text || '';
    } else if (node.content) {
      return extractTextFromADFContent(node.content);
    }
    return '';
  }).join(' ').trim();
}

// Run check
checkComments()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });