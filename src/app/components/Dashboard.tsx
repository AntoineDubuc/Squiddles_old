/**
 * Main Dashboard Component - Complete mockup implementation
 */

"use client";

import React from 'react';

interface DashboardProps {
  onNavigateToVoice?: () => void;
  onNavigateToTickets?: () => void;
  onStartVoiceSession?: () => void;
  onEndVoiceSession?: () => void;
  sessionStatus?: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  isListening?: boolean;
}

export default function Dashboard({ onNavigateToVoice, onNavigateToTickets, onStartVoiceSession, onEndVoiceSession, sessionStatus = 'DISCONNECTED', isListening = false }: DashboardProps) {
  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo">🦑 Squiddles</div>
              <nav className="nav">
                <div className="nav-item active">Dashboard</div>
                <div className="nav-item">Projects</div>
                <div className="nav-item">Team</div>
                <div className="nav-item">Reporting</div>
              </nav>
            </div>
            <div className="header-right">
              <div className="notification-button">
                🔔
                <div className="notification-badge">3</div>
              </div>
              <div 
                className="global-voice-button" 
                onClick={sessionStatus === 'DISCONNECTED' ? onStartVoiceSession : onEndVoiceSession}
                style={{
                  background: sessionStatus === 'CONNECTED' && isListening 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(34, 197, 94, 0.9))'
                    : sessionStatus === 'CONNECTING'
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(251, 191, 36, 0.9))'
                    : sessionStatus === 'CONNECTED'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9))',
                  animation: sessionStatus === 'CONNECTED' && isListening ? 'pulse 2s infinite' : 'none'
                }}
              >
                {sessionStatus === 'CONNECTED' && isListening ? '🎙️' : 
                 sessionStatus === 'CONNECTING' ? '⏳' :
                 sessionStatus === 'CONNECTED' ? '⏹️' : '🎙️'}
              </div>
              <div className="user-menu">
                <div className="user-avatar">👤</div>
                <div>
                  <div style={{fontSize: '0.875rem', fontWeight: 500}}>Jordan Kim</div>
                  <div style={{fontSize: '0.75rem', color: '#A1A1AA'}}>Product Manager</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="main-layout">
          <main className="main-content">
            <div className="welcome-section">
              <h1 className="welcome-title">Welcome back, Jordan</h1>
              <p className="welcome-subtitle">You have 3 mentions and 5 new comments on your team's tickets</p>
            </div>

            <div className="primary-action-hero">
              <div 
                className="hero-voice-button" 
                onClick={sessionStatus === 'DISCONNECTED' ? onStartVoiceSession : onEndVoiceSession}
                style={{
                  background: sessionStatus === 'CONNECTED' && isListening 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(34, 197, 94, 0.9))'
                    : sessionStatus === 'CONNECTING'
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(251, 191, 36, 0.9))'
                    : sessionStatus === 'CONNECTED'
                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9))',
                  animation: sessionStatus === 'CONNECTED' && isListening ? 'pulse 2s infinite' : 'none'
                }}
              >
                <div className="voice-icon">
                  {sessionStatus === 'CONNECTED' && isListening ? '🎙️' : 
                   sessionStatus === 'CONNECTING' ? '⏳' :
                   sessionStatus === 'CONNECTED' ? '⏹️' : '🎙️'}
                </div>
                <div className="voice-text">
                  <span className="voice-main">
                    {sessionStatus === 'CONNECTED' && isListening ? 'Listening...' :
                     sessionStatus === 'CONNECTING' ? 'Connecting...' :
                     sessionStatus === 'CONNECTED' ? 'Stop session' :
                     'Just ask me'}
                  </span>
                  <span className="voice-sub">
                    {sessionStatus === 'CONNECTED' && isListening ? 'Click to stop' :
                     sessionStatus === 'CONNECTED' ? 'Click to end voice session' : 
                     sessionStatus === 'CONNECTING' ? 'Please wait...' :
                     'Press Space or click to speak'}
                  </span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="hero-button" onClick={onNavigateToTickets}>
                  <span>➕</span>
                  <span>Create Ticket</span>
                </button>
                <button className="hero-button secondary">
                  <span>📌</span>
                  <span>Check Mentions</span>
                </button>
                <button className="hero-button secondary">
                  <span>📊</span>
                  <span>View Sprint</span>
                </button>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <div>
                    <div className="metric-value">23</div>
                    <div className="metric-label">Active Tickets</div>
                  </div>
                  <div className="metric-icon">📋</div>
                </div>
                <div className="metric-change positive">
                  <span>↑</span>
                  <span>5 from last week</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <div>
                    <div className="metric-value">68%</div>
                    <div className="metric-label">Sprint Progress</div>
                  </div>
                  <div className="metric-icon">⚡</div>
                </div>
                <div className="metric-change positive">
                  <span>→</span>
                  <span>On track</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <div>
                    <div className="metric-value">3</div>
                    <div className="metric-label">Mentions</div>
                  </div>
                  <div className="metric-icon">📌</div>
                </div>
                <div className="metric-change negative">
                  <span>↑</span>
                  <span>Need response</span>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-header">
                  <div>
                    <div className="metric-value">12</div>
                    <div className="metric-label">Comments Today</div>
                  </div>
                  <div className="metric-icon">💬</div>
                </div>
                <div className="metric-change positive">
                  <span>↑</span>
                  <span>Team is active</span>
                </div>
              </div>
            </div>

            <div className="activity-feed">
              <div className="section-header">
                <h2 className="section-title">
                  <span>💬</span>
                  <span>Activity Feed</span>
                </h2>
                <span className="view-all-link">View all →</span>
              </div>

              <div className="activity-group">
                <h3 className="activity-group-title">
                  <span>📌</span>
                  <span>You were mentioned</span>
                  <span className="mention-badge">3</span>
                </h3>
                
                <div className="comment-card mention">
                  <div className="comment-header">
                    <div className="comment-meta">
                      <span className="comment-ticket">PROD-234</span>
                      <span>•</span>
                      <span className="comment-author">Sarah Rodriguez</span>
                      <span>•</span>
                      <span className="comment-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="comment-content">
                    <span className="mention">@JordanKim</span> can you clarify the acceptance criteria for mobile checkout? The team has questions about offline mode handling and whether we should support saved payment methods in the first release.
                  </div>
                  <div className="comment-actions">
                    <button className="comment-action primary">View Comment</button>
                    <button className="comment-action">Quick Reply</button>
                    <button className="comment-action">Add to Sprint</button>
                  </div>
                </div>

                <div className="comment-card mention">
                  <div className="comment-header">
                    <div className="comment-meta">
                      <span className="comment-ticket">SPIKE-156</span>
                      <span>•</span>
                      <span className="comment-author">Alex Chen</span>
                      <span>•</span>
                      <span className="comment-time">5 hours ago</span>
                    </div>
                  </div>
                  <div className="comment-content">
                    <span className="mention">@JordanKim</span> <span className="mention">@MichaelChen</span> the research is complete. Key findings: 3 viable auth providers (Auth0, Okta, Firebase). Recommendation: Auth0 for enterprise features. Full comparison in the ticket.
                  </div>
                  <div className="comment-actions">
                    <button className="comment-action primary">View Research</button>
                    <button className="comment-action">Schedule Review</button>
                  </div>
                </div>
              </div>

              <div className="activity-group">
                <h3 className="activity-group-title">
                  <span>👥</span>
                  <span>Team Activity (Your Tickets)</span>
                </h3>
                
                <div className="comment-card">
                  <div className="comment-header">
                    <div className="comment-meta">
                      <span className="comment-ticket">TASK-567</span>
                      <span>•</span>
                      <span className="comment-author">Engineering Team</span>
                      <span>•</span>
                      <span className="comment-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="comment-content">
                    API documentation has been updated. All endpoints now include rate limiting information and error response examples. Ready for review.
                  </div>
                  <div className="comment-context">
                    Ticket: Update payment endpoints • Owner: Alex Chen • Status: In Review
                  </div>
                  <div className="comment-actions">
                    <button className="comment-action">View Changes</button>
                    <button className="comment-action">Approve</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-tickets">
              <div className="section-header">
                <h2 className="section-title">Recent Tickets</h2>
                <span className="view-all-link">View all →</span>
              </div>
              
              <div className="tickets-grid">
                <div className="ticket-card">
                  <div className="ticket-info">
                    <div className="ticket-id">PROD-234</div>
                    <div className="ticket-title">Implement checkout flow optimization for mobile users</div>
                    <div className="ticket-meta">
                      <span>Updated 2 hours ago</span>
                      <span>•</span>
                      <span>Sprint 42</span>
                      <span>•</span>
                      <span>Sarah Rodriguez</span>
                    </div>
                  </div>
                  <div className="ticket-type story">
                    <span>📖</span>
                    <span>Story</span>
                  </div>
                </div>

                <div className="ticket-card">
                  <div className="ticket-info">
                    <div className="ticket-id">TASK-567</div>
                    <div className="ticket-title">Update API documentation for payment endpoints</div>
                    <div className="ticket-meta">
                      <span>Created yesterday</span>
                      <span>•</span>
                      <span>Sprint 42</span>
                      <span>•</span>
                      <span>Alex Chen</span>
                    </div>
                  </div>
                  <div className="ticket-type task">
                    <span>✓</span>
                    <span>Task</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="recent-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-header">
                <h3 className="sidebar-title">
                  <span>📌</span>
                  <span>Mentions & Comments</span>
                </h3>
                <span className="mention-badge">3</span>
              </div>
              
              <div className="recent-item mention">
                <div className="recent-item-title">@JordanKim in PROD-234</div>
                <div className="recent-item-meta">Sarah Rodriguez • 2h ago</div>
                <div className="recent-item-preview">"can you clarify the acceptance criteria..."</div>
              </div>
              
              <div className="recent-item mention">
                <div className="recent-item-title">@JordanKim in SPIKE-156</div>
                <div className="recent-item-meta">Alex Chen • 5h ago</div>
                <div className="recent-item-preview">"research is complete. Key findings..."</div>
              </div>
              
              <div className="recent-item mention">
                <div className="recent-item-title">@JordanKim in BUG-890</div>
                <div className="recent-item-meta">QA Team • Yesterday</div>
                <div className="recent-item-preview">"bug is affecting 15% of checkouts..."</div>
              </div>
              
              <div className="recent-item">
                <div className="recent-item-title">New comment on TASK-567</div>
                <div className="recent-item-meta">Engineering • 1h ago</div>
                <div className="recent-item-preview">"API documentation updated..."</div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Voice History</h3>
              <div className="voice-history-item">
                <span>🎙️</span>
                <span>"Show me where I'm mentioned"</span>
              </div>
              <div className="voice-history-item">
                <span>🎙️</span>
                <span>"What comments need my response?"</span>
              </div>
              <div className="voice-history-item">
                <span>🎙️</span>
                <span>"Check team activity today"</span>
              </div>
              <div className="voice-history-item">
                <span>🎙️</span>
                <span>"Any blockers in comments?"</span>
              </div>
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Quick Actions</h3>
              <div className="recent-item">
                <div className="recent-item-title">Sprint planning tomorrow</div>
                <div className="recent-item-meta">2:00 PM - 3:30 PM</div>
              </div>
              <div className="recent-item">
                <div className="recent-item-title">3 tickets need priority</div>
                <div className="recent-item-meta">Set before sprint planning</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}