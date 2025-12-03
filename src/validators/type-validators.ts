/**
 * Type Validators - TypeSpec Go Emitter
 *
 * VALIDATION LOGIC: Type checking and validation utilities
 * UNIFIED ERRORS: Consistent error reporting
 */

import { ErrorFactory, GoEmitterResult } from "../domain/unified-errors.js";
import type { TypeSpecPropertyNode } from "../types/typespec-domain.js";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";

/**
 * Validate model before generation
 */
export function validateModel(model: {
  name: string;
  properties: ReadonlyMap<string, TypeSpecPropertyNode>;
}): GoEmitterResult {
  if (!model.name) {
    return ErrorFactory.createValidationError("Model name is required", {
      modelName: model.name || "undefined",
    });
  }

  if (!model.properties || model.properties.size === 0) {
    return ErrorFactory.createValidationError("Model must have at least one property", {
      modelName: model.name,
    });
  }

  // Validate each property
  for (const [propName, propNode] of model.properties) {
    if (!propNode || !propNode.type) {
      return ErrorFactory.createValidationError(`Invalid property: ${propName}`, {
        modelName: model.name,
        propertyName: propName,
      });
    }

    // Validate type using CleanTypeMapper
    try {
      const mappedType = CleanTypeMapper.mapTypeSpecType(propNode.type, propName);
      if (!mappedType || !mappedType.goType) {
        return ErrorFactory.createValidationError(`Unsupported type for property: ${propName}`, {
          modelName: model.name,
          propertyName: propName,
          invalidValue:
            typeof propNode.type === "object" && propNode.type && "kind" in propNode.type
              ? propNode.type.kind
              : propNode.type,
        });
      }
    } catch (error) {
      return ErrorFactory.createValidationError(`Type mapping failed for property: ${propName}`, {
        modelName: model.name,
        propertyName: propName,
        invalidValue: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return ErrorFactory.createSuccess(new Map(), {
    validModel: true,
    modelName: model.name,
    propertyCount: model.properties.size,
  });
}

/**
 * Validate union before generation
 */
export function validateUnion(unionModel: {
  name: string;
  kind: "union";
  variants: Array<{ name: string; type: TypeSpecPropertyNode }>;
}): GoEmitterResult {
  if (!unionModel.name) {
    return ErrorFactory.createValidationError("Union name is required", {
      modelName: unionModel.name || "undefined",
    });
  }

  if (!unionModel.variants || unionModel.variants.length === 0) {
    return ErrorFactory.createValidationError("Union must have at least one variant", {
      modelName: unionModel.name,
    });
  }

  return ErrorFactory.createSuccess(new Map(), {
    validUnion: true,
    modelName: unionModel.name,
    variantCount: unionModel.variants.length,
  });
}
