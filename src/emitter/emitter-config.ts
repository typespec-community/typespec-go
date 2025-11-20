/**
 * Emitter Configuration - TypeSpec Go Emitter
 *
 * Configuration and options management for Go emitter
 * Clean separation of concerns for emitter architecture
 */

/**
 * Go Emitter Configuration Options
 * ZERO ANY TYPES: Type-safe configuration interface
 */
export interface GoEmitterOptions {
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
}

/**
 * Default emitter configuration
 * DOMAIN LOGIC: Sensible defaults with flexibility
 */
export const DEFAULT_EMITTER_OPTIONS: Required<
  Omit<GoEmitterOptions, keyof typeof NEVER_CONFIGURED>
> = {
  outputDir: "./generated",
  namingPattern: "PascalCase",
  jsonTagStyle: "snake_case",
  pointerPolicy: "optional_only",
  uintPolicy: "auto",
} as const;

/**
 * Configuration validation utilities
 */
export class EmitterConfigValidator {
  /**
   * Validate emitter configuration
   * DOMAIN LOGIC: Type-safe validation with clear error messages
   */
  static validateOptions(options?: GoEmitterOptions): GoEmitterOptions {
    if (!options) {
      return DEFAULT_EMITTER_OPTIONS;
    }

    // Validate output directory
    if (options.outputDir && typeof options.outputDir !== "string") {
      throw new Error(
        `outputDir must be a string, got: ${typeof options.outputDir}`,
      );
    }

    // Validate naming pattern
    if (
      options.namingPattern &&
      !["snake_case", "PascalCase"].includes(options.namingPattern)
    ) {
      throw new Error(
        `namingPattern must be 'snake_case' or 'PascalCase', got: ${options.namingPattern}`,
      );
    }

    // Validate json tag style
    if (
      options.jsonTagStyle &&
      !["snake_case", "camelCase"].includes(options.jsonTagStyle)
    ) {
      throw new Error(
        `jsonTagStyle must be 'snake_case' or 'camelCase', got: ${options.jsonTagStyle}`,
      );
    }

    // Validate pointer policy
    if (
      options.pointerPolicy &&
      !["all", "optional_only", "primitives_only"].includes(
        options.pointerPolicy,
      )
    ) {
      throw new Error(
        `pointerPolicy must be 'all', 'optional_only', or 'primitives_only', got: ${options.pointerPolicy}`,
      );
    }

    // Validate uint policy
    if (
      options.uintPolicy &&
      !["auto", "int_only", "prefer_uint"].includes(options.uintPolicy)
    ) {
      throw new Error(
        `uintPolicy must be 'auto', 'int_only', or 'prefer_uint', got: ${options.uintPolicy}`,
      );
    }

    // Return merged configuration with defaults
    return {
      ...DEFAULT_EMITTER_OPTIONS,
      ...options,
    };
  }

  /**
   * Get effective configuration for specific context
   * DOMAIN LOGIC: Context-aware configuration resolution
   */
  static getEffectiveConfig(
    options?: GoEmitterOptions,
    context?: "development" | "production" | "test",
  ): GoEmitterOptions {
    const baseConfig = this.validateOptions(options);

    // Apply context-specific adjustments
    switch (context) {
      case "development":
        return {
          ...baseConfig,
          outputDir: "./generated-dev",
        };

      case "test":
        return {
          ...baseConfig,
          outputDir: "./generated-test",
        };

      case "production":
      default:
        return baseConfig;
    }
  }
}

// Type utility for default configuration
type NEVER_CONFIGURED = Record<never, never>;
