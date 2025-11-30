/**
 * TypeSpec Utilities
 * Helper functions for working with TypeSpec types and decorators
 */

import type { Model, ModelProperty, Enum, Union, Type, Program } from "@typespec/compiler";
import { getDoc, getSummary } from "@typespec/compiler";

/**
 * Get documentation string from a TypeSpec type
 * Uses @doc decorator if present, otherwise falls back to @summary
 */
export function getDocumentation(program: Program, type: Model | Enum | Union | ModelProperty): string | undefined {
  // Try @doc first
  const doc = getDoc(program, type);
  if (doc) return doc;
  
  // Fall back to @summary for models/enums/unions
  if ("name" in type && type.name) {
    const summary = getSummary(program, type);
    if (summary) return summary;
  }
  
  return undefined;
}

/**
 * Format documentation as Go comment
 * Handles multi-line comments properly
 */
export function formatGoDoc(doc: string | undefined, prefix: string = ""): string {
  if (!doc) return "";
  
  const lines = doc.split("\n");
  return lines.map(line => `${prefix}// ${line}`).join("\n");
}

/**
 * Check if a type has documentation
 */
export function hasDocumentation(program: Program, type: Model | Enum | Union | ModelProperty): boolean {
  return getDocumentation(program, type) !== undefined;
}
