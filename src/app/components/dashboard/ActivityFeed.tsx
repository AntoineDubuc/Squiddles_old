/**
 * Activity Feed Component
 * Implements TICKET-004: Create Main Dashboard UI
 */

"use client";

import React, { useState } from 'react';
import { ActivityFeedItem } from '../../types/ui-models';
import { formatTicketDuration } from '../../../lib/utils/ticket-utils';

interface ActivityFeedProps {
  collapsed: boolean;
  activities: ActivityFeedItem[];
  mentions: ActivityFeedItem[];
}

export default function ActivityFeed({ collapsed, activities, mentions }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'mentions'>('activity');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'ticket_update':
        return '✏️';
      case 'mention':
        return '📬';
      case 'status_change':
        return '🔄';
      case 'assignment':
        return '👤';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'comment':
        return 'text-blue-600';
      case 'ticket_update':
        return 'text-green-600';
      case 'mention':
        return 'text-purple-600';
      case 'status_change':
        return 'text-orange-600';
      case 'assignment':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatActivityMessage = (activity: ActivityFeedItem) => {
    const { action, targetTitle, actorName } = activity;
    
    switch (activity.type) {
      case 'comment':
        return `${actorName} commented on "${targetTitle}"`;
      case 'ticket_update':
        return `${actorName} ${action} "${targetTitle}"`;
      case 'mention':
        return `${actorName} mentioned you in "${targetTitle}"`;
      case 'status_change':
        return `${actorName} changed status of "${targetTitle}"`;
      case 'assignment':
        return `${actorName} assigned "${targetTitle}"`;
      default:
        return `${actorName} ${action} "${targetTitle}"`;
    }
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center justify-start pt-6">
        {/* Collapsed state - just icons */}
        <button
          onClick={() => {}}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="Activity Feed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        {mentions.length > 0 && (
          <div className="mt-2">
            <div className="relative">
              <button
                className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title={`${mentions.length} mentions`}
              >
                <span className="text-lg">📬</span>
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {mentions.length}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'activity'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('mentions')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
              activeTab === 'mentions'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mentions
            {mentions.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {mentions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'activity' ? (
          <div className="px-4 py-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      !activity.read ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <img
                      src={activity.actorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.actorName)}&background=3B82F6&color=fff`}
                      alt={activity.actorName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                        {!activity.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        {formatActivityMessage(activity)}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {formatTicketDuration(activity.timestamp)}
                      </p>
                      
                      {/* Additional data */}
                      {activity.data && activity.type === 'comment' && activity.data.comment && (
                        <p className="text-xs text-gray-600 mt-2 italic">
                          "{activity.data.comment.substring(0, 60)}..."
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 py-4">
            {mentions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">📬</span>
                <p className="text-sm">No mentions</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll see mentions here when someone @mentions you
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mentions.map((mention) => (
                  <div
                    key={mention.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 cursor-pointer transition-colors"
                  >
                    {/* Avatar */}
                    <img
                      src={mention.actorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mention.actorName)}&background=7C3AED&color=fff`}
                      alt={mention.actorName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">📬</span>
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      </div>
                      
                      <p className="text-sm text-purple-900 font-medium mb-1">
                        {formatActivityMessage(mention)}
                      </p>
                      
                      <p className="text-xs text-purple-600">
                        {formatTicketDuration(mention.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}