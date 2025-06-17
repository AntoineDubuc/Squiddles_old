import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Voice tests need to run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for voice tests to avoid conflicts
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: true,
    // Allow microphone access for voice testing
    permissions: ['microphone'],
    // Disable web security to allow audio injection
    launchOptions: {
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--use-file-for-fake-audio-capture=test-data/audio-samples/default.wav',
        '--allow-running-insecure-content',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    }
  },
  projects: [
    {
      name: 'chromium-voice',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true,
        // Chrome-specific audio settings
        launchOptions: {
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--disable-web-security',
            '--allow-running-insecure-content'
          ]
        }
      },
    }
  ],
  webServer: {
    command: 'cd .. && npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  },
  expect: {
    timeout: 15000 // Longer timeout for voice responses
  }
});