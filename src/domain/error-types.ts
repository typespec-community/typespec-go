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
      case "TypeSpecCompilerError":
        return !!error.resolution;
      case "GoCodeGenerationError":
        return !!error.resolution;
      case "SystemError":
        return error.context === "Temporary";
      case "ValidationError":
        return !!error.resolution;
      case "Success":
        return true; // Success is always "recoverable"
    }
  };

  /**
   * Get error severity level
   */
  export const getSeverity = (error: GoEmitterResult): "low" | "medium" | "high" | "critical" => {
    switch (error._tag) {
      case "Success":
        return "low";
      case "ValidationError":
        return "medium";
      case "GoCodeGenerationError":
        return "high";
      case "TypeSpecCompilerError":
        return "high";
      case "SystemError":
        return "critical";
    }
  };

  /**
   * Format error for user display
   */
  export const formatError = (error: GoEmitterResult): string => {
    switch (error._tag) {
      case "Success":
        return `✅ Success: Generated ${error.generatedFiles?.length || 0} files`;
      case "ValidationError":
        return `❌ Validation Error: ${error.message}${error.modelName ? ` in model '${error.modelName}'` : ""}`;
      case "GoCodeGenerationError":
        return `❌ Go Generation Error: ${error.message}${error.fileName ? ` in file '${error.fileName}'` : ""}`;
      case "TypeSpecCompilerError":
        return `❌ TypeSpec Error: ${error.message}${error.modelName ? ` in model '${error.modelName}'` : ""}`;
      case "SystemError":
        return `❌ System Error: ${error.message}${error.context ? ` (${error.context})` : ""}`;
    }
  };
}