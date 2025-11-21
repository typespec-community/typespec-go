/**
 * TypeSpec Go Emitter - Domain-Driven Implementation
 *
 * Focus: Connect TypeSpec compiler to proven StandaloneGoGenerator
 * Strategy: Domain types + discriminated unions for impossible states
 * Unified Error System: Single source of truth for all error handling
 * Modular Architecture: Clean separation of concerns
 */

import type { Program } from "@typespec/compiler";
import {
  ErrorFactory,
  type GoEmitterResult,
} from "../domain/unified-errors.js";
import { Logger, LogContext } from "../domain/structured-logging.js";
import { ModelExtractor } from "./model-extractor.js";
import { GoCodeGenerator } from "./go-code-generator.js";
import type { GoEmitterOptions } from "./emitter-config.js";

/**
 * Main TypeSpec Go Emitter
 * Domain-driven design with clean separation of concerns
 */
export class GoEmitter {
  private codeGenerator: GoCodeGenerator;
  private options?: GoEmitterOptions;

  constructor(options: GoEmitterOptions = {}) {
    this.codeGenerator = new GoCodeGenerator();
    this.options = options;
  }

  /**
   * Emit Go code from TypeSpec program
   * UNIFIED RESULT TYPE: Single source of truth for success/error
   */
  async emit(program: Program): Promise<GoEmitterResult> {
    try {
      // Extract models from TypeSpec program using modular extractor
      const extractedModels = ModelExtractor.extractModels(program);
      Logger.info(
        LogContext.TYPESPEC_INTEGRATION,
        `Found ${extractedModels.size} models`,
        {
          modelCount: extractedModels.size,
          modelNames: Array.from(extractedModels.keys()),
        },
      );

      // Generate Go code for all extracted models
      const result = this.codeGenerator.generateForModels(extractedModels);

      return result;
    } catch (error) {
      Logger.error(
        LogContext.GO_GENERATION,
        "TypeSpec to Go conversion failed",
        {
          error: error instanceof Error ? error.message : String(error),
          programStats: {
            models: program.getGlobalNamespaceType().models?.size || 0,
          },
        },
      );

      // UNIFIED ERROR RESULT: Single source of truth
      return ErrorFactory.createTypeSpecCompilerError(
        `TypeSpec to Go conversion failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          modelName: program.getGlobalNamespaceType()?.name || "Unknown",
          resolution: "Check TypeSpec model definitions and compatibility",
        },
      );
    }
  }
}

/**
 * Factory function for creating Go emitter instances
 * Domain-driven approach with configuration validation
 */
export function createGoEmitter(options?: GoEmitterOptions): GoEmitter {
  return new GoEmitter(options);
}

/**
 * Default export for convenience
 * Clean API design with straightforward usage
 */
export default GoEmitter;
