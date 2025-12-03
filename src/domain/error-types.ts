/**
 * Error Types - TypeSpec Go Emitter
 *
 * COMPREHENSIVE ERROR SYSTEM: All error types in one place
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * TYPE SAFETY: Zero any types, professional development
 * EFFECT.TS INTEGRATION: Railway programming ready
 */

/**
 * Core error base interface
 */
export interface BaseError {
  readonly _tag: "error";
  readonly kind: ErrorKind;
  readonly message: string;
  readonly timestamp: Date;
  readonly errorId: string;
}

/**
 * Error kinds - exhaustive list
 */
export type ErrorKind =
  | "typespec_compiler"
  | "go_code_generation"
  | "validation"
  | "system"
  | "type_mapping"
  | "file_system"
  | "configuration";

/**
 * Success result type
 */
export interface Success<T> {
  readonly _tag: "success";
  readonly data: T;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Result type for all operations
 */
export type GoEmitterResult<T = Map<string, string>> =
  | Success<T>
  | TypeSpecCompilerError
  | GoCodeGenerationError
  | ValidationError
  | SystemError
  | TypeMappingError
  | FileSystemError
  | ConfigurationError;

/**
 * TypeSpec Compiler Error
 * Occurs when TypeSpec models are invalid or malformed
 */
export interface TypeSpecCompilerError extends BaseError {
  readonly kind: "typespec_compiler";
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly typeSpecSource?: string;
  readonly line?: number;
  readonly column?: number;
  readonly resolution?: string;
}

/**
 * Go Code Generation Error
 * Occurs when generating Go code fails
 */
export interface GoCodeGenerationError extends BaseError {
  readonly kind: "go_code_generation";
  readonly fileName?: string;
  readonly goCode?: string;
  readonly lineNumber?: number;
  readonly goSyntax?: string;
  readonly resolution?: string;
}

/**
 * Validation Error
 * Occurs when input validation fails
 */
export interface ValidationError extends BaseError {
  readonly kind: "validation";
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly invalidValue?: unknown;
  readonly expectedType?: string;
  readonly receivedType?: string;
  readonly resolution?: string;
}

/**
 * System Error
 * Occurs for system-level failures
 */
export interface SystemError extends BaseError {
  readonly kind: "system";
  readonly stack?: string;
  readonly cause?: Error;
  readonly errorCode?: string;
  readonly resolution?: string;
}

/**
 * Type Mapping Error
 * Occurs when TypeSpec to Go type mapping fails
 */
export interface TypeMappingError extends BaseError {
  readonly kind: "type_mapping";
  readonly typeSpecType?: string;
  readonly typeSpecKind?: string;
  readonly fieldName?: string;
  readonly modelName?: string;
  readonly supportedTypes?: readonly string[];
  readonly resolution?: string;
}

/**
 * File System Error
 * Occurs when file operations fail
 */
export interface FileSystemError extends BaseError {
  readonly kind: "file_system";
  readonly filePath?: string;
  readonly operation?: "read" | "write" | "delete" | "mkdir";
  readonly permissionError?: boolean;
  readonly notFound?: boolean;
  readonly resolution?: string;
}

/**
 * Configuration Error
 * Occurs when configuration is invalid
 */
export interface ConfigurationError extends BaseError {
  readonly kind: "configuration";
  readonly configKey?: string;
  readonly configValue?: unknown;
  readonly allowedValues?: readonly string[];
  readonly resolution?: string;
}

/**
 * External error types for integration
 */
export interface TypeSpecCompilerExternalError {
  readonly _tag: "external_error";
  readonly source: "typespec_compiler";
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export interface TypeScriptExternalError {
  readonly _tag: "external_error";
  readonly source: "typescript";
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export interface GoCompilationExternalError {
  readonly _tag: "external_error";
  readonly source: "go_compiler";
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Error Recovery Strategies
 */
export type ErrorRecoveryStrategy =
  | "skip_invalid_model"
  | "skip_invalid_property"
  | "use_fallback_type"
  | "retry_with_alternate"
  | "abort_operation"
  | "log_and_continue";

/**
 * Error Analysis utilities
 */
export class ErrorAnalysis {
  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: BaseError): boolean {
    switch (error.kind) {
      case "validation":
      case "type_mapping":
        return true;
      case "system":
      case "file_system":
        return false;
      case "go_code_generation":
      case "typespec_compiler":
      case "configuration":
        return false;
      default:
        return false;
    }
  }

  /**
   * Get recovery strategy for error
   */
  static getRecoveryStrategy(error: GoEmitterResult): ErrorRecoveryStrategy {
    if (error._tag === "success") {
      return "log_and_continue";
    }

    switch (error.kind) {
      case "validation": {
        const validationError = error as ValidationError;
        return validationError.propertyName ? "skip_invalid_property" : "skip_invalid_model";
      }
      case "type_mapping":
        return "use_fallback_type";
      case "system":
      case "file_system":
      case "configuration":
        return "abort_operation";
      case "go_code_generation":
      case "typespec_compiler":
        return "abort_operation";
      default:
        return "log_and_continue";
    }
  }

  /**
   * Get error severity level
   */
  static getSeverity(error: BaseError): "low" | "medium" | "high" | "critical" {
    switch (error.kind) {
      case "type_mapping":
        return "low";
      case "validation":
        return "medium";
      case "go_code_generation":
      case "configuration":
        return "high";
      case "system":
      case "file_system":
      case "typespec_compiler":
        return "critical";
      default:
        return "medium";
    }
  }

  /**
   * Format error for logging
   */
  static formatForLogging(error: BaseError): string {
    const severity = ErrorAnalysis.getSeverity(error);
    const timestamp = error.timestamp.toISOString();
    const kind = error.kind.toUpperCase();
    const message = error.message;

    return `[${severity.toUpperCase()}] [${kind}] ${timestamp} - ${message}`;
  }

  /**
   * Extract context information from error
   */
  static extractContext(error: BaseError): Record<string, unknown> {
    const context: Record<string, unknown> = {
      errorId: error.errorId,
      kind: error.kind,
      message: error.message,
      timestamp: error.timestamp.toISOString(),
      severity: ErrorAnalysis.getSeverity(error),
      recoverable: ErrorAnalysis.isRecoverable(error),
      recoveryStrategy: ErrorAnalysis.getRecoveryStrategy(error),
    };

    // Add specific context based on error type
    if ("modelName" in error && error.modelName) {
      context.modelName = error.modelName;
    }
    if ("propertyName" in error && error.propertyName) {
      context.propertyName = error.propertyName;
    }
    if ("fileName" in error && error.fileName) {
      context.fileName = error.fileName;
    }

    return context;
  }
}

/**
 * Type guards for error types
 */
export const isErrorType = {
  isTypeSpecCompilerError: (error: unknown): error is TypeSpecCompilerError =>
    typeof error === "object" &&
    error !== null &&
    (error as BaseError).kind === "typespec_compiler",

  isGoCodeGenerationError: (error: unknown): error is GoCodeGenerationError =>
    typeof error === "object" &&
    error !== null &&
    (error as BaseError).kind === "go_code_generation",

  isValidationError: (error: unknown): error is ValidationError =>
    typeof error === "object" && error !== null && (error as BaseError).kind === "validation",

  isSystemError: (error: unknown): error is SystemError =>
    typeof error === "object" && error !== null && (error as BaseError).kind === "system",

  isTypeMappingError: (error: unknown): error is TypeMappingError =>
    typeof error === "object" && error !== null && (error as BaseError).kind === "type_mapping",

  isFileSystemError: (error: unknown): error is FileSystemError =>
    typeof error === "object" && error !== null && (error as BaseError).kind === "file_system",

  isConfigurationError: (error: unknown): error is ConfigurationError =>
    typeof error === "object" && error !== null && (error as BaseError).kind === "configuration",
};
