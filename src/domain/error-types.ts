/**
 * Error Types - Unified Error System
 *
 * Type-safe discriminated union error definitions
 * Single source of truth for all error handling
 */

/**
 * Branded Types for Type-Safe Entity Identification
 */
export type TypeSpecId = string & { readonly __brand: "TypeSpecId" };
export type ModelName = string & { readonly __brand: "ModelName" };
export type PropertyName = string & { readonly __brand: "PropertyName" };
export type ErrorId = string & { readonly __brand: "ErrorId" };
export type FileName = string & { readonly __brand: "FileName" };

/**
 * TypeSpec Compiler Error
 * DOMAIN ERROR: TypeSpec compilation or validation issues
 */
export interface TypeSpecCompilerError {
  readonly _tag: "typespec_compiler_error";
  readonly message: string;
  readonly details?: string; // Added for detailed error information
  readonly modelName?: ModelName;
  readonly propertyName?: PropertyName;
  readonly resolution?: string;
  readonly errorId: ErrorId;
}

/**
 * Go Code Generation Error
 * DOMAIN ERROR: Go code generation issues
 */
export interface GoCodeGenerationError {
  readonly _tag: "go_code_generation_error";
  readonly message: string;
  readonly fileName?: FileName;
  readonly goCode?: string;
  readonly resolution?: string;
  readonly errorId: ErrorId;
}

/**
 * System Error
 * DOMAIN ERROR: System-level issues
 */
export interface SystemError {
  readonly _tag: "system_error";
  readonly message: string;
  readonly context?: string;
  readonly resolution?: string;
  readonly errorId: ErrorId;
}

/**
 * Validation Error
 * DOMAIN ERROR: Input validation issues
 */
export interface ValidationError {
  readonly _tag: "validation_error";
  readonly message: string;
  readonly details?: string; // Added for detailed error information
  readonly modelName?: ModelName;
  readonly propertyName?: PropertyName;
  readonly reason?: string; // Added for backward compatibility
  readonly resolution?: string;
  readonly errorId: ErrorId;
}

/**
 * Success Result
 * DOMAIN SUCCESS: Successful operation result
 */
export interface Success {
  readonly _tag: "success";
  readonly data: ReadonlyMap<string, string>;
  readonly generatedFiles?: string[];
  readonly typeSpecProgram?: unknown;
}

/**
 * External Error Interfaces (for Adapter Pattern)
 * DIFFERENT NAMES: Avoid conflicts with internal error types
 */
export interface TypeSpecCompilerExternalError {
  readonly message: string;
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly resolution?: string;
}

export interface TypeScriptExternalError {
  readonly message?: string;
  readonly messageText?: string | { messageText?: string };
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly resolution?: string;
}

export interface GoCompilationExternalError {
  readonly message: string;
  readonly fileName?: string;
  readonly goCode?: string;
  readonly resolution?: string;
}

/**
 * Unified Go Emitter Result Type
 * DISCRIMINATED UNION: Compile-time exhaustive matching
 */
export type GoEmitterResult =
  | TypeSpecCompilerError
  | GoCodeGenerationError
  | SystemError
  | ValidationError
  | Success;

/**
 * Error Recovery Strategies
 * DOMAIN LOGIC: Type-safe error recovery patterns
 */
export interface ErrorRecoveryStrategy {
  readonly retryable: boolean;
  readonly fallbackAvailable: boolean;
  readonly userActionRequired: boolean;
  readonly suggestedAction: string;
}

/**
 * Error Analysis Utilities
 */
export namespace ErrorAnalysis {
  /**
   * Determine if error is recoverable
   */
  export const isRecoverable = (error: GoEmitterResult): boolean => {
    switch (error._tag) {
      case "typespec_compiler_error":
        return !!error.resolution;
      case "go_code_generation_error":
        return !!error.resolution;
      case "system_error":
        return error.context === "Temporary";
      case "validation_error":
        return !!error.resolution;
      case "success":
        return true; // Success is always "recoverable"
    }
  };

  /**
   * Get error severity level
   */
  export const getSeverity = (
    error: GoEmitterResult,
  ): "low" | "medium" | "high" | "critical" => {
    switch (error._tag) {
      case "success":
        return "low";
      case "validation_error":
        return "medium";
      case "go_code_generation_error":
        return "high";
      case "typespec_compiler_error":
        return "high";
      case "system_error":
        return "critical";
    }
  };

  /**
   * Format error for user display
   */
  export const formatError = (error: GoEmitterResult): string => {
    switch (error._tag) {
      case "success":
        return `✅ Success: Generated ${error.generatedFiles?.length || 0} files`;
      case "validation_error":
        return `❌ Validation Error: ${error.message}${error.modelName ? ` in model '${error.modelName}'` : ""}`;
      case "go_code_generation_error":
        return `❌ Go Generation Error: ${error.message}${error.fileName ? ` in file '${error.fileName}'` : ""}`;
      case "typespec_compiler_error":
        return `❌ TypeSpec Error: ${error.message}${error.modelName ? ` in model '${error.modelName}'` : ""}`;
      case "system_error":
        return `❌ System Error: ${error.message}${error.context ? ` (${error.context})` : ""}`;
    }
  };
}
