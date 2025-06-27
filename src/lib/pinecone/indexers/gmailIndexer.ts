/**
 * Gmail Email Indexer for Pinecone
 * Converts Gmail messages to indexed documents with metadata
 */

import { google } from 'googleapis';
import { EmailDocument, DocumentType, getMultiSourcePineconeService } from '../multiSourceService';

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ body?: { data?: string } }>;
  };
  internalDate: string;
}

export class GmailIndexer {
  private gmail: any;
  private pineconeService = getMultiSourcePineconeService();

  constructor() {
    const auth = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    this.gmail = google.gmail({ version: 'v1', auth });
  }

  /**
   * Index recent emails (last 30 days by default)
   */
  async indexRecentEmails(daysBack: number = 30): Promise<void> {
    const query = `newer_than:${daysBack}d`;
    await this.indexEmailsByQuery(query);
  }

  /**
   * Index emails matching a specific query
   */
  async indexEmailsByQuery(query: string): Promise<void> {
    try {
      console.log(`📧 Starting Gmail indexing with query: ${query}`);

      // Get list of message IDs
      const listResponse = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 500 // Adjust based on needs
      });

      const messages = listResponse.data.messages || [];
      console.log(`📬 Found ${messages.length} messages to index`);

      if (messages.length === 0) {
        console.log('No messages found to index');
        return;
      }

      // Process messages in batches
      const batchSize = 10;
      const emailDocuments: EmailDocument[] = [];

      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        
        console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(messages.length/batchSize)}`);
        
        const batchPromises = batch.map(message => 
          this.processMessage(message.id!)
        );
        
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            emailDocuments.push(result.value);
          } else if (result.status === 'rejected') {
            console.error(`❌ Failed to process message ${batch[index].id}:`, result.reason);
          }
        });

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (emailDocuments.length > 0) {
        console.log(`🔄 Indexing ${emailDocuments.length} email documents...`);
        await this.pineconeService.indexDocuments(emailDocuments);
        console.log(`✅ Successfully indexed ${emailDocuments.length} emails`);
      }

    } catch (error) {
      console.error('❌ Error indexing Gmail messages:', error);
      throw new Error('Failed to index Gmail messages');
    }
  }

  /**
   * Index a single email by message ID
   */
  async indexEmailById(messageId: string): Promise<void> {
    try {
      const emailDoc = await this.processMessage(messageId);
      if (emailDoc) {
        await this.pineconeService.indexDocument(emailDoc);
        console.log(`✅ Indexed email: ${emailDoc.subject}`);
      }
    } catch (error) {
      console.error(`❌ Error indexing email ${messageId}:`, error);
      throw error;
    }
  }

  /**
   * Process a Gmail message and convert to EmailDocument
   */
  private async processMessage(messageId: string): Promise<EmailDocument | null> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message: GmailMessage = response.data;
      return this.convertToEmailDocument(message);

    } catch (error) {
      console.error(`Error processing message ${messageId}:`, error);
      return null;
    }
  }

  /**
   * Convert Gmail message to EmailDocument format
   */
  private convertToEmailDocument(message: GmailMessage): EmailDocument {
    const headers = message.payload.headers || [];
    
    // Extract header values
    const getHeader = (name: string): string => {
      const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
      return header?.value || '';
    };

    const from = getHeader('From');
    const to = this.parseEmailList(getHeader('To'));
    const cc = this.parseEmailList(getHeader('Cc'));
    const subject = getHeader('Subject');
    const date = getHeader('Date');

    // Extract email content
    const content = this.extractEmailContent(message.payload);
    
    // Parse sender info
    const authorMatch = from.match(/(.*?)\s*<(.+?)>/) || from.match(/(.+)/);
    const authorName = authorMatch ? (authorMatch[1] || authorMatch[0]).trim().replace(/"/g, '') : 'Unknown';
    const authorEmail = authorMatch && authorMatch[2] ? authorMatch[2] : from;

    // Detect mentioned tickets (JIRA ticket patterns)
    const ticketMatches = content.match(/\b[A-Z]+-\d+\b/g) || [];
    const mentionedTickets = [...new Set(ticketMatches)];

    // Detect mentioned Confluence pages (basic URL detection)
    const confluenceMatches = content.match(/\/wiki\/spaces\/[A-Z]+\/pages\/\d+/g) || [];
    const mentionedPages = [...new Set(confluenceMatches.map(match => match.split('/').pop() || ''))];

    // Analyze urgency keywords
    const urgencyKeywords = this.detectUrgencyKeywords(subject + ' ' + content);
    const priority = this.determinePriority(urgencyKeywords, subject);

    // Analyze sentiment (basic keyword approach)
    const sentiment = this.analyzeSentiment(content);

    // Check for attachments
    const hasAttachments = message.payload?.parts?.some(part => 
      part.body && Object.keys(part.body).length > 0 && !part.body.data
    ) || false;

    // Check if message is read (not in UNREAD label)
    const isRead = !message.labelIds?.includes('UNREAD');

    const createdAt = date ? new Date(date) : new Date(parseInt(message.internalDate));

    return {
      id: `gmail_${message.id}`,
      type: DocumentType.EMAIL,
      title: subject || '(No Subject)',
      content,
      url: `https://mail.google.com/mail/u/0/#inbox/${message.id}`,
      createdAt,
      updatedAt: createdAt,
      author: {
        id: this.extractEmailAddress(authorEmail),
        name: authorName,
        email: this.extractEmailAddress(authorEmail)
      },
      from,
      to,
      cc,
      subject: subject || '(No Subject)',
      threadId: message.threadId,
      hasAttachments,
      isRead,
      labels: message.labelIds || [],
      metadata: {
        messageId: message.id,
        gmailId: message.id,
        priority,
        hasLinks: content.includes('http'),
        mentionedTickets,
        mentionedPages,
        sentiment,
        urgencyKeywords
      }
    };
  }

  /**
   * Extract text content from Gmail message payload
   */
  private extractEmailContent(payload: any): string {
    let content = '';

    // Check main body
    if (payload.body?.data) {
      content = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    // Check parts for multipart messages
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          const partContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
          content += '\n' + partContent;
        }
      }
    }

    // Clean up content
    content = content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return content || payload.snippet || '';
  }

  /**
   * Parse comma-separated email list
   */
  private parseEmailList(emailString: string): string[] {
    if (!emailString) return [];
    
    return emailString
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }

  /**
   * Extract email address from "Name <email>" format
   */
  private extractEmailAddress(emailString: string): string {
    const match = emailString.match(/<(.+?)>/);
    return match ? match[1] : emailString.trim();
  }

  /**
   * Detect urgency keywords in text
   */
  private detectUrgencyKeywords(text: string): string[] {
    const urgencyPatterns = [
      'urgent', 'asap', 'immediately', 'critical', 'emergency',
      'deadline', 'rush', 'priority', 'important', 'escalate',
      'blocked', 'breaking', 'issue', 'problem', 'error',
      'failed', 'down', 'outage', 'incident'
    ];

    const lowerText = text.toLowerCase();
    return urgencyPatterns.filter(keyword => lowerText.includes(keyword));
  }

  /**
   * Determine email priority based on keywords and subject
   */
  private determinePriority(urgencyKeywords: string[], subject: string): 'low' | 'medium' | 'high' {
    const criticalKeywords = ['urgent', 'critical', 'emergency', 'asap', 'immediately'];
    const highKeywords = ['important', 'deadline', 'priority', 'escalate', 'blocked'];

    const lowerSubject = subject.toLowerCase();
    const hasCritical = criticalKeywords.some(keyword => 
      urgencyKeywords.includes(keyword) || lowerSubject.includes(keyword)
    );
    const hasHigh = highKeywords.some(keyword => 
      urgencyKeywords.includes(keyword) || lowerSubject.includes(keyword)
    );

    if (hasCritical) return 'high';
    if (hasHigh) return 'high';
    if (urgencyKeywords.length > 0) return 'medium';
    
    return 'medium'; // Default to medium for business emails
  }

  /**
   * Basic sentiment analysis
   */
  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'excellent', 'good', 'thanks', 'appreciate', 'perfect', 'awesome'];
    const negativeWords = ['problem', 'issue', 'error', 'failed', 'wrong', 'bad', 'urgent', 'critical'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Get indexing statistics
   */
  async getIndexingStats(): Promise<{ totalEmails: number; recentEmails: number }> {
    try {
      // Get total email count
      const allResponse = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: 1
      });

      // Get recent email count (last 7 days)
      const recentResponse = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'newer_than:7d',
        maxResults: 1000
      });

      return {
        totalEmails: allResponse.data.resultSizeEstimate || 0,
        recentEmails: recentResponse.data.messages?.length || 0
      };
    } catch (error) {
      console.error('Error getting Gmail stats:', error);
      return { totalEmails: 0, recentEmails: 0 };
    }
  }
}

export function getGmailIndexer(): GmailIndexer {
  return new GmailIndexer();
}