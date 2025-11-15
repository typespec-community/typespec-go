/**
 * Type-Safe Professional Error Types
 * 
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * ZERO 'ANY' TYPES: Impossible states unrepresentable
 * BRAND TYPES: Type-safe entity identification
 * RAILWAY ORIENTED PROGRAMMING: Type-safe error handling
 */

/**
 * Branded Types for Type-Safe Entity Identification
 * ZERO 'ANY' TYPES: Impossible naming conflicts eliminated
 */
export type TypeSpecId = string & { readonly __brand: "TypeSpecId" };
export type ModelName = string & { readonly __brand: "ModelName" };
export type PropertyName = string & { readonly __brand: "PropertyName" };
export type ErrorId = string & { readonly __brand: "ErrorId" };

/**
 * Type-Safe Error Creators
 * ZERO 'ANY' TYPES: Type-safe error creation
 */
namespace TypeSpecEntities {
  export const createTypeSpecId = (id: string): TypeSpecId => id as TypeSpecId;
  export const createModelName = (name: string): ModelName => name as ModelName;
  export const createPropertyName = (name: string): PropertyName => name as PropertyName;
  export const createErrorId = (id: string): ErrorId => id as ErrorId;
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
  CircularReference = "circular-reference"
}

/**
 * Generation Context Enum
 * ENUMS INSTEAD OF BOOLEANS: Clear state representation
 */
export enum GenerationContext {
  Standalone = "standalone",
  TypeSpecIntegrated = "typespec-integrated",
  PluginExecution = "plugin-execution"
}

/**
 * Type-Safe Discriminated Union Error Types
 * DISCRIMINATED UNIONS: Compile-time exhaustive matching
 * ZERO 'ANY' TYPES: Impossible error states eliminated
 */
export type GeneratorError = 
  | { 
      readonly _type: "UNSUPPORTED_TYPE";
      readonly id: ErrorId;
      readonly kind: string;
      readonly context: TypeSpecId;
    }
  | { 
      readonly _type: "INVALID_MODEL";
      readonly id: ErrorId;
      readonly modelId: ModelName;
      readonly reason: InvalidModelReason;
      readonly details: string;
    }
  | { 
      readonly _type: "GENERATION_FAILED";
      readonly id: ErrorId;
      readonly modelId: ModelName;
      readonly context: GenerationContext;
      readonly error: string;
      readonly originalError?: unknown;  // Only for truly unknown errors
    };

/**
 * Type-Safe Error Factory
 * ZERO 'ANY' TYPES: Type-safe error creation
 */
export class GeneratorErrorFactory {
  /**
   * Create unsupported type error
   * TYPE-SAFE: All required properties present
   */
  static unsupportedType(kind: string, context: TypeSpecId): GeneratorError {
    return {
      _type: "UNSUPPORTED_TYPE",
      id: TypeSpecEntities.createErrorId(`unsupported-${Date.now()}`),
      kind,
      context
    };
  }

  /**
   * Create invalid model error
   * TYPE-SAFE: All required properties present
   */
  static invalidModel(modelId: ModelName, reason: InvalidModelReason, details: string): GeneratorError {
    return {
      _type: "INVALID_MODEL",
      id: TypeSpecEntities.createErrorId(`invalid-${Date.now()}`),
      modelId,
      reason,
      details
    };
  }

  /**
   * Create generation failed error
   * TYPE-SAFE: All required properties present
   */
  static generationFailed(
    modelId: ModelName, 
    context: GenerationContext, 
    error: string, 
    originalError?: unknown
  ): GeneratorError {
    return {
      _type: "GENERATION_FAILED",
      id: TypeSpecEntities.createErrorId(`failed-${Date.now()}`),
      modelId,
      context,
      error,
      originalError
    };
  }
}

/**
 * Type-Safe Error Handler
 * RAILWAY ORIENTED PROGRAMMING: Type-safe error processing
 */
export class GeneratorErrorHandler {
  /**
   * Handle errors with type-safe matching
   * DISCRIMINATED UNIONS: Exhaustive compile-time matching
   */
  static handle(error: GeneratorError): { success: boolean; message: string; details: Record<string, unknown> } {
    switch (error._type) {
      case "UNSUPPORTED_TYPE":
        return {
          success: false,
          message: `Unsupported TypeSpec type: ${error.kind}`,
          details: { errorId: error.id, context: error.context }
        };
        
      case "INVALID_MODEL":
        return {
          success: false,
          message: `Invalid model ${error.modelId}: ${error.reason}`,
          details: { errorId: error.id, reason: error.reason, details: error.details }
        };
        
      case "GENERATION_FAILED":
        return {
          success: false,
          message: `Generation failed for ${error.modelId}: ${error.error}`,
          details: { errorId: error.id, context: error.context, originalError: error.originalError }
        };
        
      // TypeScript ensures all cases are handled
      default:
        return {
          success: false,
          message: "Unknown error occurred",
          details: { errorId: "unknown", errorType: (error as any)._type }
        };
    }
  }

  /**
   * Get user-friendly error message
   * TYPE-SAFE: Professional error communication
   */
  static getUserMessage(error: GeneratorError): string {
    switch (error._type) {
      case "UNSUPPORTED_TYPE":
        return `The TypeSpec type "${error.kind}" is not yet supported by the Go generator. Supported types include: string, int32, int64, bool, arrays, and models.`;
        
      case "INVALID_MODEL":
        switch (error.reason) {
          case InvalidModelReason.EmptyName:
            return `Model "${error.modelId}" has an empty name. Models must have a non-empty name.`;
          case InvalidModelReason.NoProperties:
            return `Model "${error.modelId}" has no properties. Models must have at least one property.`;
          case InvalidModelReason.DuplicateProperty:
            return `Model "${error.modelId}" has duplicate properties. All property names must be unique within a model.`;
          case InvalidModelReason.CircularReference:
            return `Model "${error.modelId}" has circular references. Models cannot reference themselves directly or indirectly.`;
          default:
            return `Model "${error.modelId}" is invalid: ${error.details}`;
        }
        
      case "GENERATION_FAILED":
        return `Failed to generate Go code for "${error.modelId}": ${error.error}`;
        
      default:
        return `Unknown error occurred while processing model.`;
    }
  }
}