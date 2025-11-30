/**
 * Error Types - TypeSpec Go Emitter
 * Type-safe error definitions with discriminated unions
 */

/**
 * Reasons for model invalidity
 */
export type InvalidModelReason =
  | "missing_name"
  | "missing_properties"
  | "invalid_property_type"
  | "circular_reference"
  | "unsupported_feature"
  | "invalid_namespace"
  | "template_instantiation_failed";

/**
 * Type guard for InvalidModelReason
 */
export function isInvalidModelReason(value: string): value is InvalidModelReason {
  return [
    "missing_name",
    "missing_properties",
    "invalid_property_type",
    "circular_reference",
    "unsupported_feature",
    "invalid_namespace",
    "template_instantiation_failed",
  ].includes(value);
}
