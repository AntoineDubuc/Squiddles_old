#!/usr/bin/env tsx
/**
 * Environment Variable Validation Script for Squiddles
 * Validates all required environment variables for voice providers and services
 */

import dotenv from 'dotenv';
import { validateProviderConfig, logProviderConfig } from '../src/config/voiceProvider';
import { validateModelConfig, logModelConfig } from '../src/config/modelProvider';

// Load environment variables
dotenv.config();
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

interface ValidationResult {
  category: string;
  variable: string;
  required: boolean;
  value: string | undefined;
  status: 'valid' | 'missing' | 'invalid' | 'warning';
  message?: string;
}

class EnvironmentValidator {
  private results: ValidationResult[] = [];

  validate(category: string, variable: string, required: boolean = true, validator?: (value: string) => boolean): void {
    const value = process.env[variable];
    let status: 'valid' | 'missing' | 'invalid' | 'warning' = 'valid';
    let message: string | undefined;

    if (!value) {
      status = required ? 'missing' : 'warning';
      message = required ? 'Required environment variable is missing' : 'Optional environment variable not set';
    } else if (validator && !validator(value)) {
      status = 'invalid';
      message = 'Environment variable value is invalid';
    }

    this.results.push({
      category,
      variable,
      required,
      value: value ? this.maskSensitive(variable, value) : undefined,
      status,
      message
    });
  }

  private maskSensitive(variable: string, value: string): string {
    const sensitivePatterns = ['KEY', 'SECRET', 'TOKEN', 'PASSWORD'];
    if (sensitivePatterns.some(pattern => variable.includes(pattern))) {
      return `${value.substring(0, 8)}...`;
    }
    return value;
  }

  getResults(): ValidationResult[] {
    return this.results;
  }

  hasErrors(): boolean {
    return this.results.some(r => r.status === 'missing' || r.status === 'invalid');
  }

  printReport(): void {
    console.log('\n🔍 Environment Variable Validation Report');
    console.log('==========================================\n');

    const categories = [...new Set(this.results.map(r => r.category))];
    
    for (const category of categories) {
      console.log(`📁 ${category}`);
      console.log('-'.repeat(category.length + 2));
      
      const categoryResults = this.results.filter(r => r.category === category);
      
      for (const result of categoryResults) {
        const icon = this.getStatusIcon(result.status);
        const requiredText = result.required ? '[REQUIRED]' : '[OPTIONAL]';
        
        console.log(`  ${icon} ${result.variable} ${requiredText}`);
        
        if (result.value) {
          console.log(`    Value: ${result.value}`);
        }
        
        if (result.message) {
          console.log(`    ${this.getStatusColor(result.status)}${result.message}\x1b[0m`);
        }
        
        console.log();
      }
    }

    // Summary
    const errors = this.results.filter(r => r.status === 'missing' || r.status === 'invalid');
    const warnings = this.results.filter(r => r.status === 'warning');
    
    console.log('\n📊 Summary');
    console.log('----------');
    console.log(`Total variables checked: ${this.results.length}`);
    console.log(`✅ Valid: ${this.results.filter(r => r.status === 'valid').length}`);
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Critical Issues Found:');
      for (const error of errors) {
        console.log(`  - ${error.variable}: ${error.message}`);
      }
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      for (const warning of warnings) {
        console.log(`  - ${warning.variable}: ${warning.message}`);
      }
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'valid': return '✅';
      case 'missing': return '❌';
      case 'invalid': return '🚫';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'valid': return '\x1b[32m'; // Green
      case 'missing': return '\x1b[31m'; // Red
      case 'invalid': return '\x1b[31m'; // Red
      case 'warning': return '\x1b[33m'; // Yellow
      default: return '\x1b[0m'; // Reset
    }
  }
}

async function main() {
  console.log('🚀 Starting Squiddles Environment Validation...\n');
  
  const validator = new EnvironmentValidator();

  // Core AI Models
  validator.validate('Core AI Models', 'OPENAI_API_KEY', false);
  
  // AWS Configuration
  validator.validate('AWS Configuration', 'AWS_REGION', false);
  validator.validate('AWS Configuration', 'NEXT_PUBLIC_AWS_REGION', false);
  validator.validate('AWS Configuration', 'AWS_ACCESS_KEY_ID', false);
  validator.validate('AWS Configuration', 'NEXT_PUBLIC_AWS_ACCESS_KEY_ID', false);
  validator.validate('AWS Configuration', 'AWS_SECRET_ACCESS_KEY', false);
  validator.validate('AWS Configuration', 'NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY', false);

  // Voice Model Configuration (Nova Sonic)
  validator.validate('Voice Configuration', 'USE_NOVA_SONIC', false);
  validator.validate('Voice Configuration', 'VOICE_MODEL', false);
  validator.validate('Voice Configuration', 'NEXT_PUBLIC_NOVA_SONIC_VOICE_ID', false);
  validator.validate('Voice Configuration', 'NEXT_PUBLIC_NOVA_SONIC_SAMPLE_RATE', false, 
    (value) => !isNaN(parseInt(value)));
  validator.validate('Voice Configuration', 'NEXT_PUBLIC_NOVA_SONIC_SESSION_TIMEOUT', false,
    (value) => !isNaN(parseInt(value)));

  // Text Model Configuration (Nova Pro)
  validator.validate('Text Configuration', 'USE_NOVA_PRO', false);
  validator.validate('Text Configuration', 'TEXT_MODEL', false);
  validator.validate('Text Configuration', 'NEXT_PUBLIC_NOVA_PRO_MODEL_ID', false);
  validator.validate('Text Configuration', 'NEXT_PUBLIC_NOVA_PRO_MAX_TOKENS', false,
    (value) => !isNaN(parseInt(value)));
  validator.validate('Text Configuration', 'NEXT_PUBLIC_NOVA_PRO_TEMPERATURE', false,
    (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1);
  validator.validate('Text Configuration', 'NEXT_PUBLIC_NOVA_PRO_TOP_P', false,
    (value) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1);

  // Model Selection Control
  validator.validate('Model Selection', 'AUTO_DETECT_INPUT', false);
  validator.validate('Model Selection', 'PREFERRED_INPUT_TYPE', false,
    (value) => ['auto', 'voice', 'text'].includes(value.toLowerCase()));
  validator.validate('Model Selection', 'VOICE_FALLBACK_ENABLED', false);
  validator.validate('Model Selection', 'TEXT_FALLBACK_ENABLED', false);

  // Service Integrations
  validator.validate('Service Integration', 'JIRA_HOST', false);
  validator.validate('Service Integration', 'JIRA_EMAIL', false);
  validator.validate('Service Integration', 'JIRA_API_TOKEN', false);
  validator.validate('Service Integration', 'PINECONE_API_KEY', false);
  validator.validate('Service Integration', 'SLACK_BOT_TOKEN', false);
  validator.validate('Service Integration', 'CONFLUENCE_HOST', false);
  validator.validate('Service Integration', 'CONFLUENCE_EMAIL', false);
  validator.validate('Service Integration', 'CONFLUENCE_API_TOKEN', false);

  // Print validation report
  validator.printReport();

  // Run provider validation
  console.log('\n🎙️ Voice Provider Validation');
  console.log('============================');
  try {
    logProviderConfig();
    const voiceValidation = validateProviderConfig();
    
    if (!voiceValidation.isValid) {
      console.log('❌ Voice provider configuration issues:');
      voiceValidation.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ Voice provider configuration is valid');
    }
    
    if (voiceValidation.warnings.length > 0) {
      console.log('⚠️  Voice provider warnings:');
      voiceValidation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  } catch (error) {
    console.error('❌ Error validating voice provider:', error);
  }

  // Run model validation
  console.log('\n🤖 Model Provider Validation');
  console.log('============================');
  try {
    logModelConfig();
    const modelValidation = validateModelConfig();
    
    if (!modelValidation.isValid) {
      console.log('❌ Model provider configuration issues:');
      modelValidation.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ Model provider configuration is valid');
    }
    
    if (modelValidation.warnings.length > 0) {
      console.log('⚠️  Model provider warnings:');
      modelValidation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
  } catch (error) {
    console.error('❌ Error validating model provider:', error);
  }

  // Final status
  console.log('\n🏁 Validation Complete');
  console.log('======================');
  
  if (validator.hasErrors()) {
    console.log('❌ Environment validation failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('✅ Environment validation passed!');
    console.log('\n💡 Next steps:');
    console.log('  1. Run `npm run dev` to start the development server');
    console.log('  2. Test voice providers using the /api/test-voice-provider endpoint');
    console.log('  3. Check the browser console for any runtime errors');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}