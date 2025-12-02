/**
 * String Utilities - TypeSpec Go Emitter
 *
 * REUSED UTILITIES: Common string formatting operations
 * CONSISTENT FORMATTING: Standardized capitalization patterns
 */

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize words in a string (e.g., "paypal" -> "PayPal")
 */
export function capitalizeWords(str: string): string {
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
}

/**
 * Convert to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert to PascalCase
 */
export function toPascalCase(str: string): string {
  return str.replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Generate Go constant name (UPPER_SNAKE_CASE)
 */
export function generateGoConstantName(str: string): string {
  return toSnakeCase(str).toUpperCase();
}

/**
 * Generate Go field name (PascalCase for export)
 */
export function generateGoFieldName(str: string): string {
  return capitalizeFirst(str);
}