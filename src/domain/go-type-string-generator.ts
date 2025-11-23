/**
 * Go Type String Generator - TypeSpec Go Emitter
 *
 * STRING GENERATION: Go type string creation
 * ZERO ANY TYPES: Professional type safety
 * FOCUSED MODULES: Single responsibility for type strings
 */

import type { MappedGoType } from "./type-interfaces.js";

/**
 * Go Type String Generator
 *
 * Converts MappedGoType to Go type strings with proper syntax
 */
export class GoTypeStringGenerator {
  /**
   * Generate Go type string from MappedGoType
   * COMPREHENSIVE HANDLING: All type kinds supported
   */
  static generateGoTypeString(type: MappedGoType): string {
    switch (type.kind) {
      case "basic":
        return type.name || "interface{}";

      case "pointer":
        if (!type.baseType) {
          return "interface{}";
        }
        return `*${this.generateGoTypeString(type.baseType)}`;

      case "slice":
        if (!type.elementType) {
          return "[]interface{}";
        }
        return `[]${this.generateGoTypeString(type.elementType)}`;

      case "array":
        if (!type.elementType) {
          return "[0]interface{}";
        }
        return `[0]${this.generateGoTypeString(type.elementType)}`;

      case "union":
        if (!type.unionVariants || type.unionVariants.length === 0) {
          return "interface{}";
        }
        // Generate union as sealed interface with proper naming
        return type.name || this.toPascalCase("union");

      case "template":
        if (!type.template) {
          return "interface{}";
        }
        // Generate template as Go generic interface
        const templateName = type.name || "T";
        return `${templateName}[${type.template}]`;

      case "spread":
        if (!type.baseTypes || type.baseTypes.length === 0) {
          return "interface{}";
        }
        // Generate spread as composed interface with proper naming
        return type.name || this.toPascalCase("composed");

      default:
        return "interface{}";
    }
  }

  /**
   * Alias for generateGoTypeString - for backward compatibility
   */
  static generate(type: MappedGoType): string {
    return this.generateGoTypeString(type);
  }

  /**
   * Convert string to PascalCase (TypeSpec model name → Go struct name)
   * PROPER CONVENTIONS: Go naming standards
   */
  static toPascalCase(str: string): string {
    return str
      .replace(/(?:^|[_-])([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/([a-z])([A-Z])/g, (_, c1, c2) => `${c1}${c2}`)
      .replace(/^./, (c) => c.toUpperCase()); // Capitalize first letter
  }

  /**
   * Capitalize word with initialism awareness
   * PROPER INITIALISMS: Handle ID, URL, API, etc.
   */
  static capitalizeWord(word: string, initialisms: readonly string[]): string {
    const lowerWord = word.toLowerCase();

    // Check if word is a common initialism
    if (initialisms.includes(lowerWord)) {
      return word.toUpperCase();
    }

    // Normal capitalization
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}
