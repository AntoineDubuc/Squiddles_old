/**
 * Confluence API Client
 * Handles authentication and requests to Confluence REST API
 */

import { z } from 'zod';

// Types
export interface ConfluenceConfig {
  host: string;
  email: string;
  apiToken: string;
}

export interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    id: string;
    key: string;
    name: string;
    type: string;
  };
  body?: {
    storage?: {
      value: string;
      representation: string;
    };
    atlas_doc_format?: {
      value: any;
      representation: string;
    };
  };
  version: {
    number: number;
    when: string;
  };
  ancestors?: Array<{
    id: string;
    title: string;
  }>;
  _links: {
    webui: string;
    base: string;
  };
  _expandable?: Record<string, string>;
}

export interface ConfluenceSpace {
  id: string;
  key: string;
  name: string;
  type: string;
  status: string;
  _links: {
    webui: string;
    base: string;
  };
}

export interface ConfluenceComment {
  id: string;
  type: string;
  status: string;
  title: string;
  body: {
    storage: {
      value: string;
      representation: string;
    };
  };
  version: {
    number: number;
    when: string;
  };
  container: {
    id: string;
    type: string;
    title: string;
  };
}

export interface CreatePageInput {
  type: 'page' | 'blogpost';
  title: string;
  spaceKey: string;
  body: {
    storage: {
      value: string;
      representation: 'storage';
    };
  };
  parentId?: string;
}

export interface UpdatePageInput {
  id: string;
  type: 'page' | 'blogpost';
  title: string;
  body: {
    storage: {
      value: string;
      representation: 'storage';
    };
  };
  version: {
    number: number;
  };
}

export class ConfluenceClient {
  private config: ConfluenceConfig;
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.config = {
      host: process.env.CONFLUENCE_HOST || process.env.CONFLUENCE_BASE_URL || '',
      email: process.env.CONFLUENCE_EMAIL || process.env.JIRA_USER_EMAIL || '',
      apiToken: process.env.CONFLUENCE_API_TOKEN || process.env.JIRA_API_TOKEN || '',
    };

    // Debug logging for server-side only
    if (typeof window === 'undefined') {
      console.log('🔧 ConfluenceClient initialized:', {
        host: this.config.host ? 'configured' : 'missing',
        email: this.config.email ? 'configured' : 'missing',
        apiToken: this.config.apiToken ? 'configured' : 'missing'
      });
    }

    if (!this.config.host || !this.config.email || !this.config.apiToken) {
      throw new Error('Missing Confluence configuration. Please set CONFLUENCE_HOST/CONFLUENCE_BASE_URL, CONFLUENCE_EMAIL, and CONFLUENCE_API_TOKEN');
    }

    this.baseUrl = `${this.config.host}/wiki/rest/api`;
    
    // Create auth header
    const auth = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString('base64');
    this.headers = {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user/current`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get current user: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all spaces accessible to the user
   */
  async getSpaces(limit: number = 50): Promise<ConfluenceSpace[]> {
    const response = await fetch(`${this.baseUrl}/space?limit=${limit}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get spaces: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Search for content using CQL (Confluence Query Language)
   */
  async searchContent(cql: string, limit: number = 25): Promise<ConfluencePage[]> {
    const encodedCql = encodeURIComponent(cql);
    const response = await fetch(
      `${this.baseUrl}/content/search?cql=${encodedCql}&limit=${limit}&expand=space,body.storage,version,ancestors,history.createdBy,history.lastUpdated`,
      {
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search content: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Get page by ID
   */
  async getPage(pageId: string, expand?: string[]): Promise<ConfluencePage> {
    const expandParam = expand ? `?expand=${expand.join(',')}` : '?expand=space,body.storage,version,ancestors';
    const response = await fetch(`${this.baseUrl}/content/${pageId}${expandParam}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get page ${pageId}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get pages in a space
   */
  async getSpacePages(spaceKey: string, limit: number = 25): Promise<ConfluencePage[]> {
    const response = await fetch(
      `${this.baseUrl}/content?spaceKey=${spaceKey}&type=page&limit=${limit}&expand=space,body.storage,version`,
      {
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get pages for space ${spaceKey}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Create a new page
   */
  async createPage(pageInput: CreatePageInput): Promise<ConfluencePage> {
    const response = await fetch(`${this.baseUrl}/content`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        type: pageInput.type,
        title: pageInput.title,
        space: {
          key: pageInput.spaceKey,
        },
        body: pageInput.body,
        ...(pageInput.parentId && {
          ancestors: [{ id: pageInput.parentId }],
        }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create page: ${error}`);
    }

    const result = await response.json();
    
    // Log success for debugging (server-side only)
    if (typeof window === 'undefined') {
      console.log('✅ Page created:', {
        pageId: result.id,
        title: result.title,
        space: result.space.key,
      });
    }

    return result;
  }

  /**
   * Update an existing page
   */
  async updatePage(pageInput: UpdatePageInput): Promise<ConfluencePage> {
    const response = await fetch(`${this.baseUrl}/content/${pageInput.id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        type: pageInput.type,
        title: pageInput.title,
        body: pageInput.body,
        version: pageInput.version,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update page ${pageInput.id}: ${error}`);
    }

    const result = await response.json();
    
    // Log success for debugging (server-side only)
    if (typeof window === 'undefined') {
      console.log('✅ Page updated:', {
        pageId: result.id,
        title: result.title,
        version: result.version.number,
      });
    }

    return result;
  }

  /**
   * Delete a page
   */
  async deletePage(pageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/content/${pageId}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete page ${pageId}: ${error}`);
    }

    if (typeof window === 'undefined') {
      console.log(`✅ Page ${pageId} deleted`);
    }
  }

  /**
   * Add a comment to a page
   */
  async addComment(pageId: string, comment: string): Promise<ConfluenceComment> {
    const response = await fetch(`${this.baseUrl}/content`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        type: 'comment',
        container: {
          id: pageId,
          type: 'page',
        },
        body: {
          storage: {
            value: comment,
            representation: 'storage',
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to add comment to page ${pageId}: ${error}`);
    }

    const result = await response.json();
    
    // Log success for debugging (server-side only)
    if (typeof window === 'undefined') {
      console.log('✅ Comment added to page:', {
        pageId,
        commentId: result.id,
      });
    }

    return result;
  }

  /**
   * Get comments for a page
   */
  async getComments(pageId: string): Promise<ConfluenceComment[]> {
    const response = await fetch(
      `${this.baseUrl}/content/${pageId}/child/comment?expand=body.storage,version`,
      {
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get comments for page ${pageId}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Search pages by title
   */
  async searchPagesByTitle(title: string, spaceKey?: string): Promise<ConfluencePage[]> {
    let cql = `title ~ "${title}" AND type = page`;
    if (spaceKey) {
      cql += ` AND space = "${spaceKey}"`;
    }
    
    return this.searchContent(cql);
  }

  /**
   * Get recently updated content
   */
  async getRecentlyUpdated(spaceKey?: string, limit: number = 25): Promise<ConfluencePage[]> {
    let cql = 'type = page ORDER BY lastModified DESC';
    if (spaceKey) {
      cql = `space = "${spaceKey}" AND type = page ORDER BY lastModified DESC`;
    }
    
    return this.searchContent(cql, limit);
  }

  /**
   * Create Confluence storage format from plain text
   */
  createStorageFormat(text: string): string {
    // Convert plain text to basic Confluence storage format
    return `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
  }

  /**
   * Create a structured page with sections
   */
  createStructuredPage(title: string, sections: Array<{ heading: string; content: string }>): string {
    let html = '';
    
    sections.forEach(section => {
      html += `<h2>${section.heading}</h2>`;
      html += `<p>${section.content.replace(/\n/g, '</p><p>')}</p>`;
    });
    
    return html;
  }
}

// Export singleton instance
let confluenceClient: ConfluenceClient | null = null;

export function getConfluenceClient(): ConfluenceClient {
  if (!confluenceClient) {
    confluenceClient = new ConfluenceClient();
  }
  return confluenceClient;
}