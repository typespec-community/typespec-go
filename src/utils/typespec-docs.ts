import type { Program } from "@typespec/compiler";

/**
 * TypeSpec Documentation Utilities
 * Simplified version focused on @doc decorator extraction
 */

interface Documentable {
  name?: string;
  kind?: string;
  [key: string]: unknown;
}

/**
 * Get documentation from TypeSpec decorator
 * Currently provides fallback for testing without full TypeSpec program
 */
export function getDocumentation(program: Program, node: Documentable): string | undefined {
  // For now, provide fallback documentation based on type
  if (node?.name) {
    const kind = node.kind?.toLowerCase() || "";
    const name = node.name;
    
    if (kind === "operation") {
      return `Generated from TypeSpec operation ${name}`;
    } else if (kind === "model") {
      return `Generated from TypeSpec model ${name}`;
    } else if (kind === "enum") {
      return `Generated from TypeSpec enum ${name}`;
    }
  }
  
  return undefined;
}