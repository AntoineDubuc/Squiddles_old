import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { provider, fallbackEnabled } = await request.json();
    
    if (!provider || !['openai', 'nova-sonic'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be "openai" or "nova-sonic"' },
        { status: 400 }
      );
    }

    // Read current .env.local file
    const envPath = join(process.cwd(), '.env.local');
    let envContent = '';
    
    try {
      envContent = readFileSync(envPath, 'utf-8');
    } catch (error) {
      console.warn('⚠️ Could not read .env.local file:', error);
      return NextResponse.json(
        { error: 'Could not access environment file' },
        { status: 500 }
      );
    }

    // Update environment variables
    const lines = envContent.split('\n');
    let updatedLines = [...lines];
    
    // Update or add USE_NOVA_SONIC
    const useNovaSonicValue = provider === 'nova-sonic' ? 'true' : 'false';
    const useNovaSonicIndex = updatedLines.findIndex(line => line.startsWith('USE_NOVA_SONIC='));
    
    if (useNovaSonicIndex >= 0) {
      updatedLines[useNovaSonicIndex] = `USE_NOVA_SONIC=${useNovaSonicValue}`;
    } else {
      // Add to the end if not found
      updatedLines.push(`USE_NOVA_SONIC=${useNovaSonicValue}`);
    }
    
    // Update or add ENABLE_VOICE_FALLBACK
    const fallbackValue = fallbackEnabled ? 'true' : 'false';
    const fallbackIndex = updatedLines.findIndex(line => line.startsWith('ENABLE_VOICE_FALLBACK='));
    
    if (fallbackIndex >= 0) {
      updatedLines[fallbackIndex] = `ENABLE_VOICE_FALLBACK=${fallbackValue}`;
    } else {
      // Add to the end if not found
      updatedLines.push(`ENABLE_VOICE_FALLBACK=${fallbackValue}`);
    }

    // Write back to file
    const newEnvContent = updatedLines.join('\n');
    
    try {
      writeFileSync(envPath, newEnvContent, 'utf-8');
      console.log(`✅ Voice provider updated to ${provider} with fallback ${fallbackEnabled ? 'enabled' : 'disabled'}`);
      
      return NextResponse.json({
        success: true,
        message: `Voice provider updated to ${provider}`,
        provider,
        fallbackEnabled,
        restartRequired: true
      });
      
    } catch (error) {
      console.error('❌ Failed to write .env.local file:', error);
      return NextResponse.json(
        { error: 'Could not save to environment file' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Voice provider settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return current voice provider settings
    const currentProvider = process.env.USE_NOVA_SONIC === 'true' ? 'nova-sonic' : 'openai';
    const fallbackEnabled = process.env.ENABLE_VOICE_FALLBACK !== 'false';
    
    return NextResponse.json({
      provider: currentProvider,
      fallbackEnabled,
      openaiAvailable: !!process.env.OPENAI_API_KEY,
      novaSonicAvailable: !!(
        process.env.AWS_REGION &&
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY
      )
    });
    
  } catch (error) {
    console.error('❌ Voice provider settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}