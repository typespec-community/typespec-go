/**
 * Error Domains - TypeSpec Go Emitter
 * 
 * DOMAIN-DRIVEN DESIGN: Error domain separation
 * ZERO ANY TYPES: Professional error handling
 * SINGLE RESPONSIBILITY: Focused error concerns
 */

/**
 * TypeSpec Generation Errors
 * 
 * PURE DOMAIN: TypeSpec generation concerns only
 */
export interface TypeSpecGenerationError {
  readonly type: "TypeSpecGenerationError";
  readonly message: string;
  readonly modelName?: string;
  readonly propertyName?: string;
  readonly resolution: string;
}

/**
 * Go Code Generation Errors
 * 
 * PURE DOMAIN: Go code generation concerns only
 */
export interface GoCodeGenerationError {
  readonly type: "GoCodeGenerationError";
  readonly message: string;
  readonly fileName?: string;
  readonly goCode?: string;
  readonly resolution: string;
}

/**
 * Type Safety Errors
 * 
 * PURE DOMAIN: Type safety concerns only
 */
export interface TypeSafetyError {
  readonly type: "TypeSafetyError";
  readonly message: string;
  readonly violation: string;
  readonly expected: string;
  readonly actual: string;
  readonly resolution: string;
}

/**
 * Error Domain Union
 * 
 * EXHAUSTIVE TYPE MATCHING: All error types covered
 */
export type ErrorDomain = 
  | TypeSpecGenerationError
  | GoCodeGenerationError
  | TypeSafetyError;

/**
 * Error Factory
 * 
 * SINGLE SOURCE OF TRUTH: Unified error creation
 */
export class ErrorFactory {
  static createTypeSpecGenerationError(
    message: string,
    options?: { modelName?: string; propertyName?: string; resolution?: string }
  ): TypeSpecGenerationError {
    return {
      type: "TypeSpecGenerationError",
      message,
      modelName: options?.modelName,
      propertyName: options?.propertyName,
      resolution: options?.resolution || "Check TypeSpec model definition"
    };
  }

  static createGoCodeGenerationError(
    message: string,
    options?: { fileName?: string; goCode?: string; resolution?: string }
  ): GoCodeGenerationError {
    return {
      type: "GoCodeGenerationError",
      message,
      fileName: options?.fileName,
      goCode: options?.goCode,
      resolution: options?.resolution || "Check Go code generation logic"
    };
  }

  static createTypeSafetyError(
    message: string,
    violation: string,
    expected: string,
    actual: string,
    options?: { resolution?: string }
  ): TypeSafetyError {
    return {
      type: "TypeSafetyError",
      message,
      violation,
      expected,
      actual,
      resolution: options?.resolution || "Fix type safety violation"
    };
  }
}

/**
 * Error Handler
 * 
 * SINGLE RESPONSIBILITY: Error processing only
 */
export class ErrorHandler {
  static handleError(error: ErrorDomain): ErrorDomain {
    console.error(`🚨 ${error.type}: ${error.message}`);
    
    if (error.type === "TypeSpecGenerationError") {
      console.error(`   Model: ${error.modelName || "Unknown"}`);
      console.error(`   Property: ${error.propertyName || "Unknown"}`);
      console.error(`   Resolution: ${error.resolution}`);
    } else if (error.type === "GoCodeGenerationError") {
      console.error(`   File: ${error.fileName || "Unknown"}`);
      console.error(`   Resolution: ${error.resolution}`);
    } else if (error.type === "TypeSafetyError") {
      console.error(`   Violation: ${error.violation}`);
      console.error(`   Expected: ${error.expected}`);
      console.error(`   Actual: ${error.actual}`);
      console.error(`   Resolution: ${error.resolution}`);
    }
    
    return error;
  }
}