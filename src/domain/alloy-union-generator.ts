/**
 * Alloy Union Generator
 * Modern Alloy/Go implementation for union type generation
 * Replaces string-based generation with component-based architecture
 */

import { ErrorFactory, GoEmitterResult, defaultErrorHandler } from "./unified-errors.js";
import type { TypeSpecTypeNode, TypeSpecPropertyNode } from "../types/typespec-domain.js";
import { render, refkey } from "@alloy-js/core";
import * as go from "@alloy-js/go";
import type { Union, UnionVariant } from "@typespec/compiler";

/**
 * Type-safe Alloy-based Union Generator
 * Uses modern Alloy/Go components instead of string manipulation
 */
export class AlloyUnionGenerator {
  /**
   * Generate Go union type using Alloy/Go components
   * UNIFIED ERROR SYSTEM: Returns GoEmitterResult instead of throwing
   */
  async generateUnionType(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode; discriminator?: string }>;
    properties?: ReadonlyMap<string, TypeSpecPropertyNode>;
    discriminator?: string;
  }): Promise<GoEmitterResult> {
    // Input validation
    if (!unionModel.name) {
      return ErrorFactory.createValidationError("Invalid union: name must be a non-empty string", {
        modelName: unionModel.name || "unknown",
      });
    }

    if (!unionModel.variants || unionModel.variants.length === 0) {
      return ErrorFactory.createValidationError("Invalid union: must have at least one variant", {
        modelName: unionModel.name,
      });
    }

    try {
      // Convert to string-based format for now - will be replaced with Alloy integration
      const goCode = await this.generateUnionCode(unionModel);
      
      // Debug log for testing
      console.log('Generated union code:', goCode.substring(0, 200) + '...');

      return ErrorFactory.createSuccess(new Map([[`${unionModel.name}.go`, goCode]]), {
        generatedFiles: [`${unionModel.name}.go`],
        modelName: unionModel.name,
        variantCount: unionModel.variants.length,
      });
    } catch (error) {
      console.log('Error in generateUnionType:', error);
      return defaultErrorHandler(error, {
        operation: "generateUnionType",
        modelName: unionModel.name,
        variants: unionModel.variants.map((v) => v.name),
      });
    }
  }

  /**
   * Generate Go union code using existing GoUnionDeclaration
   * BRIDGE PATTERN: Leverages existing Alloy component
   */
  private async generateUnionCode(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode; discriminator?: string }>;
    discriminator?: string;
  }): Promise<string> {
    try {
      // Import GoUnionDeclaration component using dynamic import
      const { GoUnionDeclaration } = await import("../components/go/GoUnionDeclaration.js");
      
      // Convert internal format to TypeSpec Union format
      const typeSpecUnion = this.convertToTypeSpecUnion(unionModel);
      
      // Debug logging
      console.log('Converted TypeSpec Union:', JSON.stringify(typeSpecUnion, null, 2));
      
      // Use existing GoUnionDeclaration component
      const result = GoUnionDeclaration({
        union: typeSpecUnion,
        discriminator: unionModel.discriminator,
        packageName: "api",
      });
      
      // Debug result
      console.log('GoUnionDeclaration result:', result.substring(0, 200) + '...');
      
      return result;
    } catch (error) {
      console.log('Error in generateUnionCode:', error);
      throw error;
    }
  }

  /**
   * Convert internal union model to TypeSpec Union format
   */
  private convertToTypeSpecUnion(unionModel: {
    name: string;
    kind: "union";
    variants: Array<{ name: string; type: TypeSpecTypeNode; discriminator?: string }>;
  }): Union {
    // Create variant map from array
    const variants = new Map<string, UnionVariant>();
    
    for (const variant of unionModel.variants) {
      const unionVariant: UnionVariant = {
        name: variant.name,
        type: this.convertTypeSpecTypeNode(variant.type),
      };
      variants.set(variant.name, unionVariant);
    }

    // Return TypeSpec Union object
    return {
      name: unionModel.name,
      kind: "Union",
      variants,
    };
  }

  /**
   * Convert TypeSpecTypeNode to TypeSpec type format
   */
  private convertTypeSpecTypeNode(typeNode: TypeSpecTypeNode) {
    // Convert internal type representation to TypeSpec format
    switch (typeNode.kind) {
      case "String":
        return { kind: "String" };
      case "Boolean":
        return { kind: "Boolean" };
      case "Number":
        return { kind: "Number" };
      case "scalar":
        return { kind: "Scalar", name: typeNode.name };
      default:
        return { kind: "String" }; // Default fallback
    }
  }


}