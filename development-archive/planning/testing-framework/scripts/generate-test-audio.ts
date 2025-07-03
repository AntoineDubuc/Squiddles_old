#!/usr/bin/env ts-node

/**
 * Generate Test Audio Files for Voice Testing
 * 
 * This script generates realistic test audio files using OpenAI TTS
 * for automated voice interface testing.
 */

import * as fs from 'fs';
import * as path from 'path';

// OpenAI TTS Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AUDIO_OUTPUT_DIR = path.join(__dirname, '../test-data/audio-samples');

interface AudioTestCase {
  filename: string;
  text: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  description: string;
}

const TEST_AUDIO_CASES: AudioTestCase[] = [
  {
    filename: 'hello.wav',
    text: 'Hello, can you help me?',
    voice: 'alloy',
    description: 'Basic greeting test'
  },
  {
    filename: 'create-user-story.wav',
    text: 'I need to create a user story for a login feature that allows users to authenticate with email and password',
    voice: 'nova',
    description: 'Product manager user story request'
  },
  {
    filename: 'jira-handoff.wav',
    text: 'Please create a Jira ticket for this user story',
    voice: 'alloy',
    description: 'Agent handoff to Jira integration'
  },
  {
    filename: 'greeting.wav',
    text: 'Hi there',
    voice: 'echo',
    description: 'Simple greeting'
  },
  {
    filename: 'ask-for-story.wav',
    text: 'Can you help me document a new feature?',
    voice: 'alloy',
    description: 'Feature documentation request'
  },
  {
    filename: 'provide-details.wav',
    text: 'The feature should allow users to reset their password using email verification',
    voice: 'nova',
    description: 'Detailed feature description'
  },
  {
    filename: 'quick-question.wav',
    text: 'What can you do?',
    voice: 'alloy',
    description: 'Quick capability inquiry'
  },
  {
    filename: 'complex-request.wav',
    text: 'I need to create a comprehensive user story for a multi-step authentication system that includes email verification, two-factor authentication, and password reset functionality with proper error handling and user feedback',
    voice: 'nova',
    description: 'Complex feature request for streaming test'
  },
  {
    filename: 'unclear-speech.wav',
    text: 'Um, uh, I think I need to, like, create something for, you know, the login thing',
    voice: 'fable',
    description: 'Unclear speech with hesitations'
  },
  {
    filename: 'after-reconnect.wav',
    text: 'Are you still there? I was asking about creating a user story',
    voice: 'alloy',
    description: 'Speech after connection recovery'
  },
  {
    filename: 'confluence-linkedin-search.wav',
    text: 'I\'d like to see Confluence pages about LinkedIn',
    voice: 'alloy',
    description: 'Confluence search for LinkedIn pages'
  }
];

async function generateAudioFile(testCase: AudioTestCase): Promise<void> {
  if (!OPENAI_API_KEY) {
    console.log(`⚠️  No OpenAI API key found. Creating placeholder for ${testCase.filename}`);
    await createPlaceholderAudio(testCase);
    return;
  }

  try {
    console.log(`🎙️  Generating ${testCase.filename}: "${testCase.text}"`);
    
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: testCase.text,
        voice: testCase.voice,
        response_format: 'wav'
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const outputPath = path.join(AUDIO_OUTPUT_DIR, testCase.filename);
    
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
    console.log(`✅ Generated: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Failed to generate ${testCase.filename}:`, error);
    await createPlaceholderAudio(testCase);
  }
}

async function createPlaceholderAudio(testCase: AudioTestCase): Promise<void> {
  // Create a minimal WAV file as placeholder
  // This is a 1-second silence in WAV format
  const placeholderWav = Buffer.from([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x08, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20,
    0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00,
    0x02, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, 0x00, 0x08, 0x00, 0x00
  ]);
  
  // Add silence data (1 second at 44.1kHz, 16-bit, mono)
  const silenceData = Buffer.alloc(44100 * 2, 0);
  const fullWav = Buffer.concat([placeholderWav, silenceData]);
  
  const outputPath = path.join(AUDIO_OUTPUT_DIR, testCase.filename);
  fs.writeFileSync(outputPath, fullWav);
  console.log(`📝 Created placeholder: ${outputPath}`);
}

async function generateTestAudioMetadata(): Promise<void> {
  const metadata = {
    generatedAt: new Date().toISOString(),
    audioFiles: TEST_AUDIO_CASES.map(testCase => ({
      filename: testCase.filename,
      description: testCase.description,
      text: testCase.text,
      voice: testCase.voice,
      path: `audio-samples/${testCase.filename}`
    })),
    instructions: [
      'These audio files are generated for automated voice testing',
      'Each file contains a specific test scenario for voice recognition',
      'Files can be regenerated by running: npm run generate-audio',
      'Real OpenAI API key required for high-quality audio generation'
    ]
  };

  const metadataPath = path.join(__dirname, '../test-data/audio-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`📋 Generated metadata: ${metadataPath}`);
}

async function main(): Promise<void> {
  console.log('🚀 Generating test audio files for Squiddles voice testing...\n');

  // Ensure output directory exists
  if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
    fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
  }

  // Generate all audio files
  for (const testCase of TEST_AUDIO_CASES) {
    await generateAudioFile(testCase);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Generate metadata
  await generateTestAudioMetadata();

  console.log('\n✨ Test audio generation complete!');
  console.log(`📁 Audio files saved to: ${AUDIO_OUTPUT_DIR}`);
  console.log('🎯 Ready for automated voice testing');
}

if (require.main === module) {
  main().catch(console.error);
}

export { generateAudioFile, TEST_AUDIO_CASES };