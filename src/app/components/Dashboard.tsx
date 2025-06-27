/**
 * Main Dashboard Component - Multi-Integration Voice Assistant
 * Supports Jira, Confluence, Slack, and more through voice commands
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useJiraActivityFeed } from '../services/jiraService';
import { useReply } from '../contexts/ReplyContext';
import { useTranscript } from '../contexts/TranscriptContext';
import Transcript from './Transcript';

interface DashboardProps {
  onNavigateToVoice?: () => void;
  onNavigateToTickets?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToIntegrations?: () => void;
  onNavigateToTemplates?: () => void;
  onStartVoiceSession?: () => void;
  onEndVoiceSession?: () => void;
  onTextInput?: (text: string) => void;
  sessionStatus?: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED';
  isListening?: boolean;
}

export default function Dashboard({ onNavigateToVoice, onNavigateToTickets, onNavigateToSettings, onNavigateToIntegrations, onNavigateToTemplates, onStartVoiceSession, onEndVoiceSession, onTextInput, sessionStatus = 'DISCONNECTED', isListening = false }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [pendingTextInput, setPendingTextInput] = useState<string | null>(null);
  
  // Real Jira data integration with pagination
  const { activityFeed, isLoading, error, currentPage, refresh, nextPage, prevPage, loadPage } = useJiraActivityFeed();
  
  // Reply context for voice-enabled comment replies
  const { selectMentionForReply, clearSelectedMention, setVoiceReplyMode, replyState } = useReply();
  
  // Transcript context for conversation display
  const { transcriptItems } = useTranscript();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle text input submission
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // If not connected, start session first and queue the text
    if (sessionStatus === 'DISCONNECTED' && onStartVoiceSession) {
      console.log('🔌 Starting voice session for text input...');
      setPendingTextInput(textInput.trim());
      setTextInput('');
      onStartVoiceSession();
    } else if (sessionStatus === 'CONNECTED' && onTextInput) {
      // Already connected, send immediately
      onTextInput(textInput.trim());
      setTextInput('');
    }
  };

  // Send pending text once session connects
  useEffect(() => {
    if (sessionStatus === 'CONNECTED' && pendingTextInput && onTextInput) {
      console.log('📤 Sending pending text input:', pendingTextInput);
      onTextInput(pendingTextInput);
      setPendingTextInput(null);
    }
  }, [sessionStatus, pendingTextInput, onTextInput]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  // Handle spacebar for voice activation (only when not typing)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger spacebar if user is typing in an input field
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (event.code === 'Space' && !event.repeat && !isTyping) {
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


  // Handle clicks outside sidebar on mobile only
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

    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, sidebarCollapsed]);

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarCollapsed);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleActivity = () => {
    setActivityExpanded(!activityExpanded);
  };

  // Utility function for relative time formatting
  const formatRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return dateObj.toLocaleDateString();
  };

  return (
    <>
      <div className="background-gradient"></div>
      
      {/* Top Header - Full Width */}
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
              <div className="nav-item">
                <span>📝</span>
                <span>Story Creation</span>
              </div>
              <div className="nav-item" onClick={onNavigateToTemplates}>
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
              <div className="nav-item" onClick={onNavigateToSettings}>
                <span>⚙️</span>
                <span>Settings</span>
              </div>
              <div className="nav-item" onClick={onNavigateToIntegrations}>
                <span>🔗</span>
                <span>Integrations</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="main-area">
            {/* Content Wrapper for Centering */}
            <div className="content-wrapper">
              {/* Main Content - Centered and Spacious */}
              <main className="main-content">
              {/* Welcome Section */}
              <div className="welcome-section">
                <h1 className="welcome-title">Welcome back, Antoine</h1>
                <p className="welcome-subtitle">Your voice-powered workspace assistant is ready</p>
              </div>

              {/* Hero Voice Section - Primary Focus */}
              <div className="hero-voice-section">
                <div 
                  className={`svg-microphone-button ${sessionStatus === 'CONNECTED' && isListening ? 'listening' : ''}`}
                  onClick={sessionStatus === 'DISCONNECTED' ? onStartVoiceSession : onEndVoiceSession}
                >
                  <svg viewBox="0 0 160 160" className="microphone-svg">
                    {/* Microphone capsule */}
                    <path d="M72.575813,24.337227 C90.019775,14.899062 111.006821,23.968344 114.820480,43.446560 C115.168907,45.226173 115.311768,47.072208 115.318573,48.888268 C115.360992,60.205475 115.391113,71.523254 115.322739,82.840225 C115.228203,98.486122 102.638100,111.121239 87.093369,111.271851 C71.664284,111.421341 58.822792,98.743019 58.687038,83.095978 C58.593189,72.278694 58.784416,61.458256 58.629086,50.642376 C58.467880,39.417786 62.743896,30.645226 72.575813,24.337227 M93.530128,30.816212 C90.480270,30.120993 87.565414,29.020699 84.251869,29.772255 C74.101601,32.074478 68.030907,38.854221 67.763390,49.406811 C67.489769,60.199940 67.854523,71.000725 67.661629,81.808144 C67.471428,92.464508 75.495987,101.060143 84.921928,101.710281 C96.235840,102.490639 104.370056,96.182739 105.947678,84.446014 C107.523087,72.725769 106.770126,60.866394 106.322441,49.088387 C106.011116,40.897850 102.178101,34.473286 93.530128,30.816212 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                    
                    {/* Stand base */}
                    <path d="M120.522598,147.451294 C118.746017,149.523560 116.695267,149.362518 114.701836,149.363220 C96.216988,149.369705 77.732117,149.358826 59.247295,149.380005 C56.048420,149.383667 52.859486,149.147644 52.836208,144.982071 C52.812374,140.717545 56.112434,140.653488 59.250942,140.658920 C65.246010,140.669296 71.241364,140.687500 77.236076,140.638474 C79.655701,140.618683 82.772263,141.223587 82.558899,137.310745 C82.383621,134.096146 84.421623,130.256546 78.438255,128.989380 C59.180408,124.910957 46.602940,113.230499 41.360355,94.042091 C41.014130,92.774872 40.775211,91.434143 40.772640,90.127045 C40.768223,87.883179 41.868488,86.267235 44.174286,85.865509 C46.401402,85.477493 48.115547,86.442360 49.066853,88.464401 C49.628006,89.657158 49.930527,90.978088 50.290916,92.257835 C55.151535,109.517937 69.838356,120.763008 87.435791,120.685898 C104.525620,120.611008 119.050484,109.111961 123.785057,91.910416 C123.917343,91.429802 124.070045,90.954811 124.202469,90.474228 C125.031120,87.466957 126.496147,84.966431 130.103241,85.987770 C133.651550,86.992477 133.730667,90.046013 133.027878,92.955643 C130.662292,102.749672 125.962631,111.235130 118.353035,117.955925 C111.714058,123.819458 104.015701,127.765083 95.278214,129.097839 C89.462830,129.984879 91.725121,134.092758 91.413071,137.131897 C91.009735,141.059967 94.007118,140.637115 96.492538,140.645905 C102.820610,140.668259 109.149887,140.588455 115.476601,140.685181 C120.587326,140.763306 121.416718,141.858795 120.522598,147.451294 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                    
                    {/* Sound waves */}
                    <path d="M40.657822,54.072617 C40.711891,51.429638 40.548515,49.241032 40.880676,47.130402 C41.227341,44.927589 42.768822,43.687515 45.110374,43.749714 C47.427097,43.811253 49.118099,45.044224 49.163872,47.298023 C49.328846,55.421829 49.333897,63.552525 49.189224,71.676872 C49.142853,74.280823 47.217628,75.401657 44.717007,75.238792 C42.135098,75.070641 40.805424,73.436234 40.751511,70.985077 C40.631142,65.512428 40.678902,60.036091 40.657822,54.072617 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                    <path d="M124.655228,63.949356 C124.661301,58.650436 124.671753,53.842201 124.673782,49.033970 C124.675064,46.005421 125.663589,43.691425 129.145889,43.777306 C132.309692,43.855328 133.320908,46.026886 133.325439,48.845352 C133.336945,55.974731 133.321518,63.104153 133.326538,70.233551 C133.328568,73.101936 132.272385,75.163277 129.105042,75.224243 C125.945038,75.285065 124.761055,73.281555 124.694145,70.408424 C124.647835,68.419754 124.666435,66.429558 124.655228,63.949356 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                    <path d="M29.987934,50.354870 C32.402996,55.934063 31.292788,61.401443 31.007851,66.768280 C30.896009,68.874840 28.850111,70.175858 26.627056,69.930695 C24.488054,69.694794 22.862623,68.350906 22.787531,66.050819 C22.647354,61.757156 22.337275,57.407436 22.849394,53.171906 C23.333271,49.169933 25.987171,47.984531 29.987934,50.354870 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                    <path d="M142.658966,55.302124 C142.551239,51.624733 143.637985,48.955601 147.216995,49.114773 C150.822723,49.275131 151.435776,52.183567 151.358810,55.277634 C151.276566,58.583900 151.377106,61.894760 151.292404,65.200912 C151.218033,68.103302 149.728714,70.077515 146.747696,69.939774 C144.054596,69.815331 142.746353,67.862778 142.705856,65.188271 C142.658295,62.046165 142.670181,58.903164 142.658966,55.302124 z" fill={sessionStatus === 'CONNECTED' && isListening ? '#10B981' : sessionStatus === 'CONNECTING' ? '#F59E0B' : sessionStatus === 'CONNECTED' ? '#EF4444' : '#8B5CF6'}/>
                  </svg>
                  
                </div>
                
                <div className="voice-instruction-text">
                  {replyState.selectedMention ? (
                    <div style={{ color: '#10B981', fontWeight: 'bold' }}>
                      🎯 {replyState.selectedMention.ticketKey} selected
                      <br />
                      {sessionStatus === 'CONNECTED' && isListening ? 'Listening...' :
                       sessionStatus === 'CONNECTED' ? 'Click to end voice session' : 
                       sessionStatus === 'CONNECTING' ? 'Please wait...' :
                       'Ask me about this ticket, reply to it, or find related docs'}
                    </div>
                  ) : (
                    <>
                      <div className="voice-main-instruction">
                        {sessionStatus === 'CONNECTED' && isListening ? 'Listening...' :
                         sessionStatus === 'CONNECTED' ? 'Click to end voice session' : 
                         sessionStatus === 'CONNECTING' ? 'Please wait...' :
                         'Press Space or click to speak'}
                      </div>
                      {sessionStatus === 'DISCONNECTED' && (
                        <div className="voice-capabilities">
                          Ask me to search Jira, create tickets, find Confluence docs, 
                          send Slack messages, or manage your workspace
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Text Input Alternative */}
              <div className="text-input-section">
                <div className="text-input-container">
                  <form onSubmit={handleTextSubmit} className="text-input-form">
                    <div className="text-input-wrapper">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          sessionStatus === 'CONNECTING' && pendingTextInput 
                            ? "Connecting to send your message..."
                            : "Or type your command here... (e.g., 'Search confluence for API docs', 'Create a ticket for user login')"
                        }
                        className="text-input-field"
                        disabled={isListening || (sessionStatus === 'CONNECTING' && pendingTextInput !== null)}
                      />
                      <button
                        type="submit"
                        disabled={!textInput.trim() || isListening || (sessionStatus === 'CONNECTING' && pendingTextInput !== null)}
                        className="text-input-submit"
                        title={
                          sessionStatus === 'CONNECTING' && pendingTextInput 
                            ? "Connecting..." 
                            : "Send command"
                        }
                      >
                        <svg className="text-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                    {isListening && (
                      <div className="text-input-disabled-message">
                        Voice is active - stop listening to type
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Enhanced Activity Section - Recent Mentions and Updates */}
              <div className="activity-section">
                <div className="activity-header" onClick={toggleActivity}>
                  <div className="activity-title">
                    <span>💬</span>
                    <span>Recent Mentions</span>
                    {isLoading ? (
                      <div className="loading-badge">Loading...</div>
                    ) : error ? (
                      <div className="error-badge">Error</div>
                    ) : activityFeed ? (
                      <div className="mention-badge">{activityFeed.unreadCount} mentions</div>
                    ) : null}
                  </div>
                  <div className="activity-header-actions">
                    {!isLoading && (
                      <button 
                        className="refresh-btn" 
                        onClick={(e) => { e.stopPropagation(); refresh(); }}
                        title="Refresh activity"
                      >
                        🔄
                      </button>
                    )}
                    <div className="expand-icon">{activityExpanded ? '▲' : '▼'}</div>
                  </div>
                </div>
                {activityExpanded && (
                  <div className="activity-content">
                    {isLoading ? (
                      <div className="activity-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading your workspace activity...</span>
                      </div>
                    ) : error ? (
                      <div className="activity-error">
                        <div className="error-icon">⚠️</div>
                        <div>
                          <h4>Unable to load workspace activity</h4>
                          <p>{error}</p>
                          <button className="retry-btn" onClick={refresh}>Try Again</button>
                        </div>
                      </div>
                    ) : activityFeed ? (
                      <>
                        {/* Real Mention Items - Server-side Paginated */}
                        {activityFeed.mentions.map((mention) => (
                          <div 
                            key={mention.id} 
                            className={`comment-card mention ${mention.urgency} ${
                              replyState.selectedMention?.ticketKey === mention.ticketKey ? 'selected' : ''
                            }`}
                            onClick={() => {
                              console.log('🎯 Card clicked:', mention.ticketKey);
                              if (replyState.selectedMention?.ticketKey === mention.ticketKey) {
                                // Deselect if clicking same card
                                clearSelectedMention();
                              } else {
                                // Select this mention for any kind of query
                                selectMentionForReply(mention);
                                // Don't automatically set voice reply mode - let user decide what to ask
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              border: replyState.selectedMention?.ticketKey === mention.ticketKey 
                                ? '2px solid #10B981' 
                                : undefined,
                              backgroundColor: replyState.selectedMention?.ticketKey === mention.ticketKey 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : undefined
                            }}
                          >
                            {/* Left Side - Fixed Width */}
                            <div className="comment-left">
                              <div className="comment-ticket-key">{mention.ticketKey}</div>
                              <div className="comment-author">
                                <img 
                                  src={mention.commentAuthor.avatarUrls?.['48x48'] || 
                                       `https://ui-avatars.com/api/?name=${encodeURIComponent(mention.commentAuthor.displayName)}&background=6B7280&color=fff&size=24`}
                                  alt={mention.commentAuthor.displayName}
                                  className="comment-avatar"
                                />
                                <span>{mention.commentAuthor.displayName}</span>
                              </div>
                              <div className="comment-meta">
                                <span className={`comment-priority ${mention.urgency}`}>
                                  {mention.urgency.toUpperCase()}
                                </span>
                                <span className="comment-time">{formatRelativeTime(mention.timestamp)}</span>
                              </div>
                            </div>

                            {/* Center - Flexible Width */}
                            <div className="comment-center">
                              <div className="comment-content">
                                <span dangerouslySetInnerHTML={{ 
                                  __html: mention.commentPreview.replace(
                                    /@\w+/g, 
                                    '<span class="mention-highlight">$&</span>'
                                  ) 
                                }} />
                              </div>
                            </div>

                            {/* Right Side - Link Button Only */}
                            <div className="comment-right">
                              {mention.directLinkUrl ? (
                                <button 
                                  className="comment-action-btn view-ticket"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('🔗 Opening link:', mention.directLinkUrl);
                                    window.open(mention.directLinkUrl, '_blank');
                                  }}
                                  title={`View ${mention.ticketKey}`}
                                >
                                  🔗
                                </button>
                              ) : (
                                <div 
                                  className="comment-action-btn view-ticket disabled"
                                  title="Link unavailable"
                                  style={{ opacity: 0.3, cursor: 'not-allowed' }}
                                  onClick={() => console.warn('❌ Missing directLinkUrl for:', mention.ticketKey, mention)}
                                >
                                  🔗
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Pagination Controls */}
                        {(activityFeed.totalPages && activityFeed.totalPages > 1) && (
                          <div className="pagination-controls">
                            <button 
                              className="pagination-btn"
                              onClick={prevPage}
                              disabled={currentPage === 0}
                            >
                              ← Previous
                            </button>
                            <span className="pagination-info">
                              Page {currentPage + 1} of {activityFeed.totalPages}
                            </span>
                            <button 
                              className="pagination-btn"
                              onClick={nextPage}
                              disabled={!activityFeed.hasMore}
                            >
                              Next →
                            </button>
                          </div>
                        )}
                        
                        {activityFeed.mentions.length === 0 && activityFeed.ticketUpdates.length === 0 && (
                          <div className="activity-empty">
                            <div className="empty-icon">📭</div>
                            <h4>No recent activity</h4>
                            <p>No mentions or updates in the last 7 days</p>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Conversation Section - Show when there are transcript items */}
              {transcriptItems.length > 0 && (
                <div className="conversation-section">
                  <div className="conversation-header">
                    <div className="conversation-title">
                      <span>💬</span>
                      <span>Conversation</span>
                      <div className="conversation-badge">{transcriptItems.length} messages</div>
                    </div>
                  </div>
                  <div className="conversation-content">
                    <Transcript items={transcriptItems} />
                  </div>
                </div>
              )}

              {/* Try These Commands Section - Bottom of page */}
              {sessionStatus === 'DISCONNECTED' && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <div className="suggestions-title">
                      💡 {replyState.selectedMention ? 
                        `Try these commands for ${replyState.selectedMention.ticketKey}:` : 
                        'Try these commands:'}
                    </div>
                  </div>
                  <div className="suggestions-content">
                    <div className="suggestions-list">
                      {replyState.selectedMention ? (
                        // Commands specific to selected ticket
                        <>
                          <button 
                            onClick={() => setTextInput(`Summarize ticket ${replyState.selectedMention?.ticketKey}`)}
                            className="suggestion-chip"
                          >
                            Summarize this ticket
                          </button>
                          <button 
                            onClick={() => setTextInput(`Find confluence pages about ${replyState.selectedMention?.ticketKey}`)}
                            className="suggestion-chip"
                          >
                            Find related documentation
                          </button>
                          <button 
                            onClick={() => setTextInput(`Reply to ${replyState.selectedMention?.ticketKey} saying thanks for the update`)}
                            className="suggestion-chip"
                          >
                            Reply to this ticket
                          </button>
                          <button 
                            onClick={() => setTextInput(`What's the status of ${replyState.selectedMention?.ticketKey}?`)}
                            className="suggestion-chip"
                          >
                            Check ticket status
                          </button>
                          <button 
                            onClick={() => setTextInput(`Who is assigned to ${replyState.selectedMention?.ticketKey}?`)}
                            className="suggestion-chip"
                          >
                            Check ticket assignee
                          </button>
                          <button 
                            onClick={() => setTextInput(`Search for similar tickets to ${replyState.selectedMention?.ticketKey}`)}
                            className="suggestion-chip"
                          >
                            Find similar tickets
                          </button>
                        </>
                      ) : (
                        // General commands when no ticket selected
                        <>
                          <button 
                            onClick={() => setTextInput('Search confluence for authentication docs')}
                            className="suggestion-chip"
                          >
                            Search confluence for authentication docs
                          </button>
                          <button 
                            onClick={() => setTextInput('Find Jira tickets assigned to me')}
                            className="suggestion-chip"
                          >
                            Find Jira tickets assigned to me
                          </button>
                          <button 
                            onClick={() => setTextInput('Create a user story for mobile login')}
                            className="suggestion-chip"
                          >
                            Create a user story for mobile login
                          </button>
                          <button 
                            onClick={() => setTextInput('Show me current sprint tickets')}
                            className="suggestion-chip"
                          >
                            Show me current sprint tickets
                          </button>
                          <button 
                            onClick={() => setTextInput('Search Slack for deployment messages')}
                            className="suggestion-chip"
                          >
                            Search Slack for deployment messages
                          </button>
                          <button 
                            onClick={() => setTextInput('Create documentation for the new feature')}
                            className="suggestion-chip"
                          >
                            Create documentation for the new feature
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}