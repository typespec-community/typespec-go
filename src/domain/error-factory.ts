/**
 * Error Factory - Unified Error System
 *
 * Core error creation utilities for TypeSpec Go Emitter
 * Single source of truth for error generation
 */

import type { 
  TypeSpecCompilerError,
  GoCodeGenerationError,
  SystemError,
  ValidationError,
  GoEmitterResult,
} from "./error-types.js";
import type { ModelName, PropertyName, FileName, ErrorId } from "./error-entities.js";
import { Entities } from "./error-entities.js";

/**
 * Type-safe ModelValidationError for backward compatibility
 */
export interface ModelValidationError extends ValidationError {
  readonly _tag: "ModelValidationError";
}

/**
 * Centralized error factory
 * UNIFIED SYSTEM: Single source of truth for error creation
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
    return {
      _tag: "GoCodeGenerationError",
      message,
      resolution: options?.resolution || "Fix Go code syntax",
      errorId: this.createErrorId(),
      ...(options?.fileName && { fileName: Entities.createFileName(options.fileName) }),
      ...(options?.goCode && { goCode: options.goCode }),
    } as GoCodeGenerationError;
  }

  /**
   * Create System Error
   */
  static createSystemError(
    message: string,
    options?: {
      context?: string;
      resolution?: string;
    },
  ): SystemError {
    return {
      _tag: "SystemError",
      message,
      context: options?.context || "Unknown context",
      resolution: options?.resolution || "Check system configuration",
      errorId: this.createErrorId(),
    };
  }

  /**
   * Create Model Validation Error
   */
  static createModelValidationError(
    message: string,
    modelName?: string,
    reason?: string,
    options?: {
      resolution?: string;
      propertyName?: string;
    },
  ): ModelValidationError {
    const validationError: ValidationError = {
      _tag: "ValidationError",
      message,
      ...(modelName && { modelName: Entities.createModelName(modelName) }),
      ...(options?.propertyName && { propertyName: Entities.createPropertyName(options.propertyName) }),
      resolution: options?.resolution || "Fix validation issue",
      errorId: this.createErrorId(),
      ...(reason && { reason }),
    };

    // Create ModelValidationError with correct tag for backward compatibility
    return {
      ...validationError,
      _tag: "ModelValidationError" as const,
    };
  }

  /**
   * Create Validation Error
   */
  static createValidationError(
    message: string,
    options?: {
      modelName?: string;
      propertyName?: string;
      resolution?: string;
    },
  ): ValidationError {
    return {
      _tag: "ValidationError",
      message,
      ...(options?.modelName && { modelName: Entities.createModelName(options.modelName) }),
      ...(options?.propertyName && { propertyName: Entities.createPropertyName(options.propertyName) }),
      resolution: options?.resolution || "Fix validation issue",
      errorId: this.createErrorId(),
    };
  }

  /**
   * Create Success Result
   */
  static createSuccess(
    data: ReadonlyMap<string, string>,
    options?: {
      generatedFiles?: string[];
      typeSpecProgram?: unknown;
    },
  ): GoEmitterResult & { _tag: "Success" } {
    return {
      _tag: "Success",
      data,
      generatedFiles: options?.generatedFiles || Array.from(data.keys()),
      ...(options?.typeSpecProgram && { typeSpecProgram: options.typeSpecProgram }),
    };
  }

  /**
   * Handle external errors with proper typing
   */
  static handleExternalError(
    error: unknown,
    context: "typespec" | "typescript" | "go" | "system"
  ): TypeSpecCompilerError | GoCodeGenerationError | SystemError {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    switch (context) {
      case "typespec":
        return this.createTypeSpecCompilerError(`TypeSpec compiler error: ${errorMessage}`, {
          resolution: "Check TypeSpec model definitions and syntax",
        });
        
      case "typescript":
        return this.createSystemError(`TypeScript compilation error: ${errorMessage}`, {
          context: "TypeScript compilation",
        });
        
      case "go":
        return this.createGoCodeGenerationError(`Go compilation error: ${errorMessage}`, {
          resolution: "Check generated Go code for syntax errors",
        });
        
      case "system":
      default:
        return this.createSystemError(`System error: ${errorMessage}`, {
          context: "System operation",
        });
    }
  }

  /**
   * Create recovery suggestion
   * DOMAIN LOGIC: Context-aware error recovery
   */
  static createRecoverySuggestion(
    error: TypeSpecCompilerError | GoCodeGenerationError | SystemError | ValidationError,
  ): string {
    // Use error's existing resolution as primary suggestion
    if (error.resolution) {
      return error.resolution;
    }

    // Provide fallback suggestions based on error type
    switch (error._tag) {
      case "TypeSpecCompilerError":
        return "Review TypeSpec model definition for syntax or type issues";
        
      case "GoCodeGenerationError":
        return "Review Go code generation logic and type mappings";
        
      case "SystemError":
        return "Check system configuration and dependencies";
        
      case "ValidationError":
        return "Review input validation rules and constraints";
    }
  }
}