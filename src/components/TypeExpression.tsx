/**
 * Type Expression Component
 * Maps TypeSpec types to Alloy-JS Go type components
 * Following guide's reactive programming model and component patterns
 */

import type { Type, Model, Scalar, Union } from "@typespec/compiler";

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
 * Follows guide's component-based generation pattern
 * 
 * NOTE: Alloy-JS Go uses string types for type expressions, not JSX components
 * This follows the pattern from working examples
 */
export function TypeExpression({ type }: { type: Type }): string {
  // Handle Scalar types (string, int32, bool, etc.)
  if (type.kind === "Scalar") {
    const scalar = type as Scalar;
    const scalarName = scalar.name?.toLowerCase() || "";
    return SCALAR_MAPPINGS[scalarName] || "interface{}";
  }
  
  // Handle Model types (user-defined structs)
  if (type.kind === "Model") {
    const model = type as Model;
    return model.name || "interface{}";
  }
  
  // Handle Union types (string | number | boolean)
  if (type.kind === "Union") {
    const union = type as Union;
    if (union.variants && Array.from(union.variants).length === 2) {
      // Handle optional types (T | null)
      const nonNullVariant = Array.from(union.variants).find(v => v.kind !== "Null");
      if (nonNullVariant && Array.from(union.variants).some(v => v.kind === "Null")) {
        const innerType = TypeExpression({ type: nonNullVariant });
        return `*${innerType}`;
      }
    }
    
    // For complex unions, use interface{}
    return "interface{}";
  }
  
  // Handle Array types
  if (type.kind === "Model" && (type as Model).indexer) {
    const model = type as Model;
    if (model.indexer) {
      const innerType = TypeExpression({ type: model.indexer.value });
      return `[]${innerType}`;
    }
  }
  
  // Handle Template instantiations (List<T>, Map<K,V>)
  if (type.kind === "TemplateParameter") {
    return "interface{}";
  }
  
  // Fallback for unknown types
  return "interface{}";
}