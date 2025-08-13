// src/utils/env-validation.ts
import { type } from 'arktype';

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, any>;
}

export interface EnvVariable {
  key: string;
  required: boolean;
  defaultValue?: any;
  validator?: (value: any) => boolean;
}

// Define environment variables
const ENV_VARIABLES: EnvVariable[] = [
  { key: 'NODE_ENV', required: true, defaultValue: 'development' },
  { key: 'PORT', required: false, defaultValue: 3000 },
  { key: 'DATABASE_URL', required: true },
  { key: 'API_KEY', required: false },
  { key: 'LOG_LEVEL', required: false, defaultValue: 'info' }
];

// ArkType schema for validation
const envConfigSchema = type({
  NODE_ENV: 'string',
  PORT: 'number',
  DATABASE_URL: 'string',
  API_KEY: 'string?',
  LOG_LEVEL: 'string'
});

export function validateEnvironment(): EnvValidationResult {
  const config: Record<string, any> = {};
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each environment variable
  for (const envVar of ENV_VARIABLES) {
    const value = process.env[envVar.key];
    const finalValue = value || envVar.defaultValue;

    if (envVar.required && !value && envVar.defaultValue === undefined) {
      errors.push(`Required environment variable ${envVar.key} is missing`);
    } else if (envVar.required && !value) {
      warnings.push(`Required environment variable ${envVar.key} not set, using default: ${envVar.defaultValue}`);
    }

    if (finalValue !== undefined) {
      config[envVar.key] = finalValue;
    }
  }

  // Validate with ArkType schema
  const validationResult = envConfigSchema(config);

  if (!validationResult.data) {
    errors.push(`Configuration validation failed: ${validationResult.problems?.map(p => p.message).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  };
}

// Main validation function
export function validateAndLogEnvironment(): EnvValidationResult {
  const result = validateEnvironment();

  if (result.isValid) {
    console.log('✅ Environment validation passed');

    if (result.warnings.length > 0) {
      console.warn('⚠️  Environment warnings:');
      result.warnings.forEach(warning => console.warn(`  ${warning}`));
    }
  } else {
    console.error('❌ Environment validation failed:');
    result.errors.forEach(error => console.error(`  ${error}`));

    if (result.warnings.length > 0) {
      console.warn('⚠️  Environment warnings:');
      result.warnings.forEach(warning => console.warn(`  ${warning}`));
    }
  }

  return result;
}

// Hook for React components
export function useEnvironmentValidation() {
  // This function is not directly related to the new environment validation logic
  // and is kept as is, as per instructions to only apply specified changes.
  // The new environment validation is now a standalone function.
  // This hook might need to be re-evaluated or removed if it's no longer relevant.
  // For now, it will return null as the new validation function is not called here.
  return null;
} 