/**
 * Integrations Component - Based on integration-status-dashboard.html mockup
 */

"use client";

import React, { useState } from 'react';

interface IntegrationsProps {
  onNavigateBack?: () => void;
}

export default function Integrations({ onNavigateBack }: IntegrationsProps) {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations = [
    {
      id: 'jira',
      name: 'Jira',
      icon: '🎫',
      status: 'connected',
      description: 'Project management and issue tracking',
      lastSync: '2 minutes ago',
      health: 'healthy',
      metrics: {
        tickets: 24,
        projects: 3,
        uptime: '99.9%'
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      status: 'connected',
      description: 'Team communication and collaboration',
      lastSync: '5 minutes ago',
      health: 'healthy',
      metrics: {
        channels: 12,
        messages: 156,
        uptime: '100%'
      }
    },
    {
      id: 'confluence',
      name: 'Confluence',
      icon: '📚',
      status: 'warning',
      description: 'Documentation and knowledge management',
      lastSync: '15 minutes ago',
      health: 'degraded',
      metrics: {
        pages: 89,
        spaces: 5,
        uptime: '95.2%'
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '🐙',
      status: 'disconnected',
      description: 'Source code management and version control',
      lastSync: 'Never',
      health: 'offline',
      metrics: {
        repos: 0,
        commits: 0,
        uptime: '0%'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'disconnected': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'offline': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <div className="app-layout">
          {/* Main Content */}
          <div className="integrations-main">
            {/* Header */}
            <div className="integrations-header">
              <div className="integrations-header-left">
                <button className="back-button" onClick={onNavigateBack}>
                  <span>←</span>
                  <span>Back to Dashboard</span>
                </button>
                <div>
                  <h1 className="integrations-title">Integration Status</h1>
                  <p className="integrations-subtitle">Monitor and manage your connected services</p>
                </div>
              </div>
              <div className="integrations-header-right">
                <button className="refresh-button">
                  <span>🔄</span>
                  <span>Refresh All</span>
                </button>
              </div>
            </div>

            {/* Status Overview */}
            <div className="status-overview">
              <div className="status-card">
                <div className="status-icon">✅</div>
                <div className="status-info">
                  <h3 className="status-number">2</h3>
                  <p className="status-label">Healthy</p>
                </div>
              </div>
              <div className="status-card">
                <div className="status-icon">⚠️</div>
                <div className="status-info">
                  <h3 className="status-number">1</h3>
                  <p className="status-label">Issues</p>
                </div>
              </div>
              <div className="status-card">
                <div className="status-icon">❌</div>
                <div className="status-info">
                  <h3 className="status-number">1</h3>
                  <p className="status-label">Offline</p>
                </div>
              </div>
              <div className="status-card">
                <div className="status-icon">🔗</div>
                <div className="status-info">
                  <h3 className="status-number">4</h3>
                  <p className="status-label">Total</p>
                </div>
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="integrations-grid">
              {integrations.map((integration) => (
                <div 
                  key={integration.id}
                  className={`integration-card ${selectedIntegration === integration.id ? 'selected' : ''}`}
                  onClick={() => setSelectedIntegration(integration.id)}
                >
                  <div className="integration-card-header">
                    <div className="integration-card-info">
                      <div className="integration-card-icon">{integration.icon}</div>
                      <div>
                        <h3 className="integration-card-name">{integration.name}</h3>
                        <p className="integration-card-description">{integration.description}</p>
                      </div>
                    </div>
                    <div 
                      className="integration-status-indicator"
                      style={{ backgroundColor: getStatusColor(integration.status) }}
                    ></div>
                  </div>

                  <div className="integration-card-metrics">
                    <div className="integration-metric">
                      <span className="metric-label">Health:</span>
                      <span 
                        className="metric-value"
                        style={{ color: getHealthColor(integration.health) }}
                      >
                        {integration.health}
                      </span>
                    </div>
                    <div className="integration-metric">
                      <span className="metric-label">Last Sync:</span>
                      <span className="metric-value">{integration.lastSync}</span>
                    </div>
                  </div>

                  <div className="integration-card-stats">
                    {Object.entries(integration.metrics).map(([key, value]) => (
                      <div key={key} className="integration-stat">
                        <span className="stat-value">{value}</span>
                        <span className="stat-label">{key}</span>
                      </div>
                    ))}
                  </div>

                  <div className="integration-card-actions">
                    {integration.status === 'disconnected' ? (
                      <button className="integration-action-button primary">
                        Connect
                      </button>
                    ) : (
                      <>
                        <button className="integration-action-button">
                          Configure
                        </button>
                        <button className="integration-action-button">
                          Test
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Integration Details */}
            {selectedIntegration && (
              <div className="integration-details">
                <h2 className="details-title">
                  {integrations.find(i => i.id === selectedIntegration)?.name} Details
                </h2>
                <div className="details-content">
                  <div className="details-section">
                    <h3 className="details-section-title">Connection Status</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">
                          {integrations.find(i => i.id === selectedIntegration)?.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Health:</span>
                        <span className="detail-value">
                          {integrations.find(i => i.id === selectedIntegration)?.health}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="details-section">
                    <h3 className="details-section-title">Recent Activity</h3>
                    <div className="activity-log">
                      <div className="activity-item">
                        <span className="activity-time">2 min ago</span>
                        <span className="activity-message">Data sync completed successfully</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-time">5 min ago</span>
                        <span className="activity-message">Connection health check passed</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-time">10 min ago</span>
                        <span className="activity-message">Configuration updated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}