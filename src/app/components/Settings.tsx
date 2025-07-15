/**
 * Settings Component - Based on settings-configuration.html mockup
 */

"use client";

import React, { useState } from 'react';
import { 
  AGENT_VOICES, 
  NOVA_SONIC_VOICES, 
  OPENAI_VOICES,
  isNovaSonicVoice,
  isOpenAIVoice,
  getDefaultVoiceForProvider,
  getVoiceProfilesForProvider,
  type OpenAIVoice,
  type NovaSonicVoice,
  type UnifiedVoice
} from '../../config/voices';
import { getProviderDisplayName, getProviderCostInfo } from '../../config/voiceProvider';
import GmailConfig from './GmailConfig';

interface SettingsProps {
  onNavigateBack?: () => void;
}

export default function Settings({ onNavigateBack }: SettingsProps) {
  const [activeSection, setActiveSection] = useState('general');
  const [showConfluenceConfig, setShowConfluenceConfig] = useState(false);
  const [showGmailConfig, setShowGmailConfig] = useState(false);
  const [confluenceSettings, setConfluenceSettings] = useState({
    baseUrl: process.env.CONFLUENCE_BASE_URL || '',
    email: process.env.CONFLUENCE_EMAIL || '',
    apiToken: process.env.CONFLUENCE_API_TOKEN || '',
    enabled: true
  });

  const [voiceSettings, setVoiceSettings] = useState({
    globalVoice: 'echo' as UnifiedVoice,
    globalTone: 'friendly' as string,
    globalSpeed: 1.0,
    agentVoices: { ...AGENT_VOICES }
  });

  const [voiceProviderSettings, setVoiceProviderSettings] = useState({
    provider: 'openai' as 'openai' | 'nova-sonic',
    fallbackEnabled: true
  });

  const [providerStatus, setProviderStatus] = useState({
    openaiAvailable: false,
    novaSonicAvailable: false,
    loading: true
  });

  const [voiceTesting, setVoiceTesting] = useState({
    isPlaying: false,
    currentVoice: null as UnifiedVoice | null,
    currentTone: null as string | null,
    speed: 1.0
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // Connection testing state
  const [connectionTesting, setConnectionTesting] = useState({
    openai: false,
    novaSonic: false
  });
  const [connectionTestResults, setConnectionTestResults] = useState<{
    openai?: { success: boolean; message: string } | null;
    novaSonic?: { success: boolean; message: string } | null;
  }>({});

  // Sync testing speed with global speed when it changes
  React.useEffect(() => {
    setVoiceTesting(prev => ({ ...prev, speed: voiceSettings.globalSpeed }));
  }, [voiceSettings.globalSpeed]);

  // Update voice selection when provider changes
  React.useEffect(() => {
    const currentVoice = voiceSettings.globalVoice;
    
    if (voiceProviderSettings.provider === 'openai') {
      // If current voice is not an OpenAI voice, reset to default
      if (!isOpenAIVoice(currentVoice)) {
        setVoiceSettings(prev => ({ 
          ...prev, 
          globalVoice: getDefaultVoiceForProvider('openai')
        }));
      }
    } else {
      // If current voice is not a Nova Sonic voice, reset to default
      if (!isNovaSonicVoice(currentVoice)) {
        setVoiceSettings(prev => ({ 
          ...prev, 
          globalVoice: getDefaultVoiceForProvider('nova-sonic')
        }));
      }
    }
  }, [voiceProviderSettings.provider]);

  // Clear save message after 3 seconds
  React.useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Save settings function
  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Save to localStorage for now (could be extended to API later)
      const settingsData = {
        voice: voiceSettings,
        voiceProvider: voiceProviderSettings,
        confluence: confluenceSettings,
        timestamp: Date.now()
      };
      
      localStorage.setItem('squiddles-settings', JSON.stringify(settingsData));
      
      // Update voice configuration in the global config
      // This would ideally update the live agents' voice settings
      console.log('💾 Settings saved:', settingsData);
      
      // Save voice provider settings to environment via API
      let providerSaved = false;
      if (voiceProviderSettings) {
        try {
          const response = await fetch('/api/settings/voice-provider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voiceProviderSettings)
          });
          
          if (response.ok) {
            const result = await response.json();
            providerSaved = true;
            console.log('✅ Voice provider settings saved:', result);
          }
        } catch (error) {
          console.warn('⚠️ Could not save voice provider to environment:', error);
        }
      }

      // Trigger voice settings reload event
      window.dispatchEvent(new CustomEvent('voiceSettingsChanged', { 
        detail: { voiceSettings, voiceProvider: voiceProviderSettings }
      }));
      
      if (providerSaved) {
        setSaveMessage('Settings saved! Restart the app to use the new voice provider.');
      } else {
        setSaveMessage('Voice settings saved! Voice changes will take effect on next conversation.');
      }
      
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Load provider status from API
  const loadProviderStatus = async () => {
    try {
      const response = await fetch('/api/settings/voice-provider');
      if (response.ok) {
        const data = await response.json();
        setProviderStatus({
          openaiAvailable: data.openaiAvailable,
          novaSonicAvailable: data.novaSonicAvailable,
          loading: false
        });
        setVoiceProviderSettings({
          provider: data.provider,
          fallbackEnabled: data.fallbackEnabled
        });
      }
    } catch (error) {
      console.error('❌ Failed to load provider status:', error);
      setProviderStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Load settings on component mount
  React.useEffect(() => {
    // Load provider status from API
    loadProviderStatus();
    
    try {
      const savedSettings = localStorage.getItem('squiddles-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        if (parsed.voice) {
          setVoiceSettings(prev => ({ ...prev, ...parsed.voice }));
        }

        if (parsed.voiceProvider) {
          setVoiceProviderSettings(prev => ({ ...prev, ...parsed.voiceProvider }));
        }
        
        if (parsed.confluence) {
          setConfluenceSettings(prev => ({ ...prev, ...parsed.confluence }));
        }
        
        console.log('✅ Settings loaded from storage');
      }
    } catch (error) {
      console.error('❌ Failed to load settings:', error);
    }
  }, []);

  const settingsSections = [
    { id: 'general', label: 'General Settings', icon: '⚙️' },
    { id: 'voice', label: 'Voice Configuration', icon: '🎙️' },
    { id: 'integrations', label: 'Integration Settings', icon: '🔗' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security & Privacy', icon: '🔒' },
    { id: 'advanced', label: 'Advanced Settings', icon: '🔧' }
  ];

  // Sample text for different tones
  const getSampleText = (tone: string): string => {
    const samples: Record<string, string> = {
      professional: "I've found 3 tickets in your current sprint. The highest priority item is DE-3293 which requires immediate attention.",
      friendly: "Great! I found 3 tickets for you in the current sprint. Let's take a look at what we've got - the top priority one looks really important!",
      casual: "Hey! So I checked out your sprint and found 3 tickets. The main one you should probably look at is DE-3293.",
      enthusiastic: "Awesome! I discovered 3 exciting tickets in your current sprint! The top priority one, DE-3293, looks like a fantastic challenge!",
      calm: "I've gently reviewed your current sprint and found 3 tickets. The most important one is DE-3293, which deserves your thoughtful attention."
    };
    return samples[tone] || samples.professional;
  };

  // Test voice function
  const testVoice = async (voice: UnifiedVoice, tone: string) => {
    setVoiceTesting({ isPlaying: true, currentVoice: voice, currentTone: tone, speed: voiceTesting.speed });
    
    try {
      // Create a test message using the appropriate TTS service
      const sampleText = getSampleText(tone);
      
      console.log(`🎵 Testing voice: ${voice} with tone: ${tone}`);
      console.log(`Sample text: ${sampleText}`);
      
      // Determine if this is a Nova Sonic or OpenAI voice
      const provider = isNovaSonicVoice(voice) ? 'nova-sonic' : 'openai';
      
      // Call TTS API with the selected voice and provider
      const response = await fetch('/api/tts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          voice, 
          text: sampleText, 
          speed: voiceTesting.speed,
          provider 
        })
      });
      
      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }
      
      // Check if response is audio (both OpenAI and Nova Sonic should return audio)
      const contentType = response.headers.get('content-type');
      const isFallback = response.headers.get('x-fallback');
      
      if (contentType?.includes('audio')) {
        // Handle audio response (both OpenAI and Nova Sonic)
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Show fallback message if Nova Sonic fell back to OpenAI
        if (provider === 'nova-sonic' && isFallback === 'openai') {
          console.log('🔄 Nova Sonic fell back to OpenAI for testing');
        }
        
        // Play the audio
        await audio.play();
        
        // Clean up when audio ends
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setVoiceTesting({ isPlaying: false, currentVoice: null, currentTone: null, speed: voiceTesting.speed });
        };
        
        // Also handle errors during playback
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          setVoiceTesting({ isPlaying: false, currentVoice: null, currentTone: null, speed: voiceTesting.speed });
        };
        
      } else {
        // Handle JSON response (fallback case)
        const result = await response.json();
        console.log('🔊 TTS result:', result);
        
        // Show a message for JSON responses
        alert(`Voice Test: ${result.message || 'Audio playback not available'}`);
        setVoiceTesting({ isPlaying: false, currentVoice: null, currentTone: null, speed: voiceTesting.speed });
      }
      
    } catch (error) {
      console.error('Failed to test voice:', error);
      setVoiceTesting({ isPlaying: false, currentVoice: null, currentTone: null, speed: voiceTesting.speed });
    }
  };

  // Test connection function
  const testConnection = async (provider: 'openai' | 'nova-sonic') => {
    const providerKey = provider === 'nova-sonic' ? 'novaSonic' : 'openai';
    
    setConnectionTesting(prev => ({ ...prev, [providerKey]: true }));
    setConnectionTestResults(prev => ({ ...prev, [providerKey]: null }));
    
    try {
      // Test the connection by making a simple API call
      const response = await fetch('/api/test-voice-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setConnectionTestResults(prev => ({ 
          ...prev, 
          [providerKey]: { success: true, message: result.message || 'Connection successful' }
        }));
      } else {
        setConnectionTestResults(prev => ({ 
          ...prev, 
          [providerKey]: { success: false, message: result.message || 'Connection failed' }
        }));
      }
    } catch (error) {
      setConnectionTestResults(prev => ({ 
        ...prev, 
        [providerKey]: { success: false, message: 'Network error or service unavailable' }
      }));
    } finally {
      setConnectionTesting(prev => ({ ...prev, [providerKey]: false }));
    }
  };

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
                    <h3 className="setting-group-title">Voice Provider</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">AI Voice Service</label>
                        <p className="setting-description">
                          Choose between OpenAI Realtime API and AWS Nova Sonic
                          {voiceProviderSettings.provider === 'nova-sonic' && (
                            <span className="cost-savings"> (80% cost savings)</span>
                          )}
                        </p>
                      </div>
                      <select 
                        className="setting-control"
                        value={voiceProviderSettings.provider}
                        onChange={(e) => setVoiceProviderSettings(prev => ({ ...prev, provider: e.target.value as 'openai' | 'nova-sonic' }))}
                      >
                        <option value="openai">
                          {getProviderDisplayName('openai')} - ${getProviderCostInfo('openai').costPerHour}/hour
                        </option>
                        <option value="nova-sonic">
                          {getProviderDisplayName('nova-sonic')} - ${getProviderCostInfo('nova-sonic').costPerHour}/hour
                        </option>
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Provider Status</label>
                        <p className="setting-description">Current availability of voice providers</p>
                      </div>
                      <div className="provider-status-grid">
                        <div className={`provider-status ${providerStatus.openaiAvailable ? 'available' : 'unavailable'}`}>
                          <div className="provider-info">
                            <span className="provider-icon">🤖</span>
                            <span className="provider-name">OpenAI</span>
                            <span className={`status-indicator ${providerStatus.openaiAvailable ? 'green' : 'red'}`}>
                              {providerStatus.loading ? '⏳ Checking...' : 
                               providerStatus.openaiAvailable ? '✅ Available' : '❌ Not configured'}
                            </span>
                          </div>
                          <div className="provider-actions">
                            <button 
                              className="test-connection-btn"
                              onClick={() => testConnection('openai')}
                              disabled={connectionTesting.openai}
                            >
                              {connectionTesting.openai ? '⏳ Testing...' : '🔧 Test'}
                            </button>
                          </div>
                          {connectionTestResults.openai && (
                            <div className={`connection-test-result ${connectionTestResults.openai.success ? 'success' : 'error'}`}>
                              {connectionTestResults.openai.success ? '✅' : '❌'} {connectionTestResults.openai.message}
                            </div>
                          )}
                        </div>
                        <div className={`provider-status ${providerStatus.novaSonicAvailable ? 'available' : 'unavailable'}`}>
                          <div className="provider-info">
                            <span className="provider-icon">🔊</span>
                            <span className="provider-name">Nova Sonic</span>
                            <span className={`status-indicator ${providerStatus.novaSonicAvailable ? 'green' : 'red'}`}>
                              {providerStatus.loading ? '⏳ Checking...' : 
                               providerStatus.novaSonicAvailable ? '✅ Available' : '❌ Not configured'}
                            </span>
                          </div>
                          <div className="provider-actions">
                            <button 
                              className="test-connection-btn"
                              onClick={() => testConnection('nova-sonic')}
                              disabled={connectionTesting.novaSonic}
                            >
                              {connectionTesting.novaSonic ? '⏳ Testing...' : '🔧 Test'}
                            </button>
                          </div>
                          {connectionTestResults.novaSonic && (
                            <div className={`connection-test-result ${connectionTestResults.novaSonic.success ? 'success' : 'error'}`}>
                              {connectionTestResults.novaSonic.success ? '✅' : '❌'} {connectionTestResults.novaSonic.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Enable Fallback</label>
                        <p className="setting-description">
                          Automatically switch to backup provider if primary fails
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={voiceProviderSettings.fallbackEnabled}
                          onChange={(e) => setVoiceProviderSettings(prev => ({ ...prev, fallbackEnabled: e.target.checked }))}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    {voiceProviderSettings.provider === 'nova-sonic' && (
                      <div className="cost-savings-info">
                        <div className="savings-header">
                          <span className="savings-icon">💰</span>
                          <span className="savings-title">Cost Savings with Nova Sonic</span>
                        </div>
                        <div className="savings-details">
                          <div className="savings-row">
                            <span>Hourly cost reduction:</span>
                            <span className="savings-amount">$59.30 (80% savings)</span>
                          </div>
                          <div className="savings-row">
                            <span>Daily savings (8 hours):</span>
                            <span className="savings-amount">$474.40</span>
                          </div>
                          <div className="savings-row">
                            <span>Annual savings:</span>
                            <span className="savings-amount">$125,241</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="setting-group">
                    <h3 className="setting-group-title">Global Voice Settings</h3>
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Default Voice</label>
                        <p className="setting-description">Choose the default AI voice for all agents</p>
                      </div>
                      <div className="setting-control-with-test">
                        <select 
                          className="setting-control" 
                          value={voiceSettings.globalVoice}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, globalVoice: e.target.value as UnifiedVoice }))}
                        >
                          {voiceProviderSettings.provider === 'openai' ? (
                            <>
                              {Object.entries(OPENAI_VOICES).map(([key, description]) => (
                                <option key={key} value={key}>{description}</option>
                              ))}
                            </>
                          ) : (
                            <>
                              {Object.entries(NOVA_SONIC_VOICES).map(([key, description]) => (
                                <option key={key} value={key}>{description}</option>
                              ))}
                            </>
                          )}
                        </select>
                        <button 
                          className="test-voice-btn"
                          onClick={() => testVoice(voiceSettings.globalVoice, voiceSettings.globalTone)}
                          disabled={voiceTesting.isPlaying}
                        >
                          {voiceTesting.isPlaying && voiceTesting.currentVoice === voiceSettings.globalVoice ? '🔊' : '🎵'}
                        </button>
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Communication Style</label>
                        <p className="setting-description">Set the overall tone and personality</p>
                      </div>
                      <select 
                        className="setting-control"
                        value={voiceSettings.globalTone}
                        onChange={(e) => setVoiceSettings(prev => ({ ...prev, globalTone: e.target.value }))}
                      >
                        {Object.entries(getVoiceProfilesForProvider(voiceProviderSettings.provider)).map(([key, profile]) => (
                          <option key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} - {profile.style}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Default Speech Speed</label>
                        <p className="setting-description">Set the default speaking speed for all voice interactions (0.25x to 4.0x)</p>
                      </div>
                      <div className="setting-control-with-value">
                        <input 
                          type="range"
                          min="0.25"
                          max="4.0"
                          step="0.25"
                          value={voiceSettings.globalSpeed}
                          onChange={(e) => setVoiceSettings(prev => ({ ...prev, globalSpeed: parseFloat(e.target.value) }))}
                          className="speed-slider"
                        />
                        <span className="speed-value">{voiceSettings.globalSpeed}x</span>
                      </div>
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
                          <span>Click to speak</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="setting-group">
                    <h3 className="setting-group-title">Agent-Specific Voices</h3>
                    <p className="setting-group-description">Customize voice and tone for individual assistants</p>
                    
                    {Object.entries(AGENT_VOICES).map(([agentName, currentTone]) => {
                      const agentDisplayName = agentName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      
                      // Get the appropriate voice profiles based on selected provider
                      const currentVoiceProfiles = getVoiceProfilesForProvider(voiceProviderSettings.provider);
                      const currentProfile = currentVoiceProfiles[currentTone] || currentVoiceProfiles['professional'];
                      
                      return (
                        <div key={agentName} className="setting-item">
                          <div className="setting-info">
                            <label className="setting-label">
                              {agentDisplayName.replace('Integration', '')} Agent
                            </label>
                            <p className="setting-description">
                              Currently: {currentProfile?.voice || 'default'} voice with {currentProfile?.tonality || 'professional'} tone
                              {voiceProviderSettings.provider === 'nova-sonic' && (
                                <span className="nova-sonic-note"> (Nova Sonic)</span>
                              )}
                            </p>
                          </div>
                          <select 
                            className="setting-control"
                            value={voiceSettings.agentVoices[agentName]}
                            onChange={(e) => setVoiceSettings(prev => ({
                              ...prev,
                              agentVoices: {
                                ...prev.agentVoices,
                                [agentName]: e.target.value
                              }
                            }))}
                          >
                            {Object.entries(currentVoiceProfiles).map(([key, profile]) => (
                              <option key={key} value={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)} ({profile.voice})
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  <div className="setting-group">
                    <h3 className="setting-group-title">Voice Testing</h3>
                    <p className="setting-group-description">
                      Preview any voice and tone combination
                      {voiceProviderSettings.provider === 'nova-sonic' && (
                        <span className="nova-sonic-note"> (Nova Sonic with OpenAI fallback for testing)</span>
                      )}
                    </p>
                    
                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Testing Speed Override</label>
                        <p className="setting-description">Temporarily override speed for voice testing only (syncs with global speed above)</p>
                      </div>
                      <div className="setting-control-with-value">
                        <input 
                          type="range"
                          min="0.25"
                          max="4.0"
                          step="0.25"
                          value={voiceTesting.speed}
                          onChange={(e) => setVoiceTesting(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                          className="speed-slider"
                        />
                        <span className="speed-value">{voiceTesting.speed}x</span>
                      </div>
                    </div>
                    
                    <div className="voice-testing-grid">
                      {voiceProviderSettings.provider === 'openai' ? (
                        (Object.keys(OPENAI_VOICES) as OpenAIVoice[]).map((voice) => (
                          <div key={voice} className="voice-test-section">
                            <h4 className="voice-test-title">
                              {voice.charAt(0).toUpperCase() + voice.slice(1)}
                            </h4>
                            <div className="voice-test-buttons">
                              {Object.keys(getVoiceProfilesForProvider(voiceProviderSettings.provider)).map((tone) => {
                                const isPlaying = voiceTesting.isPlaying && 
                                                 voiceTesting.currentVoice === voice && 
                                                 voiceTesting.currentTone === tone;
                                
                                return (
                                  <button
                                    key={tone}
                                    className={`voice-test-btn ${isPlaying ? 'playing' : ''}`}
                                    onClick={() => testVoice(voice, tone)}
                                    disabled={voiceTesting.isPlaying}
                                    title={`Test ${voice} voice with ${tone} tone`}
                                  >
                                    {isPlaying ? '🔊' : '🎵'} {tone}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        (Object.keys(NOVA_SONIC_VOICES) as NovaSonicVoice[]).map((voice) => (
                          <div key={voice} className="voice-test-section">
                            <h4 className="voice-test-title">
                              {voice.charAt(0).toUpperCase() + voice.slice(1)}
                            </h4>
                            <div className="voice-test-buttons">
                              {Object.keys(getVoiceProfilesForProvider(voiceProviderSettings.provider)).map((tone) => {
                                const isPlaying = voiceTesting.isPlaying && 
                                                 voiceTesting.currentVoice === voice && 
                                                 voiceTesting.currentTone === tone;
                                
                                return (
                                  <button
                                    key={tone}
                                    className={`voice-test-btn ${isPlaying ? 'playing' : ''}`}
                                    onClick={() => testVoice(voice, tone)}
                                    disabled={voiceTesting.isPlaying}
                                    title={`Test ${voice} voice with ${tone} tone`}
                                  >
                                    {isPlaying ? '🔊' : '🎵'} {tone}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <label className="setting-label">Quick Test Current Settings</label>
                        <p className="setting-description">Test your currently selected global voice and tone</p>
                      </div>
                      <button 
                        className="setting-control quick-test-btn"
                        onClick={() => testVoice(voiceSettings.globalVoice, voiceSettings.globalTone)}
                        disabled={voiceTesting.isPlaying}
                        style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                      >
                        {voiceTesting.isPlaying && 
                         voiceTesting.currentVoice === voiceSettings.globalVoice && 
                         voiceTesting.currentTone === voiceSettings.globalTone ? (
                          <>🔊 Playing...</>
                        ) : (
                          <>🎵 Test Current Settings</>
                        )}
                      </button>
                    </div>

                    {voiceTesting.isPlaying && (
                      <div className="voice-testing-status">
                        <div className="testing-indicator">
                          <span className="testing-icon">🎵</span>
                          <span>Testing {voiceTesting.currentVoice} voice with {voiceTesting.currentTone} tone...</span>
                        </div>
                        <div className="testing-sample-text">
                          <strong>Sample text:</strong> "{getSampleText(voiceTesting.currentTone!)}"
                        </div>
                      </div>
                    )}
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
                        <div className="integration-icon">📖</div>
                        <div>
                          <h4 className="integration-name">Confluence Integration</h4>
                          <p className="integration-status connected">Connected</p>
                        </div>
                      </div>
                      <button 
                        className="integration-button"
                        onClick={() => setShowConfluenceConfig(true)}
                      >
                        Configure
                      </button>
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
                    <div className="integration-item">
                      <div className="integration-info">
                        <div className="integration-icon">📧</div>
                        <div>
                          <h4 className="integration-name">Gmail Integration</h4>
                          <p className="integration-status disconnected">Not Connected</p>
                        </div>
                      </div>
                      <button 
                        className="integration-button"
                        onClick={() => setShowGmailConfig(true)}
                      >
                        Configure
                      </button>
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
              <div className="save-section">
                <button 
                  className="save-button"
                  onClick={saveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {saveMessage && (
                  <div className={`save-message ${saveMessage.includes('Failed') ? 'error' : 'success'}`}>
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confluence Configuration Modal */}
      {showConfluenceConfig && (
        <div className="modal-overlay" onClick={() => setShowConfluenceConfig(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configure Confluence Integration</h3>
              <button 
                className="modal-close"
                onClick={() => setShowConfluenceConfig(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="setting-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Base URL</label>
                    <p className="setting-description">Your Confluence instance URL (e.g., https://yourcompany.atlassian.net)</p>
                  </div>
                  <input 
                    type="url" 
                    className="setting-control" 
                    value={confluenceSettings.baseUrl}
                    onChange={(e) => setConfluenceSettings({...confluenceSettings, baseUrl: e.target.value})}
                    placeholder="https://yourcompany.atlassian.net"
                  />
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Email</label>
                    <p className="setting-description">Your Confluence account email address</p>
                  </div>
                  <input 
                    type="email" 
                    className="setting-control" 
                    value={confluenceSettings.email}
                    onChange={(e) => setConfluenceSettings({...confluenceSettings, email: e.target.value})}
                    placeholder="your-email@company.com"
                  />
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">API Token</label>
                    <p className="setting-description">
                      Generate an API token from{' '}
                      <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer">
                        Atlassian Account Settings
                      </a>
                    </p>
                  </div>
                  <input 
                    type="password" 
                    className="setting-control" 
                    value={confluenceSettings.apiToken}
                    onChange={(e) => setConfluenceSettings({...confluenceSettings, apiToken: e.target.value})}
                    placeholder="Your Confluence API token"
                  />
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label className="setting-label">Enable Integration</label>
                    <p className="setting-description">Allow Squiddles to access your Confluence data</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={confluenceSettings.enabled}
                      onChange={(e) => setConfluenceSettings({...confluenceSettings, enabled: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="button-secondary"
                onClick={() => setShowConfluenceConfig(false)}
              >
                Cancel
              </button>
              <button 
                className="button-primary"
                onClick={() => {
                  // TODO: Save confluence settings
                  console.log('Saving Confluence settings:', confluenceSettings);
                  setShowConfluenceConfig(false);
                }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Configuration Modal */}
      {showGmailConfig && (
        <div className="modal-overlay" onClick={() => setShowGmailConfig(false)}>
          <div className="modal-content gmail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configure Gmail Integration</h3>
              <button 
                className="modal-close"
                onClick={() => setShowGmailConfig(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <GmailConfig onConfigUpdate={() => {
                // Refresh integrations status if needed
                console.log('Gmail configuration updated');
              }} />
            </div>
            
            <div className="modal-footer">
              <button 
                className="button-secondary"
                onClick={() => setShowGmailConfig(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}