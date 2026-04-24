import type { TypeSpecTypeNode } from "../types/typespec-domain.js";

/**
 * Common utilities for Go generation
 */
export class GeneratorUtils {
  /**
   * Capitalize first letter of a string
   */
  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get type name from TypeSpecTypeNode safely
   * Only scalar, model, enum, and template types have name property
   */
  static getTypeName(type?: TypeSpecTypeNode): string | undefined {
    if (!type) return undefined;

    if ("name" in type) {
      return (type as { name: string }).name;
    }

    return undefined;
  }

  /**
   * Add standard Go package declaration to lines array
   */
  static addPackageDeclaration(lines: string[], packageName: string = "api"): void {
    lines.push(`package ${packageName}`);
    lines.push("");
  }
}
