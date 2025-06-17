/**
 * Quick Actions Sidebar Component
 * Implements TICKET-004: Create Main Dashboard UI
 * Enhanced for TICKET-005: Build Voice Input Component
 */

"use client";

import React from 'react';
import VoiceInput from '../VoiceInput';

interface QuickActionsProps {
  collapsed: boolean;
  onNavigateToVoice?: () => void;
  onNavigateToTickets?: () => void;
}

export default function QuickActions({ 
  collapsed, 
  onNavigateToVoice, 
  onNavigateToTickets 
}: QuickActionsProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      active: true,
      action: () => console.log('Navigate to dashboard'),
    },
    {
      id: 'voice',
      label: 'Voice Interface',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      active: false,
      action: onNavigateToVoice,
      badge: 'NEW',
    },
    {
      id: 'tickets',
      label: 'All Tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      active: false,
      action: onNavigateToTickets,
    },
    {
      id: 'sprints',
      label: 'Sprints',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      active: false,
      action: () => console.log('Navigate to sprints'),
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      active: false,
      action: () => console.log('Navigate to projects'),
    },
  ];

  const quickCreateItems = [
    {
      id: 'create-story',
      label: 'User Story',
      icon: '📖',
      action: () => console.log('Create user story'),
    },
    {
      id: 'create-task',
      label: 'Task',
      icon: '✏️',
      action: () => console.log('Create task'),
    },
    {
      id: 'create-bug',
      label: 'Bug Report',
      icon: '🐛',
      action: () => console.log('Create bug report'),
    },
  ];

  const integrationItems = [
    {
      id: 'jira',
      label: 'Jira',
      icon: '🔗',
      status: 'connected',
      action: () => console.log('Open Jira integration'),
    },
    {
      id: 'slack',
      label: 'Slack',
      icon: '💬',
      status: 'connected',
      action: () => console.log('Open Slack integration'),
    },
    {
      id: 'pinecone',
      label: 'Pinecone',
      icon: '🌲',
      status: 'connected',
      action: () => console.log('Open Pinecone integration'),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!collapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
          )}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.active
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Quick Create */}
        {!collapsed && (
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Create
            </h3>
            <div className="space-y-1">
              {quickCreateItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Shortcut */}
        {!collapsed && (
          <div className="pt-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎙️</span>
                <span className="text-sm font-semibold text-purple-900">Voice Commands</span>
              </div>
              <p className="text-xs text-purple-700 mb-3">
                Quick voice input for creating tickets and getting help
              </p>
              <VoiceInput
                variant="inline"
                size="sm"
                persistSession={false}
                className="w-full text-purple-700 bg-white border border-purple-200 hover:bg-purple-50"
                onSessionStart={() => console.log('🎙️ Quick voice session started')}
              />
              <div className="mt-2 text-center">
                <button
                  onClick={onNavigateToVoice}
                  className="text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  Open Full Voice Interface
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Integrations Status */}
      <div className="border-t border-gray-200 px-4 py-4">
        {!collapsed && (
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Integrations
          </h3>
        )}
        <div className="space-y-2">
          {integrationItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              title={collapsed ? `${item.label} - ${item.status}` : undefined}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        {!collapsed ? (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Squiddles v1.0.0
            </p>
            <p className="text-xs text-gray-400">
              Voice-Driven PM
            </p>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-lg">🦑</span>
          </div>
        )}
      </div>
    </div>
  );
}