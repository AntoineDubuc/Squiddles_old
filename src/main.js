// V2R Voice Assistant - Main Entry Point
// This file will initialize the voice assistant application

import { VoiceAssistant } from './components/VoiceAssistant.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Create and mount the voice assistant
    const voiceAssistant = new VoiceAssistant();
    voiceAssistant.mount(app);
});

// Global error handling for the application
window.addEventListener('error', (event) => {
    console.error('V2R Application Error:', event.error);
    // TODO: Add error reporting/analytics
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // TODO: Add error reporting/analytics
});