/**
 * Basic Connectivity Test
 * 
 * Simple test to verify we can connect to the Squiddles app
 * and establish a baseline before running complex voice tests
 */

import { test, expect } from '@playwright/test';

test.describe('Squiddles Basic Connectivity', () => {

  test('should load Squiddles app successfully', async ({ page }) => {
    console.log('🌐 Testing basic app connectivity...');
    
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for app to load
    await page.waitForSelector('h1:has-text("Squiddles")', { timeout: 10000 });
    
    // Verify app loaded
    const title = await page.textContent('h1');
    expect(title).toContain('Squiddles');
    
    console.log('✅ App loaded successfully');
  });

  test('should show start session button', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1:has-text("Squiddles")');
    
    // Look for start session button
    const startButton = page.locator('button:has-text("Start Session")').first();
    await expect(startButton).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Start session button found');
  });

  test('should connect to voice session', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1:has-text("Squiddles")');
    
    // Click start session
    const startButton = page.locator('button:has-text("Start Session")').first();
    await startButton.click();
    
    // Wait for connection status change
    try {
      await page.waitForSelector('.bg-green-500', { timeout: 15000 });
      console.log('✅ Voice session connected successfully');
    } catch (error) {
      console.log('⚠️  Connection may have failed - checking status...');
      
      // Check what status is shown
      const statusElements = await page.locator('[class*="text-sm"]').allTextContents();
      console.log('📊 Status elements found:', statusElements);
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'test-results/connection-debug.png' });
      
      throw new Error('Failed to connect to voice session');
    }
  });

  test('should show transcript and events panels', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1:has-text("Squiddles")');
    
    // Look for main UI components
    const transcriptPanel = page.locator('text=Conversation').first();
    const eventsPanel = page.locator('text=Events').first();
    
    await expect(transcriptPanel).toBeVisible({ timeout: 5000 });
    await expect(eventsPanel).toBeVisible({ timeout: 5000 });
    
    console.log('✅ UI panels found');
  });
});