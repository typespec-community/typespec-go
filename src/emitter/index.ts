/**
 * TypeSpec Go Emitter - Domain-Driven Implementation
 *
 * Focus: Connect TypeSpec compiler to proven StandaloneGoGenerator
 * Strategy: Domain types + discriminated unions for impossible states
 * Unified Error System: Single source of truth for all error handling
 */

import type { Program } from "@typespec/compiler";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import { ErrorFactory, GoEmitterResult, ErrorHandler } from "../domain/unified-errors.js";
import type {
  TypeSpecModel,
  TypeSpecPropertyNode,
  shouldUseUnsignedType,
} from "../types/typespec-domain.js";

/**
 * TypeSpec Go Emitter Configuration
 */
export interface GoEmitterOptions {
  /** Output directory for generated Go files */
  "output-dir"?: string;
  /** Go package path */
  "go-package"?: string;
  /** Generate Go package declarations */
  "generate-package"?: boolean;
}

/**
 * Domain-Driven TypeSpec to Go Emitter
 *
 * Bridges TypeSpec AST with StandaloneGoGenerator
 * Uses proper domain types for maximum type safety
 */
export class GoEmitter {
  private generator: StandaloneGoGenerator;
  private options?: GoEmitterOptions;

  constructor(options?: GoEmitterOptions) {
    this.generator = new StandaloneGoGenerator(options);
    this.options = options;
  }

  /**
   * Emit Go code from TypeSpec program
   * UNIFIED RESULT TYPE: Single source of truth for success/error
   */
  async emit(program: Program): Promise<GoEmitterResult> {
    try {
      // Extract models from TypeSpec program using proper AST traversal
      const models = this.extractModels(program);
      console.log(`📋 Found ${models.size} models`);

      // Generate Go code for each model
      const allGeneratedFiles = new Map<string, string>();

      for (const [modelName, typeSpecModel] of models) {
        console.log(`🔧 Generating Go for model: ${modelName}`);

        // Use StandaloneGoGenerator instance method
        const result = this.generator.generateModel(typeSpecModel);
        
        if (result._tag !== "Success") {
          return result; // Return error if generation failed
        }
        
        // Extract generated code from success result
        const generatedFiles = result.data;
        for (const [fileName, goCode] of generatedFiles) {
          allGeneratedFiles.set(fileName, goCode);
        }
      }

      // SUCCESS RESULT: Using unified error system
      return ErrorFactory.createSuccess(allGeneratedFiles, {
        generatedFiles: Array.from(allGeneratedFiles.keys()),
        typeSpecProgram: program,
      });
    } catch (error) {
      // ERROR RESULT: Using unified error system
      const unifiedError = ErrorFactory.createSystemError(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error : undefined,
        {
          resolution: "Check TypeSpec model definitions and generator configuration",
        },
      );

      // Log error with structured format
      const logFormat = ErrorHandler.formatForLogging(unifiedError);
      console.error(`❌ Emission failed: ${logFormat.message}`, logFormat.context);

      return unifiedError;
    }
  }

  /**
   * Extract TypeSpec models from program
   * TODO: Implement proper TypeSpec AST traversal using @typespec/compiler API
   * CURRENT: Mock implementation with domain types and uint intelligence
   */
  private extractModels(program: Program): Map<string, TypeSpecModel> {
    const models = new Map<string, TypeSpecModel>();

    // TEMPORARY: Create test model with domain types and uint intelligence
    // TODO: Implement actual TypeSpec model extraction using program.state.models
    const userModel: TypeSpecModel = {
      name: "User",
      properties: new Map([
        [
          "ID",
          {
            name: "ID",
            type: { kind: "String" },
            optional: false,
          },
        ],
        [
          "Name",
          {
            name: "Name",
            type: { kind: "String" },
            optional: false,
          },
        ],
        [
          "Email",
          {
            name: "Email",
            type: { kind: "String" },
            optional: true,
          },
        ],
        [
          "Age",
          {
            name: "Age",
            type: { kind: "Uint8" }, // ✅ DOMAIN LOGIC: Age can't be negative, use uint!
            optional: true,
          },
        ],
        [
          "Count",
          {
            name: "Count",
            type: { kind: "Uint16" }, // ✅ DOMAIN LOGIC: Count can't be negative, use uint!
            optional: false,
          },
        ],
        [
          "IsActive",
          {
            name: "IsActive",
            type: { kind: "Boolean" },
            optional: false,
          },
        ],
      ]),
    };

    models.set("User", userModel);
    return models;
  }
}

/**
 * Create Go emitter instance
 */
export function createGoEmitter(options?: GoEmitterOptions): GoEmitter {
  return new GoEmitter(options);
}

export default GoEmitter;
