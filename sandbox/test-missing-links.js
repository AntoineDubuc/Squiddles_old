/**
 * Test script to reproduce the missing directLinkUrl issue
 */

const API_URL = 'http://localhost:8888/api/jira/activity';

async function testMultipleRequests() {
  console.log('🧪 Testing multiple API requests to reproduce missing directLinkUrl issue...\n');
  
  const results = [];
  
  // Make multiple requests to see if the issue is intermittent
  for (let i = 1; i <= 10; i++) {
    try {
      console.log(`Request #${i}:`);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        console.log(`  ❌ API returned ${response.status}: ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      
      // Check for DE-3360 specifically
      const de3360Mentions = data.mentions.filter(m => m.ticketKey === 'DE-3360');
      
      for (const mention of de3360Mentions) {
        const hasLink = !!mention.directLinkUrl;
        console.log(`  ${mention.ticketKey}-${mention.commentId}: ${hasLink ? '✅ HAS LINK' : '❌ MISSING LINK'}`);
        
        if (!hasLink) {
          console.log(`    🐛 FOUND THE BUG! Missing directLinkUrl for ${mention.ticketKey}-${mention.commentId}`);
          console.log(`    📝 Comment: "${mention.commentPreview.substring(0, 100)}..."`);
        }
        
        results.push({
          request: i,
          ticketKey: mention.ticketKey,
          commentId: mention.commentId,
          hasDirectLinkUrl: hasLink,
          directLinkUrl: mention.directLinkUrl || 'MISSING'
        });
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`  ❌ Request failed: ${error.message}`);
    }
  }
  
  console.log('\n📊 Summary of all requests:');
  const groupedResults = {};
  
  for (const result of results) {
    const key = `${result.ticketKey}-${result.commentId}`;
    if (!groupedResults[key]) {
      groupedResults[key] = {
        ticketKey: result.ticketKey,
        commentId: result.commentId,
        hasLinkCount: 0,
        missingLinkCount: 0,
        examples: []
      };
    }
    
    if (result.hasDirectLinkUrl) {
      groupedResults[key].hasLinkCount++;
    } else {
      groupedResults[key].missingLinkCount++;
    }
    
    groupedResults[key].examples.push(`Request #${result.request}: ${result.directLinkUrl}`);
  }
  
  console.log('\nPer comment analysis:');
  for (const [key, stats] of Object.entries(groupedResults)) {
    console.log(`\n${key}:`);
    console.log(`  ✅ Had directLinkUrl: ${stats.hasLinkCount} times`);
    console.log(`  ❌ Missing directLinkUrl: ${stats.missingLinkCount} times`);
    
    if (stats.missingLinkCount > 0) {
      console.log(`  🚨 INCONSISTENT BEHAVIOR DETECTED!`);
      console.log(`  📋 Examples:`);
      stats.examples.slice(0, 3).forEach(example => console.log(`    ${example}`));
    } else {
      console.log(`  ✅ Consistent behavior - always has directLinkUrl`);
    }
  }
  
  const totalMissing = results.filter(r => !r.hasDirectLinkUrl).length;
  const totalWithLinks = results.filter(r => r.hasDirectLinkUrl).length;
  
  console.log(`\n🎯 Final Results:`);
  console.log(`  Total requests: ${results.length}`);
  console.log(`  With directLinkUrl: ${totalWithLinks}`);
  console.log(`  Missing directLinkUrl: ${totalMissing}`);
  
  if (totalMissing > 0) {
    console.log(`\n🐛 BUG CONFIRMED: Found ${totalMissing} cases of missing directLinkUrl`);
    console.log(`   This explains why the user sees disabled link buttons`);
  } else {
    console.log(`\n✅ No missing directLinkUrl found in this test`);
    console.log(`   The issue might be:`);
    console.log(`   - Frontend caching (refresh the browser)`);
    console.log(`   - Environment variable not loaded during some requests`);
    console.log(`   - Race condition during server startup`);
  }
}

testMultipleRequests();