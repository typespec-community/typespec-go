/**
 * TypeSpec Go Emitter - Strong Type Safety Foundation
 * 
 * IMPOSSIBLE STATES ARE UNREPRESENTABLE THROUGH COMPILE-TIME VALIDATION
 * DISCRIMINATED UNIONS FOR RUNTIME TYPE SAFETY
 * DOMAIN-DRIVEN TYPE DESIGN
 */

import type { Program, EmitContext, Model, Type, Scalar } from "@typespec/compiler";

/**
 * Discriminated union for TypeSpec to Go type mapping
 * Makes impossible states unrepresentable
 */
export type TypeMappingResult = 
  | { _tag: "success"; result: string }
  | { _tag: "unsupported-type"; type: Type; reason: string }
  | { _tag: "invalid-array"; elementType: Type }
  | { _tag: "invalid-model"; modelName: string };

/**
 * Strong-typed Go primitive types
 * No string literals - compile-time validation
 */
export const GoPrimitiveType = {
  STRING: "string",
  BOOLEAN: "bool",
  INT8: "int8",
  INT16: "int16", 
  INT32: "int32",
  INT64: "int64",
  UINT8: "uint8",
  UINT16: "uint16",
  UINT32: "uint32", 
  UINT64: "uint64",
  FLOAT32: "float32",
  FLOAT64: "float64",
  BYTES: "[]byte",
  INTERFACE: "interface{}",
  TIME: "time.Time",
  DURATION: "time.Duration"
} as const;

export type GoPrimitiveType = typeof GoPrimitiveType[keyof typeof GoPrimitiveType];

/**
 * Type mapping configuration with type safety
 */
export interface TypeMappingConfig {
  readonly program: Program;
  readonly useUintOptimization: boolean;
  readonly validateArrays: boolean;
}

/**
 * Domain entity for Go struct field
 * Makes invalid field configurations impossible
 */
export interface GoStructField {
  readonly name: string;
  readonly goType: string;
  readonly jsonTag: string;
  readonly isOptional: boolean;
}

/**
 * Go struct generation result with discriminated union
 */
export type GoStructGenerationResult =
  | { _tag: "success"; structCode: string; fieldCount: number }
  | { _tag: "invalid-model"; modelName: string; errors: readonly string[] }
  | { _tag: "type-mapping-failure"; fieldName: string; typeError: TypeMappingResult };

/**
 * Emitter execution result with proper error handling
 */
export type EmitterExecutionResult =
  | { _tag: "success"; modelsGenerated: number; filesWritten: readonly string[] }
  | { _tag: "compilation-failed"; error: string; details?: unknown }
  | { _tag: "type-mapping-failure"; model: string; mappingErrors: readonly TypeMappingResult[] };

/**
 * Immutable configuration for TypeSpec to Go generation
 */
export interface GoGeneratorConfig {
  readonly packageName: string;
  readonly outputDir: string;
  readonly generateTimePackage: boolean;
  readonly omitEmpty: boolean;
  readonly jsonTags: boolean;
}