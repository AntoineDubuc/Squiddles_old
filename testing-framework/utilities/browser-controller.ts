/**
 * Browser Controller for External Squiddles Testing
 * 
 * Controls the browser to interact with Squiddles app like a real user
 * Tests the complete voice interface without touching production code
 */

import { Page, Browser, chromium, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export interface VoiceTestSession {
  page: Page;
  browser: Browser;
  sessionId: string;
  isConnected: boolean;
  events: any[];
}

export class SquiddlesBrowserController {
  private page!: Page;
  private browser!: Browser;
  private baseUrl: string;
  private events: any[] = [];

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async initialize(): Promise<VoiceTestSession> {
    console.log('🚀 Initializing browser for Squiddles testing...');
    
    // Launch browser with audio permissions
    this.browser = await chromium.launch({
      headless: false, // Show browser for debugging
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-running-insecure-content',
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required'
      ]
    });

    const context = await this.browser.newContext({
      permissions: ['microphone'],
    });

    this.page = await context.newPage();

    // Monitor console logs
    this.page.on('console', msg => {
      console.log(`🖥️  [Browser] ${msg.text()}`);
    });

    // Monitor network requests
    this.page.on('request', request => {
      if (request.url().includes('openai.com') || request.url().includes('/api/')) {
        console.log(`🌐 [Network] ${request.method()} ${request.url()}`);
      }
    });

    // Navigate to Squiddles
    console.log(`📍 Navigating to ${this.baseUrl}`);
    await this.page.goto(this.baseUrl);
    
    // Wait for app to load
    await this.page.waitForSelector('h1:has-text("Squiddles")', { timeout: 10000 });
    console.log('✅ Squiddles app loaded successfully');

    return {
      page: this.page,
      browser: this.browser,
      sessionId: `test-${Date.now()}`,
      isConnected: false,
      events: this.events
    };
  }

  async startVoiceSession(session: VoiceTestSession): Promise<void> {
    console.log('🎙️  Starting voice session...');
    
    // Find and click Start Session button
    const startButton = this.page.locator('button:has-text("Start Session"), button[data-testid="start-session"]').first();
    await expect(startButton).toBeVisible({ timeout: 5000 });
    await startButton.click();

    console.log('⏳ Waiting for connection...');
    
    // Wait for connection status to show "CONNECTED"
    await this.page.waitForSelector('.bg-green-500, [data-testid="status-connected"]', { timeout: 15000 });
    
    // Verify connection status text
    const statusText = await this.page.textContent('[class*="text-sm"]:has-text("CONNECTED")');
    expect(statusText).toContain('CONNECTED');
    
    session.isConnected = true;
    console.log('✅ Voice session connected successfully');
  }

  async injectAudioFile(session: VoiceTestSession, audioFileName: string): Promise<void> {
    const audioPath = path.join(__dirname, '../test-data/audio-samples', audioFileName);
    
    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found: ${audioPath}`);
    }

    console.log(`🎵 Injecting audio file: ${audioFileName}`);

    // Inject audio file into the browser's fake media stream
    await this.page.evaluate(async (audioPath) => {
      // Create a new MediaStream with the audio file
      const audioContext = new AudioContext();
      const response = await fetch(audioPath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Create a MediaStreamAudioSourceNode
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      
      // Replace the current getUserMedia stream
      const stream = destination.stream;
      
      // Trigger speech detection
      const speechEvent = new CustomEvent('test-speech-input', {
        detail: { audioBuffer, stream }
      });
      window.dispatchEvent(speechEvent);
      
      // Start playback
      source.start();
      
      return new Promise(resolve => {
        source.onended = resolve;
      });
    }, audioPath);

    console.log('✅ Audio injection completed');
  }

  async waitForTranscription(session: VoiceTestSession, expectedText?: string, timeoutMs: number = 10000): Promise<string> {
    console.log('👂 Waiting for speech transcription...');
    
    // Wait for user message to appear in transcript
    const transcriptSelector = '[data-testid="transcript"], .transcript, [class*="transcript"]';
    await this.page.waitForSelector(transcriptSelector, { timeout: timeoutMs });
    
    // Wait for transcription to stabilize (no more "Transcribing..." text)
    await this.page.waitForFunction(() => {
      const transcript = document.querySelector('[data-testid="transcript"], .transcript, [class*="transcript"]');
      return transcript && !transcript.textContent?.includes('Transcribing');
    }, { timeout: timeoutMs });

    const transcriptText = await this.page.textContent(transcriptSelector);
    console.log(`📝 Transcribed: "${transcriptText}"`);

    if (expectedText) {
      expect(transcriptText?.toLowerCase()).toContain(expectedText.toLowerCase());
      console.log('✅ Transcription matches expected text');
    }

    return transcriptText || '';
  }

  async waitForAIResponse(session: VoiceTestSession, timeoutMs: number = 15000): Promise<string> {
    console.log('🤖 Waiting for AI response...');
    
    // Wait for assistant message to appear
    const assistantSelector = '[data-testid="assistant-message"], [class*="assistant"], .role-assistant';
    
    try {
      await this.page.waitForSelector(assistantSelector, { timeout: timeoutMs });
    } catch (error) {
      // Fallback: look for any new message after user message
      console.log('⚠️  Specific assistant selector not found, using fallback...');
      await this.page.waitForFunction(() => {
        const messages = document.querySelectorAll('[data-testid="transcript"] > *, .transcript > *, [class*="message"]');
        return messages.length >= 2; // User + Assistant message
      }, { timeout: timeoutMs });
    }

    // Get the latest assistant response
    const responseText = await this.page.evaluate(() => {
      // Try multiple selectors to find assistant responses
      const selectors = [
        '[data-testid="assistant-message"]',
        '[class*="assistant"]',
        '.role-assistant',
        '[data-testid="transcript"] > *:last-child',
        '.transcript > *:last-child'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent) {
          return element.textContent;
        }
      }
      
      // Fallback: get last message
      const allMessages = document.querySelectorAll('[class*="message"], [data-testid*="message"]');
      const lastMessage = allMessages[allMessages.length - 1];
      return lastMessage?.textContent || '';
    });

    console.log(`🤖 AI Response: "${responseText}"`);
    return responseText;
  }

  async verifyAudioPlayback(session: VoiceTestSession): Promise<boolean> {
    console.log('🔊 Verifying audio playback...');
    
    const hasAudio = await this.page.evaluate(() => {
      const audioElements = document.querySelectorAll('audio');
      let hasPlayingAudio = false;
      
      audioElements.forEach(audio => {
        if (!audio.paused && audio.currentTime > 0) {
          hasPlayingAudio = true;
        }
      });
      
      return {
        audioElementCount: audioElements.length,
        hasPlayingAudio,
        audioSources: Array.from(audioElements).map(a => a.src || a.currentSrc)
      };
    });

    console.log(`🔊 Audio status:`, hasAudio);
    return hasAudio.audioElementCount > 0;
  }

  async captureNetworkEvents(session: VoiceTestSession): Promise<any[]> {
    const networkEvents: any[] = [];
    
    this.page.on('request', request => {
      if (request.url().includes('openai.com') || request.url().includes('/api/')) {
        networkEvents.push({
          type: 'request',
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        });
      }
    });

    this.page.on('response', response => {
      if (response.url().includes('openai.com') || response.url().includes('/api/')) {
        networkEvents.push({
          type: 'response',
          url: response.url(),
          status: response.status(),
          timestamp: Date.now()
        });
      }
    });

    return networkEvents;
  }

  async cleanup(session: VoiceTestSession): Promise<void> {
    console.log('🧹 Cleaning up test session...');
    
    try {
      // End voice session if connected
      if (session.isConnected) {
        const endButton = this.page.locator('button:has-text("End Session"), button[data-testid="end-session"]').first();
        if (await endButton.isVisible()) {
          await endButton.click();
          console.log('🔌 Voice session ended');
        }
      }
      
      await this.page.close();
      await this.browser.close();
      console.log('✅ Browser cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}

export { SquiddlesBrowserController };