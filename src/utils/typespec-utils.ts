/**
 * TypeSpec Utilities
 * Helper functions for working with TypeSpec types and decorators
 */

import type { Enum, Model, ModelProperty, Operation, Program, Union } from "@typespec/compiler";
import { getDoc, getSummary } from "@typespec/compiler";

/**
 * Get documentation string from a TypeSpec type
 * Uses @doc decorator if present, otherwise falls back to @summary
 */
export function getDocumentation(
  program: Program,
  type: Model | Enum | Union | ModelProperty | Operation,
): string | undefined {
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
