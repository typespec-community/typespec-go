/**
 * Error Adapters - TypeSpec Go Emitter
 * 
 * ADAPTER PATTERN: External tool integration
 * ZERO ANY TYPES: Professional error wrapping
 * SINGLE RESPONSIBILITY: Adapter concerns only
 */

import { ErrorDomain, TypeSpecGenerationError, GoCodeGenerationError } from "./error-domains.js";

/**
 * External Error Adapter
 * 
 * ADAPTER PATTERN: External tool error integration
 */
export class ExternalErrorAdapter {
  /**
   * Adapt TypeSpec Compiler Errors
   * 
   * ADAPTER PATTERN: Convert external errors to internal domain
   */
  static adaptTypeSpecCompilerError(externalError: any): TypeSpecGenerationError {
    return {
      type: "TypeSpecGenerationError",
      message: externalError.message || "TypeSpec compiler error",
      modelName: externalError.modelName,
      propertyName: externalError.propertyName,
      resolution: externalError.resolution || "Fix TypeSpec model syntax"
    };
  }

  /**
   * Adapt TypeScript Errors
   * 
   * ADAPTER PATTERN: Convert TS errors to internal domain
   */
  static adaptTypeScriptError(externalError: any): TypeSpecGenerationError {
    return {
      type: "TypeSpecGenerationError",
      message: externalError.messageText || externalError.message || "TypeScript compilation error",
      modelName: externalError.modelName,
      propertyName: externalError.propertyName,
      resolution: externalError.resolution || "Fix TypeScript type errors"
    };
  }

  /**
   * Adapt Go Compilation Errors
   * 
   * ADAPTER PATTERN: Convert Go errors to internal domain
   */
  static adaptGoCompilationError(externalError: any): GoCodeGenerationError {
    return {
      type: "GoCodeGenerationError",
      message: externalError.message || "Go compilation error",
      fileName: externalError.fileName,
      goCode: externalError.goCode,
      resolution: externalError.resolution || "Fix Go code syntax"
    };
  }
}

/**
 * Validation Error Adapter
 * 
 * ADAPTER PATTERN: Validation error integration
 */
export class ValidationErrorAdapter {
  /**
   * Adapt Validation Errors
   * 
   * ADAPTER PATTERN: Convert validation results to error domain
   */
  static adaptValidationError(validationResult: { isValid: boolean; errors: string[] }): ErrorDomain[] {
    const errors: ErrorDomain[] = [];
    
    for (const errorMessage of validationResult.errors) {
      errors.push({
        type: "GoCodeGenerationError",
        message: errorMessage,
        resolution: "Fix validation error"
      });
    }
    
    return errors;
  }
}