/**
 * Model Provider Configuration
 * Unified system for managing voice and text model selection
 * Supports separate models for voice (Nova Sonic) and text (Nova Pro) interactions
 */

export type VoiceModel = 'openai' | 'nova-sonic';
export type TextModel = 'openai' | 'nova-pro';

export interface ModelProviderConfig {
  // Voice model configuration
  voiceModel: VoiceModel;
  voiceFallbackEnabled: boolean;
  voiceFallbackModel: VoiceModel;
  
  // Text model configuration
  textModel: TextModel;
  textFallbackEnabled: boolean;
  textFallbackModel: TextModel;
  
  // General settings
  autoDetectInputType: boolean;
  preferredInputType: 'voice' | 'text' | 'auto';
}

// Default configuration optimized for cost and performance
const DEFAULT_CONFIG: ModelProviderConfig = {
  // Voice: Nova Sonic (cost-effective for voice)
  voiceModel: 'nova-sonic',
  voiceFallbackEnabled: true,
  voiceFallbackModel: 'openai',
  
  // Text: Nova Pro (optimized for text interactions)
  textModel: 'nova-pro',
  textFallbackEnabled: true,
  textFallbackModel: 'openai',
  
  // Auto-detection enabled
  autoDetectInputType: true,
  preferredInputType: 'auto',
};

// Environment variable mappings
const ENV_MAPPINGS = {
  // Voice model selection
  USE_NOVA_SONIC: 'USE_NOVA_SONIC',
  VOICE_MODEL: 'VOICE_MODEL',
  VOICE_FALLBACK_ENABLED: 'VOICE_FALLBACK_ENABLED',
  
  // Text model selection
  USE_NOVA_PRO: 'USE_NOVA_PRO',
  TEXT_MODEL: 'TEXT_MODEL',
  TEXT_FALLBACK_ENABLED: 'TEXT_FALLBACK_ENABLED',
  
  // General settings
  AUTO_DETECT_INPUT: 'AUTO_DETECT_INPUT',
  PREFERRED_INPUT_TYPE: 'PREFERRED_INPUT_TYPE',
};

// Get voice model from environment variables
export function getVoiceModel(): VoiceModel {
  // Check explicit voice model setting
  const explicitModel = process.env.VOICE_MODEL?.toLowerCase();
  if (explicitModel === 'openai' || explicitModel === 'nova-sonic') {
    return explicitModel;
  }
  
  // Check legacy Nova Sonic setting
  const useNovaSonic = process.env.USE_NOVA_SONIC === 'true' || process.env.NEXT_PUBLIC_USE_NOVA_SONIC === 'true';
  return useNovaSonic ? 'nova-sonic' : 'openai';
}

// Get text model from environment variables
export function getTextModel(): TextModel {
  // Check explicit text model setting
  const explicitModel = process.env.TEXT_MODEL?.toLowerCase();
  if (explicitModel === 'openai' || explicitModel === 'nova-pro') {
    return explicitModel;
  }
  
  // Check Nova Pro setting
  const useNovaPro = process.env.USE_NOVA_PRO === 'true' || process.env.NEXT_PUBLIC_USE_NOVA_PRO === 'true';
  return useNovaPro ? 'nova-pro' : 'openai';
}

// Check if auto-detection is enabled
export function isAutoDetectEnabled(): boolean {
  return process.env.AUTO_DETECT_INPUT !== 'false';
}

// Get preferred input type
export function getPreferredInputType(): 'voice' | 'text' | 'auto' {
  const preferred = process.env.PREFERRED_INPUT_TYPE?.toLowerCase();
  if (preferred === 'voice' || preferred === 'text' || preferred === 'auto') {
    return preferred;
  }
  return 'auto';
}

// Check if fallback is enabled for voice
export function isVoiceFallbackEnabled(): boolean {
  return process.env.VOICE_FALLBACK_ENABLED !== 'false';
}

// Check if fallback is enabled for text
export function isTextFallbackEnabled(): boolean {
  return process.env.TEXT_FALLBACK_ENABLED !== 'false';
}

// Get voice fallback model
export function getVoiceFallbackModel(): VoiceModel {
  const currentModel = getVoiceModel();
  return currentModel === 'openai' ? 'nova-sonic' : 'openai';
}

// Get text fallback model
export function getTextFallbackModel(): TextModel {
  const currentModel = getTextModel();
  return currentModel === 'openai' ? 'nova-pro' : 'openai';
}

// Get complete model provider configuration
export function getModelProviderConfig(): ModelProviderConfig {
  return {
    voiceModel: getVoiceModel(),
    voiceFallbackEnabled: isVoiceFallbackEnabled(),
    voiceFallbackModel: getVoiceFallbackModel(),
    
    textModel: getTextModel(),
    textFallbackEnabled: isTextFallbackEnabled(),
    textFallbackModel: getTextFallbackModel(),
    
    autoDetectInputType: isAutoDetectEnabled(),
    preferredInputType: getPreferredInputType(),
  };
}

// Check availability of different models
export function isNovaProAvailable(): boolean {
  return !!(
    (process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION) &&
    (process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID) &&
    (process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY)
  );
}

export function isNovaSonicAvailable(): boolean {
  return isNovaProAvailable(); // Same AWS credentials
}

export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Validate model configuration
export function validateModelConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const config = getModelProviderConfig();
  
  // Check voice model availability
  if (config.voiceModel === 'nova-sonic' && !isNovaSonicAvailable()) {
    errors.push('Nova Sonic is selected for voice but AWS credentials are not configured');
  }
  
  if (config.voiceModel === 'openai' && !isOpenAIAvailable()) {
    errors.push('OpenAI is selected for voice but OPENAI_API_KEY is not configured');
  }
  
  // Check text model availability
  if (config.textModel === 'nova-pro' && !isNovaProAvailable()) {
    errors.push('Nova Pro is selected for text but AWS credentials are not configured');
  }
  
  if (config.textModel === 'openai' && !isOpenAIAvailable()) {
    errors.push('OpenAI is selected for text but OPENAI_API_KEY is not configured');
  }
  
  // Check fallback models
  if (config.voiceFallbackEnabled) {
    if (config.voiceFallbackModel === 'nova-sonic' && !isNovaSonicAvailable()) {
      warnings.push('Nova Sonic voice fallback is enabled but AWS credentials are not configured');
    }
    
    if (config.voiceFallbackModel === 'openai' && !isOpenAIAvailable()) {
      warnings.push('OpenAI voice fallback is enabled but OPENAI_API_KEY is not configured');
    }
  }
  
  if (config.textFallbackEnabled) {
    if (config.textFallbackModel === 'nova-pro' && !isNovaProAvailable()) {
      warnings.push('Nova Pro text fallback is enabled but AWS credentials are not configured');
    }
    
    if (config.textFallbackModel === 'openai' && !isOpenAIAvailable()) {
      warnings.push('OpenAI text fallback is enabled but OPENAI_API_KEY is not configured');
    }
  }
  
  // Check if no models are available
  if (!isOpenAIAvailable() && !isNovaProAvailable() && !isNovaSonicAvailable()) {
    errors.push('No models are available - neither OpenAI nor AWS credentials are configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Get model display names
export function getVoiceModelDisplayName(model: VoiceModel): string {
  switch (model) {
    case 'nova-sonic':
      return 'AWS Nova Sonic';
    case 'openai':
      return 'OpenAI Realtime API';
    default:
      return 'Unknown';
  }
}

export function getTextModelDisplayName(model: TextModel): string {
  switch (model) {
    case 'nova-pro':
      return 'AWS Nova Pro';
    case 'openai':
      return 'OpenAI GPT';
    default:
      return 'Unknown';
  }
}

// Get cost information for models
export function getVoiceModelCostInfo(model: VoiceModel): {
  name: string;
  costPerHour: number;
  currency: string;
} {
  switch (model) {
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

export function getTextModelCostInfo(model: TextModel): {
  name: string;
  costPer1KTokens: number;
  currency: string;
} {
  switch (model) {
    case 'nova-pro':
      return {
        name: 'AWS Nova Pro',
        costPer1KTokens: 0.0008,
        currency: 'USD',
      };
    case 'openai':
      return {
        name: 'OpenAI GPT-4',
        costPer1KTokens: 0.03,
        currency: 'USD',
      };
    default:
      return {
        name: 'Unknown',
        costPer1KTokens: 0,
        currency: 'USD',
      };
  }
}

// Log model configuration
export function logModelConfig(): void {
  const config = getModelProviderConfig();
  const validation = validateModelConfig();
  
  console.log('🤖 Model Provider Configuration:');
  console.log(`  Voice Model: ${getVoiceModelDisplayName(config.voiceModel)}`);
  console.log(`  Text Model: ${getTextModelDisplayName(config.textModel)}`);
  console.log(`  Auto-Detect Input: ${config.autoDetectInputType ? 'Enabled' : 'Disabled'}`);
  console.log(`  Preferred Input: ${config.preferredInputType}`);
  
  console.log(`  Voice Fallback: ${config.voiceFallbackEnabled ? 'Enabled' : 'Disabled'}`);
  if (config.voiceFallbackEnabled) {
    console.log(`  Voice Fallback Model: ${getVoiceModelDisplayName(config.voiceFallbackModel)}`);
  }
  
  console.log(`  Text Fallback: ${config.textFallbackEnabled ? 'Enabled' : 'Disabled'}`);
  if (config.textFallbackEnabled) {
    console.log(`  Text Fallback Model: ${getTextModelDisplayName(config.textFallbackModel)}`);
  }
  
  console.log(`  Model Availability:`);
  console.log(`    OpenAI: ${isOpenAIAvailable() ? 'Yes' : 'No'}`);
  console.log(`    Nova Sonic: ${isNovaSonicAvailable() ? 'Yes' : 'No'}`);
  console.log(`    Nova Pro: ${isNovaProAvailable() ? 'Yes' : 'No'}`);
  
  if (validation.errors.length > 0) {
    console.error('❌ Configuration Errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Configuration Warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  // Cost estimation
  const voiceCost = getVoiceModelCostInfo(config.voiceModel);
  const textCost = getTextModelCostInfo(config.textModel);
  console.log(`💰 Estimated Costs:`);
  console.log(`  Voice: $${voiceCost.costPerHour}/hour (${voiceCost.name})`);
  console.log(`  Text: $${textCost.costPer1KTokens}/1K tokens (${textCost.name})`);
}

// Input type detection
export function detectInputType(input: string, context?: any): 'voice' | 'text' {
  // If auto-detection is disabled, use preferred type
  if (!isAutoDetectEnabled()) {
    const preferred = getPreferredInputType();
    return preferred === 'auto' ? 'text' : preferred;
  }
  
  // Check context for hints about input type
  if (context?.isVoiceInput === true) {
    return 'voice';
  }
  
  if (context?.isTextInput === true) {
    return 'text';
  }
  
  // Analyze input characteristics for detection
  // Voice transcripts often have certain characteristics:
  // - More conversational language
  // - Shorter sentences
  // - Less punctuation
  // - Common speech patterns
  
  const voiceIndicators = [
    /\b(um|uh|er|ah|like|you know|I mean)\b/i,
    /\b(gonna|wanna|gotta|kinda)\b/i,
    /[.!?]{2,}/, // Multiple punctuation often from voice
  ];
  
  const textIndicators = [
    /[{}[\]()]/,  // Code-like syntax
    /[<>]/,       // HTML/XML tags
    /\b(function|class|import|export|const|let|var)\b/i, // Code keywords
    /^\s*[-*+]\s/m, // List formatting
  ];
  
  const voiceScore = voiceIndicators.reduce((score, pattern) => 
    score + (pattern.test(input) ? 1 : 0), 0);
  
  const textScore = textIndicators.reduce((score, pattern) => 
    score + (pattern.test(input) ? 1 : 0), 0);
  
  // If we have strong indicators, use them
  if (textScore > voiceScore) {
    return 'text';
  }
  
  if (voiceScore > textScore) {
    return 'voice';
  }
  
  // Default to preferred type
  const preferred = getPreferredInputType();
  return preferred === 'auto' ? 'text' : preferred;
}

// Get recommended model based on input type
export function getRecommendedModel(inputType: 'voice' | 'text'): VoiceModel | TextModel {
  const config = getModelProviderConfig();
  return inputType === 'voice' ? config.voiceModel : config.textModel;
}