/**
 * Error Adapters - TypeSpec Go Emitter
 *
 * ADAPTER PATTERN: External tool integration to unified error system
 * UNIFIED ERROR SYSTEM: Single source of truth for all errors
 * ZERO ANY TYPES: Professional error wrapping
 * SINGLE RESPONSIBILITY: Adapter concerns only
 */

import {
  ErrorFactory,
  TypeSpecCompilerExternalError,
  TypeScriptExternalError,
  GoCompilationExternalError,
  GoEmitterError,
} from "../domain/unified-errors.js";

/**
 * External Error Adapter
 *
 * ADAPTER PATTERN: Convert external errors to unified error domain
 */
export class ExternalErrorAdapter {
  /**
   * Adapt TypeSpec Compiler Errors
   *
   * ADAPTER PATTERN: Convert external errors to unified error domain
   */
  static adaptTypeSpecCompilerError(
    externalError: TypeSpecCompilerExternalError,
  ): GoEmitterError {
    return ErrorFactory.createTypeSpecCompilerError(
      externalError.message || "TypeSpec compiler error",
      {
        modelName: externalError.modelName,
        propertyName: externalError.propertyName,
        resolution: externalError.resolution || "Fix TypeSpec model syntax",
      },
    );
  }

  /**
   * Adapt TypeScript Errors
   *
   * ADAPTER PATTERN: Convert TS errors to unified error domain
   */
  static adaptTypeScriptError(externalError: TypeScriptExternalError): GoEmitterError {
    const message = 
      (typeof externalError.messageText === 'string' 
        ? externalError.messageText
        : externalError.messageText?.messageText) ||
      externalError.message ||
      "TypeScript compilation error";
      
    return ErrorFactory.createTypeSpecCompilerError(message, {
      modelName: externalError.modelName,
      propertyName: externalError.propertyName,
      resolution: externalError.resolution || "Fix TypeScript type errors",
    });
  }

  /**
   * Adapt Go Compilation Errors
   *
   * ADAPTER PATTERN: Convert Go errors to unified error domain
   */
  static adaptGoCompilationError(externalError: GoCompilationExternalError): GoEmitterError {
    return ErrorFactory.createGoCodeGenerationError(
      externalError.message || "Go compilation error",
      {
        fileName: externalError.fileName,
        goCode: externalError.goCode,
        resolution: externalError.resolution || "Fix Go code syntax",
      },
    );
  }
}

/**
 * Validation Error Adapter
 *
 * ADAPTER PATTERN: Convert validation results to unified error domain
 */
export class ValidationErrorAdapter {
  /**
   * Adapt Validation Errors
   *
   * ADAPTER PATTERN: Convert validation results to unified error domain
   */
  static adaptValidationError(validationResult: {
    isValid: boolean;
    errors: string[];
  }): GoEmitterError[] {
    const errors: GoEmitterError[] = [];

    for (const errorMessage of validationResult.errors) {
      errors.push(
        ErrorFactory.createGoCodeGenerationError(errorMessage, {
          resolution: "Fix validation error",
        }),
      );
    }

    return errors;
  }
}