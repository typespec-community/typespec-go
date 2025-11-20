/**
 * Unified Error System - TypeSpec Go Emitter
 *
 * SINGLE SOURCE OF TRUTH: Eliminating split brain error systems
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * ZERO ANY TYPES: Professional type safety
 * EFFECT.TS COMPATIBLE: Railway programming ready
 */

// Re-export all types from specialized modules
export type {
  TypeSpecId,
  ModelName,
  PropertyName,
  ErrorId,
  FileName,
} from "./error-entities.js";

export type {
  TypeSpecCompilerError,
  GoCodeGenerationError,
  SystemError,
  ValidationError,
  Success,
  GoEmitterResult,
  TypeSpecCompilerExternalError,
  TypeScriptExternalError,
  GoCompilationExternalError,
  ErrorRecoveryStrategy,
} from "./error-types.js";

export {
  Entities,
  EntityValidation,
  EntityTransformation,
} from "./error-entities.js";

export { ErrorFactory } from "./error-factory.js";

export { ErrorAnalysis } from "./error-types.js";

// Export TypeSpec entities for compatibility
export { InvalidModelReason, TypeSpecEntities } from "../types/errors.js";

// Legacy exports for backward compatibility
export type TypeSpecModel = {
  readonly name: string;
  readonly properties: ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
      optional: boolean;
    }
  >;
};

export type GoEmitterOptions = {
  /** Optional custom output directory */
  readonly outputDir?: string;

  /** Optional file naming pattern */
  readonly namingPattern?: "snake_case" | "PascalCase";

  /** Optional json tag style */
  readonly jsonTagStyle?: "snake_case" | "camelCase";

  /** Optional pointer usage policy */
  readonly pointerPolicy?: "all" | "optional_only" | "primitives_only";

  /** Optional uint usage policy */
  readonly uintPolicy?: "auto" | "int_only" | "prefer_uint";
};

export type ErrorHandler = (error: GoEmitterResult) => void;
export type LogContext = string;

/**
 * Domain-specific error types
 * LEGACY COMPATIBILITY: Maintaining existing API
 */
export type GoGenerationError = GoCodeGenerationError;
export type ModelValidationError = ValidationError & {
  _tag: "ModelValidationError";
};
export type TypeSpecIntegrationError = TypeSpecCompilerError;

/**
 * Default error handler
 * LEGACY COMPATIBILITY: Existing error handling
 */
export const defaultErrorHandler: ErrorHandler = (error) => {
  console.error("Go Emitter Error:", error);
};

/**
 * Legacy error creation functions
 * LEGACY COMPATIBILITY: Existing API
 */
export const createGoGenerationError = (
  message: string,
  options?: {
    fileName?: string;
    goCode?: string;
    resolution?: string;
  },
): GoGenerationError => {
  return ErrorFactory.createGoCodeGenerationError(message, options);
};

export const createValidationError = (
  message: string,
  options?: {
    modelName?: string;
    propertyName?: string;
    resolution?: string;
  },
): ModelValidationError => {
  return ErrorFactory.createValidationError(message, options);
};

export const createTypeSpecError = (
  message: string,
  options?: {
    modelName?: string;
    propertyName?: string;
    resolution?: string;
  },
): TypeSpecIntegrationError => {
  return ErrorFactory.createTypeSpecCompilerError(message, options);
};
