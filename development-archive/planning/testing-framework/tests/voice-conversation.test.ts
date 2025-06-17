/**
 * Complete Voice Conversation Integration Tests
 * 
 * These tests validate the entire voice interface by simulating real user interactions
 * Tests run against the actual Squiddles app without modifying production code
 */

import { SquiddlesBrowserController, VoiceTestSession } from '../utilities/browser-controller';
import testScenarios from '../test-data/test-scenarios.json';

describe('Squiddles Voice Conversation Integration', () => {
  let browserController: SquiddlesBrowserController;
  let session: VoiceTestSession;

  beforeAll(async () => {
    global.testLogger.info('Starting voice conversation integration tests');
    browserController = new SquiddlesBrowserController(global.TEST_CONFIG.SQUIDDLES_BASE_URL);
  });

  beforeEach(async () => {
    session = await browserController.initialize();
    await browserController.startVoiceSession(session);
  });

  afterEach(async () => {
    await browserController.cleanup(session);
  });

  describe('Basic Voice Interaction', () => {
    test('should handle basic greeting and respond with voice', async () => {
      const scenario = testScenarios.voiceConversationScenarios.find(s => s.id === 'basic-greeting')!;
      
      global.testLogger.info(`Testing scenario: ${scenario.name}`);
      
      // Measure response timing
      const startTime = Date.now();
      
      // Inject test audio (user saying "Hello, can you help me?")
      await browserController.injectAudioFile(session, scenario.audioFile);
      
      // Verify user speech transcription
      const userTranscript = await browserController.waitForTranscription(
        session, 
        scenario.expectedUserTranscript,
        scenario.timeoutMs
      );
      
      expect(userTranscript.toLowerCase()).toContain('hello');
      
      // Verify AI responds with voice and text
      const aiResponse = await browserController.waitForAIResponse(session, scenario.timeoutMs);
      
      expect(aiResponse).toContainVoiceResponse(scenario.expectedAIResponsePatterns);
      
      // Verify audio playback
      const audioStatus = await browserController.verifyAudioPlayback(session);
      expect(audioStatus).toHaveValidAudioOutput();
      
      // Verify response timing
      const responseTime = Date.now() - startTime;
      expect(responseTime).toHaveCompletedWithinTimeout(scenario.timeoutMs);
      
      global.testLogger.success(`Basic greeting test completed in ${responseTime}ms`);
    });

    test('should maintain conversation context across exchanges', async () => {
      const scenario = testScenarios.voiceConversationScenarios.find(s => s.id === 'multi-turn-conversation')!;
      
      global.testLogger.info('Testing multi-turn conversation flow');
      
      for (let i = 0; i < scenario.steps.length; i++) {
        const step = scenario.steps[i];
        global.testLogger.info(`Conversation step ${i + 1}: ${step.audioFile}`);
        
        // Inject audio for this step
        await browserController.injectAudioFile(session, step.audioFile);
        
        // Wait for transcription
        await browserController.waitForTranscription(session, undefined, 10000);
        
        // Wait for AI response
        const response = await browserController.waitForAIResponse(session, 15000);
        
        // Verify response contains expected patterns
        expect(response).toContainVoiceResponse(step.expectedResponse);
        
        // Small delay between conversation turns
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      global.testLogger.success('Multi-turn conversation test completed');
    });
  });

  describe('Product Manager Agent Features', () => {
    test('should create user story through voice interaction', async () => {
      const scenario = testScenarios.voiceConversationScenarios.find(s => s.id === 'create-user-story')!;
      
      global.testLogger.info('Testing user story creation workflow');
      
      // Inject user story request
      await browserController.injectAudioFile(session, scenario.audioFile);
      
      // Verify transcription
      const transcript = await browserController.waitForTranscription(
        session,
        scenario.expectedUserTranscript,
        scenario.timeoutMs
      );
      
      expect(transcript.toLowerCase()).toContain('user story');
      expect(transcript.toLowerCase()).toContain('login');
      
      // Wait for AI response with tool execution
      const response = await browserController.waitForAIResponse(session, scenario.timeoutMs);
      
      // Verify response acknowledges user story creation
      expect(response).toContainVoiceResponse(scenario.expectedAIResponsePatterns);
      
      // Monitor network for tool execution
      const networkEvents = await browserController.captureNetworkEvents(session);
      
      // Should see API calls for tool execution
      const hasToolExecution = networkEvents.some(event => 
        event.url.includes('/api/responses') && event.type === 'request'
      );
      
      expect(hasToolExecution).toBe(true);
      
      global.testLogger.success('User story creation test completed');
    });

    test('should handle agent handoff to Jira integration', async () => {
      const scenario = testScenarios.voiceConversationScenarios.find(s => s.id === 'agent-handoff-jira')!;
      
      global.testLogger.info('Testing agent handoff workflow');
      
      // First create a user story context
      await browserController.injectAudioFile(session, 'create-user-story.wav');
      await browserController.waitForAIResponse(session, 15000);
      
      // Then request Jira handoff
      await browserController.injectAudioFile(session, scenario.audioFile);
      
      const transcript = await browserController.waitForTranscription(
        session,
        scenario.expectedUserTranscript,
        scenario.timeoutMs
      );
      
      expect(transcript.toLowerCase()).toContain('jira');
      
      // Wait for handoff response
      const response = await browserController.waitForAIResponse(session, scenario.timeoutMs);
      
      expect(response).toContainVoiceResponse(scenario.expectedAIResponsePatterns);
      
      // Verify agent handoff occurred (should see transfer language)
      const hasHandoffLanguage = response.toLowerCase().includes('transfer') || 
                                 response.toLowerCase().includes('jira') ||
                                 response.toLowerCase().includes('ticket');
      
      expect(hasHandoffLanguage).toBe(true);
      
      global.testLogger.success('Agent handoff test completed');
    });
  });

  describe('Performance and Reliability', () => {
    test('should respond within acceptable latency limits', async () => {
      const scenario = testScenarios.performanceScenarios.find(s => s.id === 'response-latency')!;
      
      global.testLogger.info('Testing response latency performance');
      
      const measurements: number[] = [];
      
      // Run multiple trials for statistical accuracy
      for (let trial = 0; trial < 3; trial++) {
        const startTime = Date.now();
        
        await browserController.injectAudioFile(session, scenario.audioFile);
        await browserController.waitForTranscription(session, undefined, 10000);
        await browserController.waitForAIResponse(session, 10000);
        
        const responseTime = Date.now() - startTime;
        measurements.push(responseTime);
        
        global.testLogger.info(`Trial ${trial + 1}: ${responseTime}ms`);
        
        // Reset for next trial
        if (trial < 2) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      const averageLatency = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      
      expect(averageLatency).toHaveCompletedWithinTimeout(scenario.maxLatencyMs);
      
      global.testLogger.success(`Average latency: ${averageLatency.toFixed(0)}ms (limit: ${scenario.maxLatencyMs}ms)`);
    });

    test('should handle streaming responses correctly', async () => {
      const scenario = testScenarios.performanceScenarios.find(s => s.id === 'streaming-performance')!;
      
      global.testLogger.info('Testing real-time streaming performance');
      
      // Monitor DOM changes during streaming
      const streamingUpdates: number[] = [];
      
      await session.page.evaluate(() => {
        const transcript = document.querySelector('[data-testid="transcript"], .transcript');
        if (transcript) {
          let lastLength = 0;
          const observer = new MutationObserver(() => {
            const currentLength = transcript.textContent?.length || 0;
            if (currentLength > lastLength) {
              (window as any).streamingUpdates = (window as any).streamingUpdates || [];
              (window as any).streamingUpdates.push(Date.now());
              lastLength = currentLength;
            }
          });
          observer.observe(transcript, { childList: true, subtree: true, characterData: true });
        }
      });
      
      // Inject complex request that should trigger streaming
      await browserController.injectAudioFile(session, scenario.audioFile);
      await browserController.waitForTranscription(session, undefined, 10000);
      await browserController.waitForAIResponse(session, 20000);
      
      // Check streaming performance
      const updates = await session.page.evaluate(() => (window as any).streamingUpdates || []);
      
      expect(updates.length).toBeGreaterThanOrEqual(scenario.expectedStreamingDeltas);
      
      // Check delta intervals
      if (updates.length > 1) {
        const intervals = updates.slice(1).map((time: number, i: number) => time - updates[i]);
        const averageInterval = intervals.reduce((a: number, b: number) => a + b, 0) / intervals.length;
        
        expect(averageInterval).toBeLessThanOrEqual(scenario.maxDeltaIntervalMs);
        global.testLogger.success(`Streaming: ${updates.length} updates, avg interval: ${averageInterval.toFixed(0)}ms`);
      }
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle unclear speech gracefully', async () => {
      const scenario = testScenarios.errorScenarios.find(s => s.id === 'unclear-speech')!;
      
      global.testLogger.info('Testing unclear speech handling');
      
      await browserController.injectAudioFile(session, scenario.audioFile);
      
      // Should still attempt transcription
      const transcript = await browserController.waitForTranscription(session, undefined, 15000);
      expect(transcript.length).toBeGreaterThan(0);
      
      // Should get a helpful response
      const response = await browserController.waitForAIResponse(session, 15000);
      
      // Response should indicate understanding difficulty or ask for clarification
      const hasHelpfulResponse = response.toLowerCase().includes('clarify') ||
                                response.toLowerCase().includes('understand') ||
                                response.toLowerCase().includes('help') ||
                                response.length > 10; // Any substantial response
      
      expect(hasHelpfulResponse).toBe(true);
      
      global.testLogger.success('Unclear speech test completed');
    });

    test('should maintain functionality after session recovery', async () => {
      global.testLogger.info('Testing session recovery');
      
      // Test basic functionality first
      await browserController.injectAudioFile(session, 'hello.wav');
      await browserController.waitForAIResponse(session, 10000);
      
      // Simulate connection interruption by ending and restarting session
      const endButton = session.page.locator('button:has-text("End Session")').first();
      if (await endButton.isVisible()) {
        await endButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Restart session
      await browserController.startVoiceSession(session);
      
      // Test functionality after recovery
      await browserController.injectAudioFile(session, 'after-reconnect.wav');
      const transcript = await browserController.waitForTranscription(session, undefined, 15000);
      const response = await browserController.waitForAIResponse(session, 15000);
      
      expect(transcript.length).toBeGreaterThan(0);
      expect(response.length).toBeGreaterThan(0);
      
      global.testLogger.success('Session recovery test completed');
    });
  });
});

// Test suite for individual components
describe('Squiddles UI Component Integration', () => {
  let browserController: SquiddlesBrowserController;
  let session: VoiceTestSession;

  beforeAll(async () => {
    browserController = new SquiddlesBrowserController(global.TEST_CONFIG.SQUIDDLES_BASE_URL);
    session = await browserController.initialize();
  });

  afterAll(async () => {
    await browserController.cleanup(session);
  });

  test('should display correct connection status during voice session lifecycle', async () => {
    global.testLogger.info('Testing connection status UI');
    
    // Initially should be disconnected
    const initialStatus = await session.page.textContent('[class*="text-sm"]:has-text("DISCONNECTED")');
    expect(initialStatus).toContain('DISCONNECTED');
    
    // Start session and verify connecting state
    const startButton = session.page.locator('button:has-text("Start Session")').first();
    await startButton.click();
    
    // Should briefly show connecting
    await session.page.waitForSelector('[class*="text-sm"]:has-text("CONNECTING")', { timeout: 5000 });
    
    // Then show connected with green indicator
    await session.page.waitForSelector('.bg-green-500', { timeout: 15000 });
    const connectedStatus = await session.page.textContent('[class*="text-sm"]:has-text("CONNECTED")');
    expect(connectedStatus).toContain('CONNECTED');
    
    global.testLogger.success('Connection status UI test completed');
  });

  test('should update transcript in real-time during conversation', async () => {
    await browserController.startVoiceSession(session);
    
    global.testLogger.info('Testing real-time transcript updates');
    
    // Monitor transcript changes
    const transcriptUpdates: string[] = [];
    
    await session.page.evaluate(() => {
      const transcript = document.querySelector('[data-testid="transcript"], .transcript');
      if (transcript) {
        const observer = new MutationObserver(() => {
          (window as any).transcriptHistory = (window as any).transcriptHistory || [];
          (window as any).transcriptHistory.push(transcript.textContent || '');
        });
        observer.observe(transcript, { childList: true, subtree: true, characterData: true });
      }
    });
    
    // Inject audio and wait for processing
    await browserController.injectAudioFile(session, 'hello.wav');
    await browserController.waitForAIResponse(session, 15000);
    
    // Verify transcript was updated
    const history = await session.page.evaluate(() => (window as any).transcriptHistory || []);
    expect(history.length).toBeGreaterThan(0);
    
    // Should have both user and assistant messages
    const finalTranscript = history[history.length - 1];
    expect(finalTranscript.length).toBeGreaterThan(0);
    
    global.testLogger.success('Real-time transcript test completed');
  });
});