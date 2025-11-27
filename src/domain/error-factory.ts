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
 * Go Emitter Result union type
 */
export type GoEmitterResult<T = Map<string, string>> =
  | Success<T>
  | TypeSpecCompilerError
  | GoCodeGenerationError
  | ValidationError
  | SystemError
  | TypeMappingError;

/**
 * TypeSpec Compiler Error
 */
export interface TypeSpecCompilerError extends BaseError {
  readonly _tag: "error";
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
  readonly _tag: "error";
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
  readonly _tag: "error";
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
  readonly _tag: "error";
  readonly kind: "system";
  readonly stack?: string;
  readonly cause?: Error;
  readonly resolution?: string;
}

/**
 * Error Factory - Single source of truth for error creation
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 */
export class ErrorFactory {
  /**
   * Generate unique error ID
   */
  private static generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create base error structure
   */
  private static createBaseError(kind: string, message: string): BaseError {
    return {
      _tag: "error",
      kind,
      message,
      timestamp: new Date(),
      errorId: ErrorFactory.generateErrorId(),
    };
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
    const base = ErrorFactory.createBaseError("typespec_compiler", message);
    return {
      ...base,
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
    const base = ErrorFactory.createBaseError("go_code_generation", message);
    return {
      ...base,
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
    const base = ErrorFactory.createBaseError("validation", message);
    return {
      ...base,
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
    const base = ErrorFactory.createBaseError("type_mapping", message);
    return {
      ...base,
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
    const base = ErrorFactory.createBaseError("system", message);
    return {
      ...base,
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
  static isError(result: GoEmitterResult): result is BaseError {
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
export const defaultErrorHandler = (
  error: unknown,
  context?: Record<string, unknown>,
): GoEmitterResult => {
  if (error instanceof Error) {
    return ErrorFactory.createSystemError(`Unexpected error: ${error.message}`, error, {
      resolution: "Check system logs and restart if necessary",
    });
  }

  return ErrorFactory.createSystemError(`Unknown error: ${String(error)}`, undefined, {
    resolution: "Check input data and system state",
  });
};
