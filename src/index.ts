/**
 * TypeSpec Go Emitter - Professional Standalone Generator
 * 
 * CRITICAL SUCCESS FACTORS:
 * ✅ Working Go generation - verified and tested
 * ✅ Zero 'any' types - professional type safety
 * ✅ Clean architecture - focused single responsibility
 * ✅ Customer value - real functional output
 * ✅ Professional error handling - structured error management
 */

// Legacy generator (working)
export { StandaloneGoGenerator, GoGenerationError } from "./standalone-generator.js";

// Type system components
export type { GeneratorError, GeneratorErrorFactory, InvalidModelReason, GenerationContext } from "./types/errors.js";
export type { GoIntegerType, GoStringType, GoCollectionType, GenerationMode, LogLevel, StrictMode, OptionalHandling } from "./types/go-types.js";

/**
 * Library metadata for TypeSpec integration
 */
export const $lib = {
    name: "@typespec-go/emitter",
    version: "0.0.1",
    description: "Professional TypeSpec to Go code generator with discriminated unions and proper uint usage",
    features: {
        "working-generation": "Generate compilable Go structs from TypeSpec models",
        "type-safety": "Zero 'any' types with comprehensive coverage", 
        "optional-handling": "Proper Go pointer usage for optional fields",
        "json-tags": "Automatic JSON tag generation",
        "error-handling": "Professional error management with discriminated unions",
        "discriminated-unions": "Impossible states unrepresentable",
        "proper-uint-usage": "Never-negative values use unsigned integers",
        "enums-instead-of-booleans": "Clear state representation"
    }
} as const;