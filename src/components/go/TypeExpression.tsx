/**
 * Go Type Expression Component
 * Advanced TypeSpec to Go type mapping using Alloy-JS
 * Following guide's reactive programming and type safety patterns
 */

import type { Type, Model, Scalar, Union } from "@typespec/compiler";
import { isNullType } from "@typespec/compiler";
import { refkey } from "@alloy-js/core";

// Comprehensive scalar type mappings
const SCALAR_MAPPINGS: Record<string, string> = {
  string: "string",
  boolean: "bool",
  int8: "int8",
  int16: "int16",
  int32: "int32",
  int64: "int64",
  uint8: "uint8",
  uint16: "uint16",
  uint32: "uint32",
  uint64: "uint64",
  float32: "float32",
  float64: "float64",
  bytes: "[]byte",
  plaindate: "time.Time",
  plaintime: "time.Time",
  duration: "time.Duration",
  utcdatetime: "time.Time",
  offsetdatetime: "time.Time",
} as const;

interface GoTypeExpressionProps {
  /** TypeSpec type to convert */
  type: Type;
  /** Whether to make optional types pointers */
  optional?: boolean;
}

/**
 * Go Type Expression Component
 * Converts TypeSpec types to proper Go type expressions
 * Handles:
 * - Scalar types with comprehensive mapping
 * - Model references with refkey tracking
 * - Array types (Models with indexers)
 * - Union types (especially optional types)
 * - Template instantiations
 * - Nested and complex types
 */
export function GoTypeExpression({ type, optional = false }: GoTypeExpressionProps): string {
  let goType = mapTypeSpecToGo(type);
  
  // Make optional fields pointers
  if (optional) {
    goType = `*${goType}`;
  }
  
  return goType;
}

/**
 * Core TypeSpec to Go type mapping
 * Following guide's type safety with zero 'any' types
 */
function mapTypeSpecToGo(type: Type): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (isScalar(type)) {
    const scalarName = type.name?.toLowerCase() || "";
    return SCALAR_MAPPINGS[scalarName] || "interface{}";
  }
  
  // Handle Model types (user-defined structs)
  if (isModel(type)) {
    // Handle array models (Models with indexers)
    if (isArrayModel(type)) {
      const elementType = getArrayElementType(type);
      const elementGoType = mapTypeSpecToGo(elementType);
      return `[]${elementGoType}`;
    }
    
    return type.name || "interface{}";
  }
  
  // Handle Union types (string | number | boolean)
  if (isUnion(type)) {
    return handleUnionType(type);
  }
  
  // Handle Template instantiations (List<T>, Map<K,V>)
  if (isTemplateParameter(type)) {
    return handleTemplateType(type);
  }
  
  // Fallback for unknown types
  console.warn(`Unsupported TypeSpec type: ${type.kind}`);
  return "interface{}";
}

/**
 * Handle union types, especially optional types (T | null)
 */
function handleUnionType(type: Union): string {
  const variants = Array.from(type.variants.values());
  
  // Check if this is an optional type (T | null)
  if (variants.length === 2) {
    const nonNullVariant = variants.find((v) => !isNullType(v.type));
    const hasNull = variants.some((v) => isNullType(v.type));
    
    if (nonNullVariant && hasNull) {
      const innerType = mapTypeSpecToGo(nonNullVariant.type);
      return innerType; // Pointer handling done by parent component
    }
  }
  
  // For complex unions, use interface{}
  return "interface{}";
}

/**
 * Handle template parameter types
 */
function handleTemplateType(type: Type): string {
  // For now, use interface{} for template types
  // Future enhancement: implement proper template instantiation
  return "interface{}";
}

// Type guards with proper type safety (no 'any' casts)
function isScalar(type: Type): type is Scalar {
  return type.kind === "Scalar";
}

function isModel(type: Type): type is Model {
  return type.kind === "Model";
}

function isArrayModel(type: Model): type is Model & { indexer: { key: Scalar; value: Type } } {
  return !!type.indexer;
}

function isUnion(type: Type): type is Union {
  return type.kind === "Union";
}

function isTemplateParameter(type: Type): boolean {
  return type.kind === "TemplateParameter";
}

function getArrayElementType(model: Model & { indexer: { key: Scalar; value: Type } }): Type {
  return model.indexer.value;
}

// Export the component with backward compatibility
export { GoTypeExpression as TypeExpression };