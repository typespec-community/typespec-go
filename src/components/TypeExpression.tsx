/**
 * Type Expression Component
 * Maps TypeSpec types to Alloy-JS Go type components
 * Following guide's reactive programming model and component patterns
 */

import type { Type, Model, Scalar, Union } from "@typespec/compiler";
import { isNullType } from "@typespec/compiler";
import { CleanTypeMapper } from "../domain/clean-type-mapper.js";

/**
 * Props for TypeExpression component
 */
interface TypeExpressionProps {
  /** TypeSpec type to convert */
  type: Type;
  /** Optional field name for strong ID detection */
  fieldName?: string;
}

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
 * Narrows a template argument (Type | Value | IndeterminateEntity) to a Type
 */
function extractTypeFromTemplateArg(arg: unknown): Type | undefined {
  if (arg && typeof arg === "object" && "kind" in arg) {
    const kind = (arg as { kind: unknown }).kind;
    if (
      ["Model", "Scalar", "Enum", "Union", "String", "Boolean", "Number"].includes(String(kind))
    ) {
      return arg as Type;
    }
  }
  return undefined;
}

/**
 * Type Expression Component
 * Converts TypeSpec types to proper Go type strings
 * Uses domain layer (CleanTypeMapper) for type mappings
 * Uses proper type guards, NO 'as' casts
 */
export function TypeExpression({ type, fieldName }: TypeExpressionProps): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (isScalar(type)) {
    // Use domain layer for type mapping, pass fieldName for strong ID detection
    const mapping = CleanTypeMapper.mapTypeSpecType(type, fieldName);
    return mapping.goType || "interface{}";
  }

  // Handle Model types (user-defined structs)
  if (isModel(type)) {
    // Handle array models (Models with indexers)
    if (isArrayModel(type)) {
      const elementType = getArrayElementType(type);
      const elementGoType = TypeExpression({
        type: elementType,
        fieldName: fieldName ? `${fieldName}Element` : undefined,
      });
      return "[]" + elementGoType;
    }

    // Template instances (e.g. MergePatchUpdate<Widget>, Box<string>) are not
    // generated as their own Go types; map to the underlying template argument.
    if (type.templateMapper && type.templateMapper.args && type.templateMapper.args.length > 0) {
      const firstArg = type.templateMapper.args[0];
      const argType = extractTypeFromTemplateArg(firstArg);
      if (argType) {
        return TypeExpression({ type: argType, fieldName });
      }
    }

    // Http.MergePatchUpdate<Widget> instances are named "WidgetMergePatchUpdate"
    // by the compiler (arg+template naming) and carry no templateMapper at
    // runtime. A merge-patch body IS the base model, so map to it.
    const mergePatchSuffix = "MergePatchUpdate";
    if (type.name.length > mergePatchSuffix.length && type.name.endsWith(mergePatchSuffix)) {
      return type.name.slice(0, type.name.length - mergePatchSuffix.length);
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
        const innerType = TypeExpression({ type: nonNullVariant.type, fieldName });
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
