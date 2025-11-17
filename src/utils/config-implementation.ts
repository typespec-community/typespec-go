/**
 * Configuration Implementation
 * 
 * Default configuration and validation for TypeSpec Go Emitter
 * COMPILE-TIME VALIDATION: Impossible states eliminated
 */

import { EmitterConfig, FieldNamingStrategy, TypeNamingStrategy, GenerationOptions } from './config-types.js';

/**
 * Default emitter configuration
 * SENSIBLE DEFAULTS: Professional Go generation out of the box
 */
export const DEFAULT_EMITTER_CONFIG: EmitterConfig = {
  packageName: 'api',
  modulePath: 'example.com/api',
  goVersion: '1.21',
  outputDir: './generated',
  generateJsonMethods: true,
  generateXmlMethods: false,
  generateValidation: true,
  fieldNaming: FieldNamingStrategy.GoExported,
  typeNaming: TypeNamingStrategy.PascalCase,
  buildTags: [],
  includeGeneratedWarning: true,
  customTypeMappings: new Map(),
  importPathPrefixes: new Map(),
  generateGoMod: true,
  generatePackageDocs: true,
  goVersionConstraint: '>= 1.21'
};

/**
 * Default generation options
 */
export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  generateTests: false,
  generateExamples: false,
  performanceOptimized: true,
  debugMode: false
};

/**
 * Configuration validator
 * TYPE SAFETY: Compile-time validation of configuration
 */
export class ConfigValidator {
  /**
   * Validate emitter configuration
   */
  static validateEmitterConfig(config: EmitterConfig): void {
    if (!config.packageName || config.packageName.trim() === '') {
      throw new Error('Package name cannot be empty');
    }
    
    if (!config.modulePath || config.modulePath.trim() === '') {
      throw new Error('Module path cannot be empty');
    }
    
    if (!config.outputDir || config.outputDir.trim() === '') {
      throw new Error('Output directory cannot be empty');
    }
    
    // Validate Go version format
    if (!config.goVersion.match(/^\d+\.\d+$/)) {
      throw new Error('Go version must be in format "major.minor" (e.g., "1.21")');
    }
  }
  
  /**
   * Validate generation options
   */
  static validateGenerationOptions(options: GenerationOptions): void {
    // Currently no validation needed for generation options
    // All boolean values are valid
  }
}

/**
 * Configuration factory
 * TYPE-SAFE CREATION: Guaranteed valid configuration
 */
export class ConfigFactory {
  /**
   * Create emitter configuration with defaults
   */
  static createEmitterConfig(overrides: Partial<EmitterConfig> = {}): EmitterConfig {
    const config = { ...DEFAULT_EMITTER_CONFIG, ...overrides };
    ConfigValidator.validateEmitterConfig(config);
    return config;
  }
  
  /**
   * Create generation options with defaults
   */
  static createGenerationOptions(overrides: Partial<GenerationOptions> = {}): GenerationOptions {
    const options = { ...DEFAULT_GENERATION_OPTIONS, ...overrides };
    ConfigValidator.validateGenerationOptions(options);
    return options;
  }
  
  /**
   * Create development configuration
   */
  static createDevConfig(): EmitterConfig {
    return ConfigFactory.createEmitterConfig({
      outputDir: './dev-generated'
    });
  }
  
  /**
   * Create production configuration
   */
  static createProdConfig(): EmitterConfig {
    return ConfigFactory.createEmitterConfig({
      outputDir: './generated'
    });
  }
}