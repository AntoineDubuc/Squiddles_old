"use client";

import React from 'react';
import TicketList, { JiraTicketDisplay } from '../components/TicketList';

// Demo data showing enhanced descriptions
const mockTickets: JiraTicketDisplay[] = [
  {
    key: "DEMO-123",
    summary: "Implement user authentication system",
    description: "This epic involves building a comprehensive authentication system with OAuth2 integration, multi-factor authentication, and role-based access control. The system should support social logins and maintain security best practices.",
    status: "In Progress",
    priority: "High",
    assignee: "John Smith",
    reporter: "Jane Doe",
    created: "2024-01-15T10:30:00Z",
    type: "Epic",
    url: "https://demo.atlassian.net/browse/DEMO-123"
  },
  {
    key: "DEMO-124", 
    summary: "Fix login button not responding on mobile",
    description: "Users on mobile devices are reporting that the login button becomes unresponsive after the first tap. This appears to be related to touch event handling.",
    status: "Done",
    priority: "Critical",
    assignee: "Alice Johnson",
    reporter: "Support Team",
    created: "2024-01-16T14:20:00Z", 
    type: "Bug",
    url: "https://demo.atlassian.net/browse/DEMO-124"
  },
  {
    key: "PAGE-001",
    summary: "API Documentation - Authentication Endpoints",
    description: "Comprehensive documentation covering all authentication-related API endpoints including OAuth flows, token management, user registration, and password reset procedures with code examples.",
    status: "Published",
    priority: "Medium", 
    assignee: "Technical Writer",
    reporter: "Development Team",
    created: "2024-01-17T09:15:00Z",
    type: "Page",
    url: "https://demo.confluence.com/display/API/auth"
  }
];

export default function DemoDescriptions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Enhanced Descriptions Demo
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how Jira tickets and Confluence pages now display rich descriptions 
            and excerpts in their card layouts, providing better context at a glance.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🎯 Smart Truncation</h3>
            <p className="text-gray-300 text-sm">
              Descriptions are intelligently truncated at word boundaries with 200 character limits
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">📄 Rich Content</h3>
            <p className="text-gray-300 text-sm">
              Handles ADF format from Jira and HTML content from Confluence with clean text extraction
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">🎨 Enhanced UI</h3>
            <p className="text-gray-300 text-sm">
              Better space utilization with 3-line descriptions and improved visual hierarchy
            </p>
          </div>
        </div>

        {/* Demo Tickets */}
        <TicketList 
          tickets={mockTickets}
          totalCount={mockTickets.length}
          voiceMessage="Demo: Enhanced ticket and page descriptions are now visible!"
        />

        {/* Back Link */}
        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            ← Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
}