/**
 * TypeSpec Go Emitter Types
 *
 * Core type definitions for Go code generation
 * ZERO ANY TYPES: Professional type safety throughout
 */

/**
 * Type mapping result with discriminated union
 */
export interface TypeMappingResult {
  _tag: "success" | "invalid-model" | "type-mapping-failure" | "unsupported-type" | "invalid-array";
  result?: string;
  modelName?: string;
  fieldName?: string;
  type?: unknown;
  reason?: string;
  elementType?: unknown;
  errors?: readonly string[];
}

/**
 * Go struct field definition
 */
export interface GoStructField {
  /** Field name (Go exported) */
  name: string;
  /** Go type string */
  goType: string;
  /** JSON tag for serialization */
  jsonTag: string;
  /** Whether field is optional */
  isOptional: boolean;
}

/**
 * Go generation configuration
 */
export interface GoGeneratorConfig {
  /** Package name for generated Go code */
  packageName: string;
  /** Whether to omit empty structs */
  omitEmpty?: boolean;
  /** Whether to generate time package imports */
  generateTimePackage?: boolean;
}

/**
 * Go struct generation result
 */
export interface GoStructGenerationResult {
  _tag: "success" | "invalid-model" | "type-mapping-failure";
  structCode?: string;
  fieldCount?: number;
  modelName?: string;
  errors?: readonly string[];
  fieldName?: string;
  typeError?: TypeMappingResult;
}

/**
 * Type mapping configuration
 */
export interface TypeMappingConfig {
  /** Whether to use pointers for optional fields */
  usePointersForOptional?: boolean;
  /** Custom type mappings */
  customMappings?: Record<string, string>;
}

/**
 * Go type mapping configuration
 */
export interface GoTypeMapping {
  /** Go type string */
  readonly goType: string;
  /** Whether to use pointer for optional fields */
  readonly usePointerForOptional: boolean;
  /** Whether this type requires imports */
  readonly requiresImport?: string;
}

/**
 * Go primitive types enum
 */
export enum GoPrimitiveType {
  STRING = "string",
  BOOLEAN = "bool",
  INT8 = "int8",
  INT16 = "int16",
  INT32 = "int32",
  INT64 = "int64",
  UINT8 = "uint8",
  UINT16 = "uint16",
  UINT32 = "uint32",
  UINT64 = "uint64",
  FLOAT32 = "float32",
  FLOAT64 = "float64",
  BYTES = "[]byte",
  INTERFACE = "interface{}",
  TIME = "time.Time",
  DURATION = "time.Duration",
}