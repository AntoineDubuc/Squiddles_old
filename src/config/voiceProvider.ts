/**
 * Voice Provider Configuration
 * Feature toggle system for switching between OpenAI Realtime API and AWS Nova Sonic
 */

export type VoiceProvider = 'openai' | 'nova-sonic';

export interface VoiceProviderConfig {
  provider: VoiceProvider;
  fallbackEnabled: boolean;
  fallbackProvider: VoiceProvider;
}

// Default configuration
const DEFAULT_CONFIG: VoiceProviderConfig = {
  provider: 'nova-sonic',
  fallbackEnabled: true,
  fallbackProvider: 'openai',
};

// Get voice provider from environment variables
export function getVoiceProvider(): VoiceProvider {
  // Check both server and browser environment variables
  const useNovaSonic = process.env.USE_NOVA_SONIC === 'true' || process.env.NEXT_PUBLIC_USE_NOVA_SONIC === 'true';
  return useNovaSonic ? 'nova-sonic' : 'openai';
}

// Check if fallback is enabled
export function isFallbackEnabled(): boolean {
  return process.env.ENABLE_VOICE_FALLBACK !== 'false';
}

// Get fallback provider
export function getFallbackProvider(): VoiceProvider {
  const currentProvider = getVoiceProvider();
  return currentProvider === 'openai' ? 'nova-sonic' : 'openai';
}

// Get complete voice provider configuration
export function getVoiceProviderConfig(): VoiceProviderConfig {
  return {
    provider: getVoiceProvider(),
    fallbackEnabled: isFallbackEnabled(),
    fallbackProvider: getFallbackProvider(),
  };
}

// Check if Nova Sonic is available (has required environment variables)
export function isNovaSonicAvailable(): boolean {
  return !!(
    (process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION) &&
    (process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID) &&
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)
  );
}

// Check if OpenAI is available (has required environment variables)
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Validate provider configuration
export function validateProviderConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const provider = getVoiceProvider();
  const fallbackEnabled = isFallbackEnabled();
  
  // Check primary provider
  if (provider === 'nova-sonic' && !isNovaSonicAvailable()) {
    errors.push('Nova Sonic is selected but AWS credentials are not configured');
  }
  
  if (provider === 'openai' && !isOpenAIAvailable()) {
    errors.push('OpenAI is selected but OPENAI_API_KEY is not configured');
  }
  
  // Check fallback provider
  if (fallbackEnabled) {
    const fallbackProvider = getFallbackProvider();
    
    if (fallbackProvider === 'nova-sonic' && !isNovaSonicAvailable()) {
      warnings.push('Nova Sonic fallback is enabled but AWS credentials are not configured');
    }
    
    if (fallbackProvider === 'openai' && !isOpenAIAvailable()) {
      warnings.push('OpenAI fallback is enabled but OPENAI_API_KEY is not configured');
    }
  }
  
  // Check for missing environment variables
  if (!isNovaSonicAvailable() && !isOpenAIAvailable()) {
    errors.push('Neither Nova Sonic nor OpenAI credentials are configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Get provider display name
export function getProviderDisplayName(provider: VoiceProvider): string {
  switch (provider) {
    case 'nova-sonic':
      return 'AWS Nova Sonic';
    case 'openai':
      return 'OpenAI Realtime API';
    default:
      return 'Unknown';
  }
}

// Get provider cost information
export function getProviderCostInfo(provider: VoiceProvider): {
  name: string;
  costPerHour: number;
  currency: string;
} {
  switch (provider) {
    case 'nova-sonic':
      return {
        name: 'AWS Nova Sonic',
        costPerHour: 0.70,
        currency: 'USD',
      };
    case 'openai':
      return {
        name: 'OpenAI Realtime API',
        costPerHour: 60.00,
        currency: 'USD',
      };
    default:
      return {
        name: 'Unknown',
        costPerHour: 0,
        currency: 'USD',
      };
  }
}

// Log provider configuration
export function logProviderConfig(): void {
  const config = getVoiceProviderConfig();
  const validation = validateProviderConfig();
  
  console.log('🎙️ Voice Provider Configuration:');
  console.log(`  Provider: ${getProviderDisplayName(config.provider)}`);
  console.log(`  Fallback: ${config.fallbackEnabled ? 'Enabled' : 'Disabled'}`);
  
  if (config.fallbackEnabled) {
    console.log(`  Fallback Provider: ${getProviderDisplayName(config.fallbackProvider)}`);
  }
  
  console.log(`  Nova Sonic Available: ${isNovaSonicAvailable() ? 'Yes' : 'No'}`);
  console.log(`  OpenAI Available: ${isOpenAIAvailable() ? 'Yes' : 'No'}`);
  
  if (validation.errors.length > 0) {
    console.error('❌ Configuration Errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration Warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  const costInfo = getProviderCostInfo(config.provider);
  console.log(`💰 Estimated Cost: $${costInfo.costPerHour}/hour (${costInfo.name})`);
}