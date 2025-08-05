// src/utils/env-validation.ts
import React, { useState, useEffect } from 'react';

interface EnvVariable {
  key: string;
  required: boolean;
  defaultValue?: string;
  validator?: (value: string) => boolean;
  description: string;
}

const ENV_VARIABLES: EnvVariable[] = [
  {
    key: 'VITE_GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API key for AI features',
    validator: (value) => value.length > 20 && value.startsWith('AIza'),
  },
  {
    key: 'VITE_BACKEND_URL',
    required: false,
    defaultValue: 'http://localhost:8000',
    description: 'Backend API URL',
    validator: (value) => value.startsWith('http://') || value.startsWith('https://'),
  },
  {
    key: 'VITE_APP_ENV',
    required: false,
    defaultValue: 'development',
    description: 'Application environment',
    validator: (value) => ['development', 'production', 'test'].includes(value),
  },
];

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, string>;
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, string> = {};

  for (const envVar of ENV_VARIABLES) {
    
    if (!value && envVar.required) {
      errors.push(`Missing required environment variable: ${envVar.key} - ${envVar.description}`);
      continue;
    }

    
    if (finalValue && envVar.validator && !envVar.validator(finalValue)) {
      errors.push(`Invalid value for ${envVar.key}: ${envVar.description}`);
      continue;
    }

    if (!value && envVar.defaultValue) {
      warnings.push(`Using default value for ${envVar.key}: ${envVar.defaultValue}`);
    }

    config[envVar.key] = finalValue;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}

export function logEnvironmentStatus(): void {
  
  if (result.isValid) {
    console.log('✅ Environment validation passed');
    if (result.warnings.length > 0) {
      console.warn('⚠️ Environment warnings:');
      result.warnings.forEach(warning => console.warn(`  ${warning}`));
    }
  } else {
    console.error('❌ Environment validation failed:');
    result.errors.forEach(error => console.error(`  ${error}`));
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Additional warnings:');
      result.warnings.forEach(warning => console.warn(`  ${warning}`));
    }
  }
}

// Hook for React components
export function useEnvironmentValidation() {
  const [validation, setValidation] = useState<EnvValidationResult | null>(null);

  useEffect(() => {
    setValidation(validateEnvironment());
  }, []);

  return validation;
} 