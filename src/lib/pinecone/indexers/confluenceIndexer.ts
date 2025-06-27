/**
 * Confluence Page Indexer for Pinecone
 * Converts Confluence pages to indexed documents with metadata
 */

import { ConfluenceDocument, DocumentType, getMultiSourcePineconeService } from '../multiSourceService';

interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    id: string;
    key: string;
    name: string;
  };
  version: {
    number: number;
    when: string;
    by: {
      accountId: string;
      displayName: string;
      email?: string;
    };
  };
  ancestors?: Array<{ id: string; title: string }>;
  body?: {
    storage?: {
      value: string;
      representation: string;
    };
  };
  metadata?: {
    labels?: {
      results: Array<{ name: string }>;
    };
  };
  _links: {
    webui: string;
    base: string;
  };
}

export class ConfluenceIndexer {
  private baseUrl: string;
  private auth: string;
  private pineconeService = getMultiSourcePineconeService();

  constructor() {
    this.baseUrl = process.env.CONFLUENCE_BASE_URL || process.env.CONFLUENCE_HOST || '';
    const email = process.env.CONFLUENCE_EMAIL || '';
    const token = process.env.CONFLUENCE_API_TOKEN || '';
    
    if (!this.baseUrl || !email || !token) {
      throw new Error('Missing Confluence configuration. Please set CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN');
    }

    this.auth = Buffer.from(`${email}:${token}`).toString('base64');
  }

  /**
   * Index all pages from a specific space
   */
  async indexSpace(spaceKey: string): Promise<void> {
    try {
      console.log(`📖 Starting Confluence indexing for space: ${spaceKey}`);

      let start = 0;
      const limit = 50;
      let hasMore = true;

      while (hasMore) {
        const pages = await this.fetchPages(spaceKey, start, limit);
        
        if (pages.length === 0) {
          hasMore = false;
          break;
        }

        console.log(`📦 Processing ${pages.length} pages (offset: ${start})`);
        
        const documents: ConfluenceDocument[] = [];
        
        for (const page of pages) {
          try {
            const document = await this.convertToConfluenceDocument(page);
            if (document) {
              documents.push(document);
            }
          } catch (error) {
            console.error(`❌ Error processing page ${page.id}:`, error);
          }
        }

        if (documents.length > 0) {
          await this.pineconeService.indexDocuments(documents);
          console.log(`✅ Indexed ${documents.length} Confluence pages`);
        }

        start += limit;
        hasMore = pages.length === limit;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`✅ Completed indexing for space: ${spaceKey}`);

    } catch (error) {
      console.error(`❌ Error indexing Confluence space ${spaceKey}:`, error);
      throw error;
    }
  }

  /**
   * Index recent pages (updated in last N days)
   */
  async indexRecentPages(daysBack: number = 30): Promise<void> {
    try {
      console.log(`📖 Indexing Confluence pages updated in last ${daysBack} days`);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      
      const cql = `lastModified >= "${cutoffDate.toISOString().split('T')[0]}"`;
      await this.indexPagesByCQL(cql);

    } catch (error) {
      console.error('❌ Error indexing recent Confluence pages:', error);
      throw error;
    }
  }

  /**
   * Index pages matching a CQL query
   */
  async indexPagesByCQL(cql: string): Promise<void> {
    try {
      console.log(`📖 Indexing Confluence pages with CQL: ${cql}`);

      let start = 0;
      const limit = 50;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${this.baseUrl}/rest/api/content/search?cql=${encodeURIComponent(cql)}&start=${start}&limit=${limit}&expand=space,version,body.storage,ancestors,metadata.labels`, {
          headers: {
            'Authorization': `Basic ${this.auth}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const pages = data.results || [];

        if (pages.length === 0) {
          hasMore = false;
          break;
        }

        console.log(`📦 Processing ${pages.length} pages from CQL query`);
        
        const documents: ConfluenceDocument[] = [];
        
        for (const page of pages) {
          try {
            const document = await this.convertToConfluenceDocument(page);
            if (document) {
              documents.push(document);
            }
          } catch (error) {
            console.error(`❌ Error processing page ${page.id}:`, error);
          }
        }

        if (documents.length > 0) {
          await this.pineconeService.indexDocuments(documents);
          console.log(`✅ Indexed ${documents.length} Confluence pages`);
        }

        start += limit;
        hasMore = pages.length === limit;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

    } catch (error) {
      console.error('❌ Error indexing Confluence pages with CQL:', error);
      throw error;
    }
  }

  /**
   * Index a single page by ID
   */
  async indexPageById(pageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/content/${pageId}?expand=space,version,body.storage,ancestors,metadata.labels`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
      }

      const page = await response.json();
      const document = await this.convertToConfluenceDocument(page);
      
      if (document) {
        await this.pineconeService.indexDocument(document);
        console.log(`✅ Indexed Confluence page: ${document.title}`);
      }

    } catch (error) {
      console.error(`❌ Error indexing Confluence page ${pageId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch pages from a space
   */
  private async fetchPages(spaceKey: string, start: number = 0, limit: number = 50): Promise<ConfluencePage[]> {
    const response = await fetch(`${this.baseUrl}/rest/api/space/${spaceKey}/content?start=${start}&limit=${limit}&expand=space,version,body.storage,ancestors,metadata.labels`, {
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.page?.results || [];
  }

  /**
   * Convert Confluence page to ConfluenceDocument
   */
  private async convertToConfluenceDocument(page: ConfluencePage): Promise<ConfluenceDocument | null> {
    try {
      // Extract page content
      const htmlContent = page.body?.storage?.value || '';
      const textContent = this.extractTextFromHTML(htmlContent);

      if (!textContent.trim()) {
        console.log(`⚠️ Skipping page ${page.id} - no content`);
        return null;
      }

      // Analyze content
      const hasImages = htmlContent.includes('<ac:image') || htmlContent.includes('<img');
      const hasCode = htmlContent.includes('<ac:structured-macro ac:name="code"') || htmlContent.includes('<code>');
      const hasTables = htmlContent.includes('<table>') || htmlContent.includes('<ac:structured-macro ac:name="table">');
      const wordCount = textContent.split(/\s+/).length;

      // Extract related tickets from content
      const ticketMatches = textContent.match(/\b[A-Z]+-\d+\b/g) || [];
      const relatedTickets = [...new Set(ticketMatches)];

      // Extract labels/tags
      const labels = page.metadata?.labels?.results || [];
      const tags = labels.map(label => label.name);

      // Get parent page info
      const parentId = page.ancestors && page.ancestors.length > 0 
        ? page.ancestors[page.ancestors.length - 1].id 
        : undefined;

      // Build page URL
      const pageUrl = `${this.baseUrl}${page._links.webui}`;

      const createdAt = new Date(page.version.when);
      const updatedAt = new Date(page.version.when);

      return {
        id: `confluence_${page.id}`,
        type: DocumentType.CONFLUENCE,
        title: page.title,
        content: textContent,
        url: pageUrl,
        createdAt,
        updatedAt,
        author: {
          id: page.version.by.accountId,
          name: page.version.by.displayName,
          email: page.version.by.email
        },
        spaceKey: page.space.key,
        spaceName: page.space.name,
        parentId,
        version: page.version.number,
        status: page.status,
        metadata: {
          pageId: page.id,
          hasImages,
          hasCode,
          hasTables,
          wordCount,
          relatedTickets,
          tags,
          watchers: [], // Would need additional API call to get watchers
          lastViewedBy: [] // Would need additional API call to get view history
        }
      };

    } catch (error) {
      console.error(`Error converting page ${page.id} to document:`, error);
      return null;
    }
  }

  /**
   * Extract plain text from Confluence HTML/Storage format
   */
  private extractTextFromHTML(html: string): string {
    if (!html) return '';

    let text = html;

    // Remove Confluence macros (basic cleanup)
    text = text.replace(/<ac:structured-macro[^>]*>.*?<\/ac:structured-macro>/gs, '');
    text = text.replace(/<ac:image[^>]*\/>/g, '[IMAGE]');
    text = text.replace(/<ac:link[^>]*>.*?<\/ac:link>/gs, '');

    // Basic HTML tag removal
    text = text.replace(/<[^>]*>/g, ' ');

    // Decode HTML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');

    // Clean up whitespace
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return text;
  }

  /**
   * Get available spaces
   */
  async getSpaces(): Promise<Array<{ key: string; name: string; pageCount?: number }>> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/space?limit=100`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Confluence API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.results?.map((space: any) => ({
        key: space.key,
        name: space.name,
        pageCount: space.metadata?.pageCount
      })) || [];

    } catch (error) {
      console.error('Error fetching Confluence spaces:', error);
      return [];
    }
  }

  /**
   * Get indexing statistics
   */
  async getIndexingStats(spaceKey?: string): Promise<{ totalPages: number; recentPages: number }> {
    try {
      // Get total pages
      const totalCql = spaceKey ? `space = "${spaceKey}"` : 'type = page';
      const totalResponse = await fetch(`${this.baseUrl}/rest/api/content/search?cql=${encodeURIComponent(totalCql)}&limit=0`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });

      // Get recent pages (last 7 days)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      const recentCql = spaceKey 
        ? `space = "${spaceKey}" AND lastModified >= "${cutoffDate.toISOString().split('T')[0]}"`
        : `type = page AND lastModified >= "${cutoffDate.toISOString().split('T')[0]}"`;
      
      const recentResponse = await fetch(`${this.baseUrl}/rest/api/content/search?cql=${encodeURIComponent(recentCql)}&limit=0`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });

      const totalData = totalResponse.ok ? await totalResponse.json() : { size: 0 };
      const recentData = recentResponse.ok ? await recentResponse.json() : { size: 0 };

      return {
        totalPages: totalData.size || 0,
        recentPages: recentData.size || 0
      };

    } catch (error) {
      console.error('Error getting Confluence stats:', error);
      return { totalPages: 0, recentPages: 0 };
    }
  }

  /**
   * Test Confluence connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/space?limit=1`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Confluence API error: ${response.status} ${response.statusText}`
        };
      }

      return { success: true };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown connection error'
      };
    }
  }
}

export function getConfluenceIndexer(): ConfluenceIndexer {
  return new ConfluenceIndexer();
}