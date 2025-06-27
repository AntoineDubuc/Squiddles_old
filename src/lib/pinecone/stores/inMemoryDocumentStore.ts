/**
 * In-memory document store for development/testing
 * Replace with Redis or PostgreSQL in production
 */

import { IDocumentStore, DocumentData } from '../optimizedMultiSourceService';

export class InMemoryDocumentStore implements IDocumentStore {
  private store: Map<string, DocumentData> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  async set(id: string, data: DocumentData): Promise<void> {
    // Simple LRU: if at max size, remove oldest
    if (this.store.size >= this.maxSize && !this.store.has(id)) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
      }
    }
    
    this.store.set(id, data);
  }

  async get(id: string): Promise<DocumentData | null> {
    return this.store.get(id) || null;
  }

  async mget(ids: string[]): Promise<Map<string, DocumentData>> {
    const result = new Map<string, DocumentData>();
    
    for (const id of ids) {
      const doc = this.store.get(id);
      if (doc) {
        result.set(id, doc);
      }
    }
    
    return result;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }

  // Additional utility methods
  
  size(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }
}

/**
 * Persistent JSON file store for development
 * Saves to disk periodically
 */
export class JSONFileDocumentStore implements IDocumentStore {
  private store: Map<string, DocumentData> = new Map();
  private filePath: string;
  private saveInterval: number = 30000; // 30 seconds
  private saveTimer?: NodeJS.Timeout;

  constructor(filePath: string = './document-store.json') {
    this.filePath = filePath;
    this.loadFromFile();
    this.startAutoSave();
  }

  async set(id: string, data: DocumentData): Promise<void> {
    this.store.set(id, data);
  }

  async get(id: string): Promise<DocumentData | null> {
    return this.store.get(id) || null;
  }

  async mget(ids: string[]): Promise<Map<string, DocumentData>> {
    const result = new Map<string, DocumentData>();
    
    for (const id of ids) {
      const doc = this.store.get(id);
      if (doc) {
        result.set(id, doc);
      }
    }
    
    return result;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }

  // File persistence methods
  
  private loadFromFile(): void {
    try {
      const fs = require('fs');
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(data);
        this.store = new Map(Object.entries(parsed));
        console.log(`📂 Loaded ${this.store.size} documents from ${this.filePath}`);
      }
    } catch (error) {
      console.error('Error loading document store:', error);
    }
  }

  private saveToFile(): void {
    try {
      const fs = require('fs');
      const data = Object.fromEntries(this.store);
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      console.log(`💾 Saved ${this.store.size} documents to ${this.filePath}`);
    } catch (error) {
      console.error('Error saving document store:', error);
    }
  }

  private startAutoSave(): void {
    this.saveTimer = setInterval(() => {
      this.saveToFile();
    }, this.saveInterval);
    
    // Save on process exit
    process.on('beforeExit', () => {
      this.saveToFile();
    });
    
    process.on('SIGINT', () => {
      this.saveToFile();
      process.exit();
    });
  }

  destroy(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
    this.saveToFile();
  }
}