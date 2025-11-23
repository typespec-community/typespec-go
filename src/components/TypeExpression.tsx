/**
 * Type Expression Component
 * Maps TypeSpec types to Alloy-JS Go type components
 * Following guide's reactive programming model and component patterns
 */

import type { Type, Model, Scalar, Union } from "@typespec/compiler";
import { isNullType } from "@typespec/compiler";

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
 * Maps TypeSpec scalar types to Go types
 * Comprehensive scalar mapping following guide examples
 */
const SCALAR_MAPPINGS: Record<string, string> = {
  "string": "string",
  "boolean": "bool", 
  "int8": "int8",
  "int16": "int16",
  "int32": "int32",
  "int64": "int64",
  "uint8": "uint8",
  "uint16": "uint16", 
  "uint32": "uint32",
  "uint64": "uint64",
  "float32": "float32",
  "float64": "float64",
  "bytes": "[]byte",
  "plaindate": "time.Time",
  "plainTime": "time.Time",
  "duration": "time.Duration",
  "utcDateTime": "time.Time",
  "offsetDateTime": "time.Time",
} as const;

/**
 * Type Expression Component
 * Converts TypeSpec types to proper Go type strings
 * Uses proper type guards, NO 'as' casts
 */
export function TypeExpression({ type }: { type: Type }): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (isScalar(type)) {
    const scalarName = type.name?.toLowerCase() || "";
    return SCALAR_MAPPINGS[scalarName] || "interface{}";
  }
  
  // Handle Model types (user-defined structs)
  if (isModel(type)) {
    return type.name || "interface{}";
  }
  
  // Handle Union types (string | number | boolean)
  if (isUnion(type)) {
    // Check if this is an optional type (T | null)
    const variants = Array.from(type.variants.values());
    if (variants.length === 2) {
      const nonNullVariant = variants.find(v => !isNullType(v.type));
      const hasNull = variants.some(v => isNullType(v.type));
      
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