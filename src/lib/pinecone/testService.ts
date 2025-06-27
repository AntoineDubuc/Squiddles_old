/**
 * Test script for Pinecone multi-source indexing and search
 * Tests Gmail, Confluence, and Jira indexing with cross-reference search
 */

import { getMultiSourcePineconeService, DocumentType } from './multiSourceService';
import { getGmailIndexer } from './indexers/gmailIndexer';
import { getConfluenceIndexer } from './indexers/confluenceIndexer';
import { getJiraIndexer } from './indexers/jiraIndexer';
import { getCrossReferenceSearchService } from './searchService';

interface TestResult {
  service: string;
  test: string;
  success: boolean;
  result?: any;
  error?: string;
  duration?: number;
}

class PineconeTestSuite {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Pinecone Multi-Source Test Suite');
    console.log('=' .repeat(60));

    // Test service connections
    await this.testServiceConnections();
    
    // Test health checks
    await this.testHealthChecks();
    
    // Test indexing (small sample)
    await this.testIndexing();
    
    // Test search functionality
    await this.testSearchFunctionality();
    
    // Print summary
    this.printSummary();
  }

  private async testServiceConnections(): Promise<void> {
    console.log('\n🔌 Testing Service Connections');
    console.log('-'.repeat(40));

    // Test Gmail connection
    await this.runTest('Gmail', 'Connection', async () => {
      const gmailIndexer = getGmailIndexer();
      return await gmailIndexer.getIndexingStats();
    });

    // Test Confluence connection
    await this.runTest('Confluence', 'Connection', async () => {
      const confluenceIndexer = getConfluenceIndexer();
      const test = await confluenceIndexer.testConnection();
      if (!test.success) throw new Error(test.error);
      return await confluenceIndexer.getIndexingStats();
    });

    // Test Jira connection
    await this.runTest('Jira', 'Connection', async () => {
      const jiraIndexer = getJiraIndexer();
      const test = await jiraIndexer.testConnection();
      if (!test.success) throw new Error(test.error);
      return await jiraIndexer.getIndexingStats();
    });
  }

  private async testHealthChecks(): Promise<void> {
    console.log('\n🏥 Testing Health Checks');
    console.log('-'.repeat(40));

    // Test Pinecone health
    await this.runTest('Pinecone', 'Health Check', async () => {
      const service = getMultiSourcePineconeService();
      const health = await service.getHealth();
      if (!health.healthy) throw new Error(health.error);
      return health;
    });

    // Test embedding generation
    await this.runTest('OpenAI', 'Embedding Generation', async () => {
      const service = getMultiSourcePineconeService();
      const embedding = await service.generateEmbedding('This is a test sentence for embedding generation.');
      if (!embedding || embedding.length !== 1536) {
        throw new Error('Invalid embedding generated');
      }
      return { dimension: embedding.length, sample: embedding.slice(0, 5) };
    });
  }

  private async testIndexing(): Promise<void> {
    console.log('\n📚 Testing Indexing (Small Sample)');
    console.log('-'.repeat(40));

    // Test Gmail indexing (last 1 day)
    await this.runTest('Gmail', 'Recent Emails (1 day)', async () => {
      const gmailIndexer = getGmailIndexer();
      await gmailIndexer.indexRecentEmails(1);
      return { message: 'Indexed recent emails (1 day)' };
    });

    // Test Confluence indexing (recent pages)
    await this.runTest('Confluence', 'Recent Pages (7 days)', async () => {
      const confluenceIndexer = getConfluenceIndexer();
      await confluenceIndexer.indexRecentPages(7);
      return { message: 'Indexed recent pages (7 days)' };
    });

    // Test Jira indexing (recent tickets)
    await this.runTest('Jira', 'Recent Tickets (7 days)', async () => {
      const jiraIndexer = getJiraIndexer();
      await jiraIndexer.indexRecentTickets(7);
      return { message: 'Indexed recent tickets (7 days)' };
    });
  }

  private async testSearchFunctionality(): Promise<void> {
    console.log('\n🔍 Testing Search Functionality');
    console.log('-'.repeat(40));

    const searchService = getCrossReferenceSearchService();

    // Test basic search
    await this.runTest('Search', 'Basic Query', async () => {
      const results = await searchService.search({
        query: 'test',
        maxResults: 5
      });
      return {
        totalResults: results.results.length,
        types: results.summary.resultsByType,
        suggestions: results.suggestions.length
      };
    });

    // Test semantic search
    await this.runTest('Search', 'Semantic Search', async () => {
      const results = await searchService.semanticSearch('project management', 5);
      return {
        totalResults: results.length,
        topScore: results[0]?.score || 0
      };
    });

    // Test urgent items search
    await this.runTest('Search', 'Urgent Items', async () => {
      const results = await searchService.findUrgentItems();
      return {
        urgentItems: results.length,
        types: results.reduce((acc, r) => {
          acc[r.document.type] = (acc[r.document.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    });

    // Test cross-reference search with context
    await this.runTest('Search', 'Cross-Reference with Context', async () => {
      const results = await searchService.search({
        query: 'authentication',
        context: {
          userAccountId: '712020:ca041fb3-f2cf-4ef4-86dd-fbae8bb1441e' // Antoine's account ID
        },
        includeRelated: true,
        maxResults: 10
      });
      
      return {
        totalResults: results.results.length,
        crossReferences: {
          totalTickets: results.summary.relatedTickets.length,
          totalEmails: results.summary.relatedEmails.length,
          totalPages: results.summary.relatedPages.length
        },
        urgentItems: results.summary.urgentItems.length
      };
    });
  }

  private async runTest(service: string, test: string, testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`  🧪 Testing ${service}: ${test}...`);
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.push({
        service,
        test,
        success: true,
        result,
        duration
      });
      
      console.log(`  ✅ ${service} ${test} - ${duration}ms`);
      if (result && typeof result === 'object') {
        console.log(`     Result:`, JSON.stringify(result, null, 2).split('\n').map(line => `     ${line}`).join('\n'));
      }
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        service,
        test,
        success: false,
        error: error.message,
        duration
      });
      
      console.log(`  ❌ ${service} ${test} - Failed (${duration}ms)`);
      console.log(`     Error: ${error.message}`);
    }
  }

  private printSummary(): void {
    console.log('\n📊 Test Summary');
    console.log('=' .repeat(60));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`  - ${result.service} ${result.test}: ${result.error}`);
        });
    }
    
    console.log('\n🎯 Recommendations:');
    
    const gmailTests = this.results.filter(r => r.service === 'Gmail');
    const confluenceTests = this.results.filter(r => r.service === 'Confluence');
    const jiraTests = this.results.filter(r => r.service === 'Jira');
    const searchTests = this.results.filter(r => r.service === 'Search');
    
    if (gmailTests.every(t => t.success)) {
      console.log('  ✅ Gmail integration is working - ready for full email indexing');
    } else {
      console.log('  ⚠️  Gmail has issues - check OAuth2 configuration');
    }
    
    if (confluenceTests.every(t => t.success)) {
      console.log('  ✅ Confluence integration is working - ready for page indexing');
    } else {
      console.log('  ⚠️  Confluence has issues - check API credentials');
    }
    
    if (jiraTests.every(t => t.success)) {
      console.log('  ✅ Jira integration is working - ready for ticket indexing');
    } else {
      console.log('  ⚠️  Jira has issues - check API credentials');
    }
    
    if (searchTests.every(t => t.success)) {
      console.log('  ✅ Search functionality is working - ready for voice queries');
    } else {
      console.log('  ⚠️  Search has issues - check Pinecone configuration');
    }
    
    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed! Pinecone multi-source indexing is ready to use!');
      console.log('\nNext steps:');
      console.log('  1. Index larger datasets using the API endpoints');
      console.log('  2. Integrate search with the voice interface');
      console.log('  3. Set up automated indexing schedules');
    }
  }
}

// Export test function
export async function runPineconeTests(): Promise<void> {
  const testSuite = new PineconeTestSuite();
  await testSuite.runAllTests();
}

// CLI execution
if (require.main === module) {
  runPineconeTests().catch(console.error);
}