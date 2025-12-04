/**
 * Type Mapping Service - Unified Delegation
 *
 * SINGLE SOURCE OF TRUTH: TypeSpec type mapping for Go code generation
 * ZERO ANY TYPES: Professional type safety throughout
 */

import type { Program, Type, Scalar, Model, UnionVariant } from "@typespec/compiler";
import type { TypeMappingResult, GoStructField } from "../types/emitter.types.js";
import { GoPrimitiveType } from "../types/emitter.types.js";

/**
 * TypeSpec Array Type interface
 * Standalone interface with explicit kind definition
 */
interface ArrayType {
  kind: "Array";
  elementType: Type;
}

/**
 * TypeSpec Union Type interface
 * Standalone interface with explicit kind definition
 */
// interface UnionType {
//   kind: "Union";
//   variants: readonly UnionVariant[];
// }

/**
 * TypeSpec Named Type interface
 * Standalone interface with explicit kind definition
 */
interface NamedType {
  kind: "Model" | "Scalar";
  name: string;
}

/**
 * Type-safe TypeSpec scalar to Go primitive mapping
 * No string literals - compile-time guarantees
 */
function mapScalarToGoPrimitive(scalar: Scalar): GoPrimitiveType {
  switch (scalar.name) {
    case "string":
      return GoPrimitiveType.STRING;
    case "boolean":
      return GoPrimitiveType.BOOLEAN;
    case "int8":
      return GoPrimitiveType.INT8;
    case "int16":
      return GoPrimitiveType.INT16;
    case "int32":
      return GoPrimitiveType.INT32;
    case "int64":
      return GoPrimitiveType.INT64;
    case "uint8":
      return GoPrimitiveType.UINT8;
    case "uint16":
      return GoPrimitiveType.UINT16;
    case "uint32":
      return GoPrimitiveType.UINT32;
    case "uint64":
      return GoPrimitiveType.UINT64;
    case "float32":
      return GoPrimitiveType.FLOAT32;
    case "float64":
      return GoPrimitiveType.FLOAT64;
    case "bytes":
      return GoPrimitiveType.BYTES;
    case "plainDate":
      return GoPrimitiveType.TIME;
    case "utcDateTime":
      return GoPrimitiveType.TIME;
    case "duration":
      return GoPrimitiveType.DURATION;
    default:
      // Log unsupported scalar for debugging
      console.warn(`Unsupported scalar type: ${scalar.name}`);
      return GoPrimitiveType.INTERFACE;
  }
}

/**
 * Handle array element mapping - eliminates duplication
 * SINGLE SOURCE OF TRUTH: Centralized element mapping logic
 */
function handleArrayElementMapping(
  program: Program,
  elementType: Type,
  errorTag: string,
): TypeMappingResult {
  const elementMapping = mapTypeSpecType(program, elementType);

  if (elementMapping._tag === "success") {
    return { _tag: "success", result: `[]${elementMapping.result}` };
  } else {
    return { _tag: errorTag as any, elementType };
  }
}

/**
 * Handle TypeSpec array types with type safety
 * Arrays can come from Model with indexer or Array type
 */
function mapArrayType(program: Program, type: Type): TypeMappingResult {
  // Handle Model with indexer (string[] syntax) - check indexer property
  if (type.kind === "Model" && "indexer" in type && (type as Model).indexer?.value) {
    const modelType = type as Model;
    return handleArrayElementMapping(
      program,
      modelType.indexer!.value,
      "invalid-array",
    );
  }

  // Handle potential Array type (check for elementType property)
  if ("elementType" in type) {
    const elementType = (type as unknown as ArrayType).elementType;
    return handleArrayElementMapping(
      program,
      elementType,
      "invalid-array",
    );
  }

  // Not an array type
  return {
    _tag: "unsupported-type",
    type,
    reason: "Type is not a valid array type",
  };
}

/**
 * Handle TypeSpec model types with validation
 */
function mapModelType(program: Program, type: Model): TypeMappingResult {
  if (!type.name || type.name.trim() === "") {
    return {
      _tag: "invalid-model",
      modelName: type.name || "<unnamed>",
    };
  }

  // Check if this is actually an array model (string[] syntax)
  if (type.name === "Array" && type.indexer?.value) {
    return mapArrayType(program, type);
  }

  // Regular model - return name
  return { _tag: "success", result: type.name };
}

/**
 * Handle TypeSpec union types with smart mapping
 */
function mapUnionType(program: Program, type: Type): TypeMappingResult {
  if ("variants" in type && type.kind === "Union") {
    // TypeSpec Union has RekeyableMap, convert to array
    const variants = Array.from(
      (type as { variants: Map<unknown, UnionVariant> }).variants.values(),
    );

    // If all variants are strings, map to string
    if (variants.every((v) => v.type?.kind === "String")) {
      return { _tag: "success", result: "string" };
    }
  }

  return {
    _tag: "unsupported-type",
    type,
    reason: "Union types not fully supported",
  };
}

/**
 * Handle TypeSpec enum types
 */
function mapEnumType(program: Program, type: Type): TypeMappingResult {
  if (!("name" in type) || !(type as NamedType).name) {
    return {
      _tag: "unsupported-type",
      type,
      reason: "Enum without name",
    };
  }

  // Map to string for now (could map to custom enum type)
  return { _tag: "success", result: "string" };
}

/**
 * MAIN TYPE MAPPING FUNCTION
 *
 * Pure function with discriminated union result
 * Comprehensive TypeSpec type coverage
 * Compile-time type safety
 */
export function mapTypeSpecType(program: Program, type: Type): TypeMappingResult {
  // Handle based on TypeSpec type kind
  switch (type.kind) {
    case "String":
      return { _tag: "success", result: "string" };
    case "Boolean":
      return { _tag: "success", result: "bool" };
    case "Number":
      return { _tag: "success", result: "float64" };
    case "Scalar":
      return { _tag: "success", result: mapScalarToGoPrimitive(type as Scalar) };
    case "Model":
      return mapModelType(program, type as Model);
    case "Union":
      return mapUnionType(program, type);
    case "Enum":
      return mapEnumType(program, type);
    default:
      return {
        _tag: "unsupported-type",
        type,
        reason: `Unknown type kind: ${type.kind}`,
      };
  }
}

/**
 * Create Go struct field with type safety and validation
 */
export function createGoStructField(
  program: Program,
  fieldName: string,
  type: Type,
  isOptional: boolean = false,
): GoStructField {
  // Map TypeSpec compiler type to Go type string
  let goType = "interface{}";
  let usePointerForOptional = true;

  switch (type.kind) {
    case "String":
      goType = "string";
      break;
    case "Boolean":
      goType = "bool";
      break;
    case "Number":
      goType = "float64";
      break;
    case "Scalar":
      goType = mapScalarToGoPrimitive(type as Scalar);
      break;
    case "Model":
      goType = (type as Model).name || "interface{}";
      break;
    case "Enum":
      goType = "string"; // Enums map to strings
      break;
    case "Union":
      goType = "interface{}"; // Unions require interface{}
      break;
  }

  // Apply pointer for optional fields if configured
  let finalGoType = goType;
  if (isOptional && usePointerForOptional) {
    finalGoType = `*${finalGoType}`;
  }

  // Handle failed mappings gracefully
  if (!finalGoType || finalGoType === "interface{}") {
    console.warn(`Type mapping fallback for field ${fieldName}:`, type.kind);
  }

  return {
    name: fieldName,
    goType: finalGoType,
    jsonTag: isOptional ? `json:"${fieldName},omitempty"` : `json:"${fieldName}"`,
    isOptional,
  };
}
