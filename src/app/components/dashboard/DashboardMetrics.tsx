/**
 * Dashboard Metrics Component
 * Implements TICKET-004: Create Main Dashboard UI
 */

"use client";

import React from 'react';
import { DashboardMetrics as MetricsType } from '../../types/ui-models';

interface DashboardMetricsProps {
  metrics: MetricsType;
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatSessionLength = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Metrics */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Your Work</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.user.activeTickets}</p>
              <p className="text-sm text-blue-700">Active tickets</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-blue-600">
              {metrics.user.completedThisWeek} completed this week
            </span>
            <span className="text-blue-600">
              {metrics.user.totalTickets} total
            </span>
          </div>
          {metrics.user.mentions > 0 && (
            <div className="mt-2 text-sm text-blue-700">
              📬 {metrics.user.mentions} new mentions
            </div>
          )}
          {metrics.user.newComments > 0 && (
            <div className="mt-1 text-sm text-blue-700">
              💬 {metrics.user.newComments} new comments
            </div>
          )}
        </div>

        {/* Sprint Metrics */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Sprint Progress</p>
              <p className="text-2xl font-bold text-green-900">{metrics.sprint.completed}</p>
              <p className="text-sm text-green-700">of {metrics.sprint.capacity} points</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>{metrics.sprint.name}</span>
              <span>{Math.round((metrics.sprint.completed / metrics.sprint.capacity) * 100)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (metrics.sprint.completed / metrics.sprint.capacity) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-green-700">
              {metrics.sprint.daysLeft} days remaining
            </div>
          </div>
        </div>

        {/* Team Metrics */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Team Performance</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.team.velocity}</p>
              <p className="text-sm text-purple-700">velocity</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">Burndown Rate:</span>
              <span className="text-purple-900 font-medium">{metrics.team.burndownRate}/day</span>
            </div>
            {metrics.team.blockedTickets > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-600">🚫 Blocked:</span>
                <span className="text-red-900 font-medium">{metrics.team.blockedTickets}</span>
              </div>
            )}
            {metrics.team.overdueTasks > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">⏰ Overdue:</span>
                <span className="text-orange-900 font-medium">{metrics.team.overdueTasks}</span>
              </div>
            )}
            {metrics.team.blockedTickets === 0 && metrics.team.overdueTasks === 0 && (
              <div className="text-sm text-green-600">
                ✅ All on track
              </div>
            )}
          </div>
        </div>

        {/* Voice Metrics */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600">Voice Activity</p>
              <p className="text-2xl font-bold text-amber-900">{metrics.voice.sessionsToday}</p>
              <p className="text-sm text-amber-700">sessions today</p>
            </div>
            <div className="bg-amber-500 rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">Avg Session:</span>
              <span className="text-amber-900 font-medium">{formatSessionLength(metrics.voice.avgSessionLength)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">Success Rate:</span>
              <span className="text-amber-900 font-medium">{metrics.voice.commandSuccessRate}%</span>
            </div>
            <div className="text-sm text-amber-700">
              Last used: {formatLastUsed(metrics.voice.lastUsed)}
            </div>
          </div>
          {metrics.voice.commandSuccessRate >= 95 && (
            <div className="mt-2 text-sm text-green-600">
              🎯 Excellent performance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}