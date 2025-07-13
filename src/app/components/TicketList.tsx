/**
 * TicketList Component - Displays Jira tickets with cutting-edge design
 * Features holographic effects, animations, and dark theme aesthetics
 */

"use client";

import React from 'react';
import { formatRelativeTime } from '../lib/utils';

export interface JiraTicketDisplay {
  key: string;
  summary: string;
  description?: string;
  status: string;
  priority: string;
  assignee: string | null;
  reporter: string;
  created: string;
  type: string;
  url: string;
}

interface TicketListProps {
  tickets: JiraTicketDisplay[];
  totalCount: number;
  voiceMessage: string;
  onTicketClick?: (ticket: JiraTicketDisplay) => void;
}

export default function TicketList({ tickets, totalCount, voiceMessage, onTicketClick }: TicketListProps) {
  const getPriorityClass = (priority: string): string => {
    const p = priority.toLowerCase();
    if (p === 'highest' || p === 'critical') return 'highest';
    if (p === 'high') return 'high';
    if (p === 'medium') return 'medium';
    return 'low';
  };

  const getStatusClass = (status: string): string => {
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'in-progress';
    if (s === 'done' || s === 'released' || s === 'closed') return 'done';
    return 'todo';
  };

  const getStatusEmoji = (status: string): string => {
    const s = status.toLowerCase();
    if (s.includes('progress')) return '🔄';
    if (s === 'done' || s === 'released' || s === 'closed') return '✅';
    return '📋';
  };

  const getTypeIcon = (type: string): string => {
    const t = type.toLowerCase();
    if (t === 'bug') return '🐛';
    if (t === 'task') return '📋';
    if (t === 'epic') return '🎯';
    if (t === 'page') return '📄';
    if (t === 'story') return '📖';
    if (t === 'subtask') return '📝';
    return '✨';
  };

  const getPriorityIcon = (priority: string): string => {
    const p = priority.toLowerCase();
    if (p === 'highest' || p === 'critical') return '🔥';
    if (p === 'high') return '⚡';
    if (p === 'medium') return '◐';
    return '○';
  };

  const getInitials = (name: string | null | undefined): string => {
    if (!name || typeof name !== 'string') return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="ticket-list-container">
      {/* Floating orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      {/* Voice response with neon glow */}
      <div className="voice-response-card">
        <div className="voice-content">
          <div className="voice-icon">🎙️</div>
          <div className="voice-text">{voiceMessage}</div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="ticket-list">
        {tickets.map((ticket, index) => (
          <div
            key={ticket.key}
            className="ticket-card"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onTicketClick?.(ticket)}
          >
            <div className={`priority-bar ${getPriorityClass(ticket.priority)}`}></div>
            <div className="ticket-content">
              {/* Left section - Key and status */}
              <div className="ticket-meta">
                <div className="ticket-key-wrapper">
                  <a
                    href={ticket.url}
                    className="ticket-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ticket.key}
                  </a>
                </div>
                <div className={`status-badge status-${getStatusClass(ticket.status)}`}>
                  <span className="status-indicator"></span>
                  <span>{ticket.status}</span>
                </div>
              </div>

              {/* Center section - Title and description */}
              <div className="ticket-details">
                <div className="ticket-header">
                  <div className="ticket-type">
                    <span className="type-icon">{getTypeIcon(ticket.type)}</span>
                    <span>{ticket.type.toUpperCase()}</span>
                  </div>
                  <h3 className="ticket-title">{ticket.summary}</h3>
                  <p className="ticket-description">
                    {ticket.description || (ticket.type === 'Page' ? 'No content preview available' : 'No description provided')}
                  </p>
                </div>
                <div className="ticket-footer">
                  <div className="ticket-reporter">
                    <div className="reporter-avatar">{getInitials(typeof ticket.reporter === 'object' ? ticket.reporter?.displayName : ticket.reporter)}</div>
                    <span>{typeof ticket.reporter === 'object' ? ticket.reporter?.displayName || 'Unknown' : ticket.reporter || 'Unknown'}</span>
                  </div>
                  <div className="ticket-time">
                    <span>⏱</span>
                    <span>{formatRelativeTime(ticket.created)}</span>
                  </div>
                </div>
              </div>

              {/* Right section - Actions */}
              <div className="ticket-actions">
                <div className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                  <span>{getPriorityIcon(ticket.priority)}</span>
                  <span>{ticket.priority.toUpperCase()}</span>
                </div>
                <a
                  href={ticket.url}
                  className="ticket-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="ticket-summary">
        <div className="summary-text">
          ✨ Showing {tickets.length} of {totalCount} tickets matching your search
        </div>
      </div>
    </div>
  );
}