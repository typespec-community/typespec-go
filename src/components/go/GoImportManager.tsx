/**
 * Go Import Manager Component
 * Automatic import statement generation and management
 * Following guide's automatic import management pattern
 */

import type { Model, Type, Scalar } from "@typespec/compiler";
import { SingleImportStatement } from "@alloy-js/go";

interface GoImportManagerProps {
  /** Model to analyze for import requirements */
  model: Model;
  /** Package name for the generated file */
  packageName: string;
}

/**
 * Go Import Manager Component
 * Automatically generates necessary import statements based on TypeSpec model usage
 * Handles:
 * - Standard library imports (time, encoding/json)
 * - Third-party imports (github.com/google/uuid)
 * - Internal package imports
 * - Import deduplication and organization
 */
export function GoImportManager({ model, packageName }: GoImportManagerProps) {
  const requiredImports = analyzeRequiredImports(model);
  
  return (
    <>
      {/* Standard library imports */}
      <SingleImportStatement path="encoding/json" />
      
      {/* Time-related imports if needed */}
      {requiredImports.includes("time") && (
        <SingleImportStatement path="time" />
      )}
      
      {/* UUID support if needed */}
      {requiredImports.includes("uuid") && (
        <SingleImportStatement path="github.com/google/uuid" />
      )}
      
      {/* Context support if needed */}
      {requiredImports.includes("context") && (
        <SingleImportStatement path="context" />
      )}
      
      {/* Additional standard library imports */}
      {requiredImports.includes("fmt") && (
        <SingleImportStatement path="fmt" />
      )}
      
      {/* HTTP support if needed */}
      {requiredImports.includes("http") && (
        <SingleImportStatement path="net/http" />
      )}
    </>
  );
}

/**
 * Analyze TypeSpec model to determine required imports
 * Follows guide's derived state management pattern
 */
function analyzeRequiredImports(model: Model): string[] {
  const imports = new Set<string>();
  
  // Analyze all properties to determine import requirements
  if (model.properties) {
    for (const prop of model.properties.values()) {
      analyzeTypeForImports(prop.type, imports);
    }
  }
  
  return Array.from(imports);
}

/**
 * Recursively analyze TypeSpec type for import requirements
 * Following guide's recursive analysis pattern
 */
function analyzeTypeForImports(type: Type, imports: Set<string>): void {
  switch (type.kind) {
    case "Scalar":
      const scalar = type as Scalar;
      const scalarName = scalar.name?.toLowerCase() || "";
      
      // Add time-related imports
      if (["plaindate", "plaintime", "utcdatetime", "offsetdatetime"].includes(scalarName)) {
        imports.add("time");
      }
      
      // Add duration import
      if (scalarName === "duration") {
        imports.add("time");
      }
      
      // Add bytes import (might need encoding/binary)
      if (scalarName === "bytes") {
        imports.add("encoding/binary");
      }
      
      break;
      
    case "Model":
      // For model types, we might need context for circular references
      imports.add("context");
      break;
      
    case "Union":
      // Union types might need fmt for debugging
      imports.add("fmt");
      break;
      
    // Add other type cases as needed
    default:
      // No additional imports for unknown types
      break;
  }
}