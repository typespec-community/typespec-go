/**
 * Error Entities - Unified Error System
 *
 * Type-safe entity creators for error handling
 * Branded types for compile-time safety
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
  export const createErrorMessage = (message: string): string => message;
}

/**
 * Entity validation utilities
 */
export namespace EntityValidation {
  /**
   * Validate branded entity
   */
  export const isValidEntity = <T>(entity: T): entity is T => {
    return typeof entity === "string" && entity.length > 0;
  };

  /**
   * Safe entity creation with validation
   */
  export const safeCreateModelName = (name: string): ModelName | null => {
    if (!name || name.trim().length === 0) {
      return null;
    }
    return Entities.createModelName(name.trim());
  };

  /**
   * Safe property name creation
   */
  export const safeCreatePropertyName = (name: string): PropertyName | null => {
    if (!name || name.trim().length === 0) {
      return null;
    }
    // Ensure valid Go property name
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9_]/g, "");
    if (sanitizedName.length === 0) {
      return null;
    }
    return Entities.createPropertyName(sanitizedName);
  };

  /**
   * Safe file name creation
   */
  export const safeCreateFileName = (name: string): FileName | null => {
    if (!name || name.trim().length === 0) {
      return null;
    }
    // Ensure valid Go file name
    const sanitizedName = name.trim().replace(/[^a-zA-Z0-9_.-]/g, "");
    if (sanitizedName.length === 0 || !sanitizedName.endsWith(".go")) {
      return null;
    }
    return Entities.createFileName(sanitizedName);
  };
}

/**
 * Entity transformation utilities
 */
export namespace EntityTransformation {
  /**
   * Convert to safe Go identifier
   */
  export const toGoIdentifier = (name: string): string => {
    // Convert to PascalCase for Go types
    return name
      .replace(/(?:^|[_-])([a-z])/g, (_, char) => char.toUpperCase())
      .replace(/[0-9]+/g, "") // Remove numbers
      .replace(/[^a-zA-Z]/g, "") // Remove non-letters
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
  };

  /**
   * Convert to safe Go field name
   */
  export const toGoFieldName = (name: string): string => {
    // Convert to camelCase for Go fields
    const pascalCase = toGoIdentifier(name);
    if (pascalCase.length === 0 || !pascalCase[0]) {
      return name;
    }
    return pascalCase[0].toLowerCase() + pascalCase.slice(1);
  };

  /**
   * Convert to safe Go JSON tag
   */
  export const toGoJsonTag = (name: string): string => {
    // Convert to snake_case for JSON tags
    return name
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, ""); // Remove invalid characters
  };

  /**
   * Create Error Message
   */
  export const createErrorMessage = (message: string): string => 
    message;

  /**
   * Create Extracted Visibility Info
   */
  export const createExtractedVisibilityInfo = (
    property: string,
    decorator: string,
    phases: readonly string[]
  ): {
    property: string;
    decorator: string;
    phases: readonly string[];
  } => ({
      property,
      decorator,
      phases
    });

  /**
   * Create Extraction Context
   */
  export const createExtractionContext = (
    modelName: string,
    propertyName: string,
    extractionPhase: string
  ): {
    modelName: string;
    propertyName: string;
    extractionPhase: string;
  } => ({
      modelName,
      propertyName,
      extractionPhase
    });

  /**
   * Create Decorator Analysis
   */
  export const createDecoratorAnalysis = (
    decoratorType: string,
    isValid: boolean,
    args: readonly unknown[]
  ): {
    decoratorType: string;
    isValid: boolean;
    arguments: readonly unknown[];
  } => ({
      decoratorType,
      isValid,
      arguments: args
    });

  /**
   * Create Performance Metrics
   */
  export const createPerformanceMetrics = (
    propertyCount: number,
    totalTime: number,
    errors: number
  ): {
    propertyCount: number;
    totalTime: number;
    avgTime: number;
    throughput: number;
    errorCount: number;
    errorRate: number;
  } => {
      const avgTime = totalTime / propertyCount;
      const throughput = 1000 / avgTime;
      const errorRate = errors / propertyCount;

      return {
        propertyCount,
        totalTime,
        avgTime,
        throughput,
        errorCount: errors,
        errorRate
      };
  };

  /**
   * Create Visibility Validation Result
   */
  export const createVisibilityValidationResult = (
    isVisible: boolean,
    lifecyclePhases: readonly string[],
    isInvisible: boolean,
    errors: readonly string[],
    warnings: readonly string[]
  ): {
    isVisible: boolean;
    lifecyclePhases: readonly string[];
    isInvisible: boolean;
    isValid: boolean;
    errors: readonly string[];
    warnings: readonly string[];
  } => ({
      isVisible,
      lifecyclePhases,
      isInvisible,
      isValid: errors.length === 0,
      errors,
      warnings
    });

  /**
   * Create Naming Analysis
   */
  export const createNamingAnalysis = (
    originalName: string,
    goFieldName: string,
    isExported: boolean,
    namingStrategy: string
  ): {
    originalName: string;
    goFieldName: string;
    isExported: boolean;
    namingStrategy: string;
  } => ({
      originalName,
      goFieldName,
      isExported,
      namingStrategy
    });

  /**
   * Create Transformation Metrics
   */
  export const createTransformationMetrics = (
    processedCount: number,
    successCount: number,
    failureCount: number,
    processingTime: number
  ): {
    processedCount: number;
    successCount: number;
    failureCount: number;
    successRate: number;
    processingTime: number;
    throughput: number;
  } => {
      const successRate = processedCount > 0 ? successCount / processedCount : 0;
      const throughput = processingTime > 0 ? 1000 * successCount / processingTime : 0;

      return {
        processedCount,
        successCount,
        failureCount,
        successRate,
        processingTime,
        throughput
      };
  };
}
