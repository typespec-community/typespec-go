/**
 * TypeSpec Visibility-Based Naming System
 *
 * Provides intelligent naming strategies based on TypeSpec visibility decorators
 * Maps TypeSpec @visibility and @invisible to Go field naming conventions
 * Ensures consistent naming patterns across the entire codebase
 */

import type { TypeSpecPropertyVisibility, TypeSpecVisibilityLifecycle } from "../types/typespec-domain.js";

/**
 * Visibility-based naming result with metadata
 */
export interface VisibilityBasedName {
  /** The calculated field name */
  readonly name: string;
  
  /** Whether the field should be exported in Go */
  readonly isExported: boolean;
  
  /** The naming strategy used */
  readonly strategy: "exported-pascal" | "private-camel" | "internal-snake";
  
  /** Original TypeSpec property name */
  readonly originalName: string;
  
  /** Visibility information that influenced the naming */
  readonly visibility: TypeSpecPropertyVisibility;
  
  /** Naming confidence score (0-100) */
  readonly confidence: number;
}

/**
 * Visibility-based naming conventions
 */
export type NamingStrategy = {
  readonly name: string;
  readonly description: string;
  readonly apply: (originalName: string, visibility: TypeSpecPropertyVisibility) => string;
  readonly isExported: boolean;
  readonly conditions: (visibility: TypeSpecPropertyVisibility) => boolean;
};

/**
 * TypeSpec Visibility-Based Naming System
 * 
 * Core responsibility: Convert TypeSpec property names to Go field names
 * based on visibility decorators and lifecycle phases.
 * 
 * Provides deterministic naming strategies that respect:
 * - @visibility(Lifecycle.*) decorators
 * - @invisible(Lifecycle) decorators
 * - Go naming conventions (exported vs private)
 * - TypeSpec naming patterns (camelCase)
 */
export class TypeSpecVisibilityBasedNaming {
  private static readonly COMMON_INITIALISMS = [
    "id", "url", "api", "http", "https", 
    "json", "xml", "sql", "uuid", "jwt"
  ] as const;

  private static readonly NAMING_STRATEGIES: readonly NamingStrategy[] = [
    // Strategy 1: Exported PascalCase for visible fields
    {
      name: "exported-pascal",
      description: "Visible properties become exported Go fields (PascalCase)",
      apply: (originalName) => TypeSpecVisibilityBasedNaming.toPascalCase(originalName),
      isExported: true,
      conditions: (visibility) => !visibility.isInvisible && visibility.visible
    },
    
    // Strategy 2: Private camelCase for invisible fields
    {
      name: "private-camel", 
      description: "Invisible properties become private Go fields (camelCase)",
      apply: (originalName) => originalName,
      isExported: false,
      conditions: (visibility) => visibility.isInvisible
    },
    
    // Strategy 3: Internal snake_case for special cases
    {
      name: "internal-snake",
      description: "Special internal fields use snake_case (private)",
      apply: (originalName) => TypeSpecVisibilityBasedNaming.toSnakeCase(originalName),
      isExported: false,
      conditions: (visibility) => visibility.isInvisible && TypeSpecVisibilityBasedNaming.isInternalField(originalName)
    }
  ] as const;

  /**
   * Generate Go field name based on TypeSpec visibility
   * 
   * @param originalName Original TypeSpec property name (camelCase)
   * @param visibility Extracted visibility information
   * @returns Visibility-based naming result with metadata
   */
  static generateName(
    originalName: string, 
    visibility: TypeSpecPropertyVisibility
  ): VisibilityBasedName {
    // Validate inputs
    if (!originalName || originalName.trim().length === 0) {
      throw new Error("Original name cannot be empty");
    }

    if (!visibility) {
      throw new Error("Visibility information is required");
    }

    // Find applicable naming strategy
    const strategy = this.findNamingStrategy(visibility);
    
    // Apply the strategy
    const finalName = strategy.apply(originalName, visibility);
    
    // Calculate confidence based on clarity of visibility
    const confidence = this.calculateNamingConfidence(originalName, visibility);

    return {
      name: finalName,
      isExported: strategy.isExported,
      strategy: strategy.name as VisibilityBasedName["strategy"],
      originalName,
      visibility,
      confidence
    };
  }

  /**
   * Convert TypeSpec camelCase to Go PascalCase for exported fields
   * 
   * @param camelCase Input in TypeSpec camelCase format
   * @returns PascalCase string suitable for exported Go fields
   */
  static toPascalCase(camelCase: string): string {
    // Handle edge cases
    if (camelCase.length === 0) return camelCase;
    if (camelCase.length === 1) return camelCase.toUpperCase();

    return camelCase
      .split(/[_-]/) // Split on underscores and hyphens
      .map((word, index) => {
        // Handle common initialisms
        if (this.COMMON_INITIALISMS.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        
        // Capitalize first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  }

  /**
   * Convert to snake_case for internal fields
   * 
   * @param input Any string format
   * @returns snake_case string
   */
  static toSnakeCase(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore between case changes
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Handle acronyms
      .toLowerCase();
  }

  /**
   * Check if a field should follow internal naming conventions
   * 
   * @param fieldName Field name to check
   * @returns Whether field is internal/special
   */
  static isInternalField(fieldName: string): boolean {
    const internalPatterns = [
      /^internal[A-Z]/,    // internalHash, internalToken
      /^private[A-Z]/,     // privateKey
      /^secret[A-Z]/,       // secretKey
      /^temp[A-Z]/,        // tempValue
      /^_/,                // _private
      /.*[Hh]ash$/,       // hash, Hash
      /.*[Ss]ecret$/,     // secret, Secret
      /.*[Tt]oken$/,      // token, Token
    ];

    return internalPatterns.some(pattern => pattern.test(fieldName));
  }

  /**
   * Get naming strategy based on visibility information
   * 
   * @param visibility TypeSpec property visibility
   * @returns Applicable naming strategy
   */
  private static findNamingStrategy(visibility: TypeSpecPropertyVisibility): NamingStrategy {
    // Find first matching strategy (order matters)
    for (const strategy of this.NAMING_STRATEGIES) {
      if (strategy.conditions(visibility)) {
        return strategy;
      }
    }

    // Default: exported PascalCase
    return this.NAMING_STRATEGIES[0];
  }

  /**
   * Calculate naming confidence based on visibility clarity
   * 
   * @param originalName Original field name
   * @param visibility Visibility information
   * @returns Confidence score (0-100)
   */
  private static calculateNamingConfidence(
    originalName: string, 
    visibility: TypeSpecPropertyVisibility
  ): number {
    let confidence = 50; // Base confidence

    // Higher confidence for clear visibility
    if (visibility.isInvisible) {
      confidence += 30; // Clear invisible intent
    } else if (visibility.lifecycle.length > 0) {
      confidence += 20; // Has explicit lifecycle phases
    }

    // Higher confidence for standard naming patterns
    if (/^[a-z][a-zA-Z0-9]*$/.test(originalName)) {
      confidence += 10; // Standard camelCase
    }

    // Lower confidence for ambiguous cases
    if (visibility.lifecycle.length === 0 && !visibility.isInvisible) {
      confidence -= 10; // Ambiguous visibility
    }

    // Higher confidence for non-initialism names
    if (!this.COMMON_INITIALISMS.includes(originalName.toLowerCase())) {
      confidence += 5; // Clear naming, not an acronym
    }

    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Generate comprehensive naming report for debugging
   * 
   * @param originalName Original TypeSpec property name
   * @param visibility Visibility information
   * @returns Detailed naming analysis
   */
  static generateNamingReport(
    originalName: string, 
    visibility: TypeSpecPropertyVisibility
  ): string {
    const naming = this.generateName(originalName, visibility);
    
    return [
      `TypeSpec Visibility-Based Naming Analysis:`,
      `  Original Name: ${originalName}`,
      `  Go Field Name: ${naming.name}`,
      `  Exported: ${naming.isExported}`,
      `  Strategy: ${naming.strategy}`,
      `  Confidence: ${naming.confidence}%`,
      `  Visibility Lifecycle: [${visibility.lifecycle.join(", ")}]`,
      `  Is Invisible: ${visibility.isInvisible}`,
      `  Is Internal: ${this.isInternalField(originalName)}`
    ].join("\n");
  }

  /**
   * Batch process multiple properties with consistent naming
   * 
   * @param properties Array of property names and visibility
   * @returns Array of visibility-based naming results
   */
  static batchGenerateNames(
    properties: Array<{ name: string; visibility: TypeSpecPropertyVisibility }>
  ): readonly VisibilityBasedName[] {
    return properties.map(prop => this.generateName(prop.name, prop.visibility));
  }

  /**
   * Validate naming consistency across a model
   * 
   * @param namingResults Array of naming results for a model
   * @returns Validation report with any issues
   */
  static validateNamingConsistency(
    namingResults: readonly VisibilityBasedName[]
  ): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for duplicate Go field names
    const goFieldNames = namingResults.map(result => result.name);
    const duplicates = goFieldNames.filter((name, index) => 
      goFieldNames.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      issues.push(`Duplicate Go field names: [${duplicates.join(", ")}]`);
      suggestions.push("Consider using more specific TypeSpec property names");
    }

    // Check for inconsistent visibility handling
    const invisibleCount = namingResults.filter(r => !r.isExported).length;
    const totalCount = namingResults.length;
    
    if (invisibleCount > totalCount * 0.7) {
      issues.push("Too many private fields (>70%)");
      suggestions.push("Review visibility decorators for potential errors");
    }

    // Check for low confidence naming
    const lowConfidence = namingResults.filter(r => r.confidence < 60);
    if (lowConfidence.length > 0) {
      issues.push(`${lowConfidence.length} fields have low naming confidence`);
      suggestions.push("Add explicit visibility decorators to improve clarity");
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}

/**
 * Convenience function for single property naming
 */
export function createVisibilityBasedName(
  originalName: string, 
  visibility: TypeSpecPropertyVisibility
): VisibilityBasedName {
  return TypeSpecVisibilityBasedNaming.generateName(originalName, visibility);
}

/**
 * Convenience function for batch naming
 */
export function createBatchVisibilityBasedNames(
  properties: Array<{ name: string; visibility: TypeSpecPropertyVisibility }>
): readonly VisibilityBasedName[] {
  return TypeSpecVisibilityBasedNaming.batchGenerateNames(properties);
}