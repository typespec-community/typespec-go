/**
 * Error Factory - TypeSpec Go Emitter
 *
 * SINGLE SOURCE OF TRUTH: Professional error creation
 * DISCRIMINATED UNIONS: Type-safe error handling
 * ZERO ANY TYPES: Comprehensive type safety
 * EFFECT.TS READY: Railway programming compatible
 */

/**
 * Base error types with discriminated unions
 */
export interface BaseError {
  readonly _tag: "error";
  readonly kind: string;
  readonly message: string;
  readonly timestamp: Date;
  readonly errorId: string;
}

/**
 * Success result type
 */
export interface Success<T> {
  readonly _tag: "success";
  readonly data: T;
  readonly metadata?: Record<string, unknown>;
}

/**
 * TypeSpec Compiler Error
 */
export interface TypeSpecCompilerError extends BaseError {
  readonly kind: "typespec_compiler";
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly typeSpecSource?: string;
  readonly resolution?: string;
}

/**
 * Go Code Generation Error
 */
export interface GoCodeGenerationError extends BaseError {
  readonly kind: "go_code_generation";
  readonly fileName?: string;
  readonly goCode?: string;
  readonly line_number?: number;
  readonly resolution?: string;
}

/**
 * Validation Error
 */
export interface ValidationError extends BaseError {
  readonly kind: "validation";
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly invalidValue?: unknown;
  readonly resolution?: string;
}

/**
 * System Error
 */
export interface SystemError extends BaseError {
  readonly kind: "system";
  readonly stack?: string;
  readonly cause?: Error;
  readonly resolution?: string;
}

/**
 * Type Mapping Error
 */
export interface TypeMappingError extends BaseError {
  readonly kind: "type_mapping";
  readonly typeSpecType?: string;
  readonly fieldName?: string;
  readonly supportedTypes?: string[];
  readonly resolution?: string;
}

/**
 * All error types union
 */
export type AnyError =
  | TypeSpecCompilerError
  | GoCodeGenerationError
  | ValidationError
  | SystemError
  | TypeMappingError;

/**
 * Go Emitter Result union type
 */
export type GoEmitterResult<T = Map<string, string>> = Success<T> | AnyError;

/**
 * Error Factory - Single source of truth for error creation
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 */
export class ErrorFactory {
  /**
   * Generate unique error ID
   */
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Create success result
   */
  static createSuccess<T>(data: T, metadata?: Record<string, unknown>): Success<T> {
    return {
      _tag: "success",
      data,
      metadata,
    };
  }

  /**
   * Create TypeSpec compiler error
   */
  static createTypeSpecCompilerError(
    message: string,
    options?: {
      modelName?: string;
      propertyName?: string;
      typeSpecSource?: string;
      resolution?: string;
    },
  ): TypeSpecCompilerError {
    return {
      _tag: "error",
      kind: "typespec_compiler",
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
      modelName: options?.modelName,
      propertyName: options?.propertyName,
      typeSpecSource: options?.typeSpecSource,
      resolution: options?.resolution || "Check TypeSpec model definition and syntax",
    };
  }

  /**
   * Create Go code generation error
   */
  static createGoCodeGenerationError(
    message: string,
    options?: {
      fileName?: string;
      goCode?: string;
      line_number?: number;
      resolution?: string;
    },
  ): GoCodeGenerationError {
    return {
      _tag: "error",
      kind: "go_code_generation",
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
      fileName: options?.fileName,
      goCode: options?.goCode,
      line_number: options?.line_number,
      resolution: options?.resolution || "Review TypeSpec model and Go generation logic",
    };
  }

  /**
   * Create validation error
   */
  static createValidationError(
    message: string,
    options?: {
      modelName?: string;
      propertyName?: string;
      invalidValue?: unknown;
      resolution?: string;
    },
  ): ValidationError {
    return {
      _tag: "error",
      kind: "validation",
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
      modelName: options?.modelName,
      propertyName: options?.propertyName,
      invalidValue: options?.invalidValue,
      resolution: options?.resolution || "Validate input data and model structure",
    };
  }

  /**
   * Create type mapping error
   */
  static createTypeMappingError(
    message: string,
    options?: {
      typeSpecType?: string;
      fieldName?: string;
      supportedTypes?: string[];
      resolution?: string;
    },
  ): TypeMappingError {
    return {
      _tag: "error",
      kind: "type_mapping",
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
      typeSpecType: options?.typeSpecType,
      fieldName: options?.fieldName,
      supportedTypes: options?.supportedTypes,
      resolution: options?.resolution || "Check TypeSpec type mapping configuration",
    };
  }

  /**
   * Create system error
   */
  static createSystemError(
    message: string,
    error?: Error,
    options?: {
      resolution?: string;
    },
  ): SystemError {
    return {
      _tag: "error",
      kind: "system",
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
      stack: error?.stack,
      cause: error,
      resolution: options?.resolution || "Check system resources and configuration",
    };
  }

  /**
   * Check if result is success
   */
  static isSuccess<T>(result: GoEmitterResult<T>): result is Success<T> {
    return result._tag === "success";
  }

  /**
   * Check if result is error
   */
  static isError(result: GoEmitterResult): result is AnyError {
    return result._tag === "error";
  }

  /**
   * Get error message safely
   */
  static getErrorMessage(result: GoEmitterResult): string {
    if (ErrorFactory.isError(result)) {
      return `[${result.kind.toUpperCase()}] ${result.message}`;
    }
    return "No error";
  }

  /**
   * Convert GoEmitterResult to Effect.TS Result
   */
  static toEffectResult<T>(result: GoEmitterResult<T>) {
    if (ErrorFactory.isSuccess(result)) {
      return { _tag: "success", data: result.data } as const;
    }
    return { _tag: "failure", error: result } as const;
  }
}

/**
 * Default error handler for legacy compatibility
 */
export const defaultErrorHandler = (error: unknown): GoEmitterResult => {
  if (error instanceof Error) {
    return ErrorFactory.createSystemError(`Unexpected error: ${error.message}`, error, {
      resolution: "Check system logs and restart if necessary",
    });
  }

  return ErrorFactory.createSystemError(`Unknown error: ${String(error)}`, undefined, {
    resolution: "Check input data and system state",
  });
};
