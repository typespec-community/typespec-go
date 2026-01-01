/**
 * Type Expression Component
 * Maps TypeSpec types to Alloy-JS Go type components
 * Following guide's reactive programming model and component patterns
 */

import type { Type, Model, Scalar, Union } from "@typespec/compiler";
import { isNullType } from "@typespec/compiler";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";

/**
 * Type guard for Scalar types
 */
function isScalar(type: Type): type is Scalar {
  return type.kind === "Scalar";
}

/**
 * Type guard for Model types
 */
function isModel(type: Type): type is Model {
  return type.kind === "Model";
}

/**
 * Type guard for Model types with array indexers
 */
function isArrayModel(type: Model): type is Model & { indexer: { key: Scalar; value: Type } } {
  return !!type.indexer;
}

/**
 * Type guard for Union types
 */
function isUnion(type: Type): type is Union {
  return type.kind === "Union";
}

/**
 * Type guard for TemplateParameter types
 */
function isTemplateParameter(type: Type): boolean {
  return type.kind === "TemplateParameter";
}

/**
 * Gets element type from array model safely
 */
function getArrayElementType(model: Model & { indexer: { key: Scalar; value: Type } }): Type {
  return model.indexer.value;
}

/**
 * Type Expression Component
 * Converts TypeSpec types to proper Go type strings
 * Uses domain layer (CleanTypeMapper) for type mappings
 * Uses proper type guards, NO 'as' casts
 */
export function TypeExpression({ type }: { type: Type }): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (isScalar(type)) {
    // Use domain layer for type mapping
    const mapping = CleanTypeMapper.mapTypeSpecType(type);
    return mapping.goType || "interface{}";
  }

  // Handle Model types (user-defined structs)
  if (isModel(type)) {
    // Handle array models (Models with indexers)
    if (isArrayModel(type)) {
      const elementType = getArrayElementType(type);
      const elementGoType = TypeExpression({ type: elementType });
      return "[]" + elementGoType;
    }

    return type.name || "interface{}";
  }

  // Handle Union types (string | number | boolean)
  if (isUnion(type)) {
    // Check if this is an optional type (T | null)
    const variants = Array.from(type.variants.values());
    if (variants.length === 2) {
      const nonNullVariant = variants.find((v) => !isNullType(v.type));
      const hasNull = variants.some((v) => isNullType(v.type));

      if (nonNullVariant && hasNull) {
        const innerType = TypeExpression({ type: nonNullVariant.type });
        return `*${innerType}`;
      }
    }

    // For complex unions, use interface{}
    return "interface{}";
  }

  // Handle Template instantiations (List<T>, Map<K,V>)
  if (isTemplateParameter(type)) {
    return "interface{}";
  }

  // Fallback for unknown types
  return "interface{}";
}
