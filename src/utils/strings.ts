/**
 * String Utilities
 * Shared string manipulation functions for Go code generation
 */

/**
 * Capitalize first letter for Go exported names
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word, index) => 
      index === 0 ? word.toLowerCase() : capitalize(word.toLowerCase())
    )
    .join("");
}

/**
 * Convert to PascalCase (Go exported name convention)
 */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => capitalize(word.toLowerCase()))
    .join("");
}

/**
 * Convert to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Convert to Go public field name
 * Ensures the name starts with uppercase for export
 */
export function toGoPublicName(str: string): string {
  return toPascalCase(str);
}

/**
 * Convert to Go private field name
 * Ensures the name starts with lowercase for non-export
 */
export function toGoPrivateName(str: string): string {
  const pascal = toPascalCase(str);
  if (pascal.length === 0) return pascal;
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
