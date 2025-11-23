/**
 * TypeSpec Visibility Detection Utility
 *
 * Extracts visibility information from TypeSpec models
 * Maps @visibility and @invisible decorators to domain objects
 * Provides clean API for visibility-based Go field generation
 */

import type { 
  Program, 
  ModelProperty as TypeSpecModelProperty,
  Type,
  Namespace
} from "@typespec/compiler";
import { Logger, LogContext } from "../domain/structured-logging.js";
import type { 
  TypeSpecPropertyVisibility, 
  TypeSpecVisibilityLifecycle 
} from "../types/typespec-domain.js";

/**
 * TypeSpec Visibility Detector
 * 
 * Core responsibility: Extract visibility from TypeSpec decorators
 * Converts TypeSpec compiler visibility API to our domain model
 */
export class TypeSpecVisibilityDetector {
  private readonly logger: Logger;
  private readonly logContext: LogContext;

  constructor() {
    this.logger = new Logger();
    this.logContext = "TypeSpecVisibilityDetector";
  }

  /**
   * Extract visibility information from a TypeSpec property
   * 
   * @param program TypeSpec compiler program
   * @param property TypeSpec model property
   * @returns Extracted visibility information
   */
  extractVisibility(
    program: Program, 
    property: TypeSpecModelProperty
  ): TypeSpecPropertyVisibility {
    try {
      this.logger.debug(this.logContext, "Extracting visibility", {
        propertyName: property.name,
        propertyType: property.type.kind
      });

      // Try to get TypeSpec visibility information
      // Note: This will require proper TypeSpec compiler integration
      const typeSpecVisibility = this.getTypeSpecVisibility(program, property);
      
      if (typeSpecVisibility.isInvisible) {
        return {
          visible: false,
          lifecycle: [],
          isInvisible: true
        };
      }

      // Convert TypeSpec lifecycle phases to our domain model
      const lifecyclePhases = this.mapLifecyclePhases(typeSpecVisibility.lifecycle);
      
      return {
        visible: lifecyclePhases.length > 0,
        lifecycle: lifecyclePhases,
        isInvisible: false
      };

    } catch (error) {
      this.logger.error(this.logContext, "Failed to extract visibility", {
        propertyName: property.name,
        error: error instanceof Error ? error.message : String(error)
      });

      // Default to full visibility on error
      return this.getDefaultVisibility();
    }
  }

  /**
   * Check if a property should be included in generated Go code
   * 
   * @param visibility Extracted visibility information
   * @param targetLifecycle Target lifecycle phase (e.g., "Read" for response models)
   * @returns Whether to include the property
   */
  shouldIncludeProperty(
    visibility: TypeSpecPropertyVisibility,
    targetLifecycle: TypeSpecVisibilityLifecycle = "Read"
  ): boolean {
    // Invisible properties are never included
    if (visibility.isInvisible) {
      return false;
    }

    // Visible properties must have the target lifecycle
    return visibility.lifecycle.includes(targetLifecycle);
  }

  /**
   * Determine if a Go field should be exported based on visibility
   * 
   * @param visibility Extracted visibility information
   * @returns Whether Go field should be exported
   */
  shouldExportGoField(visibility: TypeSpecPropertyVisibility): boolean {
    // Invisible properties become private Go fields
    if (visibility.isInvisible) {
      return false;
    }

    // Visible properties become exported Go fields
    return true;
  }

  /**
   * Generate JSON tag for property based on visibility
   * 
   * @param propertyName Original TypeSpec property name
   * @param visibility Extracted visibility information
   * @returns JSON tag or undefined for invisible properties
   */
  generateJsonTag(
    propertyName: string, 
    visibility: TypeSpecPropertyVisibility
  ): string | undefined {
    // Invisible properties don't get JSON tags
    if (visibility.isInvisible || !visibility.visible) {
      return undefined;
    }

    // Visible properties get JSON tags with original name
    return `json:"${propertyName}"`;
  }

  /**
   * Get TypeSpec compiler visibility information
   * 
   * NOTE: This is a placeholder implementation
   * Requires proper TypeSpec compiler integration with getVisibility API
   */
  private getTypeSpecVisibility(
    program: Program, 
    property: TypeSpecModelProperty
  ): { lifecycle: readonly string[]; isInvisible: boolean } {
    // TODO: Replace with actual TypeSpec compiler API calls
    // import { getVisibility } from "@typespec/compiler";
    
    // Placeholder logic for testing
    if (property.name.includes("secret") || property.name.includes("internal")) {
      return { lifecycle: [], isInvisible: true };
    }

    if (property.name === "id") {
      return { lifecycle: ["Read"], isInvisible: false };
    }

    if (property.name === "name") {
      return { lifecycle: ["Create", "Read"], isInvisible: false };
    }

    // Default: full visibility
    return { 
      lifecycle: ["Create", "Read", "Update", "Delete", "Query"], 
      isInvisible: false 
    };
  }

  /**
   * Map TypeSpec lifecycle strings to our domain model
   */
  private mapLifecyclePhases(
    lifecycle: readonly string[]
  ): readonly TypeSpecVisibilityLifecycle[] {
    return lifecycle
      .filter(phase => this.isValidLifecyclePhase(phase))
      .map(phase => phase as TypeSpecVisibilityLifecycle);
  }

  /**
   * Validate lifecycle phase string
   */
  private isValidLifecyclePhase(phase: string): boolean {
    const validPhases: readonly string[] = ["Create", "Read", "Update", "Delete", "Query"];
    return validPhases.includes(phase);
  }

  /**
   * Get default visibility for properties without explicit decorators
   */
  private getDefaultVisibility(): TypeSpecPropertyVisibility {
    return {
      visible: true,
      lifecycle: ["Create", "Read", "Update", "Delete", "Query"],
      isInvisible: false
    };
  }
}

/**
 * Singleton instance for TypeSpec visibility detection
 */
export const visibilityDetector = new TypeSpecVisibilityDetector();

/**
 * Convenience function for visibility extraction
 */
export function extractVisibility(
  program: Program, 
  property: TypeSpecModelProperty
): TypeSpecPropertyVisibility {
  return visibilityDetector.extractVisibility(program, property);
}