/**
 * Type-Safe TypeSpec Type Definitions
 *
 * ELIMINATES ALL 'any' TYPES
 * Enables compile-time type safety with exhaustive matching
 * Supports complete TypeSpec type system
 */
/**
 * Optional handling strategies with enums (no booleans)
 */
export var OptionalHandlingStrategy;
(function (OptionalHandlingStrategy) {
    OptionalHandlingStrategy["Pointer"] = "pointer";
    OptionalHandlingStrategy["DefaultValue"] = "default";
    OptionalHandlingStrategy["NullObject"] = "null-object";
    OptionalHandlingStrategy["Validation"] = "validation";
})(OptionalHandlingStrategy || (OptionalHandlingStrategy = {}));
