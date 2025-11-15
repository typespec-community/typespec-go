/**
 * Configuration Modules - TypeSpec Go Emitter
 * 
 * SINGLE RESPONSIBILITY: Configuration concerns only
 * ZERO ANY TYPES: Professional type safety
 * DOMAIN SEPARATION: Config domain boundaries
 */

/**
 * File Status Enum
 * 
 * ENUM INSTEAD OF BOOLEAN: Unrepresentable invalid states
 * SINGLE RESPONSIBILITY: File status concerns only
 */
export enum FileStatus {
  CREATED = "created",
  GENERATING = "generating", 
  COMPLETED = "completed",
  FAILED = "failed",
  CACHED = "cached"
}

/**
 * Validation Level Enum
 * 
 * ENUM INSTEAD OF BOOLEAN: Unrepresentable invalid states
 * SINGLE RESPONSIBILITY: Validation concerns only
 */
export enum ValidationLevel {
  NONE = "none",
  BASIC = "basic",
  COMPREHENSIVE = "comprehensive",
  STRICT = "strict"
}

/**
 * Generator Mode Enum
 * 
 * ENUM INSTEAD OF BOOLEAN: Unrepresentable invalid states
 * SINGLE RESPONSIBILITY: Generator mode concerns only
 */
export enum GeneratorMode {
  STANDALONE = "standalone",
  INTEGRATED = "integrated",
  PLUGIN = "plugin",
  TEST = "test"
}

/**
 * Configuration Interface
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Configuration concerns only
 */
export interface TypeSpecConfig {
  readonly package: string;
  readonly outputDir: string;
  readonly validationLevel: ValidationLevel;
  readonly generatorMode: GeneratorMode;
  readonly enableCaching: boolean;
  readonly enableDebugging: boolean;
}

/**
 * File Configuration Interface
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: File configuration concerns only
 */
export interface FileConfig {
  readonly fileName: string;
  readonly filePath: string;
  readonly fileStatus: FileStatus;
  readonly lastModified: Date;
  readonly checksum?: string;
}

/**
 * Type-safe Configuration Factory
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Configuration creation only
 */
export class TypeSpecConfigFactory {
  /**
   * Create default configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Default config creation only
   */
  static createDefault(): TypeSpecConfig {
    return {
      package: "api",
      outputDir: "./generated",
      validationLevel: ValidationLevel.BASIC,
      generatorMode: GeneratorMode.STANDALONE,
      enableCaching: true,
      enableDebugging: false
    };
  }

  /**
   * Create production configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Production config creation only
   */
  static createProduction(): TypeSpecConfig {
    return {
      package: "api",
      outputDir: "./src/generated",
      validationLevel: ValidationLevel.STRICT,
      generatorMode: GeneratorMode.INTEGRATED,
      enableCaching: true,
      enableDebugging: false
    };
  }

  /**
   * Create test configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Test config creation only
   */
  static createTest(): TypeSpecConfig {
    return {
      package: "api",
      outputDir: "./test/generated",
      validationLevel: ValidationLevel.COMPREHENSIVE,
      generatorMode: GeneratorMode.TEST,
      enableCaching: false,
      enableDebugging: true
    };
  }
}

/**
 * Type-safe Configuration Manager
 * 
 * ZERO ANY TYPES: Professional type safety
 * SINGLE RESPONSIBILITY: Configuration management only
 */
export class TypeSpecConfigManager {
  private currentConfig: TypeSpecConfig;

  constructor(initialConfig: TypeSpecConfig) {
    this.currentConfig = initialConfig;
  }

  /**
   * Get current configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Config retrieval only
   */
  getConfig(): TypeSpecConfig {
    return this.currentConfig;
  }

  /**
   * Update configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Config update only
   */
  updateConfig(newConfig: Partial<TypeSpecConfig>): TypeSpecConfig {
    this.currentConfig = { ...this.currentConfig, ...newConfig };
    return this.currentConfig;
  }

  /**
   * Validate configuration
   * 
   * ZERO ANY TYPES: Professional type safety
   * SINGLE RESPONSIBILITY: Config validation only
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.currentConfig.package || this.currentConfig.package.trim() === '') {
      errors.push('Package name is required and cannot be empty');
    }

    if (!this.currentConfig.outputDir || this.currentConfig.outputDir.trim() === '') {
      errors.push('Output directory is required and cannot be empty');
    }

    if (!Object.values(ValidationLevel).includes(this.currentConfig.validationLevel)) {
      errors.push('Invalid validation level');
    }

    if (!Object.values(GeneratorMode).includes(this.currentConfig.generatorMode)) {
      errors.push('Invalid generator mode');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}