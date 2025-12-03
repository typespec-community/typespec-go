/**
 * Type-safe Standalone Generator - DELEGATION ARCHITECTURE
 *
 * PROFESSIONAL TYPE SAFETY: Zero any types
 * UNIFIED ERROR SYSTEM: Single source of truth for error handling
 * ELIMINATED DUPLICATES: Single source of truth for domain types
 * DELEGATES TO CLEAN TYPE MAPPER: No duplicate mapping logic
 * CUSTOMER VALUE: Working Go generation with professional quality
 */

import { ErrorFactory, GoEmitterResult, defaultErrorHandler } from "./domain/unified-errors.js";
import { CleanTypeMapper } from "./domain/clean-type-mapper.js";
import type {
  TypeSpecPropertyNode,
  TypeSpecTypeNode,
  GoEmitterOptions,
} from "./types/typespec-domain.js";
import type { GoTypeMapping } from "./types/emitter.types.js";
import { StructGenerator } from "./domain/struct-generator.js";
import { UnionGenerator } from "./domain/union-generator.js";

/**
 * Type-safe Standalone Generator with delegation architecture
 * ELIMINATES DUPLICATION: Delegates to CleanTypeMapper for all type operations
 */
export class StandaloneGoGenerator {
  private structGenerator: StructGenerator;
  private unionGenerator: UnionGenerator;

  constructor(options?: GoEmitterOptions) {
    // Options for future extensibility
    this.structGenerator = new StructGenerator();
    this.unionGenerator = new UnionGenerator();
  }

  /**
   * Type-safe type mapping using unified CleanTypeMapper
   * ZERO ANY TYPES: Comprehensive coverage with proper error handling
   * DELEGATION PATTERN: Single source of truth for all type mappings
   */
  static mapTypeSpecType(type: TypeSpecPropertyNode["type"], fieldName?: string): GoTypeMapping {
    // DELEGATE TO CLEAN UNIFIED SYSTEM: Single source of truth
    return CleanTypeMapper.mapTypeSpecTypeLegacy(type, fieldName);
  }

  /**
   * Type-safe type mapping with legacy support
   * BACKWARD COMPATIBILITY: Supports existing code patterns
   */
  static mapTypeSpecTypeLegacy(
    type: TypeSpecPropertyNode["type"],
    fieldName?: string,
  ): GoTypeMapping {
    // DELEGATE TO CLEAN UNIFIED SYSTEM: Single source of truth
    return CleanTypeMapper.mapTypeSpecTypeLegacy(type, fieldName);
  }

  /**
   * Type-safe model generation
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  generateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
    template?: string; // Template definition like "<T>" or "PaginatedResponse<User>"
    extends?: string; // Support Go struct embedding
    propertiesFromExtends?: ReadonlyMap<string, TypeSpecPropertyNode>; // Support spread operator
  }): GoEmitterResult {
    return this.structGenerator.generateModel(model);
  }

  /**
   * Generate Go union type (sealed interface pattern)
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  generateUnionType(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
    properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    return this.unionGenerator.generateUnionType(unionModel);
  }

  /**
   * Validate union before generation
   * CONSISTENT VALIDATION: Unified error system
   */
  validateUnion(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  }): GoEmitterResult {
    return this.unionGenerator.validateUnion(unionModel);
  }

  /**
   * Validate model before generation
   * CONSISTENT VALIDATION: Unified error system
   */
  validateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    return this.structGenerator.validateModel(model);
  }

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
          result.data.forEach((code, filename) => {
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
            result.data.forEach((code, filename) => {
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
