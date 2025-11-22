/**
 * TypeSpec Model Extractor - Core Module
 *
 * Core interfaces and main extraction logic from TypeSpec programs
 * Clean separation of concerns for emitter architecture
 */

import type { 
  Program, 
  Model as TypeSpecModelType, 
  ModelProperty as TypeSpecModelProperty,
  Model,
  Type,
  Namespace,
  SemanticNodeListener,
  Union
} from "@typespec/compiler";
import type { TypeSpecPropertyNode, TypeSpecTypeNode } from "../types/typespec-domain.js";
import { 
  navigateProgram, 
  getEffectiveModelType, 
  walkPropertiesInherited
} from "@typespec/compiler";
import { Logger, LogContext } from "../domain/structured-logging.js";

/**
 * Extracted TypeSpec operation with metadata
 */
export interface ExtractedOperation {
  readonly name: string;
  readonly verb: string;
  readonly path: string;
  readonly parameters: ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
      location: string;
      optional: boolean;
    }
  >;
  readonly returnType?: { kind: string; name?: string };
}

/**
 * Extracted TypeSpec union with metadata
 */
export interface ExtractedUnion {
  readonly name: string;
  readonly variants: ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
    }
  >;
}

/**
 * Extracted TypeSpec model with metadata
 */
export interface ExtractedModel {
  readonly name: string;
  readonly properties: ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
      optional: boolean;
    }
  >;
  readonly extends?: string;
  readonly template?: string;
  readonly propertiesFromExtends?: ReadonlyMap<string, any>;
}

/**
 * TypeSpec model and union extraction utilities - Core logic
 */
export class ModelExtractor {
  /**
   * Extract all operations from TypeSpec program
   * Domain logic: Clean AST traversal for operation types
   */
  static extractOperations(program: Program): ReadonlyMap<string, ExtractedOperation> {
    try {
      const operations = new Map<string, ExtractedOperation>();

      Logger.info(
        LogContext.TYPESPEC_INTEGRATION,
        "Extracting operations from compiled program",
      );

      // Use proper TypeSpec compiler APIs instead of any types
      try {
        // TODO: Replace with proper TypeSpec API when available
        // For now, using direct program property access
        Logger.warn(
          LogContext.TYPESPEC_INTEGRATION,
          "Direct program property access - needs TypeSpec API research",
        );

        // Navigation using TypeSpec compiler API
        navigateProgram(program, {
          operation(operation) {
            const extracted = this.processTypeSpecOperation(operation, program);
            if (extracted) {
              operations.set(extracted.name, extracted);
            }
          },
        });

        Logger.info(
          LogContext.TYPESPEC_INTEGRATION,
          `Extracted ${operations.size} operations from TypeSpec program`,
        );

        return operations;
      } catch (typeSpecError) {
        Logger.error(
          LogContext.TYPESPEC_INTEGRATION,
          "TypeSpec API navigation failed",
          { error: typeSpecError instanceof Error ? typeSpecError.message : String(typeSpecError) },
        );
        return operations;
      }
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Operation extraction failed completely",
        { error: error instanceof Error ? error.message : String(error) },
      );
      return new Map();
    }
  }

  /**
   * Extract all unions from TypeSpec program
   * Domain logic: Clean AST traversal for union types
   */
  static extractUnions(program: Program): ReadonlyMap<string, ExtractedUnion> {
    try {
      const unions = new Map<string, ExtractedUnion>();

      Logger.info(
        LogContext.TYPESPEC_INTEGRATION,
        "Extracting unions from compiled program",
      );

      try {
        // Navigation using TypeSpec compiler API
        navigateProgram(program, {
          union(union) {
            const extracted = this.processTypeSpecUnion(union, program);
            if (extracted) {
              unions.set(extracted.name, extracted);
            }
          },
        });

        Logger.info(
          LogContext.TYPESPEC_INTEGRATION,
          `Extracted ${unions.size} unions from TypeSpec program`,
        );

        return unions;
      } catch (typeSpecError) {
        Logger.error(
          LogContext.TYPESPEC_INTEGRATION,
          "TypeSpec union navigation failed",
          { error: typeSpecError instanceof Error ? typeSpecError.message : String(typeSpecError) },
        );
        return unions;
      }
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Union extraction failed completely",
        { error: error instanceof Error ? error.message : String(error) },
      );
      return new Map();
    }
  }

  /**
   * Extract all models from TypeSpec program
   * Domain logic: Clean AST traversal for model types
   */
  static extractModels(program: Program): ReadonlyMap<string, ExtractedModel> {
    try {
      const models = new Map<string, ExtractedModel>();
      const cyclicDependencies = new Set<string>();

      Logger.info(
        LogContext.TYPESPEC_INTEGRATION,
        "Extracting models from compiled program",
      );

      try {
        // Navigation using TypeSpec compiler API
        navigateProgram(program, {
          model(model) {
            // Skip cyclic dependencies temporarily
            if (this.detectCyclicDependency(model, cyclicDependencies)) {
              Logger.warn(
                LogContext.TYPESPEC_INTEGRATION,
                "Cyclic dependency detected, processing with resolution",
                { modelName: model.name }
              );
            }

            try {
              const extracted = this.processTypeSpecModel(model, program);
              if (extracted) {
                // Break cyclic dependencies if detected
                const resolved = cyclicDependencies.has(extracted.name)
                  ? this.breakCyclicDependency(extracted)
                  : extracted;
                models.set(resolved.name, resolved);
              }
            } catch (modelError) {
              Logger.error(
                LogContext.TYPESPEC_INTEGRATION,
                "Failed to process individual model",
                { 
                  modelName: model.name,
                  error: modelError instanceof Error ? modelError.message : String(modelError)
                }
              );
            }
          },
        });

        Logger.info(
          LogContext.TYPESPEC_INTEGRATION,
          `Extracted ${models.size} models from TypeSpec program`,
        );

        return models;
      } catch (typeSpecError) {
        Logger.error(
          LogContext.TYPESPEC_INTEGRATION,
          "TypeSpec model navigation failed",
          { error: typeSpecError instanceof Error ? typeSpecError.message : String(typeSpecError) },
        );
        return models;
      }
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Model extraction failed completely",
        { error: error instanceof Error ? error.message : String(error) },
      );
      return new Map();
    }
  }
}