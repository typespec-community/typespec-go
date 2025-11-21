/**
 * Go Code Generator - Emitter Module
 *
 * Core Go generation coordination logic
 * Clean separation of concerns for emitter architecture
 */

import { StandaloneGoGenerator } from "../standalone-generator.js";
import type { GoEmitterResult } from "../domain/unified-errors.js";
import { Logger, LogContext } from "../domain/structured-logging.js";
import type { ExtractedModel } from "./model-extractor.js";
import { TypeSpecEntities } from "../types/errors.js";
import { Entities } from "../domain/error-entities.js";
import { GeneratorRegistry } from "../generators/index.js";
import type { TypeSpecPropertyNode } from "../types/typespec-domain.js";

/**
 * Go code generation coordination
 */
export class GoCodeGenerator {
  private generator: StandaloneGoGenerator;

  constructor() {
    this.generator = new StandaloneGoGenerator();
  }

  /**
   * Generate Go code for all extracted models
   * Domain logic: Clean generation coordination with proper error handling
   */
  generateForModels(
    models: ReadonlyMap<string, ExtractedModel>,
  ): GoEmitterResult {
    try {
      // Generate Go code for each model
      const allGeneratedFiles = new Map<string, string>();

      for (const [modelName, extractedModel] of models) {
        Logger.info(
          LogContext.GO_GENERATION,
          `Generating Go for model: ${modelName}`,
          {
            modelName,
            propertyCount: extractedModel.properties.size,
          },
        );

        // Convert extracted model to generator-compatible format
        const generatorModel = this.convertToGeneratorModel(
          modelName,
          extractedModel,
        );

        // Generate Go code using StandaloneGoGenerator
        const result = this.generator.generateModel(generatorModel);

        if (result._tag !== "success") {
          return result; // Return error if generation failed
        }

        // Extract generated code from success result
        const generatedFiles = result.data;
        for (const [fileName, goCode] of generatedFiles) {
          allGeneratedFiles.set(fileName, goCode);
        }
      }

      // Return successful result with all generated files
      return {
        _tag: "success",
        data: allGeneratedFiles,
        generatedFiles: Array.from(allGeneratedFiles.keys()),
      };
    } catch (error) {
      Logger.error(LogContext.GO_GENERATION, "Go code generation failed", {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        _tag: "go_code_generation_error",
        message: error instanceof Error ? error.message : String(error),
        errorId: Entities.createErrorId("GO_CODE_GENERATION_FAILED"),
        fileName: Entities.createFileName("emitter-generation"),
        resolution: "Check model properties and type mappings",
      };
    }
  }

  /**
   * Generate Go code using registered generators
   * DOMAIN LOGIC: Extensible generator architecture
   */
  async generateWithGenerators(
    program: import("@typespec/compiler").Program,
  ): Promise<GoEmitterResult> {
    try {
      const allGeneratedFiles = new Map<string, string>();
      const generators = GeneratorRegistry.getAll();

      Logger.info(
        LogContext.GO_GENERATION,
        `Using ${generators.length} registered generators`,
        {
          generatorNames: generators.map((g) => g.name),
        },
      );

      for (const generator of generators) {
        Logger.info(
          LogContext.GO_GENERATION,
          `Executing generator: ${generator.name}`,
        );

        // Execute generator
        const result = await generator.generate(program);

        if (result._tag !== "success") {
          return result; // Return error if generation failed
        }

        // Merge generated files
        for (const [fileName, goCode] of result.data) {
          allGeneratedFiles.set(fileName, goCode);
        }
      }

      // Return successful result with all generated files
      return {
        _tag: "success",
        data: allGeneratedFiles,
        generatedFiles: Array.from(allGeneratedFiles.keys()),
      };
    } catch (error) {
      Logger.error(
        LogContext.GO_GENERATION,
        "Generator-based generation failed",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );

      return {
        _tag: "system_error",
        message: `Generator execution failed: ${error instanceof Error ? error.message : String(error)}`,
        context: "Generator execution",
        resolution: "Check registered generators and their dependencies",
        errorId: Entities.createErrorId("GENERATOR_EXECUTION_FAILED"),
      };
    }
  }

  /**
   * Convert extracted model to generator-compatible format
   * Domain logic: Clean model format conversion
   */
  private convertToGeneratorModel(
    modelName: string,
    extractedModel: ExtractedModel,
  ): {
    name: string;
    properties: ReadonlyMap<
      string,
      TypeSpecPropertyNode
    >;
    extends?: string;
    propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>;
  } {
    // Convert property types to match expected TypeSpecPropertyNode format
    const convertedProperties = new Map<string, TypeSpecPropertyNode>();
    for (const [key, prop] of extractedModel.properties) {
      // Convert string kind to proper TypeSpecTypeNode format
      const kind = prop.type.kind as any;
      convertedProperties.set(key, {
        name: prop.name,
        type: {
          kind: kind,
          // Add any additional properties needed
        },
        optional: prop.optional,
      });
    }

    return {
      name: modelName,
      properties: convertedProperties,
      ...(extractedModel.extends && { extends: extractedModel.extends }),
      ...(extractedModel.propertiesFromExtends && { propertiesFromExtends: extractedModel.propertiesFromExtends }),
    };
  }
}
