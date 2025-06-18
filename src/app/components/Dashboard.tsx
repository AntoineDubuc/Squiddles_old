/**
 * Main Dashboard Component - Simplified with Navigation
 */

"use client";

import React, { useState, useEffect } from 'react';

interface DashboardProps {
  onNavigateToVoice?: () => void;
  onNavigateToTickets?: () => void;
  onStartVoiceSession?: () => void;
  onEndVoiceSession?: () => void;
  sessionStatus?: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  isListening?: boolean;
}

export default function Dashboard({ onNavigateToVoice, onNavigateToTickets, onStartVoiceSession, onEndVoiceSession, sessionStatus = 'DISCONNECTED', isListening = false }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle spacebar for voice activation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        if (sessionStatus === 'DISCONNECTED' && onStartVoiceSession) {
          onStartVoiceSession();
        } else if (sessionStatus === 'CONNECTED' && onEndVoiceSession) {
          onEndVoiceSession();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessionStatus, onStartVoiceSession, onEndVoiceSession]);

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && !sidebarCollapsed) {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.sidebar-toggle');
        
        if (sidebar && toggle && 
            !sidebar.contains(event.target as Node) && 
            !toggle.contains(event.target as Node)) {
          setSidebarCollapsed(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarCollapsed]);

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarCollapsed);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleActivity = () => {
    setActivityExpanded(!activityExpanded);
  };

  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <div className="app-layout">
          {/* Left Sidebar */}
          <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobile && !sidebarCollapsed ? 'open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <img 
                  src="/images/squiddles_logo_nobg.png" 
                  alt="Squiddles Logo" 
                  className="sidebar-logo-image"
                  onError={(e) => {
                    console.log('Sidebar logo image failed to load');
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'inline';
                  }}
                />
                <span className="sidebar-logo-fallback" style={{display: 'none', fontSize: '24px'}}>🦑</span>
                <span className="sidebar-logo-text">Squiddles</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-title">Overview</div>
              <div className="nav-item active">
                <span>🏠</span>
                <span>Dashboard</span>
              </div>
              <div className="nav-item">
                <span>📊</span>
                <span>Analytics</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-title">Voice Interface</div>
              <div className="nav-item" onClick={onNavigateToVoice}>
                <span>🎙️</span>
                <span>Voice Assistant</span>
              </div>
              <div className="nav-item">
                <span>📝</span>
                <span>Story Creation</span>
              </div>
              <div className="nav-item">
                <span>📋</span>
                <span>Template Manager</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-title">Project Management</div>
              <div className="nav-item" onClick={onNavigateToTickets}>
                <span>🎫</span>
                <span>Tickets</span>
              </div>
              <div className="nav-item">
                <span>👥</span>
                <span>Team</span>
              </div>
              <div className="nav-item">
                <span>📈</span>
                <span>Reports</span>
              </div>
            </div>

            <div className="nav-section">
              <div className="nav-title">Configuration</div>
              <div className="nav-item">
                <span>⚙️</span>
                <span>Settings</span>
              </div>
              <div className="nav-item">
                <span>🔗</span>
                <span>Integrations</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-area">
            {/* Top Header */}
            <header className="header">
              <div className="header-left">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                  <span>{sidebarCollapsed ? '☰' : '✕'}</span>
                </button>
                
                {/* Top Navigation Menu */}
                <nav className="top-nav">
                  <div className="top-nav-item active">Dashboard</div>
                  <div className="top-nav-item">Projects</div>
                  <div className="top-nav-item">Team</div>
                  <div className="top-nav-item">Reports</div>
                </nav>
              </div>
              
              <div className="header-right">
                <div className="notification-button">
                  🔔
                  <div className="notification-badge">3</div>
                </div>
                <div className="user-avatar">👤</div>
              </div>
            </header>

            {/* Main Content - Centered and Spacious */}
            <main className="main-content">
              {/* Welcome Section */}
              <div className="welcome-section">
                <h1 className="welcome-title">Welcome back, Jordan</h1>
                <p className="welcome-subtitle">You have 3 mentions waiting for your response</p>
              </div>

              {/* Hero Voice Section - Primary Focus */}
              <div className="hero-voice-section">
                <div 
                  className={`hero-voice-button enhanced ${sessionStatus === 'CONNECTED' && isListening ? 'listening' : ''}`}
                  onClick={sessionStatus === 'DISCONNECTED' ? onStartVoiceSession : onEndVoiceSession}
                  style={{
                    background: sessionStatus === 'CONNECTED' && isListening 
                      ? 'linear-gradient(135deg, #10B981, #22C55E)'
                      : sessionStatus === 'CONNECTING'
                      ? 'linear-gradient(135deg, #F59E0B, #FBB04C)'
                      : sessionStatus === 'CONNECTED'
                      ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                      : undefined,
                    boxShadow: sessionStatus === 'CONNECTED' && isListening 
                      ? '0 12px 40px rgba(16, 185, 129, 0.4)'
                      : sessionStatus === 'CONNECTING'
                      ? '0 12px 40px rgba(245, 158, 11, 0.4)'
                      : sessionStatus === 'CONNECTED'
                      ? '0 12px 40px rgba(239, 68, 68, 0.4)'
                      : undefined
                  }}
                >
                  <img 
                    src="/images/squiddles_logo_nobg.png" 
                    alt="Squiddles Logo" 
                    className="voice-background-icon"
                    onError={(e) => {
                      console.log('Voice background logo failed to load, using fallback');
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="voice-background-icon" style={{display: 'none', fontSize: '12rem'}}>🦑</div>
                </div>
                <div className="voice-instruction-text">
                  {sessionStatus === 'CONNECTED' && isListening ? 'Click to stop' :
                   sessionStatus === 'CONNECTED' ? 'Click to end voice session' : 
                   sessionStatus === 'CONNECTING' ? 'Please wait...' :
                   'Press Space or click to speak'}
                </div>
              </div>

              {/* Essential Metrics Only */}
              <div className="essential-metrics">
                <div className="metric-card">
                  <div className="metric-header">
                    <div>
                      <div className="metric-value">23</div>
                      <div className="metric-label">Active Tickets</div>
                    </div>
                    <div className="metric-icon">📋</div>
                  </div>
                  <div className="metric-change normal">
                    <span>↑</span>
                    <span>5 from last week</span>
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
                  <div className="metric-change urgent">
                    <span>⚠️</span>
                    <span>Need response</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Activity Section */}
              <div className="activity-section">
                <div className="activity-header" onClick={toggleActivity}>
                  <div className="activity-title">
                    <span>💬</span>
                    <span>Recent Activity</span>
                  </div>
                  <div className="expand-icon">{activityExpanded ? '▲' : '▼'}</div>
                </div>
                {activityExpanded && (
                  <div className="activity-content">
                    <div className="activity-item mention">
                      <div className="activity-meta">
                        <span>PROD-234</span>
                        <span>•</span>
                        <span>Sarah Rodriguez</span>
                        <span>•</span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="activity-content-text">
                        <span className="mention">@JordanKim</span> can you clarify the acceptance criteria for mobile checkout? The team has questions about offline mode handling.
                      </div>
                    </div>
                    
                    <div className="activity-item mention">
                      <div className="activity-meta">
                        <span>SPIKE-156</span>
                        <span>•</span>
                        <span>Alex Chen</span>
                        <span>•</span>
                        <span>5 hours ago</span>
                      </div>
                      <div className="activity-content-text">
                        <span className="mention">@JordanKim</span> the research is complete. Key findings: 3 viable auth providers. Recommendation: Auth0 for enterprise features.
                      </div>
                    </div>
                    
                    <div className="activity-item">
                      <div className="activity-meta">
                        <span>TASK-567</span>
                        <span>•</span>
                        <span>Engineering Team</span>
                        <span>•</span>
                        <span>1 hour ago</span>
                      </div>
                      <div className="activity-content-text">
                        API documentation has been updated. All endpoints now include rate limiting information and error response examples.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}