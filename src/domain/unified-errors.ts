/**
 * Unified Error System - TypeSpec Go Emitter
 *
 * SINGLE SOURCE OF TRUTH: Eliminating split brain error systems
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * ZERO ANY TYPES: Professional type safety
 * EFFECT.TS COMPATIBLE: Railway programming ready
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
 * Type-Safe Entity Creators
 */
export namespace Entities {
  export const createTypeSpecId = (id: string): TypeSpecId => id as TypeSpecId;
  export const createModelName = (name: string): ModelName => name as ModelName;
  export const createPropertyName = (name: string): PropertyName =>
    name as PropertyName;
  export const createErrorId = (id: string): ErrorId => id as ErrorId;
  export const createFileName = (name: string): FileName => name as FileName;
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
 * Invalid Model Reasons Enum
 * ENUMS INSTEAD OF BOOLEANS: Impossible states eliminated
 */
export enum InvalidModelReason {
  EmptyName = "empty-name",
  NoProperties = "no-properties",
  InvalidCharacter = "invalid-character",
  DuplicateProperty = "duplicate-property",
  CircularReference = "circular-reference",
}

/**
 * TypeSpec Compiler Error
 */
export interface TypeSpecCompilerError {
  readonly _tag: "TypeSpecCompilerError";
  readonly message: string;
  readonly modelName?: ModelName;
  readonly propertyName?: PropertyName;
  readonly resolution: string;
  readonly errorId: ErrorId;
}

/**
 * Go Code Generation Error
 */
export interface GoCodeGenerationError {
  readonly _tag: "GoCodeGenerationError";
  readonly message: string;
  readonly fileName?: FileName;
  readonly goCode?: string;
  readonly resolution: string;
  readonly errorId: ErrorId;
}

/**
 * Type Safety Error
 */
export interface TypeSafetyError {
  readonly _tag: "TypeSafetyError";
  readonly message: string;
  readonly violation: string;
  readonly expected: string;
  readonly actual: string;
  readonly resolution: string;
  readonly errorId: ErrorId;
}

/**
 * Model Validation Error
 */
export interface ModelValidationError {
  readonly _tag: "ModelValidationError";
  readonly message: string;
  readonly modelName?: ModelName;
  readonly reason: InvalidModelReason;
  readonly context?: Record<string, unknown>;
  readonly resolution: string;
  readonly errorId: ErrorId;
}

/**
 * System Error (unexpected errors)
 */
export interface SystemError {
  readonly _tag: "SystemError";
  readonly message: string;
  readonly originalError?: Error;
  readonly resolution: string;
  readonly errorId: ErrorId;
}

/**
 * Unified Error Type
 * DISCRIMINATED UNION: Exhaustive compile-time matching
 */
export type GoEmitterError =
  | TypeSpecCompilerError
  | GoCodeGenerationError
  | TypeSafetyError
  | ModelValidationError
  | SystemError;

/**
 * Success Type
 * Railway Programming Ready
 */
export interface GoEmitterSuccess {
  readonly _tag: "Success";
  readonly data: Map<string, string>;
  readonly generatedFiles: readonly FileName[];
  readonly typeSpecProgram: unknown;
}

/**
 * Result Type
 * DISCRIMINATED UNION: Impossible states unrepresentable
 */
export type GoEmitterResult = GoEmitterSuccess | GoEmitterError;

/**
 * Error Factory
 * SINGLE SOURCE OF TRUTH: Unified error creation
 */
export class ErrorFactory {
  private static nextErrorId = 0;

  private static createErrorId(): ErrorId {
    return Entities.createErrorId(`error-${++ErrorFactory.nextErrorId}`);
  }

  /**
   * Create TypeSpec Compiler Error
   */
  static createTypeSpecCompilerError(
    message: string,
    options?: {
      modelName?: string;
      propertyName?: string;
      resolution?: string;
    },
  ): TypeSpecCompilerError {
    return {
      _tag: "TypeSpecCompilerError",
      message,
      ...(options?.modelName && { modelName: Entities.createModelName(options.modelName) }),
      ...(options?.propertyName && { propertyName: Entities.createPropertyName(options.propertyName) }),
      resolution: options?.resolution || "Check TypeSpec model syntax",
      errorId: this.createErrorId(),
    };
  }

  /**
   * Create Go Code Generation Error
   */
  static createGoCodeGenerationError(
    message: string,
    options?: {
      fileName?: string;
      goCode?: string;
      resolution?: string;
    },
  ): GoCodeGenerationError {
    const errorObject: GoCodeGenerationError = {
      _tag: "GoCodeGenerationError",
      message,
      resolution: options?.resolution || "Fix Go code syntax",
      errorId: this.createErrorId(),
    };
    
    // Conditionally add optional properties to avoid explicit undefined
    if (options?.fileName) {
      errorObject.fileName = Entities.createFileName(options.fileName);
    }
    
    if (options?.goCode) {
      errorObject.goCode = options.goCode;
    }
    
    return errorObject;
  }

  /**
   * Create Type Safety Error
   */
  static createTypeSafetyError(
    message: string,
    violation: string,
    expected: string,
    actual: string,
    options?: {
      resolution?: string;
    },
  ): TypeSafetyError {
    return {
      _tag: "TypeSafetyError",
      message,
      violation,
      expected,
      actual,
      resolution: options?.resolution || "Fix type safety violation",
      errorId: this.createErrorId(),
    };
  }

  /**
   * Create Model Validation Error
   */
  static createModelValidationError(
    message: string,
    modelName: string,
    reason: InvalidModelReason,
    options?: {
      context?: Record<string, unknown>;
      resolution?: string;
    },
  ): ModelValidationError {
    const errorObject: ModelValidationError = {
      _tag: "ModelValidationError",
      message,
      modelName: Entities.createModelName(modelName),
      reason,
      resolution: options?.resolution || "Fix model validation issue",
      errorId: this.createErrorId(),
    };
    
    // Conditionally add optional context to avoid explicit undefined passing
    if (options?.context) {
      errorObject.context = options.context;
    }
    
    return errorObject;
  }

  /**
   * Create System Error
   */
  static createSystemError(
    message: string,
    originalError?: Error,
    options?: {
      resolution?: string;
    },
  ): SystemError {
    const errorObject: SystemError = {
      _tag: "SystemError",
      message,
      resolution: options?.resolution || "Contact system administrator",
      errorId: this.createErrorId(),
    };
    
    // Conditionally add optional originalError to avoid explicit undefined
    if (originalError) {
      errorObject.originalError = originalError;
    }
    
    return errorObject;
  }

  /**
   * Create Success Result
   */
  static createSuccess(
    data: Map<string, string>,
    options?: {
      generatedFiles?: string[];
      typeSpecProgram?: unknown;
    },
  ): GoEmitterSuccess {
    return {
      _tag: "Success",
      data,
      generatedFiles:
        options?.generatedFiles?.map(Entities.createFileName) ?? [],
      typeSpecProgram: options?.typeSpecProgram,
    };
  }
}

/**
 * Error Handler Utilities
 */
export namespace ErrorHandler {
  /**
   * Get user-friendly error message
   */
  export function getUserMessage(error: GoEmitterError): string {
    switch (error._tag) {
      case "TypeSpecCompilerError":
        return `TypeSpec compilation failed: ${error.message}`;

      case "GoCodeGenerationError":
        return `Go code generation failed: ${error.message}`;

      case "TypeSafetyError":
        return `Type safety violation: ${error.message}`;

      case "ModelValidationError":
        return `Model validation failed: ${error.message}`;

      case "SystemError":
        return `System error: ${error.message}`;

      default:
        const _exhaustiveCheck: never = error;
        return "Unknown error occurred";
    }
  }

  /**
   * Check if error is recoverable
   */
  export function isRecoverable(error: GoEmitterError): boolean {
    switch (error._tag) {
      case "TypeSpecCompilerError":
      case "ModelValidationError":
        return true; // User can fix these
      case "GoCodeGenerationError":
      case "TypeSafetyError":
        return false; // Internal generator issues
      case "SystemError":
        return false; // Unexpected errors
      default:
        const _exhaustiveCheck: never = error;
        return false;
    }
  }

  /**
   * Format error for logging
   */
  export function formatForLogging(error: GoEmitterError): {
    level: "error" | "warn";
    message: string;
    context: Record<string, unknown>;
  } {
    const baseContext = {
      tag: error._tag,
      errorId: error.errorId,
    };

    switch (error._tag) {
      case "TypeSpecCompilerError":
        return {
          level: "error",
          message: error.message,
          context: {
            ...baseContext,
            modelName: error.modelName,
            propertyName: error.propertyName,
            resolution: error.resolution,
          },
        };

      case "GoCodeGenerationError":
        return {
          level: "error",
          message: error.message,
          context: {
            ...baseContext,
            fileName: error.fileName,
            goCode: error.goCode,
            resolution: error.resolution,
          },
        };

      case "TypeSafetyError":
        return {
          level: "error",
          message: error.message,
          context: {
            ...baseContext,
            violation: error.violation,
            expected: error.expected,
            actual: error.actual,
            resolution: error.resolution,
          },
        };

      case "ModelValidationError":
        return {
          level: "error",
          message: error.message,
          context: {
            ...baseContext,
            modelName: error.modelName,
            reason: error.reason,
            context: error.context,
            resolution: error.resolution,
          },
        };

      case "SystemError":
        return {
          level: "error",
          message: error.message,
          context: {
            ...baseContext,
            originalError: error.originalError?.message,
            resolution: error.resolution,
          },
        };

      default:
        const _exhaustiveCheck: never = error;
        return {
          level: "error",
          message: "Unknown error",
          context: baseContext,
        };
    }
  }
}
