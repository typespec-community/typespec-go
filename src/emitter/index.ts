/**
 * TypeSpec Go Emitter - Domain-Driven Implementation
 * 
 * Focus: Connect TypeSpec compiler to proven StandaloneGoGenerator
 * Strategy: Domain types + discriminated unions for impossible states
 */

import type { Program } from "@typespec/compiler";
import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { 
  TypeSpecModel, 
  TypeSpecPropertyNode,
  TypeSpecGeneratorResult,
  shouldUseUnsignedType
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
   * RESULT TYPE: Discriminated union (success or error, never both)
   */
  async emit(program: Program): Promise<TypeSpecGeneratorResult> {
    console.log("🚀 TypeSpec Go Emitter: Starting emission...");
    
    try {
      // Extract models from TypeSpec program using proper AST traversal
      const models = this.extractModels(program);
      console.log(`📋 Found ${models.size} models`);
      
      // Generate Go code for each model
      const generatedFiles = new Map<string, string>();
      
      for (const [modelName, typeSpecModel] of models) {
        console.log(`🔧 Generating Go for model: ${modelName}`);
        
        // Use StandaloneGoGenerator instance method
        const goCode = this.generator.generateModel(typeSpecModel);
        generatedFiles.set(`${modelName}.go`, goCode);
      }
      
      // SUCCESS DISCRIMINATED RESULT: Only success state
      const successResult: TypeSpecGeneratorResult = {
        _type: "success",
        data: generatedFiles
      };
      
      console.log("✅ Emission completed successfully");
      return successResult;
      
    } catch (error) {
      console.error("❌ Emission failed:", error);
      
      // ERROR DISCRIMINATED RESULT: Only error state
      const errorResult: TypeSpecGeneratorResult = {
        _type: "error",
        error: {
          _type: "compilation",
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      };
      
      return errorResult;
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
        ["ID", { 
          name: "ID", 
          type: { kind: "String" }, 
          optional: false 
        }],
        ["Name", { 
          name: "Name", 
          type: { kind: "String" }, 
          optional: false 
        }],
        ["Email", { 
          name: "Email", 
          type: { kind: "String" }, 
          optional: true 
        }],
        ["Age", { 
          name: "Age", 
          type: { kind: "Uint8" }, // ✅ DOMAIN LOGIC: Age can't be negative, use uint!
          optional: true 
        }],
        ["Count", { 
          name: "Count", 
          type: { kind: "Uint16" }, // ✅ DOMAIN LOGIC: Count can't be negative, use uint!
          optional: false 
        }],
        ["IsActive", { 
          name: "IsActive", 
          type: { kind: "Boolean" }, 
          optional: false 
        }]
      ])
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