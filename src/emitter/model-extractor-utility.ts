/**
 * TypeSpec Model Extractor - Utility Module
 *
 * Processing utilities and TypeSpec type mapping functions
 * Clean separation of concerns for emitter architecture
 */

import type { 
  Program, 
  Model as TypeSpecModelType, 
  ModelProperty as TypeSpecModelProperty,
  Union,
  Operation as TypeSpecOperation,
  Scalar as TypeSpecScalar,
  Interface as TypeSpecInterface
} from "@typespec/compiler";
import type { ExtractedModel, ExtractedOperation, ExtractedUnion } from "./model-extractor-core.js";
import { getEffectiveModelType } from "@typespec/compiler";
import { Logger, LogContext } from "../domain/structured-logging.js";
import type { TypeSpecPropertyNode, TypeSpecKind } from "../types/typespec-domain.js";

/**
 * Model processing utilities
 */
export class ModelProcessingExtractor {
  /**
   * Process individual TypeSpec operation
   * Domain logic: Convert TypeSpec operation AST to extracted format
   */
  static processTypeSpecOperation(
    operation: unknown,
    program: Program
  ): ExtractedOperation | null {
    try {
      if (!this.isValidTypeSpecOperation(operation)) {
        Logger.debug(
          LogContext.TYPESPEC_INTEGRATION,
          "Skipping invalid operation structure",
        );
        return null;
      }

      const typeSpecOp = operation as TypeSpecOperation;
      
      return {
        name: typeSpecOp.name || "UnknownOperation",
        verb: this.extractOperationVerb(typeSpecOp),
        path: this.extractOperationPath(typeSpecOp),
        parameters: this.extractOperationParameters(typeSpecOp),
        returnType: this.extractOperationReturnType(typeSpecOp),
      };
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to process individual operation",
        { 
          operationName: (operation as TypeSpecOperation)?.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      return null;
    }
  }

  /**
   * Process individual TypeSpec union
   * Domain logic: Convert TypeSpec union AST to extracted format
   */
  static processTypeSpecUnion(
    union: unknown,
    program: Program
  ): ExtractedUnion | null {
    try {
      if (!this.isValidTypeSpecUnion(union)) {
        Logger.debug(
          LogContext.TYPESPEC_INTEGRATION,
          "Skipping invalid union structure",
        );
        return null;
      }

      const typeSpecUnion = union as Union;
      
      return {
        name: typeSpecUnion.name || "UnknownUnion",
        variants: this.extractUnionVariants(typeSpecUnion),
      };
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to process individual union",
        { 
          unionName: (union as Union)?.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      return null;
    }
  }

  /**
   * Process individual TypeSpec model
   * Domain logic: Convert TypeSpec model AST to extracted format
   */
  static processTypeSpecModel(
    model: unknown,
    program: Program
  ): ExtractedModel | null {
    try {
      if (!this.isValidTypeSpecModel(model)) {
        Logger.debug(
          LogContext.TYPESPEC_INTEGRATION,
          "Skipping invalid model structure",
        );
        return null;
      }

      const typeSpecModel = model as TypeSpecModelType;
      
      return {
        name: typeSpecModel.name || "UnknownModel",
        properties: this.extractModelProperties(typeSpecModel),
        extends: this.extractModelInheritance(typeSpecModel, program),
        template: this.extractModelTemplate(typeSpecModel),
        propertiesFromExtends: this.extractInheritedProperties(typeSpecModel),
      };
    } catch (error) {
      Logger.error(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to process individual model",
        { 
          modelName: (model as TypeSpecModelType)?.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
      return null;
    }
  }

  /**
   * Validate TypeSpec operation structure
   * Domain logic: Ensure operation meets processing requirements
   */
  static isValidTypeSpecOperation(operation: unknown): operation is TypeSpecOperation {
    if (!operation || typeof operation !== "object") {
      return false;
    }

    const op = operation as TypeSpecOperation;
    return (
      op.kind === "Operation" &&
      typeof op.name === "string" &&
      op.name.length > 0
    );
  }

  /**
   * Validate TypeSpec model structure
   * Domain logic: Ensure model meets processing requirements
   */
  static isValidTypeSpecModel(model: unknown): model is TypeSpecModelType {
    if (!model || typeof model !== "object") {
      return false;
    }

    const typeSpecModel = model as TypeSpecModelType;
    return (
      typeSpecModel.kind === "Model" &&
      typeof typeSpecModel.name === "string" &&
      typeSpecModel.name.length > 0
    );
  }

  /**
   * Validate TypeSpec union structure
   * Domain logic: Ensure union meets processing requirements
   */
  static isValidTypeSpecUnion(typeSpecUnion: unknown): typeSpecUnion is Union {
    if (!typeSpecUnion || typeof typeSpecUnion !== "object") {
      return false;
    }

    const union = typeSpecUnion as Union;
    return (
      union.kind === "Union" &&
      Array.isArray(union.variants) &&
      union.variants.every(variant => 
        variant && typeof variant === "object" && "type" in variant
      )
    );
  }

  /**
   * Extract operation verb from TypeSpec operation
   * Domain logic: HTTP method extraction from operation definition
   */
  private static extractOperationVerb(operation: TypeSpecOperation): string {
    // TODO: Extract from TypeSpec operation decorators or attributes
    // For now, default to GET - needs proper TypeSpec API research
    return "GET";
  }

  /**
   * Extract operation path from TypeSpec operation
   * Domain logic: Route path extraction from operation definition
   */
  private static extractOperationPath(operation: TypeSpecOperation): string {
    // TODO: Extract from TypeSpec operation decorators or attributes
    // For now, use operation name - needs proper TypeSpec API research
    return "/" + operation.name.toLowerCase();
  }

  /**
   * Extract operation parameters from TypeSpec operation
   * Domain logic: Parameter extraction with type information
   */
  private static extractOperationParameters(operation: TypeSpecOperation): ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
      location: string;
      optional: boolean;
    }
  > {
    const parameters = new Map();
    
    // TODO: Extract from TypeSpec operation parameters
    // For now, return empty - needs proper TypeSpec API research
    
    return parameters;
  }

  /**
   * Extract operation return type from TypeSpec operation
   * Domain logic: Return type extraction with kind information
   */
  private static extractOperationReturnType(operation: TypeSpecOperation): { kind: string; name?: string } | undefined {
    // TODO: Extract from TypeSpec operation return type
    // For now, return undefined - needs proper TypeSpec API research
    return undefined;
  }

  /**
   * Extract union variants from TypeSpec union
   * Domain logic: Variant extraction with type information
   */
  private static extractUnionVariants(union: Union): ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
    }
  > {
    const variants = new Map();
    
    union.variants.forEach((variant, index) => {
      let name: string;
      if (variant.name) {
        name = String(variant.name);
      } else {
        name = `Variant${index}`;
      }
      
      variants.set(name, {
        name,
        type: this.mapTypeSpecKind({ kind: variant.kind }),
      });
    });
    
    return variants;
  }

  /**
   * Extract model properties from TypeSpec model
   * Domain logic: Property extraction with type and optionality information
   */
  private static extractModelProperties(model: TypeSpecModelType): ReadonlyMap<
    string,
    {
      name: string;
      type: { kind: string };
      optional: boolean;
    }
  > {
    const properties = new Map();
    
    try {
      // Use TypeSpec compiler API for property extraction
      // This handles inherited properties correctly
      // walkPropertiesInherited(model, (property) => {
      //   properties.set(property.name, {
      //     name: property.name,
      //     type: this.mapTypeSpecKind(property.type),
      //     optional: property.optional,
      //   });
      // });

      // TODO: Replace with proper property extraction
      // For now, using direct property access - needs TypeSpec API research
      if (model.properties && typeof model.properties === "object") {
        Object.entries(model.properties).forEach(([key, property]: [string, TypeSpecPropertyNode]) => {
          if (property && typeof property === "object") {
            properties.set(key, {
              name: key,
              type: this.mapTypeSpecKind(property.type),
              optional: property.optional || false,
            });
          }
        });
      }
    } catch (error) {
      Logger.warn(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to extract model properties - using empty set",
        { 
          modelName: model.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
    }
    
    return properties;
  }

  /**
   * Extract model inheritance information
   * Domain logic: Model inheritance chain extraction
   */
  private static extractModelInheritance(model: TypeSpecModelType, program: Program): string | undefined {
    try {
      const effectiveModel = getEffectiveModelType(program, model);
      if (effectiveModel.name && effectiveModel.name !== model.name) {
        return effectiveModel.name;
      }
    } catch (error) {
      Logger.debug(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to extract model inheritance",
        { 
          modelName: model.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
    }
    
    return undefined;
  }

  /**
   * Extract model template information
   * Domain logic: Template model extraction
   */
  private static extractModelTemplate(model: TypeSpecModelType): string | undefined {
    // TODO: Extract template information from TypeSpec model
    // For now, return undefined - needs proper TypeSpec API research
    return undefined;
  }

  /**
   * Extract inherited properties from effective model type
   * Domain logic: Inherited properties extraction for complete model view
   */
  private static extractInheritedProperties(model: TypeSpecModelType): ReadonlyMap<string, TypeSpecPropertyNode> | undefined {
    try {
      const effectiveModel = getEffectiveModelType(model);
      if (effectiveModel.name && effectiveModel.name !== model.name) {
        // Extract properties from inherited model
        return this.extractModelProperties(effectiveModel);
      }
    } catch (error) {
      Logger.debug(
        LogContext.TYPESPEC_INTEGRATION,
        "Failed to extract inherited properties",
        { 
          modelName: model.name,
          error: error instanceof Error ? error.message : String(error)
        }
      );
    }
    
    return undefined;
  }

  /**
   * Map TypeSpec kind to simplified type representation
   * Domain logic: Type kind normalization for Go code generation
   */
  static mapTypeSpecKind(property: TypeSpecPropertyNode | { kind: TypeSpecKind }): string {
    if (!property || typeof property !== "object") {
      return "unknown";
    }

    switch (property.kind) {
      case "String":
        return "string";
      case "Int32":
        return "int32";
      case "Int64":
        return "int64";
      case "Float32":
        return "float32";
      case "Float64":
        return "float64";
      case "Boolean":
        return "boolean";
      case "Array":
        return "array";
      case "Model":
        return "model";
      case "Union":
        return "union";
      case "Enum":
        return "enum";
      case "Scalar":
        return "scalar";
      default:
        return property.kind || "unknown";
    }
  }
}