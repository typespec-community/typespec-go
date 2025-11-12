/**
 * TypeSpec-Go Emitter Configuration
 * 
 * Centralized configuration with type safety
 * No more hardcoded values, no magic strings
 * 
 * @fileoverview Emitter configuration with validation
 */

/**
 * Emitter configuration options
 */
export interface EmitterConfig {
  /** Go package name for generated code */
  readonly packageName: string;
  
  /** Go module path (e.g., "example.com/user/api") */
  readonly modulePath: string;
  
  /** Target Go version (e.g., "1.21", "1.22") */
  readonly goVersion: string;
  
  /** Output directory relative to project root */
  readonly outputDir: string;
  
  /** Whether to generate JSON marshaling methods */
  readonly generateJsonMethods: boolean;
  
  /** Whether to generate XML marshaling methods */
  readonly generateXmlMethods: boolean;
  
  /** Whether to generate validation methods */
  readonly generateValidation: boolean;
  
  /** Field naming strategy */
  readonly fieldNaming: FieldNamingStrategy;
  
  /** Type naming strategy */
  readonly typeNaming: TypeNamingStrategy;
  
  /** Build tags for generated files */
  readonly buildTags: readonly string[];
  
  /** Whether to include generated file warnings */
  readonly includeGeneratedWarning: boolean;
  
  /** Custom type mappings for TypeSpec scalars */
  readonly customTypeMappings: ReadonlyMap<string, CustomTypeMapping>;
  
  /** Import path prefixes for generated types */
  readonly importPrefixes: ReadonlyMap<string, string>;
}

/**
 * Field naming strategy options
 */
export enum FieldNamingStrategy {
  /** PascalCase: userName → UserName */
  Pascal = "pascal",
  
  /** camelCase: userName → userName */
  Camel = "camel",
  
  /** snake_case: userName → user_name */
  Snake = "snake",
}

/**
 * Type naming strategy options
 */
export enum TypeNamingStrategy {
  /** PascalCase: User → User */
  Pascal = "pascal",
  
  /** camelCase: User → user */
  Camel = "camel",
  
  /** snake_case: User → user */
  Snake = "snake",
}

/**
 * Custom type mapping configuration
 */
export interface CustomTypeMapping {
  /** Go type name */
  readonly goType: string;
  
  /** Import path if external package */
  readonly importPath?: string;
  
  /** Whether to use pointer for optional properties */
  readonly usePointerForOptional: boolean;
  
  /** Custom validation rules */
  readonly validation?: CustomValidationRules;
}

/**
 * Custom validation rules
 */
export interface CustomValidationRules {
  /** Minimum length for strings/arrays */
  readonly minLength?: number;
  
  /** Maximum length for strings/arrays */
  readonly maxLength?: number;
  
  /** Minimum value for numbers */
  readonly minValue?: number;
  
  /** Maximum value for numbers */
  readonly maxValue?: number;
  
  /** Custom validation pattern (regex) */
  readonly pattern?: string;
}

/**
 * Default emitter configuration
 */
export const DEFAULT_EMITTER_CONFIG: EmitterConfig = {
  packageName: "api",
  modulePath: "example.com/api",
  goVersion: "1.21",
  outputDir: "./gen",
  generateJsonMethods: true,
  generateXmlMethods: false,
  generateValidation: false,
  fieldNaming: FieldNamingStrategy.Pascal,
  typeNaming: TypeNamingStrategy.Pascal,
  buildTags: [],
  includeGeneratedWarning: true,
  customTypeMappings: new Map(),
  importPrefixes: new Map(),
};

/**
 * Emitter configuration factory
 */
export class EmitterConfigFactory {
  /**
   * Create configuration from TypeSpec compiler options
   */
  static fromTypeSpecOptions(typeSpecOptions: any): EmitterConfig {
    // Start with defaults
    const config = { ...DEFAULT_EMITTER_CONFIG };
    
    // Override with TypeSpec options
    if (typeSpecOptions["go-package"]) {
      config.packageName = typeSpecOptions["go-package"];
    }
    
    if (typeSpecOptions["go-module"]) {
      config.modulePath = typeSpecOptions["go-module"];
    }
    
    if (typeSpecOptions["go-version"]) {
      config.goVersion = typeSpecOptions["go-version"];
    }
    
    if (typeSpecOptions["go-output-dir"]) {
      config.outputDir = typeSpecOptions["go-output-dir"];
    }
    
    if (typeSpecOptions["go-generate-json"] !== undefined) {
      config.generateJsonMethods = Boolean(typeSpecOptions["go-generate-json"]);
    }
    
    if (typeSpecOptions["go-generate-xml"] !== undefined) {
      config.generateXmlMethods = Boolean(typeSpecOptions["go-generate-xml"]);
    }
    
    if (typeSpecOptions["go-generate-validation"] !== undefined) {
      config.generateValidation = Boolean(typeSpecOptions["go-generate-validation"]);
    }
    
    // Handle naming strategies
    if (typeSpecOptions["go-field-naming"]) {
      const strategy = FieldNamingStrategy[typeSpecOptions["go-field-naming"] as keyof typeof FieldNamingStrategy];
      if (strategy !== undefined) {
        config.fieldNaming = strategy;
      }
    }
    
    if (typeSpecOptions["go-type-naming"]) {
      const strategy = TypeNamingStrategy[typeSpecOptions["go-type-naming"] as keyof typeof TypeNamingStrategy];
      if (strategy !== undefined) {
        config.typeNaming = strategy;
      }
    }
    
    // Handle build tags
    if (typeSpecOptions["go-build-tags"]) {
      config.buildTags = String(typeSpecOptions["go-build-tags"]).split(",").map(tag => tag.trim());
    }
    
    // Handle custom type mappings
    if (typeSpecOptions["go-type-mappings"]) {
      config.customTypeMappings = this.parseCustomTypeMappings(typeSpecOptions["go-type-mappings"]);
    }
    
    return this.validateConfig(config);
  }

  /**
   * Create configuration from environment variables
   */
  static fromEnvironment(): EmitterConfig {
    const config = { ...DEFAULT_EMITTER_CONFIG };
    
    if (process.env.GO_PACKAGE) {
      config.packageName = process.env.GO_PACKAGE;
    }
    
    if (process.env.GO_MODULE) {
      config.modulePath = process.env.GO_MODULE;
    }
    
    if (process.env.GO_VERSION) {
      config.goVersion = process.env.GO_VERSION;
    }
    
    if (process.env.GO_OUTPUT_DIR) {
      config.outputDir = process.env.GO_OUTPUT_DIR;
    }
    
    return this.validateConfig(config);
  }

  /**
   * Parse custom type mappings from configuration
   */
  private static parseCustomTypeMappings(mappings: string): ReadonlyMap<string, CustomTypeMapping> {
    const result = new Map<string, CustomTypeMapping>();
    
    try {
      const parsed = JSON.parse(mappings);
      for (const [typeSpecType, mapping] of Object.entries(parsed)) {
        result.set(typeSpecType, {
          goType: mapping.goType,
          importPath: mapping.importPath,
          usePointerForOptional: mapping.usePointerForOptional !== false,
          validation: mapping.validation,
        });
      }
    } catch (error) {
      console.warn(`Failed to parse custom type mappings: ${error}`);
    }
    
    return result;
  }

  /**
   * Validate configuration and throw errors for invalid settings
   */
  static validateConfig(config: EmitterConfig): EmitterConfig {
    // Validate package name
    if (!config.packageName || config.packageName.trim().length === 0) {
      throw new Error(`Invalid package name: '${config.packageName}'`);
    }
    
    if (!/^[a-z][a-z0-9_]*$/.test(config.packageName)) {
      throw new Error(`Invalid Go package name: '${config.packageName}'. Must be lowercase, start with letter.`);
    }
    
    // Validate module path
    if (!config.modulePath || config.modulePath.trim().length === 0) {
      throw new Error(`Invalid module path: '${config.modulePath}'`);
    }
    
    if (!config.goVersion || !/^\d+\.\d+(\.\d+)?$/.test(config.goVersion)) {
      throw new Error(`Invalid Go version: '${config.goVersion}'. Expected format: 1.21 or 1.21.3`);
    }
    
    // Validate output directory
    if (!config.outputDir || config.outputDir.trim().length === 0) {
      throw new Error(`Invalid output directory: '${config.outputDir}'`);
    }
    
    // Validate build tags
    for (const tag of config.buildTags) {
      if (!/^[a-z][a-z0-9_]*$/i.test(tag)) {
        throw new Error(`Invalid build tag: '${tag}'. Must be valid Go identifier.`);
      }
    }
    
    return config;
  }

  /**
   * Create configuration with custom overrides
   */
  static create(overrides: Partial<EmitterConfig>): EmitterConfig {
    const config = { ...DEFAULT_EMITTER_CONFIG, ...overrides };
    return this.validateConfig(config);
  }

  /**
   * Get effective configuration from multiple sources
   * Priority: TypeSpec options > Environment > Defaults
   */
  static createEffective(typeSpecOptions: any): EmitterConfig {
    // Start with environment
    const config = this.fromEnvironment();
    
    // Override with TypeSpec options
    const typeSpecConfig = this.fromTypeSpecOptions(typeSpecOptions);
    return { ...config, ...typeSpecConfig };
  }
}