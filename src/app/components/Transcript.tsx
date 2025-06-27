"use client";

import React, { useEffect, useRef } from 'react';
import { TranscriptItem } from '../types';

interface TranscriptProps {
  items: TranscriptItem[];
}

export default function Transcript({ items }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleIcon = (role?: TranscriptItem['role']) => {
    switch (role) {
      case 'user': return '👤';
      case 'assistant': return '🤖';
      default: return '💬';
    }
  };

  const getRoleColor = (role?: TranscriptItem['role']) => {
    switch (role) {
      case 'user': return 'bg-blue-900 bg-opacity-20 border-blue-500 border-opacity-30';
      case 'assistant': return 'bg-green-900 bg-opacity-20 border-green-500 border-opacity-30';
      default: return 'bg-gray-800 bg-opacity-30 border-gray-600 border-opacity-30';
    }
  };

  // Helper function to detect and parse Confluence search results
  const parseConfluenceResults = (item: TranscriptItem) => {
    try {
      const content = item.data?.content || item.data?.text || '';
      
      // First, check if content contains JSON-like data for Confluence results
      if (typeof content === 'string' && (content.includes('"pages"') || content.includes('pages'))) {
        try {
          // Try multiple JSON extraction patterns
          let jsonData = null;
          
          // Pattern 1: Full JSON object
          const fullJsonMatch = content.match(/\{[\s\S]*\}/);
          if (fullJsonMatch) {
            try {
              jsonData = JSON.parse(fullJsonMatch[0]);
            } catch (e) {
              // Try pattern 2: Extract just the tool result
              const toolResultMatch = content.match(/"pages":\s*\[[\s\S]*?\]/);
              if (toolResultMatch) {
                const wrapperJson = `{${toolResultMatch[0]}}`;
                jsonData = JSON.parse(wrapperJson);
              }
            }
          }
          
          if (jsonData && jsonData.pages && Array.isArray(jsonData.pages)) {
            return jsonData.pages.map((page: any) => ({
              title: page.title,
              url: page.url,
              space: page.spaceName || page.spaceKey,
              lastModified: page.lastModified,
              createdDate: page.createdDate,
              author: page.author,
              lastUpdatedBy: page.lastUpdatedBy
            }));
          }
        } catch (e) {
          console.log('Failed to parse JSON from content:', e);
        }
      }
      
      // Check if this is a tool execution result with pages data
      if (item.data && typeof item.data === 'object') {
        // Look for pages array in the data structure
        const data = item.data as any;
        if (data.pages && Array.isArray(data.pages)) {
          return data.pages.map((page: any) => ({
            title: page.title,
            url: page.url,
            space: page.spaceName || page.spaceKey,
            lastModified: page.lastModified,
            createdDate: page.createdDate,
            author: page.author,
            lastUpdatedBy: page.lastUpdatedBy
          }));
        }
        
        // Check if it's nested in a result or similar structure
        if (data.result && data.result.pages && Array.isArray(data.result.pages)) {
          return data.result.pages.map((page: any) => ({
            title: page.title,
            url: page.url,
            space: page.spaceName || page.spaceKey,
            lastModified: page.lastModified,
            createdDate: page.createdDate,
            author: page.author,
            lastUpdatedBy: page.lastUpdatedBy
          }));
        }
      }
      
      // Fallback: parse from content string for markdown links
      if (typeof content === 'string') {
        // Look for markdown-style links in Confluence responses
        const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
        const pages = [];
        let match;
        
        while ((match = linkPattern.exec(content)) !== null) {
          if (match[2].includes('atlassian.net') || match[2].includes('confluence')) {
            pages.push({
              title: match[1].trim(),
              url: match[2].trim()
            });
          }
        }
        
        return pages.length > 0 ? pages : null;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing Confluence results:', error);
      return null;
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Render content with special handling for Confluence results
  const renderContent = (item: TranscriptItem) => {
    const content = item.data?.content || item.data?.text || '';
    const confluenceResults = parseConfluenceResults(item);
    
    
    if (confluenceResults && confluenceResults.length > 0) {
      // Use the cleaned title from the transcript item, or extract a message
      let displayMessage = item.title || content;
      
      // If the title is still raw JSON, extract a better message
      if (displayMessage.includes('{') && displayMessage.includes('"pages"')) {
        const query = displayMessage.match(/matching "([^"]+)"/)?.[1];
        if (query) {
          displayMessage = `I found ${confluenceResults.length} Confluence pages matching "${query}".`;
        } else {
          displayMessage = `I found ${confluenceResults.length} Confluence pages.`;
        }
      }
      
      return (
        <div>
          <p className="whitespace-pre-wrap mb-4 text-gray-100">{displayMessage}</p>
          <div className="confluence-results mt-4 p-4 bg-gradient-to-r from-blue-900 to-indigo-900 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-lg shadow-sm">
            <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
              <span className="mr-2">📖</span>
              Confluence Search Results ({confluenceResults.length} found)
            </h4>
            <div className="space-y-3">
              {confluenceResults.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gray-800 bg-opacity-40 rounded-lg border border-gray-600 border-opacity-30 hover:border-blue-400 hover:border-opacity-50 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
                  title={`Open "${page.title}" in new tab`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 mt-1 text-lg">📄</span>
                    <div className="flex-1 min-w-0">
                      {/* Page Title */}
                      <h4 className="text-blue-300 hover:text-blue-100 font-medium text-base leading-tight mb-2 break-words">
                        {page.title}
                      </h4>
                      
                      {/* Author and Creation Date */}
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                        {page.author && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-400">👤</span>
                            <span>Created by <span className="text-gray-300 font-medium">{page.author.displayName}</span></span>
                          </div>
                        )}
                        {page.createdDate && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">📅</span>
                            <span>{formatDate(page.createdDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Space and Last Modified */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {page.space && (
                          <div className="flex items-center space-x-1">
                            <span>🏢</span>
                            <span>{page.space}</span>
                          </div>
                        )}
                        {page.lastModified && (
                          <div className="flex items-center space-x-1">
                            <span>🔄</span>
                            <span>Updated {formatDate(page.lastModified)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* External Link Icon */}
                    <div className="flex-shrink-0 text-blue-400 opacity-60 hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <p className="whitespace-pre-wrap text-gray-100">
        {content || JSON.stringify(item.data, null, 2)}
      </p>
    );
  };

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto p-4 space-y-4"
      data-testid="transcript"
    >
      {items.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <div className="text-4xl mb-2">🦑</div>
          <p className="text-white">Start a conversation with Squiddles!</p>
          <p className="text-sm mt-2 text-gray-300">Click the microphone to begin speaking</p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.itemId}
            className={`border rounded-lg p-4 ${getRoleColor(item.role)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getRoleIcon(item.role)}</span>
                <span className="font-medium text-sm capitalize">
                  {item.role || item.type}
                  {item.title && ` - ${item.title}`}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatTimestamp(item.timestamp)}
              </span>
            </div>
            
            <div className="text-gray-100">
              {renderContent(item)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}