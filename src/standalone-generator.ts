/**
 * Type-safe Standalone Generator - DELEGATION ARCHITECTURE
 *
 * PROFESSIONAL TYPE SAFETY: Zero any types
 * UNIFIED ERROR SYSTEM: Single source of truth for error handling
 * ELIMINATED DUPLICATES: Single source of truth for domain types
 * DELEGATES TO CLEAN TYPE MAPPER: No duplicate mapping logic
 * MODULAR DESIGN: Focused generators for each responsibility
 */

import {
  ErrorFactory,
  GoEmitterResult,
  defaultErrorHandler,
} from "./domain/unified-errors.js";
import { CleanTypeMapper } from "./domain/clean-type-mapper.js";
import type {
  TypeSpecPropertyNode,
  TypeSpecTypeNode,
  GoEmitterOptions,
} from "./types/typespec-domain.js";

// Import specialized generators
import { generateModel } from "./generators/model-generator.js";
import { generateUnionType } from "./generators/union-generator.js";
import { validateModel, validateUnion } from "./validators/type-validators.js";
import { capitalizeFirst, capitalizeWords } from "./utils/string-utils.js";

/**
 * Go type mapping configuration
 */
interface GoTypeMapping {
  /** Go type string */
  readonly goType: string;
  /** Whether to use pointer for optional fields */
  readonly usePointerForOptional: boolean;
}

/**
 * Type-safe Standalone Generator with delegation architecture
 * MODULAR DESIGN: Delegates to specialized generators
 */
export class StandaloneGoGenerator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: GoEmitterOptions) {
    // Options for future extensibility
    // Currently no options needed, but constructor for consistency
  }

  /**
   * Type-safe type mapping using unified CleanTypeMapper
   * ZERO ANY TYPES: Comprehensive coverage with proper error handling
   * DELEGATION PATTERN: Single source of truth for all type mappings
   */
  static mapTypeSpecType(type: TypeSpecPropertyNode["type"], fieldName?: string): GoTypeMapping {
    // DELEGATE TO CLEAN UNIFIED SYSTEM: Single source of truth
    return CleanTypeMapper.mapTypeSpecType(type, fieldName);
  }

  /**
   * Type-safe type mapping with legacy support
   * BACKWARD COMPATIBILITY: Supports existing code patterns
   */
  static mapTypeSpecTypeLegacy(type: TypeSpecPropertyNode["type"], fieldName?: string): GoTypeMapping {
    // DELEGATE TO CLEAN UNIFIED SYSTEM: Single source of truth
    return CleanTypeMapper.mapTypeSpecTypeLegacy(type, fieldName);
  }

  /**
   * Generate Go model using specialized model generator
   * DELEGATION PATTERN: Modular architecture
   */
  generateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
    extends?: string;
  }): GoEmitterResult {
    // DELEGATE TO SPECIALIZED GENERATOR
    return generateModel(model);
  }

  /**
   * Generate Go union type using specialized union generator
   * DELEGATION PATTERN: Modular architecture
   */
  generateUnionType(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
    properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    // DELEGATE TO SPECIALIZED GENERATOR
    return generateUnionType(unionModel);
  }

  /**
   * Validate model using specialized validator
   * DELEGATION PATTERN: Modular validation
   */
  validateModel(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
  }): GoEmitterResult {
    // DELEGATE TO SPECIALIZED VALIDATOR
    return validateModel(model);
  }

  /**
   * Validate union using specialized validator
   * DELEGATION PATTERN: Modular validation
   */
  validateUnion(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  }): GoEmitterResult {
    // DELEGATE TO SPECIALIZED VALIDATOR
    return validateUnion(unionModel);
  }

  /**
   * Format TypeSpec model documentation
   * DOCUMENTATION GENERATION: Consistent Go documentation
   */
  formatModelDocumentation(model: {
    name: string;
    properties: ReadonlyMap<string, TypeSpecPropertyNode>;
    extends?: string;
  }): string {
    const lines: string[] = [];

    // Header comment
    if (model.extends) {
      lines.push(`// ${model.name} - TypeSpec generated model (extends ${model.extends})`);
    } else {
      lines.push(`// ${model.name} - TypeSpec generated model`);
    }

    // Property documentation
    for (const [propName, propNode] of model.properties) {
      const typeInfo = StandaloneGoGenerator.mapTypeSpecType(propNode.type, propName);
      const optionalText = propNode.optional ? " (optional)" : "";
      lines.push(`// ${propName}: ${typeInfo.goType}${optionalText}`);
    }

    return lines.join("\n");
  }

  /**
   * Format TypeSpec union documentation
   * DOCUMENTATION GENERATION: Consistent Go documentation
   */
  formatUnionDocumentation(unionModel: {
    name: string;
    variants: Array<{ name: string; type: TypeSpecTypeNode }>;
  }): string {
    const lines: string[] = [];

    // Header comment
    lines.push(`// ${unionModel.name} - TypeSpec generated union`);

    // Variant documentation
    for (const variant of unionModel.variants) {
      const typeName = variant.type && typeof variant.type === "object" && "name" in variant.type 
        ? (variant.type as { name: string }).name 
        : "unknown";
      lines.push(`// ${variant.name}: ${typeName}`);
    }

    return lines.join("\n");
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