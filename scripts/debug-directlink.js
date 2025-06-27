/**
 * Debug script to investigate directLinkUrl issues
 */

const API_URL = 'http://localhost:8888/api/jira/activity';

async function debugDirectLinks() {
  try {
    console.log('🔍 Fetching Jira activity...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Found ${data.mentions.length} mentions`);
    
    // Check each mention for directLinkUrl issues
    data.mentions.forEach((mention, index) => {
      console.log(`\n[${index + 1}] ${mention.ticketKey} (${mention.commentId})`);
      console.log(`  Author: ${mention.commentAuthor.displayName}`);
      console.log(`  Preview: ${mention.commentPreview.substring(0, 100)}...`);
      
      if (mention.directLinkUrl) {
        console.log(`  ✅ directLinkUrl: ${mention.directLinkUrl}`);
      } else {
        console.log(`  ❌ directLinkUrl: MISSING/UNDEFINED`);
        console.log(`  ⚠️  This would cause a disabled link button`);
      }
      
      // Check for DE-3360 specifically
      if (mention.ticketKey === 'DE-3360') {
        console.log(`  🎯 This is the DE-3360 mention the user reported!`);
      }
    });
    
    // Summary
    const withLinks = data.mentions.filter(m => m.directLinkUrl).length;
    const withoutLinks = data.mentions.filter(m => !m.directLinkUrl).length;
    
    console.log(`\n📊 Summary:`);
    console.log(`  Total mentions: ${data.mentions.length}`);
    console.log(`  With directLinkUrl: ${withLinks}`);
    console.log(`  Missing directLinkUrl: ${withoutLinks}`);
    
    if (withoutLinks > 0) {
      console.log(`\n⚠️  ${withoutLinks} mentions are missing directLinkUrl - these will show disabled link buttons`);
    } else {
      console.log(`\n✅ All mentions have directLinkUrl - the issue may be intermittent or frontend-related`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugDirectLinks();