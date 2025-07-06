/**
 * TTS Test API Endpoint - Test voice samples using OpenAI TTS or Nova Sonic
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { voice, text, speed = 1.0, provider = 'openai' } = await request.json();

    if (!voice || !text) {
      return NextResponse.json(
        { error: 'Voice and text are required' },
        { status: 400 }
      );
    }

    // Validate speed parameter
    const validSpeed = Math.max(0.25, Math.min(4.0, speed));

    console.log('🎵 Generating TTS audio:', { voice, textLength: text.length, speed: validSpeed, provider });

    if (provider === 'openai') {
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
      
    } else if (provider === 'nova-sonic') {
      // Use AWS Bedrock Nova Sonic for TTS
      const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
      
      const bedrockClient = new BedrockRuntimeClient({
        region: process.env.AWS_BEDROCK_REGION || 'us-west-2',
      });

      try {
        console.log('🔊 Generating Nova Sonic TTS audio');
        
        // Create request payload for Nova Sonic
        const payload = {
          text: text,
          voice_id: voice,
          output_format: 'mp3',
          voice_settings: {
            speed: validSpeed
          }
        };

        const command = new InvokeModelCommand({
          modelId: process.env.NOVA_SONIC_MODEL_ID || 'amazon.nova-sonic-v1:0',
          body: JSON.stringify(payload),
          contentType: 'application/json',
          accept: 'audio/mpeg'
        });

        const response = await bedrockClient.send(command);
        
        if (response.body) {
          // Convert response body to buffer
          const audioBuffer = Buffer.from(response.body);
          
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.length.toString(),
            },
          });
        } else {
          throw new Error('No audio data received from Nova Sonic');
        }
        
      } catch (error) {
        console.error('❌ Nova Sonic TTS failed:', error);
        
        // Fallback to OpenAI if Nova Sonic fails
        console.log('🔄 Falling back to OpenAI TTS');
        
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy', // Use a neutral OpenAI voice as fallback
          input: `[Nova Sonic Preview] ${text}`,
          speed: validSpeed,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length.toString(),
            'X-Fallback': 'openai',
          },
        });
      }
      
    } else {
      return NextResponse.json(
        { error: 'Invalid provider. Must be "openai" or "nova-sonic"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ TTS generation failed:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}