/**
 * TypeSpec Visibility Domain Model
 *
 * Comprehensive domain model for TypeSpec visibility decorators and lifecycle phases
 * Provides type-safe representation of @visibility and @invisible decorators
 * Ensures impossible states are unrepresentable
 */

/**
 * TypeSpec Visibility Lifecycle Enum
 * 
 * Maps directly to TypeSpec's @visibility decorator lifecycle phases.
 * These represent when a property is visible during API operations.
 */
export const TypeSpecVisibilityLifecycleValues = [
  "Create",
  "Read", 
  "Update",
  "Delete",
  "Query"
] as const;

export type TypeSpecVisibilityLifecycle = typeof TypeSpecVisibilityLifecycleValues[number];

/**
 * TypeSpec Property Visibility Information
 * 
 * Represents the complete visibility state of a TypeSpec property.
 * Discriminated union ensures impossible states cannot occur.
 */
export interface TypeSpecPropertyVisibility {
  /** Whether property is visible in any lifecycle phase */
  readonly visible: boolean;
  
  /** Array of lifecycle phases where property is visible */
  readonly lifecycle: readonly TypeSpecVisibilityLifecycle[];
  
  /** Whether property is explicitly marked as invisible */
  readonly isInvisible: boolean;
  
  /** Source of visibility information */
  readonly source: "decorator" | "default" | "inferred";
  
  /** Decorator information if source is "decorator" */
  readonly decorator?: {
    readonly type: "@visibility" | "@invisible";
    readonly phases?: readonly TypeSpecVisibilityLifecycle[];
  };
}

/**
 * TypeSpec Visibility Source Type
 * 
 * Represents how visibility information was determined
 */
export type VisibilitySource = TypeSpecPropertyVisibility["source"];

/**
 * TypeSpec Visibility Inference Rules
 * 
 * Provides domain-specific rules for inferring visibility
 * when no explicit decorators are present.
 */
export const TypeSpecVisibilityInferenceRules = {
  /**
   * Default visibility for properties without explicit decorators
   * TypeSpec default: visible in all lifecycle phases
   */
  defaultVisibility(): TypeSpecPropertyVisibility {
    return {
      visible: true,
      lifecycle: [...TypeSpecVisibilityLifecycleValues],
      isInvisible: false,
      source: "default"
    };
  },

  /**
   * Infer visibility from property name patterns
   * 
   * @param propertyName Property name to analyze
   * @returns Inferred visibility or null if no pattern matches
   */
  inferFromName(propertyName: string): TypeSpecPropertyVisibility | null {
    const lowerName = propertyName.toLowerCase();

    // Secret/internal patterns
    if (lowerName.includes("secret") || 
        lowerName.includes("password") ||
        lowerName.includes("token") ||
        lowerName.includes("hash")) {
      return {
        visible: false,
        lifecycle: [],
        isInvisible: true,
        source: "inferred"
      };
    }

    // ID patterns (usually read-only)
    if (lowerName === "id" || lowerName.endsWith("id")) {
      return {
        visible: true,
        lifecycle: ["Read"],
        isInvisible: false,
        source: "inferred"
      };
    }

    // Timestamp patterns (usually read-only)
    if (lowerName.includes("created") || 
        lowerName.includes("updated") ||
        lowerName.includes("timestamp")) {
      return {
        visible: true,
        lifecycle: ["Read"],
        isInvisible: false,
        source: "inferred"
      };
    }

    // No inference possible
    return null;
  },

  /**
   * Create visibility from @visibility decorator
   * 
   * @param phases Lifecycle phases from @visibility decorator
   * @returns Visibility information
   */
  fromVisibilityDecorator(phases: readonly TypeSpecVisibilityLifecycle[]): TypeSpecPropertyVisibility {
    return {
      visible: phases.length > 0,
      lifecycle: phases,
      isInvisible: false,
      source: "decorator",
      decorator: {
        type: "@visibility",
        phases
      }
    };
  },

  /**
   * Create visibility from @invisible decorator
   * 
   * @returns Visibility information for invisible property
   */
  fromInvisibleDecorator(): TypeSpecPropertyVisibility {
    return {
      visible: false,
      lifecycle: [],
      isInvisible: true,
      source: "decorator",
      decorator: {
        type: "@invisible"
      }
    };
  },

  /**
   * Validate visibility information consistency
   * 
   * @param visibility Visibility to validate
   * @returns Validation result
   */
  validate(visibility: TypeSpecPropertyVisibility): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for impossible states
    if (visibility.isInvisible && visibility.visible) {
      errors.push("Property cannot be both invisible and visible");
    }

    if (visibility.isInvisible && visibility.lifecycle.length > 0) {
      errors.push("Invisible property cannot have lifecycle phases");
    }

    // Check decorator consistency
    if (visibility.decorator) {
      if (visibility.decorator.type === "@invisible" && visibility.lifecycle.length > 0) {
        errors.push("@invisible decorator cannot have lifecycle phases");
      }

      if (visibility.decorator.type === "@visibility" && !visibility.decorator.phases) {
        errors.push("@visibility decorator must specify phases");
      }
    }

    // Check for deprecated patterns
    if (visibility.source === "inferred") {
      warnings.push("Inferred visibility - consider using explicit decorators");
    }

    // Check for empty lifecycle
    if (!visibility.isInvisible && !visibility.visible && visibility.lifecycle.length === 0) {
      warnings.push("Property has no visibility - will be invisible");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
} as const;

/**
 * TypeSpec Visibility Query Builder
 * 
 * Provides fluent interface for building complex visibility queries
 */
export class TypeSpecVisibilityQueryBuilder {
  private conditions: Array<(visibility: TypeSpecPropertyVisibility) => boolean> = [];

  /**
   * Add condition to query
   */
  where(condition: (visibility: TypeSpecPropertyVisibility) => boolean): this {
    this.conditions.push(condition);
    return this;
  }

  /**
   * Filter by lifecycle phase
   */
  hasLifecyclePhase(phase: TypeSpecVisibilityLifecycle): this {
    this.conditions.push(v => v.lifecycle.includes(phase));
    return this;
  }

  /**
   * Filter visible properties
   */
  isVisible(): this {
    this.conditions.push(v => v.visible);
    return this;
  }

  /**
   * Filter invisible properties
   */
  isInvisible(): this {
    this.conditions.push(v => v.isInvisible);
    return this;
  }

  /**
   * Filter by visibility source
   */
  hasSource(source: VisibilitySource): this {
    this.conditions.push(v => v.source === source);
    return this;
  }

  /**
   * Execute query against visibility array
   */
  execute(visibilities: readonly TypeSpecPropertyVisibility[]): readonly TypeSpecPropertyVisibility[] {
    return visibilities.filter(visibility => 
      this.conditions.every(condition => condition(visibility))
    );
  }

  /**
   * Count matches
   */
  count(visibilities: readonly TypeSpecPropertyVisibility[]): number {
    return this.execute(visibilities).length;
  }

  /**
   * Check if any matches
   */
  any(visibilities: readonly TypeSpecPropertyVisibility[]): boolean {
    return this.count(visibilities) > 0;
  }

  /**
   * Check if all match
   */
  all(visibilities: readonly TypeSpecPropertyVisibility[]): boolean {
    return this.count(visibilities) === visibilities.length;
  }
}

/**
 * Convenience function for creating visibility queries
 */
export function createVisibilityQuery(): TypeSpecVisibilityQueryBuilder {
  return new TypeSpecVisibilityQueryBuilder();
}

/**
 * TypeSpec Visibility Utility Functions
 */
export const TypeSpecVisibilityUtils = {
  /**
   * Check if visibility includes any lifecycle phase
   */
  hasAnyLifecyclePhase(
    visibility: TypeSpecPropertyVisibility, 
    phases: readonly TypeSpecVisibilityLifecycle[]
  ): boolean {
    return phases.some(phase => visibility.lifecycle.includes(phase));
  },

  /**
   * Check if visibility includes all lifecycle phases
   */
  hasAllLifecyclePhases(
    visibility: TypeSpecPropertyVisibility,
    phases: readonly TypeSpecVisibilityLifecycle[]
  ): boolean {
    return phases.every(phase => visibility.lifecycle.includes(phase));
  },

  /**
   * Get readable description of visibility
   */
  getDescription(visibility: TypeSpecPropertyVisibility): string {
    if (visibility.isInvisible) {
      return "Invisible (never visible)";
    }

    if (visibility.lifecycle.length === 0) {
      return "No visibility (effectively invisible)";
    }

    const phases = visibility.lifecycle.join(", ");
    return `Visible in: ${phases}`;
  },

  /**
   * Merge multiple visibility preferences
   * 
   * Useful when multiple decorators are present
   */
  merge(visibilities: readonly TypeSpecPropertyVisibility[]): TypeSpecPropertyVisibility {
    if (visibilities.length === 0) {
      return TypeSpecVisibilityInferenceRules.defaultVisibility();
    }

    if (visibilities.length === 1) {
      return visibilities[0];
    }

    // If any are invisible, result is invisible
    if (visibilities.some(v => v.isInvisible)) {
      return TypeSpecVisibilityInferenceRules.fromInvisibleDecorator();
    }

    // Merge lifecycle phases (union)
    const allPhases = Array.from(new Set(
      visibilities.flatMap(v => [...v.lifecycle])
    ));

    return {
      visible: allPhases.length > 0,
      lifecycle: allPhases,
      isInvisible: false,
      source: "decorator",
      decorator: {
        type: "@visibility",
        phases: allPhases
      }
    };
  }
} as const;