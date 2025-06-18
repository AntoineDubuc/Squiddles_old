/**
 * Settings Component - Based on settings-configuration.html mockup
 */

"use client";

import React, { useState } from 'react';

interface SettingsProps {
  onNavigateBack?: () => void;
}

export default function Settings({ onNavigateBack }: SettingsProps) {
  const [activeSection, setActiveSection] = useState('general');

  const settingsSections = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'voice', label: 'Voice Configuration', icon: '🎙️' },
    { id: 'integrations', label: 'Integration Settings', icon: '🔗' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security & Privacy', icon: '🔒' },
    { id: 'advanced', label: 'Advanced Settings', icon: '🔧' }
  ];

  return (
    <>
      <div className="background-gradient"></div>
      <div className="container">
        <div className="app-layout">
          {/* Settings Sidebar */}
          <div className="settings-sidebar">
            <div className="settings-header">
              <button className="back-button" onClick={onNavigateBack}>
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
              <h2 className="settings-title">Settings</h2>
            </div>

            <div className="settings-nav">
              {settingsSections.map((section) => (
                <div 
                  key={section.id}
                  className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="settings-nav-icon">{section.icon}</span>
                  <span className="settings-nav-label">{section.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Main Content */}
          <div className="settings-main">
            {/* Header */}
            <div className="settings-content-header">
              <h1 className="settings-page-title">
                {settingsSections.find(s => s.id === activeSection)?.label}
              </h1>
              <p className="settings-page-subtitle">
                Configure your Squiddles experience
              </p>
            </div>

            {/* Content Area */}
            <div className="settings-content">
              {activeSection === 'general' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Application Preferences</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Theme</label>
                        <p className="setting-description">Choose your preferred color scheme</p>
                      </div>
                      <select className="setting-control">
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Language</label>
                        <p className="setting-description">Select your preferred language</p>
                      </div>
                      <select className="setting-control">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'voice' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Voice Configuration</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Voice Model</label>
                        <p className="setting-description">Select the AI voice personality</p>
                      </div>
                      <select className="setting-control">
                        <option value="sage">Sage (Recommended)</option>
                        <option value="alloy">Alloy</option>
                        <option value="echo">Echo</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Voice Activation</label>
                        <p className="setting-description">How to activate voice commands</p>
                      </div>
                      <div className="setting-control-group">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span>Space bar activation</span>
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" />
                          <span>Wake word detection</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Connected Services</h3>
                    <div className="integration-item">
                      <div className="integration-info">
                        <div className="integration-icon">🎫</div>
                        <div>
                          <h4 className="integration-name">Jira Integration</h4>
                          <p className="integration-status connected">Connected</p>
                        </div>
                      </div>
                      <button className="integration-button">Configure</button>
                    </div>
                    <div className="integration-item">
                      <div className="integration-info">
                        <div className="integration-icon">💬</div>
                        <div>
                          <h4 className="integration-name">Slack Integration</h4>
                          <p className="integration-status disconnected">Not Connected</p>
                        </div>
                      </div>
                      <button className="integration-button">Connect</button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Notification Preferences</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Mentions</label>
                        <p className="setting-description">Get notified when you're mentioned</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Ticket Updates</label>
                        <p className="setting-description">Notifications for ticket changes</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Security Settings</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Session Timeout</label>
                        <p className="setting-description">Automatically sign out after inactivity</p>
                      </div>
                      <select className="setting-control">
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="240">4 hours</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'advanced' && (
                <div className="settings-section">
                  <div className="setting-group">
                    <h3 className="setting-group-title">Advanced Configuration</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Debug Mode</label>
                        <p className="setting-description">Enable detailed logging for troubleshooting</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">API Endpoint</label>
                        <p className="setting-description">Custom API endpoint URL</p>
                      </div>
                      <input 
                        type="text" 
                        className="setting-control" 
                        placeholder="https://api.squiddles.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="settings-footer">
              <button className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}