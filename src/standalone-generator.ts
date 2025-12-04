/**
 * Type-safe Standalone Generator - DELEGATION ARCHITECTURE
 *
 * PROFESSIONAL TYPE SAFETY: Zero any types
 * UNIFIED ERROR SYSTEM: Single source of truth for error handling
 * ELIMINATED DUPLICATES: Single source of truth for domain types
 * DELEGATES TO CLEAN TYPE MAPPER: No duplicate mapping logic
 * CUSTOMER VALUE: Working Go generation with professional quality
 */

import { defaultErrorHandler, ErrorFactory } from "./domain/unified-errors.js";
import type { GoEmitterResult } from "./domain/unified-errors.js";
import type {
  TypeSpecPropertyNode,
  TypeSpecTypeNode,
  GeneratorModel,
} from "./types/typespec-domain.js";
import { StructGenerator } from "./domain/struct-generator.js";
import { UnionGenerator } from "./domain/union-generator.js";

/**
 * Type-safe Standalone Generator with delegation architecture
 * ELIMINATES DUPLICATION: Delegates to CleanTypeMapper for all type operations
 */
export class StandaloneGoGenerator {
  private structGenerator: StructGenerator;
  private unionGenerator: UnionGenerator;

  constructor() {
    this.structGenerator = new StructGenerator();
    this.unionGenerator = new UnionGenerator();
  }

  /**
   * Type-safe model generation
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  generateModel(model: GeneratorModel): GoEmitterResult {
    return this.structGenerator.generateModel(model);
  }

  /**
   * Generate Go union type (sealed interface pattern)
   * DELEGATION: Forwards to UnionGenerator for actual implementation
   */
  // jscpd:ignore-start
  generateUnionType(unionData: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
    properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    return this.unionGenerator.generateUnionType(unionData);
  }
  // jscpd:ignore-end

  /**
   * Generate Go package with multiple models
   * BATCH GENERATION: Efficient processing of multiple models
   */
  generatePackage(packageInfo: {
    name: string;
    models: Array<{
      name: string;
      properties: ReadonlyMap<string, TypeSpecPropertyNode>;
      extends?: string;
    }>;
    unions?: Array<{
      name: string;
      kind: "union";
      variants: Array<{ name: string; type: TypeSpecTypeNode }>;
    }>;
  }): GoEmitterResult {
    try {
      const allFiles = new Map<string, string>();
      const generatedFiles: string[] = [];
      const generatedModels: string[] = [];
      const generatedUnions: string[] = [];

      // Generate all models
      for (const model of packageInfo.models) {
        const result = this.generateModel(model);
        if (result._tag === "success") {
          result.data.forEach((code: string, filename: string) => {
            allFiles.set(filename, code);
            generatedFiles.push(filename);
          });
          generatedModels.push(model.name);
        } else {
          return result; // Return first error
        }
      }

      // Generate all unions
      if (packageInfo.unions) {
        for (const union of packageInfo.unions) {
          const result = this.generateUnionType(union);
          if (result._tag === "success") {
            result.data.forEach((code: string, filename: string) => {
              allFiles.set(filename, code);
              generatedFiles.push(filename);
            });
            generatedUnions.push(union.name);
          } else {
            return result; // Return first error
          }
        }
      }

      return ErrorFactory.createSuccess(allFiles, {
        generatedFiles,
        packageName: packageInfo.name,
        modelCount: generatedModels.length,
        unionCount: generatedUnions.length,
      });
    } catch (error) {
      return defaultErrorHandler(error, {
        operation: "generatePackage",
        packageName: packageInfo.name,
        modelCount: packageInfo.models.length,
        unionCount: packageInfo.unions?.length || 0,
      });
    }
  }
}
