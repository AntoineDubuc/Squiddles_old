/**
 * Test Setup and Global Configuration
 * 
 * Global test setup for the isolated Squiddles testing framework
 */

import * as path from 'path';
import * as fs from 'fs';

// Global test configuration
global.TEST_CONFIG = {
  SQUIDDLES_BASE_URL: process.env.SQUIDDLES_BASE_URL || 'http://localhost:3002',
  TEST_TIMEOUT: parseInt(process.env.TEST_TIMEOUT || '60000'),
  VOICE_RESPONSE_TIMEOUT: parseInt(process.env.VOICE_RESPONSE_TIMEOUT || '15000'),
  OPENAI_TEST_MODE: process.env.OPENAI_TEST_MODE === 'true',
  AUDIO_SAMPLES_PATH: path.join(__dirname, '../test-data/audio-samples'),
  TEST_RESULTS_PATH: path.join(__dirname, '../test-results'),
  VERBOSE_LOGGING: process.env.VERBOSE_LOGGING === 'true'
};

// Custom console logger for tests
global.testLogger = {
  info: (message: string, ...args: any[]) => {
    if (global.TEST_CONFIG.VERBOSE_LOGGING) {
      console.log(`ℹ️  [TEST] ${message}`, ...args);
    }
  },
  success: (message: string, ...args: any[]) => {
    console.log(`✅ [TEST] ${message}`, ...args);
  },
  warning: (message: string, ...args: any[]) => {
    console.warn(`⚠️  [TEST] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [TEST] ${message}`, ...args);
  }
};

// Ensure test directories exist
beforeAll(() => {
  const requiredDirs = [
    global.TEST_CONFIG.TEST_RESULTS_PATH,
    path.join(global.TEST_CONFIG.TEST_RESULTS_PATH, 'screenshots'),
    path.join(global.TEST_CONFIG.TEST_RESULTS_PATH, 'audio-captures'),
    path.join(global.TEST_CONFIG.TEST_RESULTS_PATH, 'network-logs')
  ];

  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      global.testLogger.info(`Created test directory: ${dir}`);
    }
  });
});

// Test audio file verification
beforeAll(() => {
  const audioSamplesDir = global.TEST_CONFIG.AUDIO_SAMPLES_PATH;
  
  if (!fs.existsSync(audioSamplesDir)) {
    global.testLogger.warning('Audio samples directory not found. Run "npm run generate-audio" first.');
    return;
  }

  const audioFiles = fs.readdirSync(audioSamplesDir).filter(file => file.endsWith('.wav'));
  global.testLogger.info(`Found ${audioFiles.length} test audio files`);
  
  if (audioFiles.length === 0) {
    global.testLogger.warning('No audio files found. Run "npm run generate-audio" to create test audio.');
  }
});

// Global test timeout
jest.setTimeout(global.TEST_CONFIG.TEST_TIMEOUT);

// Enhanced expect matchers for voice testing
expect.extend({
  toContainVoiceResponse(received: string, expectedPatterns: string[]) {
    const receivedLower = received.toLowerCase();
    const matchedPatterns = expectedPatterns.filter(pattern => 
      receivedLower.includes(pattern.toLowerCase())
    );

    const pass = matchedPatterns.length > 0;
    
    if (pass) {
      return {
        message: () => `Expected "${received}" not to contain voice patterns ${expectedPatterns.join(', ')}, but found: ${matchedPatterns.join(', ')}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected "${received}" to contain at least one of the voice patterns: ${expectedPatterns.join(', ')}`,
        pass: false,
      };
    }
  },

  toHaveCompletedWithinTimeout(received: number, timeoutMs: number) {
    const pass = received <= timeoutMs;
    
    if (pass) {
      return {
        message: () => `Expected ${received}ms not to be within timeout of ${timeoutMs}ms`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received}ms to be within timeout of ${timeoutMs}ms`,
        pass: false,
      };
    }
  },

  toHaveValidAudioOutput(received: any) {
    const hasAudio = received && 
                     typeof received === 'object' && 
                     received.audioElementCount > 0;
    
    if (hasAudio) {
      return {
        message: () => `Expected not to have valid audio output`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected to have valid audio output with audioElementCount > 0, but received: ${JSON.stringify(received)}`,
        pass: false,
      };
    }
  }
});

// Type declarations for global extensions
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainVoiceResponse(expectedPatterns: string[]): R;
      toHaveCompletedWithinTimeout(timeoutMs: number): R;
      toHaveValidAudioOutput(): R;
    }
  }

  var TEST_CONFIG: {
    SQUIDDLES_BASE_URL: string;
    TEST_TIMEOUT: number;
    VOICE_RESPONSE_TIMEOUT: number;
    OPENAI_TEST_MODE: boolean;
    AUDIO_SAMPLES_PATH: string;
    TEST_RESULTS_PATH: string;
    VERBOSE_LOGGING: boolean;
  };

  var testLogger: {
    info: (message: string, ...args: any[]) => void;
    success: (message: string, ...args: any[]) => void;
    warning: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
  };
}

export {};