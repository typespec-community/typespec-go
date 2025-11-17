/**
 * Configuration Types
 * 
 * Type-safe configuration interfaces for TypeSpec Go Emitter
 * ZERO 'ANY' TYPES: Comprehensive type safety
 */

/**
 * Field naming strategies
 * ENUMS INSTEAD OF BOOLEANS: Clear naming options
 */
export enum FieldNamingStrategy {
  PascalCase = "pascal-case",
  CamelCase = "camel-case", 
  SnakeCase = "snake-case",
  GoExported = "go-exported" // PascalCase with JSON tags
}

/**
 * Type naming strategies
 */
export enum TypeNamingStrategy {
  PascalCase = "pascal-case",
  SnakeCase = "snake-case",
  SuffixStruct = "suffix-struct" // Add "Struct" suffix
}

/**
 * Custom type mapping configuration
 */
export interface CustomTypeMapping {
  readonly goType: string;
  readonly usePointer: boolean;
  readonly imports?: readonly string[];
}

/**
 * Emitter configuration options
 * COMPREHENSIVE COVERAGE: All generation options
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
  readonly importPathPrefixes: ReadonlyMap<string, string>;
  
  /** Whether to generate go.mod file */
  readonly generateGoMod: boolean;
  
  /** Whether to generate package documentation */
  readonly generatePackageDocs: boolean;
  
  /** Minimum Go version constraint */
  readonly goVersionConstraint: string;
}

/**
 * Generation options for specific generation types
 */
export interface GenerationOptions {
  /** Whether to generate tests */
  readonly generateTests: boolean;
  
  /** Whether to generate examples */
  readonly generateExamples: boolean;
  
  /** Whether to include performance optimizations */
  readonly performanceOptimized: boolean;
  
  /** Debug mode with verbose logging */
  readonly debugMode: boolean;
}