module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/utilities/test-setup.ts'
  ],
  testTimeout: 120000, // 2 minutes for voice tests
  verbose: true,
  collectCoverage: false, // We're testing external app
  testSequencer: '<rootDir>/utilities/voice-test-sequencer.js',
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Squiddles Voice Test Report',
      outputPath: 'test-results/voice-test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ],
  // Custom test environment variables
  globals: {
    SQUIDDLES_BASE_URL: 'http://localhost:3000',
    TEST_TIMEOUT: 60000,
    VOICE_RESPONSE_TIMEOUT: 15000,
    OPENAI_TEST_MODE: true
  }
};