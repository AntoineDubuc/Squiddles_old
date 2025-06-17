/**
 * Tickets List Component
 * Implements TICKET-004: Create Main Dashboard UI
 */

"use client";

import React from 'react';
import { EnhancedTicket } from '../../types/ui-models';
import { getTicketStatusDisplay, getTicketPriorityDisplay, getTicketTypeDisplay, formatTicketDuration } from '../../../lib/utils/ticket-utils';

interface TicketsListProps {
  tickets: EnhancedTicket[];
  onTicketClick: (ticketId: string) => void;
  title: string;
  showAll?: boolean;
  maxItems?: number;
}

export default function TicketsList({ 
  tickets, 
  onTicketClick, 
  title, 
  showAll = false,
  maxItems = 5 
}: TicketsListProps) {
  const displayTickets = showAll ? tickets : tickets.slice(0, maxItems);

  if (tickets.length === 0) {
    return (
      <div className="px-6 py-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No tickets to display</p>
          <p className="text-sm text-gray-400 mt-1">Create your first ticket using voice commands!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {!showAll && tickets.length > maxItems && (
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all {tickets.length} tickets
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayTickets.map((ticket) => {
          const statusDisplay = getTicketStatusDisplay(ticket.status);
          const priorityDisplay = getTicketPriorityDisplay(ticket.priority);
          const typeDisplay = getTicketTypeDisplay(ticket.type);

          return (
            <div
              key={ticket.id}
              onClick={() => onTicketClick(ticket.id)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-mono text-gray-500">{ticket.jiraKey}</span>
                    {ticket.createdViaVoice && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        🎙️ Voice
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {ticket.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-1 ml-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                    {statusDisplay.icon} {statusDisplay.label}
                  </span>
                  {ticket.storyPoints && (
                    <span className="text-xs text-gray-500">
                      {ticket.storyPoints} pts
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Type */}
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeDisplay.color}`}>
                    {typeDisplay.icon} {typeDisplay.label}
                  </span>

                  {/* Priority */}
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityDisplay.color}`}>
                    {priorityDisplay.icon} {priorityDisplay.label}
                  </span>

                  {/* Assignee */}
                  {ticket.assigneeName && (
                    <div className="flex items-center space-x-1">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.assigneeName)}&background=3B82F6&color=fff&size=24`}
                        alt={ticket.assigneeName}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-xs text-gray-600">{ticket.assigneeName}</span>
                    </div>
                  )}

                  {/* Sprint */}
                  {ticket.sprintName && (
                    <span className="text-xs text-gray-500">
                      📋 {ticket.sprintName}
                    </span>
                  )}
                </div>

                {/* Time info */}
                <div className="text-xs text-gray-500">
                  Updated {formatTicketDuration(ticket.updatedAt)}
                </div>
              </div>

              {/* Progress indicators */}
              {(ticket.sections.length > 0 || (ticket.acceptanceCriteria?.length || 0) > 0 || ticket.comments.length > 0) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    {ticket.sections.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{ticket.sections.length} sections</span>
                      </span>
                    )}
                    
                    {(ticket.acceptanceCriteria?.length || 0) > 0 && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{ticket.acceptanceCriteria?.length || 0} criteria</span>
                      </span>
                    )}
                    
                    {ticket.comments.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{ticket.comments.length} comments</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more button */}
      {!showAll && tickets.length > maxItems && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
            Show {tickets.length - maxItems} more tickets
          </button>
        </div>
      )}
    </div>
  );
}