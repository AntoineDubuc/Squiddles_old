/**
 * TTS Test API Endpoint - Test voice samples using OpenAI TTS
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { voice, text, speed = 1.0 } = await request.json();

    if (!voice || !text) {
      return NextResponse.json(
        { error: 'Voice and text are required' },
        { status: 400 }
      );
    }

    // Validate speed parameter
    const validSpeed = Math.max(0.25, Math.min(4.0, speed));

    console.log('🎵 Generating TTS audio:', { voice, textLength: text.length, speed: validSpeed });

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
      speed: validSpeed,
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Return audio as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('❌ TTS generation failed:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}